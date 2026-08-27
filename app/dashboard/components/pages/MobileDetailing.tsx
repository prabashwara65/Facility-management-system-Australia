// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Check,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Save,
  RefreshCw,
  Clock,
  Calendar,
  Package,
  Car,
  Truck,
  Warehouse,
  Bus,
  Home,
  User,
  Loader2,
  Tag,
  Layers,
  List,
  Clock as ClockIcon,
  DollarSign,
  Star,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronUp,
  ArrowRight,
  FolderTree,
  Grid,
  List as ListIcon,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Settings,
  Award,
  Shield,
  MessageSquare,
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
  make_name?: string; // Virtual field for display
}

interface VehicleBodyType {
  id: number;
  make_id: number;
  name: string;
  created_at?: string;
  make_name?: string; // Virtual field for display
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

// ============================================
// ICON MAP
// ============================================

const iconMap: Record<string, any> = {
  Car: Car,
  Truck: Truck,
  Warehouse: Warehouse,
  Bus: Bus,
  Home: Home,
};

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
  const [activeTab, setActiveTab] = useState<'services' | 'addons' | 'categories' | 'makes' | 'models' | 'bodytypes' | 'conditions' | 'windows' | 'bookings'>('models');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'hierarchical' | 'table'>('hierarchical');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editFormData, setEditFormData] = useState<any>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [expandedBrands, setExpandedBrands] = useState<Set<number>>(new Set());

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
  const textColor = currentTheme?.colors?.[3] || '#1a1a2e';

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

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

      const transformedData = data?.map((item: any) => ({
        ...item,
        make_name: item.vehicle_makes?.name || 'Unknown Brand'
      })) || [];

      setModels(transformedData);
    } catch (error) {
      console.error('Error fetching models:', error);
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

      const transformedData = data?.map((item: any) => ({
        ...item,
        make_name: item.vehicle_makes?.name || 'Unknown Brand'
      })) || [];

      setBodyTypes(transformedData);
    } catch (error) {
      console.error('Error fetching body types:', error);
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
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
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
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // ============================================
  // CRUD OPERATIONS
  // ============================================

  // --- MAKES ---
  const handleAddMake = async (data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Brand name is required', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_makes')
        .insert([{ name: data.name.trim() }]);
      if (error) throw error;
      showToast('Brand added successfully!', 'success');
      fetchMakes();
      setShowAddModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleUpdateMake = async (id: number, data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Brand name is required', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_makes')
        .update({ name: data.name.trim() })
        .eq('id', id);
      if (error) throw error;
      showToast('Brand updated successfully!', 'success');
      fetchMakes();
      setShowEditModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
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
      fetchMakes();
      setShowDeleteModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  // --- MODELS ---
  const handleAddModel = async (data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Model name is required', 'error');
        return;
      }
      if (!data.make_id || data.make_id === 0) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_models')
        .insert([{
          make_id: data.make_id,
          name: data.name.trim()
        }]);
      if (error) throw error;
      showToast('Model added successfully!', 'success');
      fetchModels();
      setShowAddModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleUpdateModel = async (id: number, data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Model name is required', 'error');
        return;
      }
      if (!data.make_id || data.make_id === 0) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_models')
        .update({
          make_id: data.make_id,
          name: data.name.trim()
        })
        .eq('id', id);
      if (error) throw error;
      showToast('Model updated successfully!', 'success');
      fetchModels();
      setShowEditModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
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
      fetchModels();
      setShowDeleteModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  // --- BODY TYPES ---
  const handleAddBodyType = async (data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Body type name is required', 'error');
        return;
      }
      if (!data.make_id || data.make_id === 0) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_body_types')
        .insert([{
          make_id: data.make_id,
          name: data.name.trim()
        }]);
      if (error) throw error;
      showToast('Body type added successfully!', 'success');
      fetchBodyTypes();
      setShowAddModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleUpdateBodyType = async (id: number, data: any) => {
    try {
      if (!data.name || data.name.trim() === '') {
        showToast('Body type name is required', 'error');
        return;
      }
      if (!data.make_id || data.make_id === 0) {
        showToast('Please select a brand', 'error');
        return;
      }
      const { error } = await supabase
        .from('vehicle_body_types')
        .update({
          make_id: data.make_id,
          name: data.name.trim()
        })
        .eq('id', id);
      if (error) throw error;
      showToast('Body type updated successfully!', 'success');
      fetchBodyTypes();
      setShowEditModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
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
      fetchBodyTypes();
      setShowDeleteModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  // --- SERVICES, ADD-ONS, CATEGORIES, CONDITIONS, WINDOWS, BOOKINGS ---
  // (Keep existing handlers for these tables)

  const handleAddService = async (data: any) => {
    try {
      const { error } = await supabase.from('vehicle_services').insert([data]);
      if (error) throw error;
      showToast('Service added successfully!', 'success');
      fetchServices();
      setShowAddModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleUpdateService = async (id: number, data: any) => {
    try {
      const { error } = await supabase.from('vehicle_services').update(data).eq('id', id);
      if (error) throw error;
      showToast('Service updated successfully!', 'success');
      fetchServices();
      setShowEditModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  const handleDeleteService = async (id: number) => {
    try {
      const { error } = await supabase.from('vehicle_services').delete().eq('id', id);
      if (error) throw error;
      showToast('Service deleted successfully!', 'success');
      fetchServices();
      setShowDeleteModal(false);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    }
  };

  // Add more handlers for addons, categories, conditions, windows, bookings...

  // ============================================
  // TOAST
  // ============================================

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
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
  // HIERARCHICAL VIEW - MODELS
  // ============================================

  const renderModelsHierarchical = () => {
    // Group models by brand
    const groupedModels: Record<number, VehicleModel[]> = {};
    models.forEach(model => {
      if (!groupedModels[model.make_id]) {
        groupedModels[model.make_id] = [];
      }
      groupedModels[model.make_id].push(model);
    });

    // Filter brands based on search
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
        {/* Legend */}
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
              {/* Brand Header */}
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

              {/* Models Grid */}
              {isExpanded && (
                <div className="p-4 pt-0 border-t border-theme-border">
                  {brandModels.length === 0 ? (
                    <div className="text-center py-8 text-theme-muted">
                      No models for this brand. Click "Add Model" to create one.
                    </div>
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
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  ID: {model.id}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(model);
                                  setEditFormData({
                                    make_id: model.make_id,
                                    name: model.name
                                  });
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
                    <div className="text-center py-8 text-theme-muted">
                      No body types for this brand. Click "Add Body Type" to create one.
                    </div>
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
                                <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                  ID: {bodyType.id}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                              <button
                                onClick={() => {
                                  setSelectedItem(bodyType);
                                  setEditFormData({
                                    make_id: bodyType.make_id,
                                    name: bodyType.name
                                  });
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
                        setEditFormData({
                          make_id: model.make_id,
                          name: model.name
                        });
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
                        setEditFormData({
                          make_id: bodyType.make_id,
                          name: bodyType.name
                        });
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
  // RENDER OTHER TABLES
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
  // MODAL COMPONENT
  // ============================================

  const AddEditModal = () => {
    const isEditing = !!selectedItem?.id;
    const title = isEditing ? 'Edit Item' : 'Add New Item';
    const isModelOrBodyType = activeTab === 'models' || activeTab === 'bodytypes';
    const isModel = activeTab === 'models';

    const handleSave = () => {
      switch (activeTab) {
        case 'services':
          if (isEditing) {
            handleUpdateService(selectedItem.id, editFormData);
          } else {
            handleAddService(editFormData);
          }
          break;
        // Add more cases for other tables
        case 'makes':
          if (isEditing) {
            handleUpdateMake(selectedItem.id, editFormData);
          } else {
            handleAddMake(editFormData);
          }
          break;
        case 'models':
          if (isEditing) {
            handleUpdateModel(selectedItem.id, editFormData);
          } else {
            handleAddModel(editFormData);
          }
          break;
        case 'bodytypes':
          if (isEditing) {
            handleUpdateBodyType(selectedItem.id, editFormData);
          } else {
            handleAddBodyType(editFormData);
          }
          break;
        // Add more cases...
        default:
          break;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => { setShowEditModal(false); setShowAddModal(false); }}
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
              onClick={() => { setShowEditModal(false); setShowAddModal(false); }}
              className="p-2 rounded-lg hover:bg-theme-card transition-colors text-theme-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Brand Dropdown for Models and Body Types */}
            {isModelOrBodyType && (
              <div>
                <label className="block text-sm font-medium text-theme-text mb-1">Select Brand</label>
                <select
                  value={editFormData.make_id || 0}
                  onChange={(e) => setEditFormData({ ...editFormData, make_id: parseInt(e.target.value) })}
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
                {editFormData.make_id && editFormData.make_id !== 0 && (
                  <div className="mt-2 p-3 bg-theme-card rounded-lg border border-green-500/30">
                    <p className="text-xs text-theme-muted">
                      Selected Brand: <span className="font-medium text-theme-text">{getBrandName(editFormData.make_id)}</span>
                    </p>
                    <p className="text-xs text-theme-muted mt-1">
                      {isModel ? 'Models' : 'Body Types'} for this brand: {
                        isModel
                          ? models.filter(m => m.make_id === editFormData.make_id).length
                          : bodyTypes.filter(b => b.make_id === editFormData.make_id).length
                      } item(s)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Dynamic form fields */}
            {Object.entries(editFormData).map(([key, value]) => {
              if (['id', 'created_at', 'updated_at', 'confirmed_at', 'completed_at', 'cancelled_at', 'make_id'].includes(key)) return null;

              if (typeof value === 'boolean') {
                return (
                  <div key={key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={editFormData[key] || false}
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
                      value={editFormData[key] ?? ''}
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
                    value={editFormData[key] ?? ''}
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
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
              style={{ backgroundColor: primaryColor }}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
            <button
              onClick={() => { setShowEditModal(false); setShowAddModal(false); }}
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

  const DeleteModal = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowDeleteModal(false)}
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
              onClick={() => {
                switch (activeTab) {
                  case 'services': handleDeleteService(selectedItem.id); break;
                  case 'makes': handleDeleteMake(selectedItem.id); break;
                  case 'models': handleDeleteModel(selectedItem.id); break;
                  case 'bodytypes': handleDeleteBodyType(selectedItem.id); break;
                  // Add more cases...
                  default: break;
                }
              }}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2 bg-red-500"
            >
              Delete
            </button>
            <button
              onClick={() => setShowDeleteModal(false)}
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
  // MAIN RENDER
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

  return (
    <div className="min-h-screen bg-theme-bg text-theme-text">
      {/* Toast */}
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
          {[
            { id: 'services', label: 'Services', icon: Package },
            { id: 'addons', label: 'Add-ons', icon: Plus },
            { id: 'categories', label: 'Categories', icon: Car },
            { id: 'makes', label: 'Brands', icon: Tag },
            { id: 'models', label: 'Models', icon: Layers },
            { id: 'bodytypes', label: 'Body Types', icon: Truck },
            { id: 'conditions', label: 'Conditions', icon: AlertCircle },
            { id: 'windows', label: 'Windows', icon: ClockIcon },
            { id: 'bookings', label: 'Bookings', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
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
        {/* Toolbar */}
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

            {/* View Mode Toggle */}
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
            onClick={() => {
              const emptyForm: any = {};
              switch (activeTab) {
                case 'services':
                  emptyForm.name = '';
                  emptyForm.price = 0;
                  emptyForm.rating = 0;
                  emptyForm.reviews = 0;
                  emptyForm.popular = false;
                  emptyForm.description = '';
                  emptyForm.vehicle_type = 'car';
                  emptyForm.estimated_time = '60 minutes';
                  break;
                case 'addons':
                  emptyForm.id = `new-${Date.now()}`;
                  emptyForm.name = '';
                  emptyForm.price = 0;
                  emptyForm.description = '';
                  emptyForm.details = '';
                  emptyForm.per_seat = false;
                  break;
                case 'categories':
                  emptyForm.id = '';
                  emptyForm.label = '';
                  emptyForm.icon_name = 'Car';
                  break;
                case 'makes':
                  emptyForm.name = '';
                  break;
                case 'models':
                  emptyForm.make_id = 0;
                  emptyForm.name = '';
                  break;
                case 'bodytypes':
                  emptyForm.make_id = 0;
                  emptyForm.name = '';
                  break;
                case 'conditions':
                  emptyForm.name = '';
                  break;
                case 'windows':
                  emptyForm.window_time = '';
                  emptyForm.display_order = 0;
                  break;
                default:
                  emptyForm.name = '';
              }
              setSelectedItem(null);
              setEditFormData(emptyForm);
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 flex items-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: secondaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add New
          </button>
        </div>

        {/* Loading State */}
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

      {/* Modals */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && <AddEditModal />}
      </AnimatePresence>
      <AnimatePresence>
        {showDeleteModal && <DeleteModal />}
      </AnimatePresence>
    </div>
  );
}