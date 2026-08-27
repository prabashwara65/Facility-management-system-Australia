// app/admin/dashboard/page.tsx
'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  ChevronDown,
  AlertCircle,
  Save,
  RefreshCw,
  Calendar,
  Package,
  Car,
  Truck,
  Warehouse,
  Bus,
  Home,
  Loader2,
  Tag,
  Layers,
  Clock as ClockIcon,
  ChevronUp,
  ArrowRight,
  FolderTree,
  List as ListIcon,
} from 'lucide-react';
import { useTheme } from '@/app/context/ThemeProvider';
import { createClient } from '@/lib/supabase/client';

// ============================================
// TYPES
// ============================================

interface VehicleCategory {
  id: string;
  label: string;
  icon_name: string;
  created_at?: string;
}

interface VehicleMake {
  id: number;
  name: string;
  created_at?: string;
}

interface VehicleModel {
  id: number;
  make_id: number;
  name: string;
  created_at?: string;
  make_name?: string;
}

interface VehicleBodyType {
  id: number;
  make_id: number;
  name: string;
  created_at?: string;
  make_name?: string;
}

interface VehicleService {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  popular: boolean;
  description: string;
  vehicle_type: string;
  estimated_time: string;
  created_at?: string;
  updated_at?: string;
}

interface VehicleAddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  per_seat: boolean;
  created_at?: string;
  updated_at?: string;
}

interface VehicleCondition {
  id: number;
  name: string;
  created_at?: string;
}

interface VehicleArrivalWindow {
  id: number;
  window_time: string;
  display_order: number;
  created_at?: string;
}

interface VehicleBooking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  address_unit?: string;
  city: string;
  state: string;
  zip_code: string;
  service_area_zip?: string;
  vehicle_year: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_body: string;
  vehicle_category?: string;
  vehicle_count: number;
  package_id?: number;
  package_name?: string;
  package_price?: number;
  package_description?: string;
  conditions: string[];
  other_condition?: string;
  add_ons: Record<string, number>;
  add_ons_total: number;
  appointment_date: string;
  selected_windows: string[];
  backup_date?: string;
  water_access?: 'yes' | 'no';
  electricity?: 'yes' | 'no';
  covered_area?: 'yes' | 'no';
  extra_info?: string;
  marketing_opt_in: boolean;
  total_price: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  confirmed_at?: string;
  completed_at?: string;
  cancelled_at?: string;
}

type AdminTab = 'services' | 'addons' | 'categories' | 'makes' | 'models' | 'bodytypes' | 'conditions' | 'windows' | 'bookings';
type ToastType = 'success' | 'error' | 'info';
type FormValue = string | number | boolean | string[] | Record<string, number> | null | undefined;
type EditFormData = Record<string, FormValue>;
type ValidationResult<T> = { value: T; error?: never } | { error: string; value?: never };
type ServicePayload = Omit<VehicleService, 'id' | 'created_at' | 'updated_at'>;
type AddOnPayload = Omit<VehicleAddOn, 'created_at' | 'updated_at'>;
type CategoryPayload = VehicleCategory;
type NamePayload = Pick<VehicleMake, 'name'>;
type WindowPayload = Pick<VehicleArrivalWindow, 'window_time' | 'display_order'>;
type DashboardItem =
  | VehicleCategory
  | VehicleMake
  | VehicleModel
  | VehicleBodyType
  | VehicleService
  | VehicleAddOn
  | VehicleCondition
  | VehicleArrivalWindow
  | VehicleBooking;

interface JoinedVehicleMake {
  id: number;
  name: string;
}

interface VehicleModelRow extends Omit<VehicleModel, 'make_name'> {
  vehicle_makes?: JoinedVehicleMake | null;
}

interface VehicleBodyTypeRow extends Omit<VehicleBodyType, 'make_name'> {
  vehicle_makes?: JoinedVehicleMake | null;
}

// ============================================
// ICON MAP
// ============================================

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Car: Car,
  Truck: Truck,
  Warehouse: Warehouse,
  Bus: Bus,
  Home: Home,
};

const tabs: { id: AdminTab; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'services', label: 'Services', icon: Package },
  { id: 'addons', label: 'Add-ons', icon: Plus },
  { id: 'categories', label: 'Categories', icon: Car },
  { id: 'makes', label: 'Brands', icon: Tag },
  { id: 'models', label: 'Models', icon: Layers },
  { id: 'bodytypes', label: 'Body Types', icon: Truck },
  { id: 'conditions', label: 'Conditions', icon: AlertCircle },
  { id: 'windows', label: 'Windows', icon: ClockIcon },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
];

// ============================================
// DASHBOARD COMPONENT
// ============================================

export default function AdminDashboard() {
  const { currentTheme } = useTheme();
  const supabase = createClient();

  // ============================================
  // STATE
  // ============================================

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<AdminTab>('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchical' | 'table'>('hierarchical');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DashboardItem | null>(null);
  const [editFormData, setEditFormData] = useState<EditFormData>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set());
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Data states
  const [services, setServices] = useState<VehicleService[]>([]);
  const [addOns, setAddOns] = useState<VehicleAddOn[]>([]);
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModel[]>([]);
  const [bodyTypes, setBodyTypes] = useState<VehicleBodyType[]>([]);
  const [conditions, setConditions] = useState<VehicleCondition[]>([]);
  const [windows, setWindows] = useState<VehicleArrivalWindow[]>([]);
  const [bookings, setBookings] = useState<VehicleBooking[]>([]);

  const primaryColor = currentTheme?.colors?.[1] || '#3b82f6';
  const secondaryColor = currentTheme?.colors?.[2] || '#8b5cf6';
  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'object' && error && 'message' in error) {
      const message = (error as { message?: unknown }).message;
      return typeof message === 'string' ? message : 'Something went wrong';
    }
    return 'Something went wrong';
  };

  const hasId = (item: DashboardItem | null): item is DashboardItem & { id: string | number } => {
    return !!item && 'id' in item && item.id !== undefined && item.id !== null;
  };

  const toFormData = (item: DashboardItem): EditFormData => ({ ...item }) as EditFormData;

  const requiredString = (value: FormValue) => typeof value === 'string' ? value.trim() : '';

  const positiveNumber = (value: FormValue, fallback = 0) => {
    const number = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(number) && number >= 0 ? number : fallback;
  };

  const sanitizeService = (data: EditFormData): ValidationResult<ServicePayload> => {
    const name = requiredString(data.name);
    const description = requiredString(data.description);
    if (!name) return { error: 'Service name is required' };
    if (!description) return { error: 'Service description is required' };

    return {
      value: {
        name,
        price: positiveNumber(data.price),
        rating: Math.min(5, positiveNumber(data.rating)),
        reviews: Math.floor(positiveNumber(data.reviews)),
        popular: Boolean(data.popular),
        description,
        vehicle_type: requiredString(data.vehicle_type) || 'car',
        estimated_time: requiredString(data.estimated_time) || '60 minutes',
      },
    };
  };

  const sanitizeAddOn = (data: EditFormData): ValidationResult<AddOnPayload> => {
    const id = requiredString(data.id);
    const name = requiredString(data.name);
    if (!id) return { error: 'Add-on ID is required' };
    if (!name) return { error: 'Add-on name is required' };

    return {
      value: {
        id,
        name,
        price: positiveNumber(data.price),
        description: requiredString(data.description),
        details: requiredString(data.details),
        per_seat: Boolean(data.per_seat),
      },
    };
  };

  const sanitizeCategory = (data: EditFormData): ValidationResult<CategoryPayload> => {
    const id = requiredString(data.id).toLowerCase().replace(/\s+/g, '-');
    const label = requiredString(data.label);
    if (!id) return { error: 'Category ID is required' };
    if (!label) return { error: 'Category label is required' };

    return {
      value: {
        id,
        label,
        icon_name: requiredString(data.icon_name) || 'Car',
      },
    };
  };

  const sanitizeNameOnly = (data: EditFormData, label: string): ValidationResult<NamePayload> => {
    const name = requiredString(data.name);
    if (!name) return { error: `${label} name is required` };
    return { value: { name } };
  };

  const sanitizeWindow = (data: EditFormData): ValidationResult<WindowPayload> => {
    const windowTime = requiredString(data.window_time);
    if (!windowTime) return { error: 'Window time is required' };
    return {
      value: {
        window_time: windowTime,
        display_order: Math.floor(positiveNumber(data.display_order)),
      },
    };
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 5000);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedItem(null);
    setEditFormData({});
  };

  const openAddModal = (defaults: EditFormData) => {
    setSelectedItem(null);
    setEditFormData(defaults);
    setShowAddModal(true);
  };

  const getEmptyFormForTab = (tab: AdminTab): EditFormData => {
    switch (tab) {
      case 'services':
        return {
          name: '',
          price: 0,
          rating: 0,
          reviews: 0,
          popular: false,
          description: '',
          vehicle_type: 'car',
          estimated_time: '60 minutes',
        };
      case 'addons':
        return {
          id: `new-${Date.now()}`,
          name: '',
          price: 0,
          description: '',
          details: '',
          per_seat: false,
        };
      case 'categories':
        return { id: '', label: '', icon_name: 'Car' };
      case 'models':
      case 'bodytypes':
        return { make_id: 0, name: '' };
      case 'windows':
        return { window_time: '', display_order: windows.length + 1 };
      case 'makes':
      case 'conditions':
      case 'bookings':
      default:
        return { name: '' };
    }
  };

  const runMutation = async (action: () => Promise<void>) => {
    if (saving) return;
    setSaving(true);
    try {
      await action();
    } finally {
      setSaving(false);
    }
  };

  const getBrandName = (makeId: number): string => {
    if (!makeId || makeId === 0) return 'No Brand Assigned';
    const brand = makes.find(b => b.id === makeId);
    return brand ? brand.name : `Unknown Brand (ID: ${makeId})`;
  };

  const getModelBrandName = (model: VehicleModel): string => {
    return model.make_name || getBrandName(model.make_id);
  };

  const getBodyTypeBrandName = (bodyType: VehicleBodyType): string => {
    return bodyType.make_name || getBrandName(bodyType.make_id);
  };

  // ============================================
  // FETCH FUNCTIONS
  // ============================================

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_services')
        .select('*')
        .order('id');
      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  };

  const fetchAddOns = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_add_on_options')
        .select('*')
        .order('name');
      if (error) throw error;
      setAddOns(data || []);
    } catch (error) {
      console.error('Error fetching add-ons:', error);
      throw error;
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_categories')
        .select('*')
        .order('label');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  };

  const fetchMakes = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_makes')
        .select('*')
        .order('name');
      if (error) throw error;
      setMakes(data || []);
    } catch (error) {
      console.error('Error fetching makes:', error);
      throw error;
    }
  };

  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_models')
        .select(`
          *,
          vehicle_makes (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;

      const transformedData = (data as VehicleModelRow[] | null)?.map((item) => ({
        ...item,
        make_name: item.vehicle_makes?.name || 'Unknown Brand'
      })) || [];

      setModels(transformedData);
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  };

  const fetchBodyTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_body_types')
        .select(`
          *,
          vehicle_makes (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;

      const transformedData = (data as VehicleBodyTypeRow[] | null)?.map((item) => ({
        ...item,
        make_name: item.vehicle_makes?.name || 'Unknown Brand'
      })) || [];

      setBodyTypes(transformedData);
    } catch (error) {
      console.error('Error fetching body types:', error);
      throw error;
    }
  };

  const fetchConditions = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_conditions')
        .select('*')
        .order('name');
      if (error) throw error;
      setConditions(data || []);
    } catch (error) {
      console.error('Error fetching conditions:', error);
      throw error;
    }
  };

  const fetchWindows = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_arrival_windows')
        .select('*')
        .order('display_order');
      if (error) throw error;
      setWindows(data || []);
    } catch (error) {
      console.error('Error fetching windows:', error);
      throw error;
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('vehicle_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setLoadError(null);
    const results = await Promise.allSettled([
      fetchServices(),
      fetchAddOns(),
      fetchCategories(),
      fetchMakes(),
      fetchModels(),
      fetchBodyTypes(),
      fetchConditions(),
      fetchWindows(),
      fetchBookings(),
    ]);
    const failed = results.filter(result => result.status === 'rejected');
    if (failed.length > 0) {
      setLoadError(`${failed.length} data source${failed.length > 1 ? 's' : ''} failed to load. Some dashboard sections may be incomplete.`);
      showToast('Some mobile detailing data could not be loaded', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    // The dashboard intentionally loads once on mount; fetchAllData closes over current Supabase client state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  // --- MAKES ---
  const handleAddMake = async (data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      if (!name) {
        showToast('Brand name is required', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_makes')
        .insert([{ name }]);
      if (error) throw error;
      showToast('Brand added successfully!', 'success');
      await fetchMakes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateMake = async (id: number, data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      if (!name) {
        showToast('Brand name is required', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_makes')
        .update({ name })
        .eq('id', id);
      if (error) throw error;
      showToast('Brand updated successfully!', 'success');
      await fetchMakes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteMake = async (id: number) => {
    try {
      const hasModels = models.some(m => m.make_id === id);
      const hasBodyTypes = bodyTypes.some(b => b.make_id === id);
      if (hasModels || hasBodyTypes) {
        showToast('Cannot delete brand with existing models or body types', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_makes')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Brand deleted successfully!', 'success');
      await fetchMakes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- MODELS ---
  const handleAddModel = async (data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      const makeId = positiveNumber(data.make_id);
      if (!name) {
        showToast('Model name is required', 'error');
        return;
      }
      if (!makeId) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_models')
        .insert([{
          make_id: makeId,
          name
        }]);
      if (error) throw error;
      showToast('Model added successfully!', 'success');
      await fetchModels();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateModel = async (id: number, data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      const makeId = positiveNumber(data.make_id);
      if (!name) {
        showToast('Model name is required', 'error');
        return;
      }
      if (!makeId) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_models')
        .update({
          make_id: makeId,
          name
        })
        .eq('id', id);
      if (error) throw error;
      showToast('Model updated successfully!', 'success');
      await fetchModels();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteModel = async (id: number) => {
    try {
      const { error } = await supabase
        .from('vehicle_models')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Model deleted successfully!', 'success');
      await fetchModels();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- BODY TYPES ---
  const handleAddBodyType = async (data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      const makeId = positiveNumber(data.make_id);
      if (!name) {
        showToast('Body type name is required', 'error');
        return;
      }
      if (!makeId) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_body_types')
        .insert([{
          make_id: makeId,
          name
        }]);
      if (error) throw error;
      showToast('Body type added successfully!', 'success');
      await fetchBodyTypes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateBodyType = async (id: number, data: EditFormData) => {
    try {
      const name = requiredString(data.name);
      const makeId = positiveNumber(data.make_id);
      if (!name) {
        showToast('Body type name is required', 'error');
        return;
      }
      if (!makeId) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_body_types')
        .update({
          make_id: makeId,
          name
        })
        .eq('id', id);
      if (error) throw error;
      showToast('Body type updated successfully!', 'success');
      await fetchBodyTypes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteBodyType = async (id: number) => {
    try {
      const { error } = await supabase
        .from('vehicle_body_types')
        .delete()
        .eq('id', id);
      if (error) throw error;
      showToast('Body type deleted successfully!', 'success');
      await fetchBodyTypes();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- SERVICES ---
  const handleAddService = async (data: EditFormData) => {
    try {
      const sanitized = sanitizeService(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_services').insert([sanitized.value]);
      if (error) throw error;
      showToast('Service added successfully!', 'success');
      await fetchServices();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateService = async (id: number, data: EditFormData) => {
    try {
      const sanitized = sanitizeService(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_services').update(sanitized.value).eq('id', id);
      if (error) throw error;
      showToast('Service updated successfully!', 'success');
      await fetchServices();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      const { error } = await supabase.from('vehicle_services').delete().eq('id', id);
      if (error) throw error;
      showToast('Service deleted successfully!', 'success');
      await fetchServices();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- ADD-ONS ---
  const handleAddAddOn = async (data: EditFormData) => {
    try {
      const sanitized = sanitizeAddOn(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_add_on_options').insert([sanitized.value]);
      if (error) throw error;
      showToast('Add-on added successfully!', 'success');
      await fetchAddOns();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateAddOn = async (id: string, data: EditFormData) => {
    try {
      const sanitized = sanitizeAddOn({ ...data, id });
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const payload = {
        name: sanitized.value.name,
        price: sanitized.value.price,
        description: sanitized.value.description,
        details: sanitized.value.details,
        per_seat: sanitized.value.per_seat,
      };
      const { error } = await supabase.from('vehicle_add_on_options').update(payload).eq('id', id);
      if (error) throw error;
      showToast('Add-on updated successfully!', 'success');
      await fetchAddOns();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteAddOn = async (id: string) => {
    try {
      const { error } = await supabase.from('vehicle_add_on_options').delete().eq('id', id);
      if (error) throw error;
      showToast('Add-on deleted successfully!', 'success');
      await fetchAddOns();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- CATEGORIES ---
  const handleAddCategory = async (data: EditFormData) => {
    try {
      const sanitized = sanitizeCategory(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_categories').insert([sanitized.value]);
      if (error) throw error;
      showToast('Category added successfully!', 'success');
      await fetchCategories();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateCategory = async (id: string, data: EditFormData) => {
    try {
      const sanitized = sanitizeCategory({ ...data, id });
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const payload = {
        label: sanitized.value.label,
        icon_name: sanitized.value.icon_name,
      };
      const { error } = await supabase.from('vehicle_categories').update(payload).eq('id', id);
      if (error) throw error;
      showToast('Category updated successfully!', 'success');
      await fetchCategories();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from('vehicle_categories').delete().eq('id', id);
      if (error) throw error;
      showToast('Category deleted successfully!', 'success');
      await fetchCategories();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- CONDITIONS ---
  const handleAddCondition = async (data: EditFormData) => {
    try {
      const sanitized = sanitizeNameOnly(data, 'Condition');
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_conditions').insert([sanitized.value]);
      if (error) throw error;
      showToast('Condition added successfully!', 'success');
      await fetchConditions();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateCondition = async (id: number, data: EditFormData) => {
    try {
      const sanitized = sanitizeNameOnly(data, 'Condition');
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_conditions').update(sanitized.value).eq('id', id);
      if (error) throw error;
      showToast('Condition updated successfully!', 'success');
      await fetchConditions();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteCondition = async (id: number) => {
    try {
      const { error } = await supabase.from('vehicle_conditions').delete().eq('id', id);
      if (error) throw error;
      showToast('Condition deleted successfully!', 'success');
      await fetchConditions();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- WINDOWS ---
  const handleAddWindow = async (data: EditFormData) => {
    try {
      const sanitized = sanitizeWindow(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_arrival_windows').insert([sanitized.value]);
      if (error) throw error;
      showToast('Window added successfully!', 'success');
      await fetchWindows();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleUpdateWindow = async (id: number, data: EditFormData) => {
    try {
      const sanitized = sanitizeWindow(data);
      if ('error' in sanitized) {
        showToast(sanitized.error ?? 'Invalid form data', 'error');
        return;
      }
      const { error } = await supabase.from('vehicle_arrival_windows').update(sanitized.value).eq('id', id);
      if (error) throw error;
      showToast('Window updated successfully!', 'success');
      await fetchWindows();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteWindow = async (id: number) => {
    try {
      const { error } = await supabase.from('vehicle_arrival_windows').delete().eq('id', id);
      if (error) throw error;
      showToast('Window deleted successfully!', 'success');
      await fetchWindows();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // --- BOOKINGS ---
  const handleUpdateBookingStatus = async (id: string, status: VehicleBooking['status']) => {
    try {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('vehicle_bookings')
        .update({
          status,
          confirmed_at: status === 'confirmed' ? now : undefined,
          completed_at: status === 'completed' ? now : undefined,
          cancelled_at: status === 'cancelled' ? now : undefined,
        })
        .eq('id', id);
      if (error) throw error;
      showToast(`Booking ${status}!`, 'success');
      await fetchBookings();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase.from('vehicle_bookings').delete().eq('id', id);
      if (error) throw error;
      showToast('Booking deleted successfully!', 'success');
      await fetchBookings();
      closeModal();
    } catch (error: unknown) {
      showToast(`Error: ${getErrorMessage(error)}`, 'error');
    }
  };

  // ============================================
  // RENDER FUNCTIONS
  // ============================================

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      in_progress: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // ============================================
  // SERVICES TABLE
  // ============================================

  const renderServicesTable = () => {
    const filtered = services.filter(s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Rating</th>
              <th className="px-4 py-3 text-left">Vehicle Type</th>
              <th className="px-4 py-3 text-left">Popular</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((service) => (
              <tr key={service.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 font-medium text-theme-text">{service.name}</td>
                <td className="px-4 py-3" style={{ color: secondaryColor }}>${service.price}</td>
                <td className="px-4 py-3 text-theme-text">★ {service.rating} ({service.reviews})</td>
                <td className="px-4 py-3 text-theme-muted capitalize">{service.vehicle_type}</td>
                <td className="px-4 py-3">
                  {service.popular && (
                    <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                      Popular
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSelectedItem(service); setEditFormData(toFormData(service)); setShowEditModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(service); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // ADD-ONS TABLE
  // ============================================

  const renderAddOnsTable = () => {
    const filtered = addOns.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Per Seat</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((addOn) => (
              <tr key={addOn.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 font-medium text-theme-text">{addOn.name}</td>
                <td className="px-4 py-3" style={{ color: secondaryColor }}>${addOn.price}</td>
                <td className="px-4 py-3 text-theme-text">{addOn.per_seat ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-theme-muted text-sm">{addOn.description}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSelectedItem(addOn); setEditFormData(toFormData(addOn)); setShowEditModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(addOn); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // CATEGORIES TABLE
  // ============================================

  const renderCategoriesTable = () => {
    const filtered = categories.filter(c =>
      c.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Label</th>
              <th className="px-4 py-3 text-left">Icon</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((category) => {
              const IconComponent = iconMap[category.icon_name] || Car;
              return (
                <tr key={category.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                  <td className="px-4 py-3 text-theme-muted text-sm">{category.id}</td>
                  <td className="px-4 py-3 font-medium text-theme-text">{category.label}</td>
                  <td className="px-4 py-3">
                    <IconComponent className="w-5 h-5 text-theme-muted" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedItem(category); setEditFormData(toFormData(category)); setShowEditModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        style={{ color: primaryColor }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedItem(category); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // MAKES TABLE (Brands)
  // ============================================

  const renderMakesTable = () => {
    const filtered = makes.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Brand Name</th>
              <th className="px-4 py-3 text-left">Models</th>
              <th className="px-4 py-3 text-left">Body Types</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((make) => {
              const modelCount = models.filter(m => m.make_id === make.id).length;
              const bodyTypeCount = bodyTypes.filter(b => b.make_id === make.id).length;
              return (
                <tr key={make.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                  <td className="px-4 py-3 text-theme-muted text-sm">{make.id}</td>
                  <td className="px-4 py-3 font-medium text-theme-text">{make.name}</td>
                  <td className="px-4 py-3 text-theme-muted text-sm">{modelCount}</td>
                  <td className="px-4 py-3 text-theme-muted text-sm">{bodyTypeCount}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedItem(make); setEditFormData({ name: make.name }); setShowEditModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                        style={{ color: primaryColor }}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => { setSelectedItem(make); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // HIERARCHICAL VIEW - MODELS
  // ============================================

  const renderModelsHierarchical = () => {
    const groupedModels: Record<number, VehicleModel[]> = {};
    models.forEach(model => {
      if (!groupedModels[model.make_id]) {
        groupedModels[model.make_id] = [];
      }
      groupedModels[model.make_id].push(model);
    });

    const filteredBrands = makes.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (groupedModels[b.id] || []).some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredBrands.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
          <FolderTree className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No models found</p>
          <p className="text-sm">{searchQuery ? 'Try a different search.' : 'Add your first model!'}</p>
          <button
            onClick={() => {
              setEditFormData({ make_id: 0, name: '' });
              setSelectedItem(null);
              setShowAddModal(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add New Model
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-6 px-4 py-2 bg-theme-card rounded-xl border border-theme-border text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
            <span className="text-theme-muted">Brand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: primaryColor }}></div>
            <span className="text-theme-muted">Model</span>
          </div>
          <ArrowRight className="w-4 h-4 text-theme-muted" />
          <span className="text-theme-muted">Relationship</span>
        </div>

        {filteredBrands.map((brand) => {
          const brandModels = groupedModels[brand.id] || [];
          const isExpanded = expandedBrands.has(brand.id);
          const brandBodyTypes = bodyTypes.filter(b => b.make_id === brand.id);

          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-theme-card rounded-xl border border-theme-border overflow-hidden transition-all"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-theme-panel/50 transition-colors"
                onClick={() => {
                  const newExpanded = new Set(expandedBrands);
                  if (newExpanded.has(brand.id)) {
                    newExpanded.delete(brand.id);
                  } else {
                    newExpanded.add(brand.id);
                  }
                  setExpandedBrands(newExpanded);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${secondaryColor}20` }}>
                    <Tag className="w-5 h-5" style={{ color: secondaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-theme-text">{brand.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-theme-muted">
                      <span>{brandModels.length} model{brandModels.length > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{brandBodyTypes.length} body type{brandBodyTypes.length > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="text-theme-text">Body Types: {brandBodyTypes.map(b => b.name).join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditFormData({ make_id: brand.id, name: '' });
                      setSelectedItem(null);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:opacity-90 flex items-center gap-1"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Model
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-theme-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-theme-muted" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-theme-border">
                  {brandModels.length === 0 ? (
                    <div className="text-center py-8 text-theme-muted">No models for this brand. Click &quot;Add Model&quot; to create one.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {brandModels.map((model) => (
                        <motion.div
                          key={model.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl border border-theme-border bg-theme-card hover:border-theme-secondary transition-all group relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: primaryColor }}></div>
                                <h4 className="font-semibold text-theme-text truncate">{model.name}</h4>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-theme-muted">
                                <span className="font-medium">Brand:</span>
                                <span className="text-theme-text">{getModelBrandName(model)}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-theme-muted">
                                <span className="font-medium">Body Types:</span>
                                <span className="text-theme-text">
                                  {brandBodyTypes.length > 0
                                    ? brandBodyTypes.map(b => b.name).join(', ')
                                    : 'No body types available'}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">ID: {model.id}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(model);
                                  setEditFormData({ make_id: model.make_id, name: model.name });
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                style={{ color: primaryColor }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setSelectedItem(model); setShowDeleteModal(true); }}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // ============================================
  // TABLE VIEW - MODELS
  // ============================================

  const renderModelsTable = () => {
    const filtered = models.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getModelBrandName(m).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Model Name</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((model) => (
              <tr key={model.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 text-theme-muted text-sm">{model.id}</td>
                <td className="px-4 py-3 font-medium text-theme-text">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
                    {getModelBrandName(model)}
                  </span>
                </td>
                <td className="px-4 py-3 text-theme-text">{model.name}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(model);
                        setEditFormData({ make_id: model.make_id, name: model.name });
                        setShowEditModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(model); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // HIERARCHICAL VIEW - BODY TYPES
  // ============================================

  const renderBodyTypesHierarchical = () => {
    const groupedBodyTypes: Record<number, VehicleBodyType[]> = {};
    bodyTypes.forEach(bodyType => {
      if (!groupedBodyTypes[bodyType.make_id]) {
        groupedBodyTypes[bodyType.make_id] = [];
      }
      groupedBodyTypes[bodyType.make_id].push(bodyType);
    });

    const filteredBrands = makes.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (groupedBodyTypes[b.id] || []).some(bt => bt.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (filteredBrands.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-theme-muted">
          <Truck className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">No body types found</p>
          <p className="text-sm">{searchQuery ? 'Try a different search.' : 'Add your first body type!'}</p>
          <button
            onClick={() => {
              setEditFormData({ make_id: 0, name: '' });
              setSelectedItem(null);
              setShowAddModal(true);
            }}
            className="mt-4 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 flex items-center gap-2"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add New Body Type
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-6 px-4 py-2 bg-theme-card rounded-xl border border-theme-border text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
            <span className="text-theme-muted">Brand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#f59e0b' }}></div>
            <span className="text-theme-muted">Body Type</span>
          </div>
          <ArrowRight className="w-4 h-4 text-theme-muted" />
          <span className="text-theme-muted">Relationship</span>
        </div>

        {filteredBrands.map((brand) => {
          const brandBodyTypes = groupedBodyTypes[brand.id] || [];
          const isExpanded = expandedBrands.has(brand.id);
          const brandModels = models.filter(m => m.make_id === brand.id);

          return (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-theme-card rounded-xl border border-theme-border overflow-hidden transition-all"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-theme-panel/50 transition-colors"
                onClick={() => {
                  const newExpanded = new Set(expandedBrands);
                  if (newExpanded.has(brand.id)) {
                    newExpanded.delete(brand.id);
                  } else {
                    newExpanded.add(brand.id);
                  }
                  setExpandedBrands(newExpanded);
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${secondaryColor}20` }}>
                    <Truck className="w-5 h-5" style={{ color: secondaryColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-theme-text">{brand.name}</h3>
                    <div className="flex items-center gap-3 text-xs text-theme-muted">
                      <span>{brandBodyTypes.length} body type{brandBodyTypes.length > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span>{brandModels.length} model{brandModels.length > 1 ? 's' : ''}</span>
                      <span>•</span>
                      <span className="text-theme-text">Models: {brandModels.map(m => m.name).join(', ') || 'None'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditFormData({ make_id: brand.id, name: '' });
                      setSelectedItem(null);
                      setShowAddModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg text-white text-xs font-medium transition-all hover:opacity-90 flex items-center gap-1"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Body Type
                  </button>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-theme-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-theme-muted" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="p-4 pt-0 border-t border-theme-border">
                  {brandBodyTypes.length === 0 ? (
                    <div className="text-center py-8 text-theme-muted">No body types for this brand. Click &quot;Add Body Type&quot; to create one.</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {brandBodyTypes.map((bodyType) => (
                        <motion.div
                          key={bodyType.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-4 rounded-xl border border-theme-border bg-theme-card hover:border-theme-secondary transition-all group relative"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: '#f59e0b' }}></div>
                                <h4 className="font-semibold text-theme-text truncate">{bodyType.name}</h4>
                              </div>
                              <div className="mt-2 flex items-center gap-2 text-xs text-theme-muted">
                                <span className="font-medium">Brand:</span>
                                <span className="text-theme-text">{getBodyTypeBrandName(bodyType)}</span>
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-xs text-theme-muted">
                                <span className="font-medium">Models:</span>
                                <span className="text-theme-text">
                                  {brandModels.length > 0
                                    ? brandModels.map(m => m.name).join(', ')
                                    : 'No models available'}
                                </span>
                              </div>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">ID: {bodyType.id}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(bodyType);
                                  setEditFormData({ make_id: bodyType.make_id, name: bodyType.name });
                                  setShowEditModal(true);
                                }}
                                className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                style={{ color: primaryColor }}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => { setSelectedItem(bodyType); setShowDeleteModal(true); }}
                                className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    );
  };

  // ============================================
  // TABLE VIEW - BODY TYPES
  // ============================================

  const renderBodyTypesTable = () => {
    const filtered = bodyTypes.filter(b =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getBodyTypeBrandName(b).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Body Type</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((bodyType) => (
              <tr key={bodyType.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 text-theme-muted text-sm">{bodyType.id}</td>
                <td className="px-4 py-3 font-medium text-theme-text">
                  <span className="inline-flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }}></span>
                    {getBodyTypeBrandName(bodyType)}
                  </span>
                </td>
                <td className="px-4 py-3 text-theme-text">{bodyType.name}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(bodyType);
                        setEditFormData({ make_id: bodyType.make_id, name: bodyType.name });
                        setShowEditModal(true);
                      }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(bodyType); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // CONDITIONS TABLE
  // ============================================

  const renderConditionsTable = () => {
    const filtered = conditions.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((condition) => (
              <tr key={condition.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 text-theme-muted text-sm">{condition.id}</td>
                <td className="px-4 py-3 font-medium text-theme-text">{condition.name}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSelectedItem(condition); setEditFormData(toFormData(condition)); setShowEditModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(condition); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // WINDOWS TABLE
  // ============================================

  const renderWindowsTable = () => {
    const filtered = windows.filter(w =>
      w.window_time.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Window Time</th>
              <th className="px-4 py-3 text-left">Display Order</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((window) => (
              <tr key={window.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                <td className="px-4 py-3 text-theme-muted text-sm">{window.id}</td>
                <td className="px-4 py-3 font-medium text-theme-text">{window.window_time}</td>
                <td className="px-4 py-3 text-theme-muted text-sm">{window.display_order}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setSelectedItem(window); setEditFormData(toFormData(window)); setShowEditModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                      style={{ color: primaryColor }}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { setSelectedItem(window); setShowDeleteModal(true); }}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // BOOKINGS TABLE
  // ============================================

  const renderBookingsTable = () => {
    const filtered = bookings.filter(b =>
      b.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle_make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle_model.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-theme-muted bg-theme-panel">
            <tr>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Vehicle</th>
              <th className="px-4 py-3 text-left">Package</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((booking) => {
              const IconComponent = iconMap[booking.vehicle_category === 'car' ? 'Car' :
                                       booking.vehicle_category === 'truck' ? 'Truck' :
                                       booking.vehicle_category === 'van' ? 'Warehouse' :
                                       booking.vehicle_category === 'suv' ? 'Bus' : 'Car'];
              return (
                <tr key={booking.id} className="border-b border-theme-border hover:bg-theme-panel/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-theme-text">{booking.first_name} {booking.last_name}</p>
                      <p className="text-xs text-theme-muted">{booking.email}</p>
                      <p className="text-xs text-theme-muted">{booking.phone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-theme-muted" />
                      <span className="text-theme-text text-sm">
                        {booking.vehicle_year} {booking.vehicle_make}
                      </span>
                      <span className="text-xs text-theme-muted">{booking.vehicle_model}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-theme-text text-sm">{booking.package_name}</span>
                    <p className="text-xs text-theme-muted">{booking.vehicle_count} vehicle{booking.vehicle_count > 1 ? 's' : ''}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-theme-text text-sm">{new Date(booking.appointment_date).toLocaleDateString('en-AU')}</span>
                      <span className="text-xs text-theme-muted">{booking.selected_windows?.join(', ')}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: secondaryColor }}>
                    ${booking.total_price}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={booking.status}
                      onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value as VehicleBooking['status'])}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer ${getStatusBadge(booking.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setSelectedItem(booking); setShowDeleteModal(true); }}
                        className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // ============================================
  // MODAL COMPONENT
  // ============================================

  const renderAddEditModal = () => {
    const isEditing = hasId(selectedItem);
    const title = isEditing ? 'Edit Item' : 'Add New Item';
    const isModelOrBodyType = activeTab === 'models' || activeTab === 'bodytypes';
    const isModel = activeTab === 'models';
    const selectedMakeId = positiveNumber(editFormData.make_id);

    const handleSave = () => runMutation(async () => {
      switch (activeTab) {
        case 'services':
          if (isEditing) {
            await handleUpdateService(Number(selectedItem.id), editFormData);
          } else {
            await handleAddService(editFormData);
          }
          break;
        case 'addons':
          if (isEditing) {
            await handleUpdateAddOn(String(selectedItem.id), editFormData);
          } else {
            await handleAddAddOn(editFormData);
          }
          break;
        case 'categories':
          if (isEditing) {
            await handleUpdateCategory(String(selectedItem.id), editFormData);
          } else {
            await handleAddCategory(editFormData);
          }
          break;
        case 'makes':
          if (isEditing) {
            await handleUpdateMake(Number(selectedItem.id), editFormData);
          } else {
            await handleAddMake(editFormData);
          }
          break;
        case 'models':
          if (isEditing) {
            await handleUpdateModel(Number(selectedItem.id), editFormData);
          } else {
            await handleAddModel(editFormData);
          }
          break;
        case 'bodytypes':
          if (isEditing) {
            await handleUpdateBodyType(Number(selectedItem.id), editFormData);
          } else {
            await handleAddBodyType(editFormData);
          }
          break;
        case 'conditions':
          if (isEditing) {
            await handleUpdateCondition(Number(selectedItem.id), editFormData);
          } else {
            await handleAddCondition(editFormData);
          }
          break;
        case 'windows':
          if (isEditing) {
            await handleUpdateWindow(Number(selectedItem.id), editFormData);
          } else {
            await handleAddWindow(editFormData);
          }
          break;
        default:
          break;
      }
    });

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-theme-panel rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-theme-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-theme-text">{title}</h2>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg hover:bg-theme-card transition-colors text-theme-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {isModelOrBodyType && (
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">Select Brand</label>
                <select
                  value={selectedMakeId}
                  onChange={(e) => setEditFormData({ ...editFormData, make_id: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors"
                >
                  <option value={0}>Select a brand...</option>
                  {makes.map((make) => (
                    <option key={make.id} value={make.id}>
                      {make.name}
                    </option>
                  ))}
                </select>
                {makes.length === 0 && (
                  <p className="text-xs text-yellow-500 mt-1">No brands available. Please add a brand first.</p>
                )}
                {selectedMakeId !== 0 && (
                  <div className="mt-2 p-3 bg-theme-card rounded-lg border border-green-500/30">
                    <p className="text-xs text-theme-muted">
                      Selected Brand: <span className="font-medium text-theme-text">{getBrandName(selectedMakeId)}</span>
                    </p>
                    <p className="text-xs text-theme-muted mt-1">
                      {isModel ? 'Models' : 'Body Types'} for this brand: {
                        isModel
                          ? models.filter(m => m.make_id === selectedMakeId).length
                          : bodyTypes.filter(b => b.make_id === selectedMakeId).length
                      } item(s)
                    </p>
                  </div>
                )}
              </div>
            )}

            {Object.entries(editFormData).map(([key, value]) => {
              if (['id', 'created_at', 'updated_at', 'confirmed_at', 'completed_at', 'cancelled_at', 'make_id'].includes(key)) return null;

              if (typeof value === 'boolean') {
                return (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.checked })}
                      className="w-5 h-5 rounded border-theme-border text-blue-600 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-theme-text capitalize">{key.replace(/_/g, ' ')}</label>
                  </div>
                );
              }

              if (typeof value === 'number') {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-theme-text mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: parseFloat(e.target.value) || 0 })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors"
                    />
                  </div>
                );
              }

              if (Array.isArray(value)) {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-theme-text mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    <textarea
                      value={value.join('\n')}
                      onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value.split('\n').filter(Boolean) })}
                      className="w-full px-4 py-2 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors min-h-[100px]"
                      placeholder="Enter each item on a new line"
                    />
                  </div>
                );
              }

              if (typeof value === 'object' && value !== null) {
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-theme-text mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                    <textarea
                      value={JSON.stringify(value, null, 2)}
                      onChange={(e) => {
                        try {
                          setEditFormData({ ...editFormData, [key]: JSON.parse(e.target.value) });
                        } catch {
                          // Keep as string if invalid JSON
                        }
                      }}
                      className="w-full px-4 py-2 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors min-h-[100px] font-mono text-sm"
                      placeholder="{}"
                    />
                  </div>
                );
              }

              return (
                <div key={key}>
                  <label className="block text-sm font-medium text-theme-text mb-1 capitalize">{key.replace(/_/g, ' ')}</label>
                  <input
                    type="text"
                    value={typeof value === 'string' || typeof value === 'number' ? value : ''}
                    onChange={(e) => setEditFormData({ ...editFormData, [key]: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors"
                    placeholder={`Enter ${key.replace(/_/g, ' ')}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-theme-border">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={closeModal}
              disabled={saving}
              className="px-6 py-3 rounded-xl border-2 border-theme-border text-theme-muted font-semibold hover:bg-theme-card transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ============================================
  // DELETE MODAL
  // ============================================

  const renderDeleteModal = () => {
    if (!hasId(selectedItem)) return null;

    const handleConfirmDelete = async () => {
      if (deleting) return;
      setDeleting(true);
      try {
        switch (activeTab) {
          case 'services':
            await handleDeleteService(Number(selectedItem.id));
            break;
          case 'addons':
            await handleDeleteAddOn(String(selectedItem.id));
            break;
          case 'categories':
            await handleDeleteCategory(String(selectedItem.id));
            break;
          case 'makes':
            await handleDeleteMake(Number(selectedItem.id));
            break;
          case 'models':
            await handleDeleteModel(Number(selectedItem.id));
            break;
          case 'bodytypes':
            await handleDeleteBodyType(Number(selectedItem.id));
            break;
          case 'conditions':
            await handleDeleteCondition(Number(selectedItem.id));
            break;
          case 'windows':
            await handleDeleteWindow(Number(selectedItem.id));
            break;
          case 'bookings':
            await handleDeleteBooking(String(selectedItem.id));
            break;
          default:
            break;
        }
      } finally {
        setDeleting(false);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-theme-panel rounded-2xl max-w-md w-full p-6 border border-theme-border"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Trash2 className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-theme-text text-center mb-2">Delete Item</h3>
          <p className="text-theme-muted text-center mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 bg-red-500"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button
              onClick={closeModal}
              disabled={deleting}
              className="px-6 py-3 rounded-xl border-2 border-theme-border text-theme-muted font-semibold hover:bg-theme-card transition-colors"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  // ============================================
  // RENDER CONTENT
  // ============================================

  const renderContent = () => {
    switch (activeTab) {
      case 'services':
        return renderServicesTable();
      case 'addons':
        return renderAddOnsTable();
      case 'categories':
        return renderCategoriesTable();
      case 'makes':
        return renderMakesTable();
      case 'models':
        return viewMode === 'hierarchical' ? renderModelsHierarchical() : renderModelsTable();
      case 'bodytypes':
        return viewMode === 'hierarchical' ? renderBodyTypesHierarchical() : renderBodyTypesTable();
      case 'conditions':
        return renderConditionsTable();
      case 'windows':
        return renderWindowsTable();
      case 'bookings':
        return renderBookingsTable();
      default:
        return null;
    }
  };

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-4"
          >
            <div
              className={`px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
                toast.type === 'success'
                  ? 'bg-green-500 text-white'
                  : toast.type === 'error'
                  ? 'bg-red-500 text-white'
                  : 'bg-blue-500 text-white'
              }`}
            >
              {toast.type === 'success' && <Check className="w-5 h-5 flex-shrink-0" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button onClick={() => setToast(null)} className="text-white/70 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Header */}
      <div className="border-b border-theme-border" style={{ background: `linear-gradient(to right, ${primaryColor}30, ${secondaryColor}30)` }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-theme-text">Admin Dashboard</h1>
              <p className="text-theme-muted mt-1">Manage your mobile detailing platform</p>
            </div>
            <button
              onClick={fetchAllData}
              className="px-4 py-2 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex flex-wrap gap-2 border-b border-theme-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 flex items-center gap-2 ${
                  isActive
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-theme-muted hover:text-theme-text'
                }`}
                style={isActive ? { borderColor: primaryColor, color: primaryColor } : {}}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-theme-muted" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-theme-border bg-theme-card text-theme-text focus:outline-none focus:border-theme-secondary transition-colors"
              />
            </div>

            {(activeTab === 'models' || activeTab === 'bodytypes') && (
              <div className="flex items-center gap-1 p-1 rounded-xl border border-theme-border bg-theme-card">
                <button
                  onClick={() => setViewMode('hierarchical')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'hierarchical'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <FolderTree className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'table'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-theme-muted hover:text-theme-text'
                  }`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => openAddModal(getEmptyFormForTab(activeTab))}
            className="px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: secondaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {loadError && (
          <div className="mb-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Partial load issue</p>
              <p>{loadError}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: primaryColor }} />
          </div>
        ) : (
          <div className="bg-theme-panel rounded-2xl border border-theme-border overflow-hidden">
            {renderContent()}
          </div>
        )}
      </div>

      <AnimatePresence>
        {(showAddModal || showEditModal) && renderAddEditModal()}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteModal && renderDeleteModal()}
      </AnimatePresence>
    </div>
  );
}
