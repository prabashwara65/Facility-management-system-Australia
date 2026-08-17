'use client';

import { useState } from 'react';
import { 
  Home, 
  Building2,
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Filter,
  Package,
  DollarSign,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Copy,
  ArrowUpDown,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  HelpCircle,
} from 'lucide-react';

type ServiceCategory = 'Residential' | 'Commercial';

interface Tier {
  id: number;
  label: string;
  price: string;
  description: string;
  isPopular: boolean;
  category: ServiceCategory;
  bookings: number;
  rating: number;
  status: 'Active' | 'Inactive' | 'Draft';
}

interface AddOn {
  id: number;
  name: string;
  price: string;
  category: ServiceCategory;
  side: 'left' | 'right';
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: ServiceCategory;
}

// Initial Data from PricingSection
const initialTiers: Tier[] = [
  {
    id: 1,
    label: 'General Clean',
    price: '$179',
    description: 'Perfect for regular upkeep. Keep your place feeling fresh, organised, and stress-free every week or fortnight. Member rates apply',
    isPopular: false,
    category: 'Residential',
    bookings: 156,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 2,
    label: 'Deep Reset Clean',
    price: '$249',
    description: 'For when your home needs more than a touch-up. Floors, bathrooms, kitchen, tackled top to bottom. It\'s the reset button for your space.',
    isPopular: true,
    category: 'Residential',
    bookings: 98,
    rating: 4.9,
    status: 'Active',
  },
  {
    id: 3,
    label: 'End of Lease Cleaning',
    price: '$319',
    description: '100% BOND RETURN GUARANTEE. Designed to get your bond back. Full vacate clean with checklist compliance. Zero stress, all sparkle.',
    isPopular: false,
    category: 'Residential',
    bookings: 234,
    rating: 4.7,
    status: 'Active',
  },
  {
    id: 4,
    label: 'Office Clean',
    price: '$199',
    description: 'Professional office cleaning for workspaces up to 3 rooms. Daily or weekly service available.',
    isPopular: false,
    category: 'Commercial',
    bookings: 67,
    rating: 4.6,
    status: 'Active',
  },
  {
    id: 5,
    label: 'Retail Clean',
    price: '$299',
    description: 'Specialised retail space cleaning to keep your shop floor and displays spotless.',
    isPopular: true,
    category: 'Commercial',
    bookings: 45,
    rating: 4.8,
    status: 'Active',
  },
  {
    id: 6,
    label: 'Warehouse Clean',
    price: '$399',
    description: 'Complete warehouse and industrial space cleaning with heavy-duty equipment.',
    isPopular: false,
    category: 'Commercial',
    bookings: 23,
    rating: 4.5,
    status: 'Draft',
  },
];

const initialAddOns: AddOn[] = [
  { id: 1, name: 'Inside oven', price: '$45', category: 'Residential', side: 'left' },
  { id: 2, name: 'Inside windows', price: '$60', category: 'Residential', side: 'left' },
  { id: 3, name: 'Balcony / outdoor area', price: '$50', category: 'Residential', side: 'left' },
  { id: 4, name: 'Inside fridge', price: '$35', category: 'Residential', side: 'right' },
  { id: 5, name: 'Carpet steam clean (per room)', price: '$55', category: 'Residential', side: 'right' },
  { id: 6, name: 'Garage', price: '$70', category: 'Residential', side: 'right' },
  { id: 7, name: 'Washroom sanitising', price: '$45', category: 'Commercial', side: 'left' },
  { id: 8, name: 'Window cleaning', price: '$90', category: 'Commercial', side: 'left' },
  { id: 9, name: 'After-hours clean', price: '$60', category: 'Commercial', side: 'left' },
  { id: 10, name: 'Carpet treatment', price: '$80', category: 'Commercial', side: 'right' },
  { id: 11, name: 'Deep kitchen detail', price: '$95', category: 'Commercial', side: 'right' },
  { id: 12, name: 'Strata common area', price: '$120', category: 'Commercial', side: 'right' },
];

const initialFAQs: FAQ[] = [
  {
    id: 1,
    question: 'What\'s included in your residential cleaning services?',
    answer: 'Our residential cleaning services include dusting, vacuuming, mopping, surface wiping, disinfecting high-touch areas, and detailed cleaning of kitchens and bathrooms. You can also request extras like inside window cleaning or oven cleaning, depending on your home\'s needs.',
    category: 'Residential',
  },
  {
    id: 2,
    question: 'How do I book residential cleaning services?',
    answer: 'Booking is quick and easy! Simply select your preferred cleaning package, choose your date and time, and confirm your booking. No payment is required at the time of booking – you only pay after the service is completed to your satisfaction.',
    category: 'Residential',
  },
  {
    id: 3,
    question: 'Are your residential cleaning services customisable?',
    answer: 'Yes! We understand every home is different. You can customise your cleaning package by adding extra services, focusing on specific rooms, or scheduling regular cleans. Our team works with you to create the perfect cleaning plan for your home.',
    category: 'Residential',
  },
  {
    id: 4,
    question: 'Do you provide house cleaning for specific rooms only?',
    answer: 'Absolutely! If you only need certain rooms cleaned, we can tailor our service to focus on those areas. Whether it\'s just the kitchen and bathrooms, or specific bedrooms, we\'ll create a customised plan that meets your needs.',
    category: 'Residential',
  },
  {
    id: 5,
    question: 'Are your cleaners insured and background-checked?',
    answer: 'Yes, all our cleaners are fully insured, police-checked, and professionally trained. We take your safety and trust seriously, ensuring every cleaner who enters your home is reliable, trustworthy, and experienced.',
    category: 'Residential',
  },
  {
    id: 6,
    question: 'Do I need to be home during the cleaning?',
    answer: 'It\'s completely up to you! Many clients prefer to be home to oversee the service, while others provide us with access instructions. We have flexible arrangements to suit your preferences and schedule.',
    category: 'Residential',
  },
  {
    id: 7,
    question: 'What commercial cleaning services do you offer?',
    answer: 'We offer comprehensive commercial cleaning services including office cleaning, retail cleaning, school cleaning, gym cleaning, showroom cleaning, medical centre cleaning, and shopping centre cleaning.',
    category: 'Commercial',
  },
  {
    id: 8,
    question: 'How often do you provide commercial cleaning?',
    answer: 'We offer flexible scheduling options including nightly, weekly, fortnightly, or monthly cleans. We can also accommodate deep cleans and one-time special events.',
    category: 'Commercial',
  },
  {
    id: 9,
    question: 'Are your commercial cleaners insured and background-checked?',
    answer: 'Yes, absolutely. All our cleaners are 100% police checked, insured, and professionally trained. We take security and trust very seriously, ensuring your workplace and assets are always in safe hands.',
    category: 'Commercial',
  },
  {
    id: 10,
    question: 'Do you provide cleaning supplies and equipment for commercial spaces?',
    answer: 'Yes, we come fully equipped with superior cleaning products, professional-grade equipment, and all necessary supplies. We can also replenish cleaning goods and restock toiletries as part of our service.',
    category: 'Commercial',
  },
  {
    id: 11,
    question: 'Can I customise my commercial cleaning package?',
    answer: 'Absolutely! Our commercial cleaning packages are 100% customisable. We work with you to create a tailored cleaning plan that fits your specific needs, schedule, and budget. You can add or remove services as needed.',
    category: 'Commercial',
  },
];

const categories = ['All', 'Residential', 'Commercial'];
const statusOptions = ['Active', 'Inactive', 'Draft'];

export default function PricingContent() {
  const [tiers, setTiers] = useState<Tier[]>(initialTiers);
  const [addOns, setAddOns] = useState<AddOn[]>(initialAddOns);
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tiers' | 'addons' | 'faqs'>('tiers');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'tier' | 'addon' | 'faq'>('tier');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter data
  const filteredTiers = tiers.filter(tier => {
    const matchesCategory = selectedCategory === 'All' || tier.category === selectedCategory;
    const matchesSearch = tier.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tier.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredAddOns = addOns.filter(addon => {
    const matchesCategory = selectedCategory === 'All' || addon.category === selectedCategory;
    const matchesSearch = addon.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Tiers', value: tiers.length, icon: Package, color: '#3b82f6' },
    { label: 'Active Tiers', value: tiers.filter(t => t.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Total Add-Ons', value: addOns.length, icon: Plus, color: '#8b5cf6' },
    { label: 'Total FAQs', value: faqs.length, icon: HelpCircle, color: '#f59e0b' },
  ];

  const handleDeleteTier = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tier?')) {
      setTiers(tiers.filter(t => t.id !== id));
    }
  };

  const handleDeleteAddOn = (id: number) => {
    if (window.confirm('Are you sure you want to delete this add-on?')) {
      setAddOns(addOns.filter(a => a.id !== id));
    }
  };

  const handleDeleteFAQ = (id: number) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== id));
    }
  };

  const handleSaveTier = (tierData: any) => {
    if (editingItem) {
      setTiers(tiers.map(t => t.id === editingItem.id ? { ...t, ...tierData } : t));
    } else {
      const newTier: Tier = {
        ...tierData,
        id: tiers.length + 1,
        bookings: 0,
        rating: 0,
        status: 'Active',
      };
      setTiers([...tiers, newTier]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveAddOn = (addonData: any) => {
    if (editingItem) {
      setAddOns(addOns.map(a => a.id === editingItem.id ? { ...a, ...addonData } : a));
    } else {
      const newAddOn: AddOn = {
        ...addonData,
        id: addOns.length + 1,
      };
      setAddOns([...addOns, newAddOn]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveFAQ = (faqData: any) => {
    if (editingItem) {
      setFaqs(faqs.map(f => f.id === editingItem.id ? { ...f, ...faqData } : f));
    } else {
      const newFAQ: FAQ = {
        ...faqData,
        id: faqs.length + 1,
      };
      setFaqs([...faqs, newFAQ]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#ef4444';
      case 'Draft': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle size={14} />;
      case 'Inactive': return <XCircle size={14} />;
      case 'Draft': return <Clock size={14} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Header */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(2, 6, 23, 0.28)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Pricing Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Manage Pricing
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setModalType('tier');
              setShowModal(true);
            }}
            style={{
              border: 'none',
              borderRadius: '14px',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
            }}
          >
            <Plus size={18} />
            Add Tier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                background: 'rgba(15, 23, 42, 0.82)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: `${stat.color}22`,
                  color: stat.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{stat.label}</div>
                <div style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Tabs */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '20px',
          padding: '16px 20px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: selectedCategory === cat ? 'rgba(59,130,246,0.2)' : 'transparent',
                  color: selectedCategory === cat ? '#3b82f6' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  transition: 'all 0.2s ease',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  height: '38px',
                  borderRadius: '10px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  color: '#cbd5e1',
                  padding: '0 16px 0 36px',
                  fontSize: '0.9rem',
                  outline: 'none',
                  width: '180px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px', borderTop: '1px solid rgba(148,163,184,0.08)', paddingTop: '14px' }}>
          {[
            { id: 'tiers', label: 'Service Tiers', count: filteredTiers.length, icon: Package },
            { id: 'addons', label: 'Add-Ons', count: filteredAddOns.length, icon: Plus },
            { id: 'faqs', label: 'FAQs', count: filteredFAQs.length, icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(59,130,246,0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Icon size={16} />
                {tab.label}
                <span
                  style={{
                    fontSize: '0.7rem',
                    padding: '1px 8px',
                    borderRadius: '10px',
                    background: 'rgba(148,163,184,0.12)',
                    color: '#94a3b8',
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'tiers' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredTiers.map((tier) => {
              const isExpanded = expandedItems.includes(tier.id);

              return (
                <div
                  key={tier.id}
                  style={{
                    borderRadius: '16px',
                    border: tier.isPopular ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(148,163,184,0.08)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto auto auto auto',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '14px 18px',
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleExpand(tier.id)}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: 'rgba(59,130,246,0.12)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {tier.category === 'Residential' ? <Home size={20} /> : <Building2 size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{tier.label}</span>
                        {tier.isPopular && (
                          <span style={{ fontSize: '0.6rem', padding: '2px 10px', borderRadius: '10px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', fontWeight: 700 }}>
                            Popular
                          </span>
                        )}
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: getStatusColor(tier.status) }}>
                          {getStatusIcon(tier.status)}
                          {tier.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem' }}>{tier.price}</span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>★ {tier.rating}</span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{tier.bookings} bookings</span>
                      </div>
                    </div>

                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {tier.category}
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingItem(tier); setModalType('tier'); setShowModal(true); }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteTier(tier.id); }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ color: '#64748b' }}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ padding: '0 18px 18px 72px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '12px' }}>
                        {tier.description}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>ID: #{tier.id}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredTiers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                No service tiers found. Click "Add Tier" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'addons' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Add-Ons</h3>
            <button
              onClick={() => { setEditingItem(null); setModalType('addon'); setShowModal(true); }}
              style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.12)', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add Add-On
            </button>
          </div>

          <div style={{ display: 'grid', gap: '8px' }}>
            {filteredAddOns.map((addon) => (
              <div
                key={addon.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.72)',
                  border: '1px solid rgba(148,163,184,0.08)',
                }}
              >
                <div>
                  <span style={{ color: '#e2e8f0' }}>{addon.name}</span>
                  <span style={{ color: '#64748b', fontSize: '0.8rem', marginLeft: '12px' }}>{addon.category}</span>
                  <span style={{ color: '#64748b', fontSize: '0.7rem', marginLeft: '8px', background: 'rgba(148,163,184,0.12)', padding: '1px 8px', borderRadius: '8px' }}>
                    {addon.side}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#3b82f6', fontWeight: 600 }}>{addon.price}</span>
                  <button
                    onClick={() => { setEditingItem(addon); setModalType('addon'); setShowModal(true); }}
                    style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteAddOn(addon.id)}
                    style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
            {filteredAddOns.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                No add-ons found. Click "Add Add-On" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'faqs' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>FAQs</h3>
            <button
              onClick={() => { setEditingItem(null); setModalType('faq'); setShowModal(true); }}
              style={{ padding: '6px 14px', borderRadius: '10px', border: '1px solid rgba(148,163,184,0.12)', background: 'rgba(59,130,246,0.12)', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
            >
              <Plus size={14} /> Add FAQ
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {filteredFAQs.map((faq) => (
              <div
                key={faq.id}
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 23, 42, 0.72)',
                  border: '1px solid rgba(148,163,184,0.08)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 500 }}>{faq.question}</span>
                      <span style={{ fontSize: '0.65rem', padding: '1px 8px', borderRadius: '8px', background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}>
                        {faq.category}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>{faq.answer}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditingItem(faq); setModalType('faq'); setShowModal(true); }}
                      style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteFAQ(faq.id)}
                      style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredFAQs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                No FAQs found. Click "Add FAQ" to create one.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PricingModal
          type={modalType}
          data={editingItem}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSave={(data) => {
            if (modalType === 'tier') handleSaveTier(data);
            else if (modalType === 'addon') handleSaveAddOn(data);
            else if (modalType === 'faq') handleSaveFAQ(data);
          }}
        />
      )}
    </div>
  );
}

// Modal Component
function PricingModal({ type, data, onClose, onSave }: any) {
  const [formData, setFormData] = useState(
    data || {
      label: '',
      price: '',
      description: '',
      category: 'Residential',
      isPopular: false,
      status: 'Active',
      name: '',
      question: '',
      answer: '',
      side: 'left',
    }
  );

  const getTitle = () => {
    if (type === 'tier') return data ? 'Edit Tier' : 'Add New Tier';
    if (type === 'addon') return data ? 'Edit Add-On' : 'Add New Add-On';
    return data ? 'Edit FAQ' : 'Add New FAQ';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFields = () => {
    if (type === 'tier') {
      return (
        <>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Tier Name *
            </label>
            <input
              type="text"
              value={formData.label || ''}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              placeholder="Enter tier name"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Price *
            </label>
            <input
              type="text"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              placeholder="e.g. $199"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Description *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              placeholder="Describe the tier..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={formData.category || 'Residential'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={formData.status || 'Active'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.isPopular || false}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#3b82f6',
                  cursor: 'pointer',
                }}
              />
              Mark as Popular
            </label>
          </div>
        </>
      );
    }

    if (type === 'addon') {
      return (
        <>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Add-On Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              placeholder="Enter add-on name"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Price *
            </label>
            <input
              type="text"
              value={formData.price || ''}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              placeholder="e.g. $45"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={formData.category || 'Residential'}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Side
              </label>
              <select
                value={formData.side || 'left'}
                onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(148,163,184,0.12)',
                  background: 'rgba(15, 23, 42, 0.72)',
                  color: '#e2e8f0',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
        </>
      );
    }

    if (type === 'faq') {
      return (
        <>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Question *
            </label>
            <input
              type="text"
              value={formData.question || ''}
              onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
              placeholder="Enter FAQ question"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Answer *
            </label>
            <textarea
              value={formData.answer || ''}
              onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
              required
              rows={4}
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              placeholder="Enter FAQ answer"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Category *
            </label>
            <select
              value={formData.category || 'Residential'}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
            </select>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.98)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '32px',
          padding: '32px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h3 style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700 }}>
              {getTitle()}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {data ? 'Update the details below' : 'Fill in the details to create a new entry'}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          {renderFields()}

          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              <Save size={16} />
              {data ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}