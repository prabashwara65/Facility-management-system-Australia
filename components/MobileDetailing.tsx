'use client';

/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Check,
  Car,
  Truck,
  Warehouse,
  Bus,
  Shield,
  Clock,
  MapPin,
  Award,
  X,
  Sparkles,
  Calendar,
  Users,
  Clock as ClockIcon,
  ChevronRight,
  Unlock,
  AlertCircle,
  ChevronDown,
  User,
  Plus,
  Minus,
  Trash2,
  Home,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/app/context/ThemeProvider';
import { createClient } from '@/lib/supabase/client';

interface Service {
  id: number;
  name: string;
  price: string;
  rating: number;
  reviews: number;
  popular?: boolean;
  description: string;
  exterior: string[];
  interior: string[];
  vehicleType: 'car' | 'truck' | 'van' | 'suv' | 'all';
  estimatedTime: string;
}

interface AddOnOption {
  id: string;
  name: string;
  price: number;
  description: string;
  details: string;
  perSeat?: boolean;
}

interface VehicleCategory {
  id: string;
  label: string;
  icon_name?: string;
  icon: ComponentType<{ className?: string }>;
}

interface VehicleMake {
  id: number;
  name: string;
  category_id?: string | null;
}

interface VehicleModel {
  id: number;
  make_id: number;
  name: string;
}

interface VehicleBodyType {
  id: number;
  make_id: number;
  model_id?: number | null;
  name: string;
}

interface VehicleServiceRow {
  id: number;
  name: string;
  price: number | string;
  rating: number | string | null;
  reviews: number | null;
  popular: boolean | null;
  description: string | null;
  vehicle_type: Service['vehicleType'] | null;
  estimated_time: string | null;
}

interface VehicleServiceItemRow {
  service_id: number;
  item: string;
}

interface VehicleAddOnRow {
  id: string;
  name: string;
  price: number | string;
  description: string | null;
  details: string | null;
  per_seat: boolean | null;
}

interface VehicleConditionRow {
  name: string;
}

interface VehicleArrivalWindowRow {
  window_time: string;
}

const services: Service[] = [
  {
    id: 1,
    name: 'PLATINUM Detailing Package',
    price: '$299',
    rating: 4.72,
    reviews: 23782,
    popular: true,
    description: 'Our signature auto detailing package with comprehensive INTERIOR and EXTERIOR services including shampoo and high quality wax.',
    vehicleType: 'car',
    estimatedTime: '180 minutes',
    exterior: [
      'Complete outside wash (including truck beds)',
      'Hand dry with clean microfiber towels to protect your paint',
      'Clean and degrease wheels and tires',
      'Dress tires, trim and moldings',
      'Clean all door jambs and trunk seals',
      'Clean exterior windows',
      'Clay prep all painted surfaces to remove harmful contaminants',
      'Apply high quality wax by hand to all painted surfaces',
      'Wipe down engine bay',
    ],
    interior: [
      'Vacuum entire interior and trunk',
      'Wipe down all interior surfaces',
      'Apply UV protector to all hard surfaces',
      'Shampoo OR Steam interior carpets, trunk and floor mats',
      'Shampoo Or Steam leather OR cloth seats',
      'Wipe down any leather surfaces and apply a conditioner',
      'Spot clean head liner',
      'Clean vents',
      'Clean all interior cup holders',
      'Clean interior compartments (emptied)',
      'Clean interior windows',
    ],
  },
  {
    id: 2,
    name: 'GOLD Detailing Package',
    price: '$219',
    rating: 4.76,
    reviews: 11966,
    description: 'Combines the complete EXTERIOR detail and hand wax with Interior vacuum, wipe down, and leather/vinyl dressings',
    vehicleType: 'car',
    estimatedTime: '120 minutes',
    exterior: [
      'We come to you!',
      'Complete outside wash (including bed for trucks)',
      'Hand dry with clean microfiber towels to protect your paint',
      'Clean and degrease wheels and tires',
      'Apply tire and wheel dressing',
      'Clean all door jambs and trunk seals',
      'Clean exterior windows',
      'Exterior dressing of plastics',
      'Clay prep all painted surfaces to remove harmful contaminants',
      'Apply high quality wax by hand to all painted surfaces',
    ],
    interior: [
      'Vacuum seats, carpets, trunk and floor mats',
      'Wipe down all interior surfaces',
      'Clean all vents, cup holders, door panels, etc.',
      'Clean interior compartments (emptied)',
      'Apply UV protectant to all hard interior surfaces',
      'Clean and condition leather, vinyl and plastics',
      'Clean interior windows',
    ],
  },
  {
    id: 3,
    name: 'TITANIUM Detailing Package',
    price: '$545',
    rating: 4.68,
    reviews: 1648,
    description: 'Our most thorough detailing package! A complete exterior detail with single pass compounding/buffing paint correction combined with a full interior detailing.',
    vehicleType: 'car',
    estimatedTime: '240 minutes',
    exterior: [
      'We come to you!',
      'Complete outside wash (including truck beds)',
      'Hand dry with clean microfiber towels to protect your paint',
      'Clean all door jambs and trunk seals',
      'Clean exterior windows',
      'Clay prep all painted surfaces to remove harmful contaminants',
      'Single pass compounding and buffing to remove surface defects.',
      'Apply high quality wax by hand to all painted surfaces',
      'Dress exterior plastics',
      'Clean and degrease wheels and tires',
      'Polish Wheels',
      'Apply tire and wheel dressing',
      'Engine compartment wipe-down',
    ],
    interior: [
      'Vacuum entire interior and trunk',
      'Complete wipe down',
      'Apply UV protector to all hard surfaces',
      'Shampoo OR steam interior carpets, trunk and floor mats',
      'Shampoo Or Steam leather OR cloth seats',
      'Wipe down any leather surfaces and apply a conditioner',
      'Spot clean head liner',
      'Clean vents',
      'Clean door jambs',
      'Clean all cup holders',
      'Clean emptied interior compartments',
      'Clean interior windows',
    ],
  },
  {
    id: 4,
    name: 'TITANIUM Exterior Only',
    price: '$455',
    rating: 4.67,
    reviews: 467,
    description: 'All of the exterior services in the FULL Titanium detail package.',
    vehicleType: 'truck',
    estimatedTime: '120 minutes',
    exterior: [
      'We come to you!',
      'Complete outside wash',
      'Hand dry with clean microfiber towels to protect your paint',
      'Clean exterior windows',
      'Clay prep all painted surfaces to remove harmful contaminants',
      'Single pass compounding and buffing to remove surface defects.',
      'Apply high quality wax by hand to all painted surfaces',
      'Dress exterior plastics',
      'Clean and degrease wheels and tires',
      'Polish Wheels',
      'Apply tire and wheel dressing',
      'Engine compartment wipe-down',
    ],
    interior: [],
  },
  {
    id: 5,
    name: 'INTERIOR Only Detailing',
    price: '$219',
    rating: 4.73,
    reviews: 13782,
    description: 'INTERIOR ONLY detailing package including vacuum, shampoo, deep cleaning and leather/vinyl dressings.',
    vehicleType: 'car',
    estimatedTime: '120 minutes',
    exterior: [],
    interior: [
      'We come to you!',
      'Vacuum entire interior and trunk',
      'Wipe down/deep clean hard surfaces',
      'Clean interior windows',
      'Apply UV protector to all hard surfaces',
      'Shampoo OR steam interior carpets, trunk and floor mats',
      'Deep clean and condition leather seats OR deep clean and shampoo cloth seats',
      'Wipe down/deep clean any leather surfaces and apply a conditioner',
      'Spot clean head liner',
      'Clean vents',
      'Clean door jambs',
      'Clean all cup holders',
      'Clean interior compartments (emptied)',
    ],
  },
];

// Enhanced Add-on options with details
const addOnOptions: AddOnOption[] = [
  { 
    id: 'pet-hair', 
    name: 'Pet Hair Removal', 
    price: 70, 
    description: 'Remove all visible pet hair from interior',
    details: 'Complete removal of pet hair from all surfaces'
  },
  { 
    id: 'super-interior', 
    name: 'Super Interior', 
    price: 140, 
    description: 'Double shampoo, stain pre-treatment, pet hair removal',
    details: 'Deep clean with stain removal and pet hair extraction'
  },
  { 
    id: 'interior-sanitizing', 
    name: 'Interior Sanitizing', 
    price: 60, 
    description: 'Sanitize/disinfect all interior surfaces',
    details: 'Anti-microbial treatment for all surfaces'
  },
  { 
    id: 'rain-x', 
    name: 'Rain X Treatment', 
    price: 30, 
    description: 'Treat all exterior glass with water repellent',
    details: 'Hydrophobic coating for all exterior glass'
  },
  { 
    id: 'polymer-sealant', 
    name: 'Polymer Sealant', 
    price: 35, 
    description: 'Extend paint protection for up to 6 months',
    details: 'Synthetic sealant for long-lasting protection'
  },
  { 
    id: 'headlight-restoration', 
    name: 'Headlight Restoration', 
    price: 105, 
    description: 'Restore headlights to bright and brilliant shine',
    details: 'Professional headlight restoration service'
  },
  { 
    id: 'child-seat', 
    name: 'Child Seat Cleaning', 
    price: 35, 
    description: 'Vacuum, wipe down, and shampoo child seat',
    details: 'Deep clean and sanitize child safety seats',
    perSeat: true
  },
];

// Vehicle Makes
const makes = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 
  'Dodge', 'Ford', 'GMC', 'Genesis', 'Honda', 'Hyundai', 'INFINITI', 
  'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus', 
  'MINI', 'Mazda', 'Mercedes-Benz', 'Mitsubishi', 'Nissan', 'Ram', 
  'Rivian', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen'
];

// Models by make
const modelsByMake: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'e-tron', 'RS5', 'RS7', 'S4', 'S5', 'S6', 'S7', 'S8'],
  'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'i3', 'i4', 'i5', 'i7', 'iX', 'Z4'],
  'Mercedes-Benz': ['A-Class', 'B-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'EQE', 'EQS', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'GT', 'S-Class', 'SL', 'AMG GT'],
  'Toyota': ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma', 'Tundra', 'Sienna', 'Prius', '4Runner', 'Land Cruiser', 'Sequoia', 'Avalon', 'C-HR', 'GR Supra', 'GR86'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Passport', 'Pilot', 'Odyssey', 'Ridgeline', 'Insight', 'Clarity'],
  'Ford': ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco', 'Bronco Sport', 'Edge', 'Expedition', 'Ranger', 'Maverick', 'Mustang Mach-E', 'Transit'],
  'Chevrolet': ['Silverado', 'Equinox', 'Tahoe', 'Suburban', 'Traverse', 'Trailblazer', 'Colorado', 'Blazer', 'Malibu', 'Camaro', 'Corvette', 'Bolt EUV'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster'],
  'Volkswagen': ['Golf', 'Jetta', 'Passat', 'Tiguan', 'Atlas', 'ID.4', 'Taos', 'Arteon', 'GTI', 'R'],
  'Hyundai': ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Palisade', 'Kona', 'Ioniq 5', 'Ioniq 6', 'Venue'],
  'Kia': ['Sportage', 'Sorento', 'Telluride', 'K5', 'Forte', 'Rio', 'Soul', 'EV6', 'EV9', 'Niro'],
  'Nissan': ['Altima', 'Maxima', 'Sentra', 'Rogue', 'Pathfinder', 'Armada', 'Frontier', 'Titan', 'Leaf', 'Ariya', 'Z'],
  'Subaru': ['Outback', 'Forester', 'Crosstrek', 'Ascent', 'Legacy', 'Impreza', 'WRX', 'BRZ'],
  'Lexus': ['ES', 'IS', 'LS', 'RX', 'NX', 'GX', 'LX', 'UX', 'RZ', 'LC'],
  'Jeep': ['Wrangler', 'Grand Cherokee', 'Cherokee', 'Compass', 'Renegade', 'Gladiator', 'Wagoneer', 'Grand Wagoneer'],
  'Ram': ['1500', '2500', '3500', 'ProMaster', 'ProMaster City'],
  'GMC': ['Sierra', 'Yukon', 'Terrain', 'Acadia', 'Canyon', 'Hummer EV'],
  'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-50', 'CX-90'],
  'Acura': ['Integra', 'TLX', 'MDX', 'RDX', 'NSX'],
  'Cadillac': ['CT4', 'CT5', 'XT4', 'XT5', 'XT6', 'Escalade', 'Lyriq'],
  'Buick': ['Encore', 'Envision', 'Enclave', 'Regal'],
  'Chrysler': ['300', 'Pacifica', 'Voyager'],
  'Dodge': ['Challenger', 'Charger', 'Durango', 'Hornet'],
  'Genesis': ['G70', 'G80', 'G90', 'GV60', 'GV70', 'GV80'],
  'INFINITI': ['Q50', 'Q60', 'QX50', 'QX55', 'QX60', 'QX80'],
  'Jaguar': ['XE', 'XF', 'F-Type', 'E-Pace', 'F-Pace', 'I-Pace'],
  'Land Rover': ['Range Rover', 'Range Rover Sport', 'Range Rover Evoque', 'Discovery', 'Discovery Sport', 'Defender', 'Velar'],
  'Lincoln': ['Corsair', 'Nautilus', 'Aviator', 'Navigator'],
  'Lotus': ['Emira', 'Evija', 'Eletre'],
  'MINI': ['Cooper', 'Clubman', 'Countryman'],
  'Mitsubishi': ['Outlander', 'Eclipse Cross', 'Mirage', 'Outlander Sport'],
  'Rivian': ['R1T', 'R1S'],
};

// Body types by make
const bodyTypesByMake: Record<string, string[]> = {
  'Audi': ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Hatchback'],
  'BMW': ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Hatchback'],
  'Mercedes-Benz': ['Sedan', 'SUV', 'Coupe', 'Convertible', 'Wagon', 'Hatchback'],
  'Toyota': ['Sedan', 'SUV', 'Truck', 'Minivan', 'Coupe', 'Hatchback'],
  'Honda': ['Sedan', 'SUV', 'Minivan', 'Truck', 'Hatchback'],
  'Ford': ['Truck', 'SUV', 'Sedan', 'Coupe', 'Convertible', 'Minivan'],
  'Chevrolet': ['Truck', 'SUV', 'Sedan', 'Coupe', 'Convertible'],
  'Tesla': ['Sedan', 'SUV', 'Truck'],
  'Volkswagen': ['Sedan', 'SUV', 'Hatchback', 'Wagon', 'Convertible'],
  'Hyundai': ['Sedan', 'SUV', 'Hatchback', 'Coupe'],
  'Kia': ['Sedan', 'SUV', 'Hatchback', 'Coupe'],
  'Nissan': ['Sedan', 'SUV', 'Truck', 'Coupe', 'Hatchback'],
  'Subaru': ['SUV', 'Sedan', 'Hatchback', 'Coupe'],
  'Lexus': ['Sedan', 'SUV', 'Coupe', 'Convertible'],
  'Jeep': ['SUV', 'Truck'],
  'Ram': ['Truck', 'Van'],
  'GMC': ['Truck', 'SUV', 'Van'],
  'Mazda': ['Sedan', 'SUV', 'Coupe', 'Convertible'],
  'Acura': ['Sedan', 'SUV', 'Coupe'],
  'Cadillac': ['Sedan', 'SUV', 'Coupe'],
  'Buick': ['SUV', 'Sedan'],
  'Chrysler': ['Sedan', 'Minivan'],
  'Dodge': ['Sedan', 'SUV', 'Coupe'],
  'Genesis': ['Sedan', 'SUV'],
  'INFINITI': ['Sedan', 'SUV', 'Coupe'],
  'Jaguar': ['Sedan', 'SUV', 'Coupe', 'Convertible'],
  'Land Rover': ['SUV'],
  'Lincoln': ['SUV', 'Sedan'],
  'Lotus': ['Coupe', 'SUV'],
  'MINI': ['Hatchback', 'SUV', 'Wagon'],
  'Mitsubishi': ['SUV', 'Sedan', 'Hatchback'],
  'Rivian': ['Truck', 'SUV'],
};

// Vehicle Categories with Icons
const vehicleIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Car,
  Truck,
  Warehouse,
  Bus,
  Home,
};

const vehicleCategories: VehicleCategory[] = [
  { id: 'car', label: 'Cars', icon: Car },
  { id: 'truck', label: 'Trucks', icon: Truck },
  { id: 'van', label: 'Vans', icon: Warehouse },
  { id: 'suv', label: 'SUVs', icon: Bus },
];

const australianPostcodes = {
  VIC: { min: 3000, max: 3999 },
  NSW: { min: 2000, max: 2999 },
  QLD: { min: 4000, max: 4999 },
  SA: { min: 5000, max: 5999 },
  WA: { min: 6000, max: 6999 },
  TAS: { min: 7000, max: 7999 },
  NT: { min: 800, max: 999 },
  ACT: { min: 2600, max: 2618 },
};

const isValidAustralianPostcode = (postcode: string): boolean => {
  const code = parseInt(postcode);
  if (isNaN(code)) return false;
  return Object.values(australianPostcodes).some(range => {
    return code >= range.min && code <= range.max;
  });
};

// Generate years from 1896 to current year
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 1896; year--) {
    years.push(year.toString());
  }
  return years;
};

const years = generateYears();

// Vehicle Condition options
const vehicleConditions = [
  'Excessive pet hair',
  'Mold/mildew',
  'Human or animal biological waste',
  'Heavy soilage/stains',
  'Foul odors',
  'Tree sap',
  'Exterior hard water spots',
  'Overspray (paint, concrete, tar, chemical, etc)',
];

// Arrival Window options
const arrivalWindows = [
  '8am - 11am',
  '10am - 1pm',
  '12pm - 3pm',
  '2pm - 5pm',
];

const fallbackVehicleMakes = makes.map((name, index) => ({ id: index + 1, name }));
const fallbackMakeIdByName = new Map(fallbackVehicleMakes.map((make) => [make.name, make.id]));
const fallbackVehicleModels = Object.entries(modelsByMake).flatMap(([makeName, modelNames]) =>
  modelNames.map((name, modelIndex) => ({
    id: (fallbackMakeIdByName.get(makeName) || 0) * 1000 + modelIndex + 1,
    make_id: fallbackMakeIdByName.get(makeName) || 0,
    name,
  }))
);
const fallbackVehicleBodyTypes = Object.entries(bodyTypesByMake).flatMap(([makeName, bodyNames]) =>
  bodyNames.map((name, bodyIndex) => ({
    id: (fallbackMakeIdByName.get(makeName) || 0) * 1000 + bodyIndex + 1,
    make_id: fallbackMakeIdByName.get(makeName) || 0,
    name,
  }))
);

// Generate next 14 days
const generateDates = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

// Storage keys
const STORAGE_KEY = 'mobile_detailing_booking_data';

// Save to local storage
const saveToLocalStorage = (data: unknown) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
};

// Load from local storage
const loadFromLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

// Clear local storage
const clearLocalStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export default function MobileDetailing() {
  const router = useRouter();
  const { currentTheme } = useTheme();
  
  // Booking Type State
  const [bookingType, setBookingType] = useState<'residential' | 'mobile' | null>('mobile');
  
  // All state declarations first
  const [selectedVehicleType, setSelectedVehicleType] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeTab, setActiveTab] = useState<'exterior' | 'interior'>('exterior');
  const [zipCode, setZipCode] = useState('');
  const [zipError, setZipError] = useState('');
  const [isZipValid, setIsZipValid] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Service | null>(null);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedBody, setSelectedBody] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<'year' | 'make' | 'model' | 'body' | null>(null);
  const [popupService, setPopupService] = useState<Service | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [otherCondition, setOtherCondition] = useState('');
  const [selectedAddOns, setSelectedAddOns] = useState<Record<string, number>>({});
  const [showAddOnsStep, setShowAddOnsStep] = useState(false);
  const [showDateTimeStep, setShowDateTimeStep] = useState(false);
  const [showInfoStep, setShowInfoStep] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(1);
  
  // Date/Time state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedArrivalWindows, setSelectedArrivalWindows] = useState<string[]>([]);
  const [backupDate, setBackupDate] = useState<Date | null>(null);
  const [showBackupDate, setShowBackupDate] = useState(false);

  // Info state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [addressUnit, setAddressUnit] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [infoZipCode, setInfoZipCode] = useState('');
  const [waterAccess, setWaterAccess] = useState<'yes' | 'no' | null>(null);
  const [electricity, setElectricity] = useState<'yes' | 'no' | null>(null);
  const [coveredArea, setCoveredArea] = useState<'yes' | 'no' | null>(null);
  const [extraInfo, setExtraInfo] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isVehicleDataLoading, setIsVehicleDataLoading] = useState(true);
  const [vehicleDataError, setVehicleDataError] = useState('');
  const [loadedServices, setLoadedServices] = useState<Service[]>(services);
  const [loadedAddOns, setLoadedAddOns] = useState<AddOnOption[]>(addOnOptions);
  const [loadedCategories, setLoadedCategories] = useState<VehicleCategory[]>(vehicleCategories);
  const [loadedMakes, setLoadedMakes] = useState<VehicleMake[]>(fallbackVehicleMakes);
  const [loadedModels, setLoadedModels] = useState<VehicleModel[]>(fallbackVehicleModels);
  const [loadedBodyTypes, setLoadedBodyTypes] = useState<VehicleBodyType[]>(fallbackVehicleBodyTypes);
  const [loadedConditions, setLoadedConditions] = useState<string[]>(vehicleConditions);
  const [loadedArrivalWindows, setLoadedArrivalWindows] = useState<string[]>(arrivalWindows);

  // Load saved data from local storage on mount
  // ============================================
// UNIFIED LOCAL STORAGE + SUPABASE LOADING
// ============================================

useEffect(() => {
  // STEP 1: Restore from localStorage FIRST
  const savedData = loadFromLocalStorage();
  if (savedData) {
    setZipCode(savedData.zipCode || '');
    setIsZipValid(savedData.isZipValid || false);
    setIsUnlocked(savedData.isUnlocked || false);
    setSelectedCategory(savedData.selectedCategory || null);
    setSelectedVehicleType(savedData.selectedVehicleType || null);
    setSelectedPackage(savedData.selectedPackage || null);
    setSelectedService(savedData.selectedService || null);
    setSelectedYear(savedData.selectedYear || '');
    setSelectedMake(savedData.selectedMake || '');
    setSelectedModel(savedData.selectedModel || '');
    setSelectedBody(savedData.selectedBody || '');
    setSelectedConditions(savedData.selectedConditions || []);
    setOtherCondition(savedData.otherCondition || '');
    setSelectedAddOns(savedData.selectedAddOns || {});
    setVehicleCount(savedData.vehicleCount || 1);
    setSelectedDate(savedData.selectedDate ? new Date(savedData.selectedDate) : null);
    setSelectedArrivalWindows(savedData.selectedArrivalWindows || []);
    setBackupDate(savedData.backupDate ? new Date(savedData.backupDate) : null);
    setShowBackupDate(savedData.showBackupDate || false);
    if (savedData.showAddOnsStep) setShowAddOnsStep(true);
    if (savedData.showDateTimeStep) setShowDateTimeStep(true);
    if (savedData.showInfoStep) setShowInfoStep(true);
    setFirstName(savedData.firstName || '');
    setLastName(savedData.lastName || '');
    setEmail(savedData.email || '');
    setPhone(savedData.phone || '');
    setAddress(savedData.address || '');
    setAddressUnit(savedData.addressUnit || '');
    setCity(savedData.city || '');
    setState(savedData.state || '');
    setInfoZipCode(savedData.infoZipCode || '');
    setWaterAccess(savedData.waterAccess || null);
    setElectricity(savedData.electricity || null);
    setCoveredArea(savedData.coveredArea || null);
    setExtraInfo(savedData.extraInfo || '');
    setMarketingOptIn(savedData.marketingOptIn || false);

    if (!savedData.isZipValid) {
      setSelectedCategory(null);
      setSelectedVehicleType(null);
      setSelectedPackage(null);
      setSelectedService(null);
      setSelectedYear('');
      setSelectedMake('');
      setSelectedModel('');
      setSelectedBody('');
      setShowAddOnsStep(false);
      setShowDateTimeStep(false);
      setShowInfoStep(false);
    }
  }

  // STEP 2: Fetch fresh data from Supabase (but DON'T reset saved state)
  const loadVehicleData = async () => {
    const supabase = createClient();
    setIsVehicleDataLoading(true);
    setVehicleDataError('');

    try {
      const [
        servicesResult,
        exteriorResult,
        interiorResult,
        addOnsResult,
        categoriesResult,
        makesResult,
        modelsResult,
        bodyTypesResult,
        conditionsResult,
        windowsResult,
      ] = await Promise.all([
        supabase.from('vehicle_services').select('*').order('id'),
        supabase.from('vehicle_service_exterior_items').select('service_id, item').order('display_order'),
        supabase.from('vehicle_service_interior_items').select('service_id, item').order('display_order'),
        supabase.from('vehicle_add_on_options').select('*').order('name'),
        supabase.from('vehicle_categories').select('*').order('label'),
        supabase.from('vehicle_makes').select('*').order('name'),
        supabase.from('vehicle_models').select('*').order('name'),
        supabase.from('vehicle_body_types').select('*').order('name'),
        supabase.from('vehicle_conditions').select('name').order('name'),
        supabase.from('vehicle_arrival_windows').select('window_time').order('display_order'),
      ]);

      const results = [servicesResult, exteriorResult, interiorResult, addOnsResult, categoriesResult, makesResult, modelsResult, bodyTypesResult, conditionsResult, windowsResult];
      const failedResult = results.find((result) => result.error);
      if (failedResult?.error) {
        throw failedResult.error;
      }

      const exteriorByService = ((exteriorResult.data || []) as VehicleServiceItemRow[]).reduce<Record<number, string[]>>((acc, item) => {
        acc[item.service_id] = [...(acc[item.service_id] || []), item.item];
        return acc;
      }, {});

      const interiorByService = ((interiorResult.data || []) as VehicleServiceItemRow[]).reduce<Record<number, string[]>>((acc, item) => {
        acc[item.service_id] = [...(acc[item.service_id] || []), item.item];
        return acc;
      }, {});

      const fallbackServiceByName = new Map(services.map((service) => [service.name, service]));
      const nextServices = ((servicesResult.data || []) as VehicleServiceRow[]).map((service) => {
        const fallback = fallbackServiceByName.get(service.name);
        return {
          id: service.id,
          name: service.name,
          price: `$${Number(service.price || 0).toFixed(0)}`,
          rating: Number(service.rating || fallback?.rating || 0),
          reviews: service.reviews ?? fallback?.reviews ?? 0,
          popular: Boolean(service.popular),
          description: service.description || fallback?.description || '',
          vehicleType: service.vehicle_type || fallback?.vehicleType || 'all',
          estimatedTime: service.estimated_time || fallback?.estimatedTime || '',
          exterior: exteriorByService[service.id] || fallback?.exterior || [],
          interior: interiorByService[service.id] || fallback?.interior || [],
        } satisfies Service;
      });

      if (nextServices.length > 0) {
        setLoadedServices(nextServices);
      }

      const nextAddOns = ((addOnsResult.data || []) as VehicleAddOnRow[]).map((addOn) => ({
        id: addOn.id,
        name: addOn.name,
        price: Number(addOn.price || 0),
        description: addOn.description || '',
        details: addOn.details || '',
        perSeat: Boolean(addOn.per_seat),
      }));
      if (nextAddOns.length > 0) {
        setLoadedAddOns(nextAddOns);
      }

      const nextCategories = ((categoriesResult.data || []) as Array<{ id: string; label: string; icon_name?: string | null }>).map((category) => ({
        id: category.id,
        label: category.label,
        icon_name: category.icon_name || 'Car',
        icon: vehicleIconMap[category.icon_name || 'Car'] || Car,
      }));
      if (nextCategories.length > 0) {
        setLoadedCategories(nextCategories);
      }

      const nextMakes = (makesResult.data || []) as VehicleMake[];
      if (nextMakes.length > 0) {
        setLoadedMakes(nextMakes);
      }

      const nextModels = (modelsResult.data || []) as VehicleModel[];
      if (nextModels.length > 0) {
        setLoadedModels(nextModels);
      }

      const nextBodyTypes = (bodyTypesResult.data || []) as VehicleBodyType[];
      if (nextBodyTypes.length > 0) {
        setLoadedBodyTypes(nextBodyTypes);
      }

      const nextConditions = ((conditionsResult.data || []) as VehicleConditionRow[]).map((condition) => condition.name);
      if (nextConditions.length > 0) {
        setLoadedConditions(nextConditions);
      }

      const nextWindows = ((windowsResult.data || []) as VehicleArrivalWindowRow[]).map((window) => window.window_time);
      if (nextWindows.length > 0) {
        setLoadedArrivalWindows(nextWindows);
      }

    } catch (error) {
      console.error('Error loading mobile detailing data:', error);
      setVehicleDataError('Live booking options could not be refreshed. Showing saved defaults.');
    } finally {
      setIsVehicleDataLoading(false);
    }
  };

  loadVehicleData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []); // ← Empty array - runs ONCE on mount

  useEffect(() => {
    const loadVehicleData = async () => {
      const supabase = createClient();
      setIsVehicleDataLoading(true);
      setVehicleDataError('');

      try {
        const [
          servicesResult,
          exteriorResult,
          interiorResult,
          addOnsResult,
          categoriesResult,
          makesResult,
          modelsResult,
          bodyTypesResult,
          conditionsResult,
          windowsResult,
        ] = await Promise.all([
          supabase.from('vehicle_services').select('*').order('id'),
          supabase.from('vehicle_service_exterior_items').select('service_id, item').order('display_order'),
          supabase.from('vehicle_service_interior_items').select('service_id, item').order('display_order'),
          supabase.from('vehicle_add_on_options').select('*').order('name'),
          supabase.from('vehicle_categories').select('*').order('label'),
          supabase.from('vehicle_makes').select('*').order('name'),
          supabase.from('vehicle_models').select('*').order('name'),
          supabase.from('vehicle_body_types').select('*').order('name'),
          supabase.from('vehicle_conditions').select('name').order('name'),
          supabase.from('vehicle_arrival_windows').select('window_time').order('display_order'),
        ]);

        const results = [
          servicesResult,
          exteriorResult,
          interiorResult,
          addOnsResult,
          categoriesResult,
          makesResult,
          modelsResult,
          bodyTypesResult,
          conditionsResult,
          windowsResult,
        ];
        const failedResult = results.find((result) => result.error);
        if (failedResult?.error) {
          throw failedResult.error;
        }

        const exteriorByService = ((exteriorResult.data || []) as VehicleServiceItemRow[]).reduce<Record<number, string[]>>((acc, item) => {
          acc[item.service_id] = [...(acc[item.service_id] || []), item.item];
          return acc;
        }, {});

        const interiorByService = ((interiorResult.data || []) as VehicleServiceItemRow[]).reduce<Record<number, string[]>>((acc, item) => {
          acc[item.service_id] = [...(acc[item.service_id] || []), item.item];
          return acc;
        }, {});

        const fallbackServiceByName = new Map(services.map((service) => [service.name, service]));
        const nextServices = ((servicesResult.data || []) as VehicleServiceRow[]).map((service) => {
          const fallback = fallbackServiceByName.get(service.name);
          return {
            id: service.id,
            name: service.name,
            price: `$${Number(service.price || 0).toFixed(0)}`,
            rating: Number(service.rating || fallback?.rating || 0),
            reviews: service.reviews ?? fallback?.reviews ?? 0,
            popular: Boolean(service.popular),
            description: service.description || fallback?.description || '',
            vehicleType: service.vehicle_type || fallback?.vehicleType || 'all',
            estimatedTime: service.estimated_time || fallback?.estimatedTime || '',
            exterior: exteriorByService[service.id] || fallback?.exterior || [],
            interior: interiorByService[service.id] || fallback?.interior || [],
          } satisfies Service;
        });

        if (nextServices.length > 0) {
          setLoadedServices(nextServices);
        }

        const nextAddOns = ((addOnsResult.data || []) as VehicleAddOnRow[]).map((addOn) => ({
          id: addOn.id,
          name: addOn.name,
          price: Number(addOn.price || 0),
          description: addOn.description || '',
          details: addOn.details || '',
          perSeat: Boolean(addOn.per_seat),
        }));
        if (nextAddOns.length > 0) {
          setLoadedAddOns(nextAddOns);
        }

        const nextCategories = ((categoriesResult.data || []) as Array<{ id: string; label: string; icon_name?: string | null }>).map((category) => ({
          id: category.id,
          label: category.label,
          icon_name: category.icon_name || 'Car',
          icon: vehicleIconMap[category.icon_name || 'Car'] || Car,
        }));
        if (nextCategories.length > 0) {
          setLoadedCategories(nextCategories);
        }

        const nextMakes = (makesResult.data || []) as VehicleMake[];
        if (nextMakes.length > 0) {
          setLoadedMakes(nextMakes);
        }

        const nextModels = (modelsResult.data || []) as VehicleModel[];
        if (nextModels.length > 0) {
          setLoadedModels(nextModels);
        }

        const nextBodyTypes = (bodyTypesResult.data || []) as VehicleBodyType[];
        if (nextBodyTypes.length > 0) {
          setLoadedBodyTypes(nextBodyTypes);
        }

        const nextConditions = ((conditionsResult.data || []) as VehicleConditionRow[]).map((condition) => condition.name);
        if (nextConditions.length > 0) {
          setLoadedConditions(nextConditions);
        }

        const nextWindows = ((windowsResult.data || []) as VehicleArrivalWindowRow[]).map((window) => window.window_time);
        if (nextWindows.length > 0) {
          setLoadedArrivalWindows(nextWindows);
        }
      } catch (error) {
        console.error('Error loading mobile detailing data:', error);
        setVehicleDataError('Live booking options could not be refreshed. Showing saved defaults.');
      } finally {
        setIsVehicleDataLoading(false);
      }
    };

    loadVehicleData();
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    const dataToSave = {
      // Step 1: Services
      zipCode,
      isZipValid,
      isUnlocked,
      selectedCategory,
      selectedVehicleType,
      selectedPackage,
      selectedService,
      selectedYear,
      selectedMake,
      selectedModel,
      selectedBody,
      selectedConditions,
      otherCondition,
      
      // Step 2: Add-ons
      selectedAddOns,
      vehicleCount,
      
      // Step 3: Date & Time
      selectedDate,
      selectedArrivalWindows,
      backupDate,
      showBackupDate,
      
      // Step navigation
      showAddOnsStep,
      showDateTimeStep,
      showInfoStep,
      
      // Step 4: Customer Info
      firstName,
      lastName,
      email,
      phone,
      address,
      addressUnit,
      city,
      state,
      infoZipCode,
      waterAccess,
      electricity,
      coveredArea,
      extraInfo,
      marketingOptIn,
    };
    saveToLocalStorage(dataToSave);
  }, [
    // Step 1: Services
    zipCode, isZipValid, isUnlocked, selectedCategory, selectedVehicleType, 
    selectedPackage, selectedService, selectedYear, selectedMake, selectedModel, 
    selectedBody, selectedConditions, otherCondition,
    
    // Step 2: Add-ons
    selectedAddOns, vehicleCount,
    
    // Step 3: Date & Time
    selectedDate, selectedArrivalWindows, backupDate, showBackupDate,
    
    // Step navigation
    showAddOnsStep, showDateTimeStep, showInfoStep,
    
    // Step 4: Customer Info
    firstName, lastName, email, phone, address, addressUnit,
    city, state, infoZipCode, waterAccess, electricity,
    coveredArea, extraInfo, marketingOptIn
  ]);

  const servicesForBooking = loadedServices;
  const addOnOptionsForBooking = loadedAddOns;
  const vehicleCategoriesForBooking = loadedCategories;
  const vehicleConditionsForBooking = loadedConditions;
  const arrivalWindowsForBooking = loadedArrivalWindows;
  const hasCategoryScopedMakes = loadedMakes.some((make) => Boolean(make.category_id));
  const availableMakeRows = loadedMakes.filter((make) => (
    !selectedCategory || !hasCategoryScopedMakes || make.category_id === selectedCategory
  ));
  const makesForBooking = availableMakeRows.map((make) => make.name);
  const selectedMakeRow = loadedMakes.find((make) => make.name === selectedMake);
  const selectedModelRow = selectedMakeRow
    ? loadedModels.find((model) => model.make_id === selectedMakeRow.id && model.name === selectedModel)
    : null;
  const modelsByMakeForBooking = loadedMakes.reduce<Record<string, string[]>>((acc, make) => {
    acc[make.name] = loadedModels
      .filter((model) => model.make_id === make.id)
      .map((model) => model.name);
    return acc;
  }, {});
  const hasModelScopedBodyTypes = loadedBodyTypes.some((bodyType) => Boolean(bodyType.model_id));
  const bodyTypesByMakeForBooking = loadedMakes.reduce<Record<string, string[]>>((acc, make) => {
    const names = loadedBodyTypes
      .filter((bodyType) => {
        if (bodyType.make_id !== make.id) return false;
        if (!hasModelScopedBodyTypes || !selectedModelRow) return true;
        return !bodyType.model_id || bodyType.model_id === selectedModelRow.id;
      })
      .map((bodyType) => bodyType.name);
    acc[make.name] = [...new Set(names)];
    return acc;
  }, {});

  useEffect(() => {
    if (selectedMake && !makesForBooking.includes(selectedMake)) {
      setSelectedMake('');
      setSelectedModel('');
      setSelectedBody('');
      setIsDropdownOpen(null);
    }
  }, [makesForBooking, selectedMake]);

  useEffect(() => {
    const availableModels = selectedMake ? modelsByMakeForBooking[selectedMake] || [] : [];
    if (selectedModel && !availableModels.includes(selectedModel)) {
      setSelectedModel('');
      setSelectedBody('');
      setIsDropdownOpen(null);
    }
  }, [modelsByMakeForBooking, selectedMake, selectedModel]);

  useEffect(() => {
    const availableBodyTypes = selectedMake && selectedModel ? bodyTypesByMakeForBooking[selectedMake] || [] : [];
    if (selectedBody && !availableBodyTypes.includes(selectedBody)) {
      setSelectedBody('');
      setIsDropdownOpen(null);
    }
  }, [bodyTypesByMakeForBooking, selectedBody, selectedMake, selectedModel]);

  const isStep1Complete = isZipValid && selectedCategory && selectedPackage && selectedYear && selectedMake && selectedModel && selectedBody;
  const isStep2Complete = selectedDate && selectedArrivalWindows.length > 0;
  const isInfoComplete = firstName && lastName && email && phone && address && city && state && infoZipCode;

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode || zipCode.length !== 4) {
      setZipError('Please enter a valid 4-digit postcode');
      setIsZipValid(false);
      return;
    }
    if (isValidAustralianPostcode(zipCode)) {
      setIsZipValid(true);
      setIsUnlocked(true);
      setZipError('');
    } else {
      setZipError('Invalid Australian postcode. Please check and try again.');
      setIsZipValid(false);
      setIsUnlocked(false);
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    if (isUnlocked) {
      setSelectedCategory(categoryId);
      setSelectedVehicleType(categoryId);
      setSelectedMake('');
      setSelectedModel('');
      setSelectedBody('');
      setIsDropdownOpen(null);
    }
  };

  const handleSelectPackage = (service: Service) => {
    if (isUnlocked) {
      if (selectedPackage?.id === service.id) {
        setSelectedPackage(null);
        setSelectedService(null);
        setSelectedConditions([]);
        setOtherCondition('');
      } else {
        setSelectedPackage(service);
        setSelectedService(service);
        setActiveTab(service.exterior.length > 0 ? 'exterior' : 'interior');
      }
    }
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions(prev =>
      prev.includes(condition)
        ? prev.filter(c => c !== condition)
        : [...prev, condition]
    );
  };

  const handleAddAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [addOnId]: (prev[addOnId] || 0) + 1
    }));
  };

  const handleRemoveAddOn = (addOnId: string) => {
    setSelectedAddOns(prev => {
      const newCount = (prev[addOnId] || 0) - 1;
      if (newCount <= 0) {
        const next = { ...prev };
        delete next[addOnId];
        return next;
      }
      return { ...prev, [addOnId]: newCount };
    });
  };

  const getAddOnCount = (addOnId: string): number => {
    return selectedAddOns[addOnId] || 0;
  };

  const getAddOnTotal = (): number => {
    let total = 0;
    Object.entries(selectedAddOns).forEach(([id, count]) => {
      const addOn = addOnOptionsForBooking.find(a => a.id === id);
      if (addOn) {
        total += addOn.price * count;
      }
    });
    return total;
  };

  const handleNextStep = () => {
    if (isStep1Complete) {
      setShowAddOnsStep(true);
      setTimeout(() => {
        document.getElementById('addons-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBackToServices = () => {
    setShowAddOnsStep(false);
  };

  const handleProceedToDateTime = () => {
    setShowDateTimeStep(true);
    setShowAddOnsStep(false);
    setTimeout(() => {
      document.getElementById('datetime-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleBackToAddons = () => {
    setShowDateTimeStep(false);
    setShowAddOnsStep(true);
    setTimeout(() => {
      document.getElementById('addons-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleProceedToInfo = () => {
    if (isStep2Complete) {
      setShowInfoStep(true);
      setShowDateTimeStep(false);
      setTimeout(() => {
        document.getElementById('info-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleBackToDateTime = () => {
    setShowInfoStep(false);
    setShowDateTimeStep(true);
    setTimeout(() => {
      document.getElementById('datetime-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleCompleteBooking = async () => {
    if (isInfoComplete) {
      // Calculate total price
      const packagePrice = parseInt(selectedPackage?.price?.replace('$', '') || '0');
      const addonsTotal = getAddOnTotal();
      const totalPrice = packagePrice + addonsTotal;
      
      // Prepare email data with ALL fields including zip codes
      const emailData = {
        // Customer Info
        firstName,
        lastName,
        email,
        phone,
        address,
        addressUnit,
        city,
        state,
        infoZipCode, // This is the zip code from the info step
        zipCode, // This is the zip code from the initial step (service area)
        
        // Vehicle Info
        selectedYear,
        selectedMake,
        selectedModel,
        selectedBody,
        selectedCategory,
        selectedVehicleType,
        
        // Package & Add-ons
        selectedPackage: {
          name: selectedPackage?.name,
          price: selectedPackage?.price,
          description: selectedPackage?.description,
        },
        selectedAddOns: Object.entries(selectedAddOns).map(([id, count]) => {
          const addOn = addOnOptionsForBooking.find(a => a.id === id);
          return addOn ? { name: addOn.name, price: addOn.price, count } : null;
        }).filter(Boolean),
        selectedConditions,
        otherCondition,
        addOnsTotal: `$${addonsTotal}`,
        
        // Date & Time
        selectedDate: selectedDate?.toISOString(),
        selectedArrivalWindows,
        backupDate: backupDate?.toISOString(),
        
        // Location Details
        waterAccess,
        electricity,
        coveredArea,
        
        // Other
        extraInfo,
        vehicleCount,
        marketingOptIn,
        
        // Total
        totalPrice: `$${totalPrice}`,
        
        // Booking Type
        bookingType: 'Mobile Detailing',
        
        // Timestamp
        timestamp: new Date().toISOString(),
      };

      try {
        // Send email via API
        await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailData),
        });

        // Clear local storage
        clearLocalStorage();
        
        // Reset all form data
        setZipCode('');
        setIsZipValid(false);
        setIsUnlocked(false);
        setSelectedCategory(null);
        setSelectedVehicleType(null);
        setSelectedPackage(null);
        setSelectedService(null);
        setSelectedYear('');
        setSelectedMake('');
        setSelectedModel('');
        setSelectedBody('');
        setSelectedConditions([]);
        setOtherCondition('');
        setSelectedAddOns({});
        setVehicleCount(1);
        setSelectedDate(null);
        setSelectedArrivalWindows([]);
        setBackupDate(null);
        setShowBackupDate(false);
        setShowAddOnsStep(false);
        setShowDateTimeStep(false);
        setShowInfoStep(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        setAddress('');
        setAddressUnit('');
        setCity('');
        setState('');
        setInfoZipCode('');
        setWaterAccess(null);
        setElectricity(null);
        setCoveredArea(null);
        setExtraInfo('');
        setMarketingOptIn(false);

        setToast({ 
          message: '✅ Booking confirmed! We will contact you shortly.', 
          type: 'success' 
        });

        // Scroll to top to show toast
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Auto-hide toast after 6 seconds
        setTimeout(() => {
          setToast(null);
        }, 6000);

      } catch (error) {
        console.error('Error sending email:', error);
        
        // Still clear local storage and reset
        clearLocalStorage();
        
        setToast({ 
          message: 'Booking confirmed! We will contact you shortly.', 
          type: 'success' 
        });
        
        setTimeout(() => {
          setToast(null);
        }, 6000);
      }
    }
  };

  const toggleArrivalWindow = (window: string) => {
    setSelectedArrivalWindows(prev =>
      prev.includes(window)
        ? prev.filter(w => w !== window)
        : [...prev, window]
    );
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-AU', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating) 
                ? 'fill-yellow-400 text-yellow-400' 
                : i < rating 
                  ? 'fill-yellow-400/50 text-yellow-400/50' 
                  : 'fill-gray-300 text-gray-300 dark:fill-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const primaryColor = currentTheme.colors[1];
  const secondaryColor = currentTheme.colors[2];
  const bgColor = currentTheme.colors[0];
  const textColor = currentTheme.colors[3];
  const glassPanelClass = 'rounded-2xl border border-white/10 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-sm';
  const glassCardClass = 'rounded-xl border border-white/10 bg-white/[0.06] shadow-lg shadow-black/10 backdrop-blur-sm';

  // Filter services based on selected category
  const filteredServices = Array.isArray(servicesForBooking) ? servicesForBooking.filter(service => 
    selectedCategory === 'all' || service.vehicleType === selectedCategory || service.vehicleType === 'all'
  ) : [];

  const availableDates = generateDates();

  // Toast component
  const renderToast = () => {
    if (!toast) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md mx-4"
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
          <button
            onClick={() => setToast(null)}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  };

  // Booking Type Selector Component
  const renderBookingTypeSelector = () => {
    if (bookingType) return null;
    
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/[0.07] rounded-2xl p-8 border border-white/10 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">
            Choose Your Service Type
          </h2>
          <p className="text-white/55 mb-8">
            Select the type of service you&apos;d like to book
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                router.push('/booking');
              }}
              className="p-6 rounded-2xl border-2 border-white/10 hover:border-blue-500 transition-all bg-white/[0.06] text-left"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${primaryColor}20` }}>
                  <Home className="w-6 h-6" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Residential</h3>
                  <p className="text-xs text-white/55">Home & Office Cleaning</p>
                </div>
              </div>
              <p className="text-sm text-white/55">
                Bond cleaning, regular cleaning, deep cleaning, and more
              </p>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setBookingType('mobile');
              }}
              className="p-6 rounded-2xl border-2 border-blue-500 transition-all bg-white/[0.06] text-left shadow-lg"
              style={{ borderColor: secondaryColor }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${secondaryColor}20` }}>
                  <Car className="w-6 h-6" style={{ color: secondaryColor }} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Mobile Detailing</h3>
                  <p className="text-xs text-white/55">Vehicle Detailing</p>
                </div>
              </div>
              <p className="text-sm text-white/55">
                Premium auto detailing with comprehensive interior & exterior services
              </p>
              <div className="mt-2">
                <span className="inline-block px-2 py-1 text-xs font-medium rounded-full" style={{ backgroundColor: `${secondaryColor}20`, color: secondaryColor }}>
                  Selected
                </span>
              </div>
            </motion.button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div
        className="min-h-screen pt-20 font-sans text-white"
        style={{
          background: `linear-gradient(180deg, var(--theme-primary) 0%, ${primaryColor} 54%, #07182f 100%)`,
        }}
      >
        {/* Toast */}
        {renderToast()}

        {/* Booking Type Selector - Show when no type selected */}
        {renderBookingTypeSelector()}

        {/* Only show booking content when mobile detailing is selected */}
        {bookingType === 'mobile' && (
          <>
            {/* Hero Section */}
            <div 
              className="relative overflow-hidden border-b border-white/10"
              style={{ 
                background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}66)`
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_32%),linear-gradient(90deg,rgba(255,255,255,0.08),transparent)]" />
              <div className="relative max-w-7xl mx-auto px-4 py-12 sm:py-16">
                <div className="mx-auto max-w-3xl text-center">
                  <span
                    className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white/75"
                  >
                    
                    Mobile vehicle detailing
                  </span>
                  <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white mb-4">
                    Book Your Mobile Detailing
                  </h1>
                  <p className="text-base sm:text-lg text-white/75 max-w-2xl mx-auto">
                    Select your vehicle, pick your services, choose a date, and we&apos;ll come to you.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-white/70">
                    {['Melbourne metro', 'Fully insured', 'No payment to book'].map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        {item}
                      </span>
                    ))}
                  </div>
                  {/* <button
                    onClick={() => {
                      setBookingType(null);
                      // Reset any booking state if needed
                    }}
                    className="mt-5 text-sm font-medium text-white/70 transition-colors hover:text-white hover:underline flex items-center gap-1 mx-auto"
                  >
                    ← Change service type
                  </button> */}
                </div>
              </div>
            </div>

            {/* Progress Bar - 3 Steps */}
            <div className="max-w-5xl mx-auto px-4 py-8">
              <div className="relative rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl shadow-black/10 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  {[
                    { id: 'services', label: 'Services', icon: <Calendar className="w-4 h-4" /> },
                    { id: 'datetime', label: 'Date/Time', icon: <Clock className="w-4 h-4" /> },
                    { id: 'info', label: 'Your Info', icon: <User className="w-4 h-4" /> },
                  ].map((step, index) => {
                    const isCompleted = (index === 0 && isStep1Complete) || 
                                       (index === 1 && isStep2Complete) || 
                                       (index === 2 && isInfoComplete);
                    const isActive = (index === 0 && !showAddOnsStep && !showDateTimeStep && !showInfoStep) || 
                                    (index === 1 && showDateTimeStep) ||
                                    (index === 2 && showInfoStep) ||
                                    (index === 0 && showAddOnsStep);
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center flex-1 relative">
                        {index < 2 && (
                          <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-40px)] h-0.5 transition-all duration-500 ${
                            (index === 0 && isStep1Complete) || (index === 1 && isStep2Complete) ? 'bg-green-400' : 'bg-white/10'
                          }`} />
                        )}
                        
                        <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-400 text-white' 
                            : isActive 
                              ? 'border-[var(--theme-secondary)] bg-white/15 text-white shadow-lg shadow-black/20'
                              : 'border-white/15 bg-white/[0.05] text-white/45'
                        }`}>
                          {isCompleted ? <Check className="w-5 h-5" /> : step.icon}
                        </div>
                        
                        <span className={`mt-2 text-xs font-medium transition-all duration-500 ${
                          isCompleted ? 'text-green-300' : isActive ? 'text-white' : 'text-white/45'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 1: Select your services */}
            {!showAddOnsStep && !showDateTimeStep && !showInfoStep && (
              <>
                <div className="max-w-7xl mx-auto px-4 pb-8">
                  <div className={`${glassPanelClass} p-5 sm:p-6`}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-white">Step 1: Select your services</span>
                        {isStep1Complete && (
                          <span className="rounded-full bg-green-500/15 px-2 py-1 text-xs text-green-300 font-medium">Complete</span>
                        )}
                        {isVehicleDataLoading && (
                          <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-white/60">Refreshing options...</span>
                        )}
                      </div>
                      {isStep1Complete && (
                        <button 
                          className="text-sm font-medium text-white/70 hover:text-white hover:underline"
                          style={{ color: secondaryColor }}
                          onClick={() => {
                            setSelectedPackage(null);
                            setShowAddOnsStep(false);
                            setShowDateTimeStep(false);
                            setShowInfoStep(false);
                          }}
                        >
                          Change
                        </button>
                      )}
                    </div>

                    {vehicleDataError && (
                      <div className="mb-5 flex items-start gap-2 rounded-xl border border-yellow-400/25 bg-yellow-500/10 p-3 text-sm text-yellow-100">
                        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                        <span>{vehicleDataError}</span>
                      </div>
                    )}

                    {/* ZIP Code Input */}
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/45" />
                          <input
                            type="text"
                            placeholder="Postcode"
                            value={zipCode}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                              setZipCode(value);
                              setZipError('');
                              if (value.length === 4 && isValidAustralianPostcode(value)) {
                                setIsZipValid(true);
                                setIsUnlocked(true);
                              } else {
                                setIsZipValid(false);
                                setIsUnlocked(false);
                              }
                            }}
                            className="w-full rounded-xl border bg-white/[0.08] py-2.5 pl-10 pr-10 text-white outline-none transition-colors placeholder:text-white/35 focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                            style={{ borderColor: isZipValid ? '#22c55e' : zipError ? '#ef4444' : 'rgba(255,255,255,0.12)' }}
                          />
                          {isZipValid && <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />}
                        </div>
                        <button
                          onClick={handleZipSubmit}
                          className="px-6 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-90 whitespace-nowrap"
                          style={{ backgroundColor: secondaryColor }}
                        >
                          {isZipValid ? 'Verified ✓' : 'Enter Postcode'}
                        </button>
                      </div>
                      {zipError && (
                        <div className="flex items-center gap-2 text-sm text-red-500 mt-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>{zipError}</span>
                        </div>
                      )}
                      {isZipValid && (
                        <div className="flex items-center gap-2 text-sm text-green-500 mt-2">
                          <Unlock className="w-4 h-4" />
                          <span>Postcode verified! Select your vehicle below.</span>
                        </div>
                      )}
                    </div>

                    {/* Vehicle Category Cards */}
                    <div className={`mb-6 transition-opacity duration-300 ${!isUnlocked ? 'opacity-50 pointer-events-none' : ''}`}>
                      <p className="text-sm font-medium text-white mb-3">Select your vehicle type</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {vehicleCategoriesForBooking.map((category) => {
                          const Icon = category.icon;
                          const isSelected = selectedCategory === category.id;
                          return (
                            <motion.button
                              key={category.id}
                              whileHover={isUnlocked ? { scale: 1.03, y: -2 } : {}}
                              whileTap={isUnlocked ? { scale: 0.97 } : {}}
                              onClick={() => handleSelectCategory(category.id)}
                              disabled={!isUnlocked}
                              className={`p-4 rounded-xl border transition-all ${
                                isSelected 
                                  ? 'shadow-lg shadow-black/20' 
                                  : 'hover:border-white/25'
                              }`}
                              style={{
                                backgroundColor: isSelected ? `${secondaryColor}24` : 'rgba(255,255,255,0.06)',
                                borderColor: isSelected ? secondaryColor : 'rgba(255,255,255,0.1)',
                              }}
                            >
                              <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-white/45'}`} />
                              <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-white/60'}`}>
                                {category.label}
                              </p>
                              {isSelected && (
                                <div className="mt-1 flex justify-center">
                                  <Check className="w-4 h-4 text-green-500" />
                                </div>
                              )}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Vehicle Selection Dropdowns */}
                    {selectedCategory && (
                      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 transition-opacity duration-300`}>
                        {/* Year Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setIsDropdownOpen(isDropdownOpen === 'year' ? null : 'year')}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white flex items-center justify-between hover:border-white/25 transition-colors"
                            style={{ borderColor: isDropdownOpen === 'year' ? secondaryColor : 'var(--theme-border)' }}
                          >
                            <span className={selectedYear ? 'text-white' : 'text-white/55'}>
                              {selectedYear || 'Select year'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/55 transition-transform ${isDropdownOpen === 'year' ? 'rotate-180' : ''}`} />
                          </button>
                          {isDropdownOpen === 'year' && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/[0.06] border border-white/10 rounded-xl shadow-lg z-20">
                              {years.map((year) => (
                                <button
                                  key={year}
                                  onClick={() => { setSelectedYear(year); setIsDropdownOpen(null); }}
                                  className="w-full px-4 py-2 text-left hover:bg-white/[0.07] transition-colors text-sm text-white"
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Make Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setIsDropdownOpen(isDropdownOpen === 'make' ? null : 'make')}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white flex items-center justify-between hover:border-white/25 transition-colors"
                            style={{ borderColor: isDropdownOpen === 'make' ? secondaryColor : 'var(--theme-border)' }}
                          >
                            <span className={selectedMake ? 'text-white' : 'text-white/55'}>
                              {selectedMake || 'Select brand'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/55 transition-transform ${isDropdownOpen === 'make' ? 'rotate-180' : ''}`} />
                          </button>
                          {isDropdownOpen === 'make' && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/[0.06] border border-white/10 rounded-xl shadow-lg z-20">
                              {makesForBooking.map((make) => (
                                <button
                                  key={make}
                                  onClick={() => { setSelectedMake(make); setSelectedModel(''); setSelectedBody(''); setIsDropdownOpen(null); }}
                                  className="w-full px-4 py-2 text-left hover:bg-white/[0.07] transition-colors text-sm text-white"
                                >
                                  {make}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Model Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setIsDropdownOpen(isDropdownOpen === 'model' ? null : 'model')}
                            disabled={!selectedMake}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white flex items-center justify-between hover:border-white/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: isDropdownOpen === 'model' ? secondaryColor : 'var(--theme-border)' }}
                          >
                            <span className={selectedModel ? 'text-white' : 'text-white/55'}>
                              {selectedModel || 'Select model'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/55 transition-transform ${isDropdownOpen === 'model' ? 'rotate-180' : ''}`} />
                          </button>
                          {isDropdownOpen === 'model' && selectedMake && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/[0.06] border border-white/10 rounded-xl shadow-lg z-20">
                              {(modelsByMakeForBooking[selectedMake] || []).map((model) => (
                                <button
                                  key={model}
                                  onClick={() => { setSelectedModel(model); setSelectedBody(''); setIsDropdownOpen(null); }}
                                  className="w-full px-4 py-2 text-left hover:bg-white/[0.07] transition-colors text-sm text-white"
                                >
                                  {model}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Body Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setIsDropdownOpen(isDropdownOpen === 'body' ? null : 'body')}
                            disabled={!selectedModel}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white flex items-center justify-between hover:border-white/25 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ borderColor: isDropdownOpen === 'body' ? secondaryColor : 'var(--theme-border)' }}
                          >
                            <span className={selectedBody ? 'text-white' : 'text-white/55'}>
                              {selectedBody || 'Select body'}
                            </span>
                            <ChevronDown className={`w-4 h-4 text-white/55 transition-transform ${isDropdownOpen === 'body' ? 'rotate-180' : ''}`} />
                          </button>
                          {isDropdownOpen === 'body' && selectedMake && selectedModel && (
                            <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-white/[0.06] border border-white/10 rounded-xl shadow-lg z-20">
                              {(bodyTypesByMakeForBooking[selectedMake] || []).map((body) => (
                                <button
                                  key={body}
                                  onClick={() => { setSelectedBody(body); setIsDropdownOpen(null); }}
                                  className="w-full px-4 py-2 text-left hover:bg-white/[0.07] transition-colors text-sm text-white"
                                >
                                  {body}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Vehicle Summary */}
                    {selectedYear && selectedMake && selectedModel && selectedBody && (
                      <div className="mt-4 rounded-xl border border-green-400/25 bg-green-500/10 p-3">
                        <div className="flex items-center gap-4 text-sm flex-wrap">
                          <span className="font-medium text-white">Vehicle:</span>
                          <span className="text-white/70">{selectedYear}</span>
                          <span className="text-white/70">{selectedMake}</span>
                          <span className="text-white/70">{selectedModel}</span>
                          <span className="text-white/70">{selectedBody}</span>
                          <Check className="w-4 h-4 text-green-500 ml-auto" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Selection - Only shown when vehicle is fully selected */}
                {selectedYear && selectedMake && selectedModel && selectedBody && (
                  <div className="max-w-7xl mx-auto px-4 pb-16">
                    <h2 className="text-2xl font-serif font-bold text-center mb-6 text-white">
                      Select Your Package
                    </h2>
                    
                    <div className={`grid gap-6 transition-all duration-500 ${
                      selectedPackage 
                        ? 'grid-cols-1 max-w-md mx-auto' 
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                    }`}>
                      {filteredServices.map((service) => {
                        const isSelected = selectedPackage?.id === service.id;
                        if (selectedPackage && !isSelected) return null;
                        
                        return (
                          <motion.div
                            key={service.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: service.id * 0.05 }}
                            className="h-full"
                            layout
                          >
                            <div 
                              className={`relative rounded-2xl border p-6 h-full flex flex-col transition-all duration-300 backdrop-blur-sm ${
                                isSelected 
                                  ? 'shadow-2xl shadow-black/30' 
                                  : 'hover:border-white/25 hover:shadow-xl hover:shadow-black/20'
                              }`}
                              style={{ 
                                backgroundColor: isSelected ? `${secondaryColor}18` : 'rgba(255,255,255,0.07)',
                                borderColor: isSelected ? secondaryColor : 'rgba(255,255,255,0.1)',
                                boxShadow: isSelected ? `0 0 0 4px ${secondaryColor}20, 0 20px 60px rgba(0,0,0,0.28)` : undefined,
                              }}
                            >
                              {isSelected && (
                                <div className="absolute -top-2 -right-2">
                                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-white" />
                                  </div>
                                </div>
                              )}

                              {!isSelected ? (
                                <>
                                  {service.popular && (
                                    <div className="mb-3">
                                      <span className="inline-block px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                        Most Popular
                                      </span>
                                    </div>
                                  )}

                                  <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                                  <p className="text-2xl font-bold" style={{ color: secondaryColor }}>{service.price}</p>

                                  <div className="flex items-center gap-2 mb-3">
                                    {renderStars(service.rating)}
                                    <span className="text-white/55 text-sm">({service.reviews.toLocaleString()})</span>
                                  </div>

                                  <p className="text-white/70 text-sm mb-4 flex-grow">{service.description}</p>

                                  <div className="space-y-2 mb-4">
                                    {service.exterior.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: secondaryColor }}>Exterior</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {service.exterior.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                                              {item.split(' ').slice(0, 3).join(' ')}
                                            </span>
                                          ))}
                                          {service.exterior.length > 3 && (
                                            <span className="text-xs text-white/45">+{service.exterior.length - 3} more</span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                    {service.interior.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: primaryColor }}>Interior</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {service.interior.slice(0, 3).map((item, idx) => (
                                            <span key={idx} className="text-xs bg-white/10 px-2 py-1 rounded-full text-white/70">
                                              {item.split(' ').slice(0, 3).join(' ')}
                                            </span>
                                          ))}
                                          {service.interior.length > 3 && (
                                            <span className="text-xs text-white/45">+{service.interior.length - 3} more</span>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 text-xs text-white/55 mb-3">
                                    <ClockIcon className="w-3.5 h-3.5" />
                                    <span>Estimated {service.estimatedTime}</span>
                                  </div>

                                  <div className="flex flex-col gap-2 mt-auto">
                                    <button
                                      onClick={() => handleSelectPackage(service)}
                                      className="w-full text-center px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:opacity-85 hover:scale-[1.02]"
                                      style={{ backgroundColor: primaryColor }}
                                    >
                                      Select
                                    </button>
                                    
                                    <button
                                      onClick={() => setPopupService(service)}
                                      className="w-full text-center px-4 py-2 rounded-xl border-2 transition-all font-medium text-sm"
                                      style={{ 
                                        color: secondaryColor, 
                                        borderColor: `${secondaryColor}40`,
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = secondaryColor;
                                        e.currentTarget.style.color = 'white';
                                        e.currentTarget.style.borderColor = secondaryColor;
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = secondaryColor;
                                        e.currentTarget.style.borderColor = `${secondaryColor}40`;
                                      }}
                                    >
                                      View Full Details
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.4 }}
                                  className="flex flex-col h-full w-full"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="text-lg font-bold text-white">{service.name}</h3>
                                    <span className="text-sm font-bold" style={{ color: secondaryColor }}>{service.price}</span>
                                  </div>
                                  
                                  <p className="text-sm font-semibold text-white mb-1">Vehicle Condition</p>
                                  <p className="text-xs text-white/55 mb-3">Select any that apply:</p>
                                  
                                  <div className="space-y-2 flex-grow">
                                    {vehicleConditionsForBooking.map((condition) => (
                                      <button
                                        key={condition}
                                        onClick={() => toggleCondition(condition)}
                                        className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 transition-all ${
                                          selectedConditions.includes(condition)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                            : 'border-white/10 hover:border-white/25'
                                        }`}
                                        style={{
                                          borderColor: selectedConditions.includes(condition) ? secondaryColor : undefined,
                                        }}
                                      >
                                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                          selectedConditions.includes(condition)
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-300'
                                        }`}>
                                          {selectedConditions.includes(condition) && (
                                            <Check className="w-3 h-3 text-white" />
                                          )}
                                        </div>
                                        <span className="text-sm text-white">{condition}</span>
                                      </button>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-3">
                                    <input
                                      type="text"
                                      placeholder="Other (describe below)"
                                      value={otherCondition}
                                      onChange={(e) => setOtherCondition(e.target.value)}
                                      className="w-full p-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white focus:outline-none focus:border-[var(--theme-secondary)] transition-colors text-sm"
                                      style={{ borderColor: otherCondition ? secondaryColor : 'var(--theme-border)' }}
                                    />
                                  </div>

                                  {selectedConditions.length > 0 && (
                                    <div className="mt-3 p-2.5 bg-white/[0.07] rounded-xl">
                                      <div className="flex justify-between text-sm">
                                        <span className="text-white/55">Conditions selected:</span>
                                        <span className="font-medium text-white">{selectedConditions.length}</span>
                                      </div>
                                    </div>
                                  )}

                                  <button
                                    onClick={() => handleSelectPackage(service)}
                                    className="mt-4 w-full text-center px-4 py-2.5 rounded-xl border-2 transition-all font-medium text-sm"
                                    style={{ 
                                      color: secondaryColor, 
                                      borderColor: `${secondaryColor}40`,
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.backgroundColor = secondaryColor;
                                      e.currentTarget.style.color = 'white';
                                      e.currentTarget.style.borderColor = secondaryColor;
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.backgroundColor = 'transparent';
                                      e.currentTarget.style.color = secondaryColor;
                                      e.currentTarget.style.borderColor = `${secondaryColor}40`;
                                    }}
                                  >
                                    ← Change Package
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Next Step Button */}
                    {isStep1Complete && (
                      <div className="flex justify-center mt-8">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleNextStep}
                          className="px-8 py-3 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 flex items-center gap-2"
                          style={{ backgroundColor: primaryColor }}
                        >
                          Next Step: Enhance Your Service
                          <ChevronRight className="w-5 h-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Step 2: Enhance Your Service - Add-ons */}
            {showAddOnsStep && isStep1Complete && !showDateTimeStep && !showInfoStep && (
              <div id="addons-section" className="max-w-4xl mx-auto px-4 pb-16">
                <div className={`${glassPanelClass} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        Enhance Your Service
                      </h2>
                      <p className="text-sm text-white/65 mt-1">
                        Add optional extras to customize your detailing package
                      </p>
                    </div>
                    <button
                      onClick={handleBackToServices}
                      className="text-sm font-medium hover:underline"
                      style={{ color: secondaryColor }}
                    >
                      ← Back to Services
                    </button>
                  </div>

                  {/* Selected Package Summary */}
                  <div className={`${glassCardClass} mb-6 p-4`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-sm text-white/55">Selected Package:</span>
                        <span className="ml-2 font-semibold text-white">{selectedPackage?.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-white/55">Price:</span>
                        <span className="ml-2 font-bold" style={{ color: secondaryColor }}>{selectedPackage?.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Add-ons Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addOnOptionsForBooking.map((addOn) => {
                      const count = getAddOnCount(addOn.id);
                      return (
                        <div
                          key={addOn.id}
                          className="rounded-xl border border-white/10 bg-white/[0.06] p-4 transition-all hover:border-white/25"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-white">{addOn.name}</h4>
                              <button
                                className="text-xs text-white/50 hover:text-white hover:underline mt-0.5"
                                onClick={() => {/* Show details modal */}}
                              >
                                Details
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              {addOn.perSeat ? (
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold" style={{ color: secondaryColor }}>{addOn.price}/ea</span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleRemoveAddOn(addOn.id)}
                                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    >
                                      <Minus className="w-3 h-3 text-white/60" />
                                    </button>
                                    <span className="w-6 text-center text-sm font-medium text-white">{count}</span>
                                    <button
                                      onClick={() => handleAddAddOn(addOn.id)}
                                      className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                                    >
                                      <Plus className="w-3 h-3 text-white/60" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <span className="text-sm font-bold" style={{ color: secondaryColor }}>${addOn.price}</span>
                                  {count > 0 ? (
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs text-green-500 font-medium">Added ✓</span>
                                      <button
                                        onClick={() => handleRemoveAddOn(addOn.id)}
                                        className="p-1 rounded hover:bg-red-50 transition-colors"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => handleAddAddOn(addOn.id)}
                                      className="px-3 py-1 rounded-lg text-white text-sm font-medium transition-all hover:opacity-85"
                                      style={{ backgroundColor: primaryColor }}
                                    >
                                      Add
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Vehicle Count */}
                  <div className={`${glassCardClass} mt-6 p-4`}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">Number of vehicles</span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setVehicleCount(Math.max(1, vehicleCount - 1))}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-white/60" />
                        </button>
                        <span className="text-lg font-bold text-white w-8 text-center">{vehicleCount}</span>
                        <button
                          onClick={() => setVehicleCount(vehicleCount + 1)}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-white/60" />
                        </button>
                      </div>
                    </div>
                    <button
                      className="mt-3 text-sm font-medium hover:underline"
                      style={{ color: secondaryColor }}
                    >
                      + Add Another Vehicle
                    </button>
                  </div>

                  {/* Total and Continue */}
                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <span className="text-sm text-white/55">Add-ons total:</span>
                        <span className="ml-2 text-lg font-bold" style={{ color: secondaryColor }}>
                          ${getAddOnTotal()}
                        </span>
                        <span className="ml-4 text-sm text-white/55">Vehicles: {vehicleCount}</span>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleProceedToDateTime}
                        className="px-8 py-3 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 flex items-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Proceed to Date & Time
                        <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Date & Time Selection */}
            {showDateTimeStep && isStep1Complete && !showInfoStep && (
              <div id="datetime-section" className="max-w-4xl mx-auto px-4 pb-16">
                <div className={`${glassPanelClass} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        Choose Date & Time
                      </h2>
                      <p className="text-sm text-white/65 mt-1">
                        Select your preferred appointment date and arrival window
                      </p>
                    </div>
                    <button
                      onClick={handleBackToAddons}
                      className="text-sm font-medium hover:underline"
                      style={{ color: secondaryColor }}
                    >
                      ← Back
                    </button>
                  </div>

                  {/* Selected Package Summary */}
                  <div className={`${glassCardClass} mb-6 p-4`}>
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-sm text-white/55">Selected Package:</span>
                        <span className="ml-2 font-semibold text-white">{selectedPackage?.name}</span>
                      </div>
                      <div>
                        <span className="text-sm text-white/55">Price:</span>
                        <span className="ml-2 font-bold" style={{ color: secondaryColor }}>{selectedPackage?.price}</span>
                      </div>
                      {getAddOnTotal() > 0 && (
                        <div>
                          <span className="text-sm text-white/55">Add-ons:</span>
                          <span className="ml-2 font-bold" style={{ color: secondaryColor }}>+${getAddOnTotal()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Date */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">Appointment Date</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {availableDates.map((date, index) => {
                        const isSelected = selectedDate?.getTime() === date.getTime();
                        const isToday = date.toDateString() === new Date().toDateString();
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedDate(date)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                            style={{
                              borderColor: isSelected ? secondaryColor : undefined,
                              backgroundColor: isSelected ? `${secondaryColor}15` : undefined,
                            }}
                          >
                            <p className="text-sm font-medium text-white">
                              {date.toLocaleDateString('en-AU', { weekday: 'short' })}
                            </p>
                            <p className="text-lg font-bold text-white">
                              {date.toLocaleDateString('en-AU', { day: 'numeric' })}
                            </p>
                            <p className="text-xs text-white/55">
                              {date.toLocaleDateString('en-AU', { month: 'short' })}
                            </p>
                            {isToday && (
                              <span className="text-xs text-green-500 font-medium">Today</span>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 mx-auto mt-1 text-green-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Arrival Window */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-white mb-3">
                      Arrival Window
                      <span className="text-xs font-normal text-white/50 ml-2">
                        Choose more than one if flexible
                      </span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {arrivalWindowsForBooking.map((window) => {
                        const isSelected = selectedArrivalWindows.includes(window);
                        return (
                          <button
                            key={window}
                            onClick={() => toggleArrivalWindow(window)}
                            className={`p-3 rounded-xl border-2 text-center transition-all ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                : 'border-white/10 hover:border-white/25'
                            }`}
                            style={{
                              borderColor: isSelected ? secondaryColor : undefined,
                              backgroundColor: isSelected ? `${secondaryColor}15` : undefined,
                            }}
                          >
                            <Clock className="w-5 h-5 mx-auto mb-1 text-white/55" />
                            <p className="text-sm font-medium text-white">{window}</p>
                            {isSelected && (
                              <Check className="w-4 h-4 mx-auto mt-1 text-green-500" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Backup Date */}
                  <div className="mb-6">
                    <button
                      onClick={() => setShowBackupDate(!showBackupDate)}
                      className="text-sm font-medium hover:underline flex items-center gap-2"
                      style={{ color: secondaryColor }}
                    >
                      {showBackupDate ? '−' : '+'} Add Backup Date
                    </button>
                    
                    {showBackupDate && (
                      <div className="mt-3">
                        <h3 className="text-sm font-semibold text-white mb-3">Backup Date</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {availableDates.slice(1, 8).map((date, index) => {
                            const isSelected = backupDate?.getTime() === date.getTime();
                            return (
                              <button
                                key={index}
                                onClick={() => setBackupDate(date)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                                    : 'border-white/10 hover:border-white/25'
                                }`}
                                style={{
                                  borderColor: isSelected ? secondaryColor : undefined,
                                  backgroundColor: isSelected ? `${secondaryColor}15` : undefined,
                                }}
                              >
                                <p className="text-sm font-medium text-white">
                                  {date.toLocaleDateString('en-AU', { weekday: 'short' })}
                                </p>
                                <p className="text-lg font-bold text-white">
                                  {date.toLocaleDateString('en-AU', { day: 'numeric' })}
                                </p>
                                <p className="text-xs text-white/55">
                                  {date.toLocaleDateString('en-AU', { month: 'short' })}
                                </p>
                                {isSelected && (
                                  <Check className="w-4 h-4 mx-auto mt-1 text-green-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Summary of selections */}
                  {selectedDate && selectedArrivalWindows.length > 0 && (
                    <div className="mb-6 p-4 rounded-xl border border-green-400/25 bg-green-500/10">
                      <p className="text-sm font-medium text-white">
                        <span className="text-green-500">✓</span> Selected:
                        <span className="ml-2">{formatDate(selectedDate)}</span>
                        <span className="ml-2 text-white/45">•</span>
                        <span className="ml-2">{selectedArrivalWindows.join(', ')}</span>
                        {backupDate && (
                          <span className="ml-2 text-white/55">• Backup: {formatDate(backupDate)}</span>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                    <button
                      onClick={handleBackToAddons}
                      className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-white/65 font-semibold hover:bg-white/10 transition-colors"
                    >
                      Back
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleProceedToInfo}
                      disabled={!isStep2Complete}
                      className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90 flex items-center justify-center gap-2 ${
                        !isStep2Complete ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      style={{ backgroundColor: primaryColor }}
                    >
                      Continue
                      <ChevronRight className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {!isStep2Complete && (
                    <p className="text-center text-xs text-red-500 mt-3">
                      Please select a date and at least one arrival window
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Your Information */}
            {showInfoStep && isStep2Complete && (
              <div id="info-section" className="max-w-6xl mx-auto px-4 pb-16">
                <div className={`${glassPanelClass} p-5 sm:p-6`}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold text-white">
                        Your Information
                      </h2>
                      <p className="text-sm text-white/65 mt-1">
                        Please provide your contact and location details
                      </p>
                    </div>
                    <button
                      onClick={handleBackToDateTime}
                      className="text-sm font-medium hover:underline"
                      style={{ color: secondaryColor }}
                    >
                      ← Back
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Form */}
                    <div className="lg:col-span-2">
                      <div className="rounded-xl border border-white/10 bg-white/[0.06] p-5 sm:p-6 shadow-lg shadow-black/10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* First Name */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="First Name"
                            />
                          </div>

                          {/* Last Name */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="Last Name"
                            />
                          </div>

                          {/* Email */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-1">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="john@example.com"
                            />
                          </div>

                          {/* Mobile Phone */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-1">
                              Mobile Phone <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="555-123-4567"
                            />
                          </div>

                          {/* Address */}
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-white mb-1">
                              Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="Start typing your address..."
                            />
                          </div>

                          {/* Address Unit */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              Address Unit
                            </label>
                            <input
                              type="text"
                              value={addressUnit}
                              onChange={(e) => setAddressUnit(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="Apt / Suite"
                            />
                          </div>

                          {/* City */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="City"
                            />
                          </div>

                          {/* State */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              State <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                            >
                              <option value="">Select State</option>
                              <option value="VIC">Victoria</option>
                              <option value="NSW">New South Wales</option>
                              <option value="QLD">Queensland</option>
                              <option value="SA">South Australia</option>
                              <option value="WA">Western Australia</option>
                              <option value="TAS">Tasmania</option>
                              <option value="NT">Northern Territory</option>
                              <option value="ACT">Australian Capital Territory</option>
                            </select>
                          </div>

                          {/* Zip Code */}
                          <div>
                            <label className="block text-sm font-medium text-white mb-1">
                              Zip Code <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={infoZipCode}
                              onChange={(e) => setInfoZipCode(e.target.value)}
                              className="w-full rounded-xl border border-white/10 bg-white/[0.08] px-4 py-2.5 text-white outline-none transition-colors placeholder:text-white/35 focus:border-[var(--theme-secondary)] focus:ring-2 focus:ring-[var(--theme-secondary)]/20"
                              placeholder="10001"
                            />
                          </div>
                        </div>

                        {/* Location Details */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <h3 className="text-sm font-semibold text-white mb-4">Location Details</h3>
                          <p className="text-xs text-white/55 mb-3">Not required to book</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {/* Water Access */}
                            <div>
                              <label className="block text-sm text-white mb-2">Water access</label>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setWaterAccess('yes')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    waterAccess === 'yes'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: waterAccess === 'yes' ? secondaryColor : undefined,
                                    backgroundColor: waterAccess === 'yes' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setWaterAccess('no')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    waterAccess === 'no'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: waterAccess === 'no' ? secondaryColor : undefined,
                                    backgroundColor: waterAccess === 'no' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  No
                                </button>
                              </div>
                            </div>

                            {/* Electricity */}
                            <div>
                              <label className="block text-sm text-white mb-2">Electricity</label>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setElectricity('yes')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    electricity === 'yes'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: electricity === 'yes' ? secondaryColor : undefined,
                                    backgroundColor: electricity === 'yes' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setElectricity('no')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    electricity === 'no'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: electricity === 'no' ? secondaryColor : undefined,
                                    backgroundColor: electricity === 'no' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  No
                                </button>
                              </div>
                            </div>

                            {/* Covered Area */}
                            <div>
                              <label className="block text-sm text-white mb-2">Covered area</label>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => setCoveredArea('yes')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    coveredArea === 'yes'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: coveredArea === 'yes' ? secondaryColor : undefined,
                                    backgroundColor: coveredArea === 'yes' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => setCoveredArea('no')}
                                  className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                    coveredArea === 'no'
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                      : 'border-white/10 hover:border-white/25'
                                  }`}
                                  style={{
                                    borderColor: coveredArea === 'no' ? secondaryColor : undefined,
                                    backgroundColor: coveredArea === 'no' ? `${secondaryColor}15` : undefined,
                                  }}
                                >
                                  No
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Extra Information */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <label className="block text-sm font-medium text-white mb-2">
                            Extra Information <span className="text-xs text-white/55 font-normal">Optional</span>
                          </label>
                          <p className="text-xs text-white/55 mb-3">Any extra information you would like to share with us?</p>
                          <textarea
                            value={extraInfo}
                            onChange={(e) => setExtraInfo(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-white/10 bg-white/[0.06] text-white focus:outline-none focus:border-[var(--theme-secondary)] transition-colors resize-none"
                            placeholder="Any additional details..."
                          />
                        </div>

                        {/* Marketing Opt-in */}
                        <div className="mt-6 pt-6 border-t border-white/10">
                          <label className="flex items-start gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={marketingOptIn}
                              onChange={(e) => setMarketingOptIn(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded border-white/10 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-white">
                              Yes! Email me exclusive discounts and promotions. We respect your privacy — see our Privacy Policy.
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                      <div className="bg-white/[0.06] rounded-xl p-6 border border-white/10 sticky top-24">
                        <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>
                        
                        {/* Service Area Postcode */}
                        <div className="mb-4">
                          <p className="text-xs text-white/55">Service Area Postcode</p>
                          <p className="text-sm font-medium text-white">{zipCode || 'Not entered'}</p>
                        </div>

                        {/* Requested Date */}
                        <div className="mb-4">
                          <p className="text-xs text-white/55">Requested Date</p>
                          <p className="text-sm font-medium text-white">{selectedDate ? formatDate(selectedDate) : 'Not selected'}</p>
                        </div>

                        {/* Requested Windows */}
                        <div className="mb-4">
                          <p className="text-xs text-white/55">Requested Arrival Windows</p>
                          <p className="text-sm font-medium text-white">{selectedArrivalWindows.join(', ') || 'Not selected'}</p>
                        </div>

                        {/* Package */}
                        <div className="mb-2 flex justify-between">
                          <span className="text-sm text-white">{selectedPackage?.name}</span>
                          <span className="text-sm font-bold" style={{ color: secondaryColor }}>{selectedPackage?.price}</span>
                        </div>

                        {/* Vehicle */}
                        <div className="mb-4">
                          <p className="text-sm text-white/55">
                            {selectedYear} {selectedMake} {selectedModel} {selectedBody}
                          </p>
                        </div>

                        {/* Add-ons */}
                        {Object.entries(selectedAddOns).map(([id, count]) => {
                          const addOn = addOnOptionsForBooking.find(a => a.id === id);
                          if (addOn && count > 0) {
                            return (
                              <div key={id} className="flex justify-between text-sm mb-1">
                                <span className="text-white">{addOn.name} × {count}</span>
                                <span className="text-white/55">+${addOn.price * count}</span>
                              </div>
                            );
                          }
                          return null;
                        })}

                        {/* Subtotal */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                          <span className="text-sm text-white/55">Subtotal ({vehicleCount} vehicle{vehicleCount > 1 ? 's' : ''})</span>
                          <span className="text-sm font-bold text-white">
                            ${parseInt(selectedPackage?.price?.replace('$', '') || '0') + getAddOnTotal()}
                          </span>
                        </div>

                        {/* Coupon */}
                        <div className="mt-3">
                          <button className="text-sm font-medium hover:underline" style={{ color: secondaryColor }}>
                            Have a coupon code?
                          </button>
                        </div>

                        {/* Total */}
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                          <span className="text-base font-bold text-white">Total</span>
                          <span className="text-xl font-bold" style={{ color: secondaryColor }}>
                            ${parseInt(selectedPackage?.price?.replace('$', '') || '0') + getAddOnTotal()}
                          </span>
                        </div>

                        {/* Terms */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-white/55 leading-relaxed">
                            By completing this booking, you agree to our Privacy Policy, Terms of Service and agree to receive updates via SMS messages regarding your order status. Message and data rates may apply.
                          </p>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="mt-6 flex flex-col gap-3">
                          <button
                            onClick={handleBackToDateTime}
                            className="w-full px-6 py-3 rounded-xl border-2 border-white/10 text-white/55 font-semibold hover:bg-white/[0.07] transition-colors"
                          >
                            Back
                          </button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleCompleteBooking}
                            disabled={!isInfoComplete}
                            className={`w-full px-6 py-3 rounded-xl text-white font-bold text-lg transition-all hover:opacity-90 ${
                              !isInfoComplete ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            style={{ backgroundColor: primaryColor }}
                          >
                            Complete Booking
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Trust Section */}
            <div className="bg-white/[0.07] border-t border-white/10 py-12">
              <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                    <p className="text-white font-semibold">100% Satisfaction</p>
                    <p className="text-white/55 text-sm">Guaranteed</p>
                  </div>
                  <div>
                    <Award className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                    <p className="text-white font-semibold">Fully Insured</p>
                    <p className="text-white/55 text-sm">& Bonded</p>
                  </div>
                  <div>
                    <Clock className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                    <p className="text-white font-semibold">We Come to You</p>
                    <p className="text-white/55 text-sm">Mobile Service</p>
                  </div>
                  <div>
                    <MapPin className="w-8 h-8 mx-auto mb-3" style={{ color: secondaryColor }} />
                    <p className="text-white font-semibold">Melbourne Metro</p>
                    <p className="text-white/55 text-sm">No Travel Fees</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section
            <div 
              className="py-12"
              style={{ 
                background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`
              }}
            >
              <div className="max-w-7xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Your Vehicle Detailed?</h2>
                <p className="text-white/80 mb-6">Book online in minutes. We come to you!</p>
                <button
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setBookingType(null);
                    setTimeout(() => {
                      setBookingType('mobile');
                    }, 100);
                  }}
                  className="inline-block bg-white hover:bg-blue-50 px-8 py-3 rounded-full font-bold transition-colors"
                  style={{ color: primaryColor }}
                >
                  Book Now
                </button>
              </div>
            </div> */}
          </>
        )}

        {/* Bottom Slide-up Popup for Package Details */}
        <AnimatePresence mode="wait">
          {popupService && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={() => setPopupService(null)}
              />

              <motion.div
                initial={{ y: '100%', opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: '100%', opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  damping: 30, 
                  stiffness: 300,
                  opacity: { duration: 0.3 }
                }}
                className="fixed inset-x-0 bottom-0 z-50 max-h-[90vh] overflow-y-auto"
              >
                <div 
                  className="rounded-t-3xl shadow-2xl max-w-4xl mx-auto overflow-hidden relative"
                  style={{ 
                    backgroundColor: bgColor,
                    boxShadow: `0 -20px 60px rgba(0,0,0,0.3), 0 0 0 1px ${secondaryColor}20`
                  }}
                >
                  <div className="flex justify-center pt-3 pb-1">
                    <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: `${textColor}30` }}></div>
                  </div>

                  <div 
                    className="relative px-6 sm:px-8 md:px-10 pt-4 pb-6"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}15)`,
                      borderBottom: `1px solid ${secondaryColor}20`
                    }}
                  >
                    <button
                      onClick={() => setPopupService(null)}
                      className="absolute top-4 right-4 p-2 rounded-full transition-colors shadow-md z-10"
                      style={{ 
                        backgroundColor: `${textColor}10`,
                        color: textColor
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${textColor}20`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = `${textColor}10`;
                      }}
                    >
                      <X className="w-5 h-5" />
                    </button>

                    {popupService.popular && (
                      <div className="mb-3">
                        <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: textColor }}>
                          {popupService.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-2">
                            {renderStars(popupService.rating)}
                            <span className="text-sm font-medium" style={{ color: textColor }}>
                              {popupService.rating}
                            </span>
                          </div>
                          <span style={{ color: `${textColor}50` }}>•</span>
                          <span className="text-sm" style={{ color: `${textColor}70` }}>
                            {popupService.reviews.toLocaleString()} reviews
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-3xl sm:text-4xl font-bold" style={{ color: secondaryColor }}>
                          {popupService.price}
                        </span>
                        <p className="text-xs text-right" style={{ color: `${textColor}50` }}>Starting at</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm" style={{ color: `${textColor}70` }}>
                        <ClockIcon className="w-4 h-4" style={{ color: secondaryColor }} />
                        <span>Estimated {popupService.estimatedTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: `${textColor}70` }}>
                        <Users className="w-4 h-4" style={{ color: secondaryColor }} />
                        <span>1-2 technicians</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: `${textColor}70` }}>
                        <Calendar className="w-4 h-4" style={{ color: secondaryColor }} />
                        <span>Available today</span>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 sm:px-8 md:px-10 pt-6 pb-4">
                    <p 
                      className="text-sm sm:text-base leading-relaxed rounded-xl p-4"
                      style={{ 
                        backgroundColor: `${textColor}08`,
                        color: `${textColor}80`
                      }}
                    >
                      {popupService.description}
                    </p>
                  </div>

                  {(popupService.exterior.length > 0 || popupService.interior.length > 0) && (
                    <div className="px-6 sm:px-8 md:px-10">
                      <div className="flex gap-2 border-b" style={{ borderColor: `${textColor}20` }}>
                        {popupService.exterior.length > 0 && (
                          <button
                            onClick={() => setActiveTab('exterior')}
                            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
                              activeTab === 'exterior'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'border-transparent hover:text-white'
                            }`}
                            style={activeTab === 'exterior' ? { borderColor: secondaryColor, color: secondaryColor } : { color: `${textColor}50` }}
                          >
                            Exterior ({popupService.exterior.length})
                          </button>
                        )}
                        {popupService.interior.length > 0 && (
                          <button
                            onClick={() => setActiveTab('interior')}
                            className={`px-4 py-2.5 text-sm font-medium transition-all border-b-2 ${
                              activeTab === 'interior'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'border-transparent hover:text-white'
                            }`}
                            style={activeTab === 'interior' ? { borderColor: primaryColor, color: primaryColor } : { color: `${textColor}50` }}
                          >
                            Interior ({popupService.interior.length})
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="px-6 sm:px-8 md:px-10 py-4">
                    <AnimatePresence mode="wait">
                      {activeTab === 'exterior' && popupService.exterior.length > 0 && (
                        <motion.div
                          key="exterior"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {popupService.exterior.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-start gap-3 p-2.5 rounded-xl transition-colors"
                                style={{ color: `${textColor}80` }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${textColor}08`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div 
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${secondaryColor}20` }}
                                >
                                  <Check className="w-3 h-3" style={{ color: secondaryColor }} />
                                </div>
                                <span className="text-sm">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'interior' && popupService.interior.length > 0 && (
                        <motion.div
                          key="interior"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {popupService.interior.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.03 }}
                                className="flex items-start gap-3 p-2.5 rounded-xl transition-colors"
                                style={{ color: `${textColor}80` }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${textColor}08`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                              >
                                <div 
                                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                  style={{ backgroundColor: `${primaryColor}20` }}
                                >
                                  <Check className="w-3 h-3" style={{ color: primaryColor }} />
                                </div>
                                <span className="text-sm">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {activeTab === 'exterior' && popupService.exterior.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                          style={{ color: `${textColor}50` }}
                        >
                          No exterior services included
                        </motion.div>
                      )}

                      {activeTab === 'interior' && popupService.interior.length === 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center py-8"
                          style={{ color: `${textColor}50` }}
                        >
                          No interior services included
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="px-6 sm:px-8 md:px-10 pb-6 pt-2 border-t" style={{ borderColor: `${textColor}20` }}>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => setPopupService(null)}
                        className="flex-1 px-6 py-3 rounded-xl border-2 font-semibold transition-colors"
                        style={{ 
                          borderColor: `${textColor}30`,
                          color: `${textColor}60`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = `${textColor}10`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          setPopupService(null);
                          setSelectedPackage(popupService);
                          setSelectedService(popupService);
                          setActiveTab(popupService.exterior.length > 0 ? 'exterior' : 'interior');
                        }}
                        className="flex-1 px-6 py-3 rounded-xl text-white font-semibold text-center transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Sparkles className="w-4 h-4" />
                        Select Package
                      </button>
                    </div>

                    <p className="text-center text-xs mt-4" style={{ color: `${textColor}40` }}>
                      <span className="inline-flex items-center gap-3 flex-wrap justify-center">
                        <span>No obligation</span>
                        <span>•</span>
                        <span>Free quote</span>
                        <span>•</span>
                        <span>100% satisfaction guaranteed</span>
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
