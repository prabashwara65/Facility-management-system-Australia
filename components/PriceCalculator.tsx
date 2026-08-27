'use client';

/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  Building,
  Calculator,
  Car,
  Check,
  Home,
  Loader2,
  Plus,
  Minus,
  Sparkles,
  Store,
  Truck,
  Warehouse,
  X,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

type CalculatorMode = 'residential' | 'mobile';

interface PricingTierRow {
  id: number;
  label: string;
  price: string;
  description: string;
  category: string;
  is_popular: boolean;
  status: string;
  sort_order: number;
}

interface ResidentialAddOnRow {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  is_active: boolean;
  sort_order: number;
}

interface VehicleServiceRow {
  id: number;
  name: string;
  price: number | string;
  rating: number | string | null;
  reviews: number | null;
  popular: boolean | null;
  description: string | null;
  vehicle_type: string | null;
  estimated_time: string | null;
}

interface VehicleAddOnRow {
  id: string;
  name: string;
  price: number | string;
  description: string | null;
  details: string | null;
  per_seat: boolean | null;
}

interface EstimateItem {
  id: string;
  name: string;
  price: number;
  displayPrice: string;
  description: string;
  badge?: string;
  icon: React.ReactNode;
}

interface EstimateAddOn {
  id: string;
  name: string;
  price: number;
  displayPrice: string;
  description: string;
  category?: string;
  perSeat?: boolean;
}

const categoryIconMap: Record<string, React.ReactNode> = {
  Residential: <Home className="h-5 w-5" />,
  Commercial: <Building className="h-5 w-5" />,
  Retail: <Store className="h-5 w-5" />,
  Warehouse: <Warehouse className="h-5 w-5" />,
};

const vehicleIconMap: Record<string, React.ReactNode> = {
  car: <Car className="h-5 w-5" />,
  truck: <Truck className="h-5 w-5" />,
  van: <Warehouse className="h-5 w-5" />,
  suv: <Car className="h-5 w-5" />,
  all: <Sparkles className="h-5 w-5" />,
};

function parsePrice(value: string | number | null | undefined) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  const matches = String(value ?? '').match(/\d+(?:\.\d+)?/g);
  if (!matches || matches.length === 0) {
    return 0;
  }

  return Math.max(...matches.map(Number));
}

function formatMoney(value: number) {
  return `$${Math.round(value).toLocaleString()}`;
}

export default function PriceCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mode, setMode] = useState<CalculatorMode>('residential');
  const [residentialServices, setResidentialServices] = useState<EstimateItem[]>([]);
  const [residentialAddOns, setResidentialAddOns] = useState<EstimateAddOn[]>([]);
  const [mobileServices, setMobileServices] = useState<EstimateItem[]>([]);
  const [mobileAddOns, setMobileAddOns] = useState<EstimateAddOn[]>([]);
  const [selectedResidentialService, setSelectedResidentialService] = useState('');
  const [selectedMobileService, setSelectedMobileService] = useState('');
  const [selectedResidentialAddOns, setSelectedResidentialAddOns] = useState<string[]>([]);
  const [selectedMobileAddOns, setSelectedMobileAddOns] = useState<string[]>([]);
  const [vehicleCount, setVehicleCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const loadCalculatorData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          pricingResult,
          addonsResult,
          vehicleServicesResult,
          vehicleAddonsResult,
        ] = await Promise.all([
          supabase
            .from('pricing_tiers')
            .select('id, label, price, description, category, is_popular, status, sort_order')
            .eq('status', 'Active')
            .order('sort_order', { ascending: true }),
          supabase
            .from('addons')
            .select('id, name, price, description, category, is_active, sort_order')
            .eq('is_active', true)
            .order('sort_order', { ascending: true }),
          supabase
            .from('vehicle_services')
            .select('id, name, price, rating, reviews, popular, description, vehicle_type, estimated_time')
            .order('id', { ascending: true }),
          supabase
            .from('vehicle_add_on_options')
            .select('id, name, price, description, details, per_seat')
            .order('name', { ascending: true }),
        ]);

        const failedResult = [pricingResult, addonsResult, vehicleServicesResult, vehicleAddonsResult].find((result) => result.error);
        if (failedResult?.error) {
          throw failedResult.error;
        }

        const nextResidentialServices = ((pricingResult.data || []) as PricingTierRow[]).map((tier) => ({
          id: tier.id.toString(),
          name: tier.label,
          price: parsePrice(tier.price),
          displayPrice: tier.price,
          description: tier.description,
          badge: tier.is_popular ? 'Popular' : tier.category,
          icon: categoryIconMap[tier.category] || <Sparkles className="h-5 w-5" />,
        }));

        const nextResidentialAddOns = ((addonsResult.data || []) as ResidentialAddOnRow[]).map((addOn) => ({
          id: addOn.id.toString(),
          name: addOn.name,
          price: parsePrice(addOn.price),
          displayPrice: addOn.price,
          description: addOn.description,
          category: addOn.category,
        }));

        const nextMobileServices = ((vehicleServicesResult.data || []) as VehicleServiceRow[]).map((service) => {
          const vehicleType = service.vehicle_type || 'all';

          return {
            id: service.id.toString(),
            name: service.name,
            price: parsePrice(service.price),
            displayPrice: formatMoney(parsePrice(service.price)),
            description: service.description || service.estimated_time || '',
            badge: service.popular ? 'Popular' : service.estimated_time || undefined,
            icon: vehicleIconMap[vehicleType] || vehicleIconMap.all,
          };
        });

        const nextMobileAddOns = ((vehicleAddonsResult.data || []) as VehicleAddOnRow[]).map((addOn) => ({
          id: addOn.id,
          name: addOn.name,
          price: parsePrice(addOn.price),
          displayPrice: formatMoney(parsePrice(addOn.price)),
          description: addOn.description || addOn.details || '',
          perSeat: Boolean(addOn.per_seat),
        }));

        setResidentialServices(nextResidentialServices);
        setResidentialAddOns(nextResidentialAddOns);
        setMobileServices(nextMobileServices);
        setMobileAddOns(nextMobileAddOns);
        setSelectedResidentialService(nextResidentialServices[0]?.id || '');
        setSelectedMobileService(nextMobileServices[0]?.id || '');
      } catch (loadError) {
        console.error('Error loading calculator data:', loadError);
        setError('Could not load calculator pricing from Supabase.');
      } finally {
        setLoading(false);
      }
    };

    loadCalculatorData();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
      return;
    }

    const timer = setTimeout(() => setIsVisible(false), 300);
    document.body.style.overflow = 'unset';

    return () => clearTimeout(timer);
  }, [isOpen]);

  const activeServices = mode === 'residential' ? residentialServices : mobileServices;
  const activeAddOns = mode === 'residential' ? residentialAddOns : mobileAddOns;
  const selectedServiceId = mode === 'residential' ? selectedResidentialService : selectedMobileService;
  const selectedAddOns = mode === 'residential' ? selectedResidentialAddOns : selectedMobileAddOns;
  const selectedService = activeServices.find((service) => service.id === selectedServiceId);
  const multiplier = mode === 'mobile' ? vehicleCount : 1;
  const basePrice = (selectedService?.price || 0) * multiplier;

  const addOnsTotal = useMemo(
    () =>
      selectedAddOns.reduce((total, id) => {
        const addOn = activeAddOns.find((item) => item.id === id);
        if (!addOn) {
          return total;
        }

        const addOnMultiplier = mode === 'mobile' && addOn.perSeat ? vehicleCount : 1;
        return total + addOn.price * addOnMultiplier;
      }, 0),
    [activeAddOns, mode, selectedAddOns, vehicleCount],
  );

  const totalPrice = basePrice + addOnsTotal;

  const toggleAddOn = (id: string) => {
    if (mode === 'residential') {
      setSelectedResidentialAddOns((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      );
      return;
    }

    setSelectedMobileAddOns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const selectService = (id: string) => {
    if (mode === 'residential') {
      setSelectedResidentialService(id);
      return;
    }

    setSelectedMobileService(id);
  };

  const handleBookNow = () => {
    setIsOpen(false);
    document.querySelector('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const modeLabel = mode === 'residential' ? 'Residential Cleaning' : 'Mobile Detailing';

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold text-white shadow-2xl sm:bottom-6 sm:right-6 sm:px-5 sm:py-3.5"
        style={{ backgroundColor: 'var(--theme-primary)' }}
        whileHover={{ scale: 1.05, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.5 }}
      >
        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Calculator className="h-5 w-5" />}
        <span className="hidden sm:inline">{loading ? 'Loading...' : 'Calculate Price'}</span>
        <span className="sm:hidden">Price</span>
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              onClick={handleClose}
            />

            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 h-full w-full overflow-y-auto bg-white shadow-2xl sm:w-[520px] md:w-[600px]"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur-sm sm:px-6">
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-lg p-2 text-white"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    <Calculator className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Price Calculator</h2>
                    <p className="text-xs text-gray-500">Estimate before you book</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                  aria-label="Close price calculator"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6 px-5 py-6 sm:px-6">
                <div className="grid grid-cols-2 rounded-2xl bg-gray-100 p-1">
                  {[
                    ['residential', 'Residential'],
                    ['mobile', 'Mobile Detailing'],
                  ].map(([value, label]) => {
                    const isActive = mode === value;

                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setMode(value as CalculatorMode)}
                        className="rounded-xl px-3 py-2.5 text-xs font-bold transition-all sm:text-sm"
                        style={{
                          backgroundColor: isActive ? 'var(--theme-primary)' : 'transparent',
                          color: isActive ? '#ffffff' : 'var(--theme-text)',
                        }}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>

                {error && (
                  <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {mode === 'mobile' && (
                  <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <div>
                      <div className="text-sm font-bold text-gray-900">Vehicle Count</div>
                      <div className="text-xs text-gray-500">Package price multiplies per vehicle.</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setVehicleCount((count) => Math.max(1, count - 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white"
                        aria-label="Decrease vehicle count"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-lg font-bold text-gray-900">{vehicleCount}</span>
                      <button
                        type="button"
                        onClick={() => setVehicleCount((count) => Math.min(10, count + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white"
                        aria-label="Increase vehicle count"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Select {modeLabel}</h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {activeServices.map((service) => {
                      const isSelected = selectedServiceId === service.id;

                      return (
                        <button
                          key={service.id}
                          onClick={() => selectService(service.id)}
                          className="relative rounded-xl border-2 p-3 text-left transition-all"
                          style={{
                            borderColor: isSelected ? 'var(--theme-primary)' : '#e5e7eb',
                            backgroundColor: isSelected ? 'var(--theme-panel)' : '#ffffff',
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                              style={{
                                backgroundColor: isSelected ? 'var(--theme-primary)' : '#f3f4f6',
                                color: isSelected ? '#ffffff' : '#6b7280',
                              }}
                            >
                              {service.icon}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-semibold leading-snug text-gray-900">{service.name}</div>
                              <div className="mt-1 line-clamp-2 text-xs text-gray-500">{service.description}</div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3">
                            {service.badge && (
                              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-bold" style={{ color: 'var(--theme-primary)' }}>
                                {service.badge}
                              </span>
                            )}
                            <span className="ml-auto text-lg font-bold" style={{ color: 'var(--theme-primary)' }}>
                              {service.displayPrice}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-sm font-semibold text-gray-700">Add-on Services</h3>
                  {activeAddOns.length === 0 ? (
                    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-500">
                      No add-ons are available for this calculator.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {activeAddOns.map((addOn) => {
                        const isSelected = selectedAddOns.includes(addOn.id);
                        const calculatedPrice = addOn.price * (mode === 'mobile' && addOn.perSeat ? vehicleCount : 1);

                        return (
                          <button
                            key={addOn.id}
                            onClick={() => toggleAddOn(addOn.id)}
                            className="flex w-full items-center justify-between gap-3 rounded-xl border-2 p-3 text-left transition-all"
                            style={{
                              borderColor: isSelected ? 'var(--theme-primary)' : '#e5e7eb',
                              backgroundColor: isSelected ? 'var(--theme-panel)' : '#ffffff',
                            }}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2"
                                style={{
                                  borderColor: isSelected ? 'var(--theme-primary)' : '#d1d5db',
                                  backgroundColor: isSelected ? 'var(--theme-primary)' : '#ffffff',
                                }}
                              >
                                {isSelected && <Check className="h-3 w-3 text-white" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-sm font-semibold text-gray-900">{addOn.name}</div>
                                <div className="line-clamp-2 text-xs text-gray-500">
                                  {addOn.description}
                                  {addOn.category ? ` • ${addOn.category}` : ''}
                                  {addOn.perSeat ? ` • per seat x ${vehicleCount}` : ''}
                                </div>
                              </div>
                            </div>
                            <span className="flex-shrink-0 text-sm font-bold text-gray-700">
                              {addOn.price === 0 ? addOn.displayPrice : `+${formatMoney(calculatedPrice)}`}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-600">
                      {mode === 'mobile' ? `Package x ${vehicleCount}` : 'Base Service'}
                    </span>
                    <span className="font-semibold text-gray-900">{formatMoney(basePrice)}</span>
                  </div>
                  {selectedAddOns.length > 0 && (
                    <div className="flex justify-between gap-4 text-sm">
                      <span className="text-gray-600">Add-ons ({selectedAddOns.length})</span>
                      <span className="font-semibold text-gray-900">+{formatMoney(addOnsTotal)}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-3">
                    <span className="text-base font-bold text-gray-900">Total Estimate</span>
                    <span className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>
                      {formatMoney(totalPrice)}
                    </span>
                  </div>
                  <div className="rounded-lg px-3 py-2 text-center text-xs" style={{ backgroundColor: 'var(--theme-soft)', color: 'var(--theme-primary)' }}>
                    Final price may vary after inspection for custom or range-priced items.
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-xl border-2 border-gray-200 px-6 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <motion.button
                    onClick={handleBookNow}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-white transition-all"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Book Now
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
