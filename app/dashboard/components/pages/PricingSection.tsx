'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  Building2,
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Package,
  Users,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  Bath,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

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

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: ServiceCategory;
}

interface AddOn {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const categories = ['All', 'Residential', 'Commercial'];
const statusOptions = ['Active', 'Inactive', 'Draft'];
const addOnCategories = ['Carpet & Upholstery', 'Kitchen Add-ons', 'Whole Home', 'Deep Detail'];

// Category icons
const categoryIconMap: Record<string, React.ReactNode> = {
  'Carpet & Upholstery': <Home className="w-4 h-4" />,
  'Kitchen Add-ons': <Bath className="w-4 h-4" />,
  'Whole Home': <Sparkles className="w-4 h-4" />,
  'Deep Detail': <Clock className="w-4 h-4" />,
};

export default function PricingContent() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'tiers' | 'faqs' | 'addons'>('tiers');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'tier' | 'faq' | 'addon'>('tier');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  // Load all data from Supabase
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load tiers
      const { data: tiersData, error: tiersError } = await supabase
        .from('pricing_tiers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (tiersError) {
        console.error('Error loading tiers:', tiersError);
      } else if (tiersData) {
        setTiers(tiersData);
      }

      // Load FAQs
      const { data: faqsData, error: faqsError } = await supabase
        .from('faqs')
        .select('*')
        .order('sort_order', { ascending: true });

      if (faqsError) {
        console.error('Error loading FAQs:', faqsError);
      } else if (faqsData) {
        setFaqs(faqsData);
      }

      // Load Add-ons from the addons table
      const { data: addOnsData, error: addOnsError } = await supabase
        .from('addons')
        .select('*')
        .order('sort_order', { ascending: true });

      if (addOnsError) {
        console.error('Error loading add-ons:', addOnsError);
      } else if (addOnsData) {
        setAddOns(addOnsData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter data
  const filteredTiers = tiers.filter((tier: Tier) => {
    const matchesCategory = selectedCategory === 'All' || tier.category === selectedCategory;
    const matchesSearch = tier.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tier.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredFAQs = faqs.filter((faq: FAQ) => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredAddOns = addOns.filter((addOn: AddOn) => {
    const matchesSearch = addOn.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addOn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         addOn.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Tiers', value: tiers.length, icon: Package, color: '#3b82f6' },
    { label: 'Active Tiers', value: tiers.filter((t: Tier) => t.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Total Add-ons', value: addOns.length, icon: ShoppingBag, color: '#8b5cf6' },
    { label: 'Total FAQs', value: faqs.length, icon: HelpCircle, color: '#f59e0b' },
  ];

  // CRUD: Delete Tier
  const handleDeleteTier = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tier?')) return;

    try {
      const { error } = await supabase
        .from('pricing_tiers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting tier:', error);
        alert('Failed to delete tier');
        return;
      }

      setTiers(tiers.filter((t: Tier) => t.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete tier');
    }
  };

  // CRUD: Delete FAQ
  const handleDeleteFAQ = async (id: number) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;

    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting FAQ:', error);
        alert('Failed to delete FAQ');
        return;
      }

      setFaqs(faqs.filter((f: FAQ) => f.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete FAQ');
    }
  };

  // CRUD: Delete Add-on
  const handleDeleteAddOn = async (id: number) => {
    if (!confirm('Are you sure you want to delete this add-on?')) return;

    try {
      const { error } = await supabase
        .from('addons')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting add-on:', error);
        alert('Failed to delete add-on');
        return;
      }

      setAddOns(addOns.filter((a: AddOn) => a.id !== id));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to delete add-on');
    }
  };

  // CRUD: Save Tier
  const handleSaveTier = async (tierData: any) => {
    setSaving(true);
    try {
      if (editingItem) {
        const { data, error } = await supabase
          .from('pricing_tiers')
          .update({
            label: tierData.label,
            price: tierData.price,
            description: tierData.description,
            is_popular: tierData.isPopular,
            category: tierData.category,
            status: tierData.status,
          })
          .eq('id', editingItem.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating tier:', error);
          alert('Failed to update tier');
          return;
        }

        setTiers(tiers.map((t: Tier) => t.id === editingItem.id ? { ...t, ...tierData } : t));
      } else {
        const { data, error } = await supabase
          .from('pricing_tiers')
          .insert({
            label: tierData.label,
            price: tierData.price,
            description: tierData.description,
            is_popular: tierData.isPopular || false,
            category: tierData.category,
            status: tierData.status || 'Active',
            bookings: 0,
            rating: 0,
            sort_order: tiers.length + 1,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating tier:', error);
          alert('Failed to create tier');
          return;
        }

        setTiers([...tiers, data]);
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save tier');
    } finally {
      setSaving(false);
    }
  };

  // CRUD: Save FAQ
  const handleSaveFAQ = async (faqData: any) => {
    setSaving(true);
    try {
      if (editingItem) {
        const { data, error } = await supabase
          .from('faqs')
          .update({
            question: faqData.question,
            answer: faqData.answer,
            category: faqData.category,
          })
          .eq('id', editingItem.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating FAQ:', error);
          alert('Failed to update FAQ');
          return;
        }

        setFaqs(faqs.map((f: FAQ) => f.id === editingItem.id ? { ...f, ...faqData } : f));
      } else {
        const { data, error } = await supabase
          .from('faqs')
          .insert({
            question: faqData.question,
            answer: faqData.answer,
            category: faqData.category,
            sort_order: faqs.length + 1,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating FAQ:', error);
          alert('Failed to create FAQ');
          return;
        }

        setFaqs([...faqs, data]);
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  // CRUD: Save Add-on to addons table
  const handleSaveAddOn = async (addOnData: any) => {
    setSaving(true);
    try {
      // Clean the data - ensure all required fields are present
      const cleanData = {
        name: addOnData.name?.trim() || '',
        price: addOnData.price?.trim() || '',
        description: addOnData.description?.trim() || '',
        category: addOnData.category || 'Carpet & Upholstery',
        is_active: addOnData.is_active !== undefined ? addOnData.is_active : true,
      };

      // Validate required fields
      if (!cleanData.name || !cleanData.price) {
        alert('Name and Price are required fields');
        setSaving(false);
        return;
      }

      if (editingItem) {
        // Update existing add-on
        const { data, error } = await supabase
          .from('addons')
          .update(cleanData)
          .eq('id', editingItem.id)
          .select();

        if (error) {
          console.error('Error updating add-on:', error);
          alert('Failed to update add-on: ' + error.message);
          setSaving(false);
          return;
        }

        if (data && data.length > 0) {
          setAddOns(addOns.map((a: AddOn) => 
            a.id === editingItem.id ? { ...a, ...cleanData, updated_at: new Date().toISOString() } : a
          ));
          alert('Add-on updated successfully!');
        }
      } else {
        // Create new add-on
        const { data, error } = await supabase
          .from('addons')
          .insert({
            ...cleanData,
            sort_order: addOns.length + 1,
          })
          .select();

        if (error) {
          console.error('Error creating add-on:', error);
          alert('Failed to create add-on: ' + error.message);
          setSaving(false);
          return;
        }

        if (data && data.length > 0) {
          setAddOns([...addOns, data[0]]);
          alert('Add-on created successfully!');
        }
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error: any) {
      console.error('Error:', error);
      alert('Failed to save add-on: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Toggle Add-on Active Status
  const handleToggleAddOnActive = async (addOn: AddOn) => {
    try {
      const { data, error } = await supabase
        .from('addons')
        .update({ is_active: !addOn.is_active })
        .eq('id', addOn.id)
        .select()
        .single();

      if (error) {
        console.error('Error toggling add-on:', error);
        alert('Failed to update add-on status');
        return;
      }

      setAddOns(addOns.map((a: AddOn) => a.id === addOn.id ? { ...a, is_active: !a.is_active } : a));
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update add-on status');
    }
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

  const handleRefresh = () => {
    loadData();
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px',
        color: '#94a3b8'
      }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px' }}>Loading...</span>
      </div>
    );
  }

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
              Pricing & Add-ons Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Dashboard ({tiers.length} Tiers, {addOns.length} Add-ons)
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRefresh}
              style={{
                padding: '8px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'transparent',
                color: '#94a3b8',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
              }}
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
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
                  background: selectedCategory === cat ? 'rgba(246, 217, 97, 0.15)' : 'transparent',
                  color: selectedCategory === cat ? '#F6D961' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

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

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '16px', borderTop: '1px solid rgba(148,163,184,0.08)', paddingTop: '14px' }}>
          <button
            onClick={() => setActiveTab('tiers')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'tiers' ? 'rgba(246, 217, 97, 0.15)' : 'transparent',
              color: activeTab === 'tiers' ? '#F6D961' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'tiers' ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Package size={16} />
            Tiers
            <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '10px', background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}>
              {filteredTiers.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('addons')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'addons' ? 'rgba(246, 217, 97, 0.15)' : 'transparent',
              color: activeTab === 'addons' ? '#F6D961' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'addons' ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShoppingBag size={16} />
            Add-ons
            <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '10px', background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}>
              {filteredAddOns.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'faqs' ? 'rgba(246, 217, 97, 0.15)' : 'transparent',
              color: activeTab === 'faqs' ? '#F6D961' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'faqs' ? 600 : 400,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <HelpCircle size={16} />
            FAQs
            <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: '10px', background: 'rgba(148,163,184,0.12)', color: '#94a3b8' }}>
              {filteredFAQs.length}
            </span>
          </button>
        </div>
      </div>

      {/* Add-ons Tab */}
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
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Add-on Services</h3>
            <button
              onClick={() => { setEditingItem(null); setModalType('addon'); setShowModal(true); }}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: '#F6D961',
                color: '#1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(246, 217, 97, 0.3)',
              }}
            >
              <Plus size={16} /> Add Add-on
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredAddOns.map((addOn: AddOn) => {
              const isExpanded = expandedItems.includes(addOn.id);
              const Icon = categoryIconMap[addOn.category] || <Package className="w-4 h-4" />;

              return (
                <div
                  key={addOn.id}
                  style={{
                    borderRadius: '16px',
                    border: addOn.is_active ? '1px solid rgba(148,163,184,0.08)' : '1px solid rgba(239,68,68,0.15)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    overflow: 'hidden',
                    opacity: addOn.is_active ? 1 : 0.6,
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
                    onClick={() => toggleExpand(addOn.id)}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: addOn.is_active ? 'rgba(59,130,246,0.12)' : 'rgba(239,68,68,0.12)',
                        color: addOn.is_active ? '#3b82f6' : '#ef4444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {Icon}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{addOn.name}</span>
                        <span style={{ 
                          fontSize: '0.6rem', 
                          padding: '2px 10px', 
                          borderRadius: '10px', 
                          background: addOn.is_active ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                          color: addOn.is_active ? '#10b981' : '#ef4444',
                          fontWeight: 700 
                        }}>
                          {addOn.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '2px' }}>
                        <span style={{ color: '#3b82f6', fontWeight: 700, fontSize: '0.95rem' }}>{addOn.price}</span>
                        <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{addOn.category}</span>
                      </div>
                    </div>

                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {addOn.category}
                    </div>

                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingItem(addOn); setModalType('addon'); setShowModal(true); }}
                        style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAddOn(addOn.id); }}
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
                        {addOn.description}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <button
                          onClick={() => handleToggleAddOnActive(addOn)}
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            border: 'none',
                            background: addOn.is_active ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
                            color: addOn.is_active ? '#ef4444' : '#10b981',
                            cursor: 'pointer',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                          }}
                        >
                          {addOn.is_active ? 'Deactivate' : 'Activate'}
                        </button>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          Created: {new Date(addOn.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            {filteredAddOns.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <ShoppingBag size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No add-ons found. Click "Add Add-on" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tiers Tab */}
      {activeTab === 'tiers' && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>Tiers</h3>
            <button
              onClick={() => { setEditingItem(null); setModalType('tier'); setShowModal(true); }}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: '#F6D961',
                color: '#1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(246, 217, 97, 0.3)',
              }}
            >
              <Plus size={16} /> Add Tier
            </button>
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            {filteredTiers.map((tier: Tier) => {
              const isExpanded = expandedItems.includes(tier.id);

              return (
                <div
                  key={tier.id}
                  style={{
                    borderRadius: '16px',
                    border: tier.isPopular ? '1px solid rgba(245,158,11,0.3)' : '1px solid rgba(148,163,184,0.08)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    overflow: 'hidden',
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

                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{tier.category}</div>

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
                    </div>
                  )}
                </div>
              );
            })}
            {filteredTiers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                <Package size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No tiers found. Click "Add Tier" to create one.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAQs Tab */}
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
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: '#F6D961',
                color: '#1a1a1a',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.85rem',
                fontWeight: 600,
                boxShadow: '0 2px 10px rgba(246, 217, 97, 0.3)',
              }}
            >
              <Plus size={16} /> Add FAQ
            </button>
          </div>

          <div style={{ display: 'grid', gap: '10px' }}>
            {filteredFAQs.map((faq: FAQ) => (
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
                <HelpCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p>No FAQs found. Click "Add FAQ" to create one.</p>
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
            else if (modalType === 'faq') handleSaveFAQ(data);
            else if (modalType === 'addon') handleSaveAddOn(data);
          }}
          saving={saving}
        />
      )}
    </div>
  );
}

// Modal Component
function PricingModal({ type, data, onClose, onSave, saving }: any) {
  // Initialize form data based on type
  const getInitialData = () => {
    if (data) return data;
    
    if (type === 'tier') {
      return {
        label: '',
        price: '',
        description: '',
        category: 'Residential',
        isPopular: false,
        status: 'Active',
      };
    }
    
    if (type === 'addon') {
      return {
        name: '',
        price: '',
        description: '',
        category: 'Carpet & Upholstery',
        is_active: true,
      };
    }
    
    if (type === 'faq') {
      return {
        question: '',
        answer: '',
        category: 'Residential',
      };
    }
    
    return {};
  };

  const [formData, setFormData] = useState(getInitialData());

  const getTitle = () => {
    if (type === 'tier') return data ? 'Edit Tier' : 'Add New Tier';
    if (type === 'addon') return data ? 'Edit Add-on' : 'Add New Add-on';
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
              Add-on Name *
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
              placeholder="e.g. Oven Cleaning"
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
              placeholder="e.g. $65"
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Description
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              placeholder="Describe the add-on..."
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Category *
            </label>
            <select
              value={formData.category || 'Carpet & Upholstery'}
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
              <option value="Carpet & Upholstery">Carpet & Upholstery</option>
              <option value="Kitchen Add-ons">Kitchen Add-ons</option>
              <option value="Whole Home">Whole Home</option>
              <option value="Deep Detail">Deep Detail</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.is_active !== undefined ? formData.is_active : true}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#3b82f6',
                  cursor: 'pointer',
                }}
              />
              Active
            </label>
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
              disabled={saving}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: '#F6D961',
                color: '#1a1a1a',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                boxShadow: '0 4px 15px rgba(246, 217, 97, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: saving ? 0.7 : 1,
              }}
            >
              <Save size={16} />
              {saving ? 'Saving...' : (data ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}