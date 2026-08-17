'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  FileCheck2,
  UserCheck,
  Tag,
  Leaf,
  Plane,
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Eye,
  X,
  Save,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

interface PromiseFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  order: number;
}

// Initial data from PromiseSection
const initialFeatures: PromiseFeature[] = [
  {
    id: 1,
    icon: 'ShieldCheck',
    title: '48-Hour Re-Clean Guarantee',
    description: 'Not happy? We return within 48 hours at no extra cost, no questions asked.',
    status: 'Active',
    order: 1,
  },
  {
    id: 2,
    icon: 'FileCheck2',
    title: 'Fully Insured & Bonded',
    description: 'All cleaners carry $10M public liability insurance for complete peace of mind.',
    status: 'Active',
    order: 2,
  },
  {
    id: 3,
    icon: 'UserCheck',
    title: 'Vetted & Background-Checked',
    description: 'Every team member passes a national police check before joining our crew.',
    status: 'Active',
    order: 3,
  },
  {
    id: 4,
    icon: 'Tag',
    title: 'Fixed, Transparent Pricing',
    description: 'No hidden fees. Your quoted price is what you pay — always.',
    status: 'Active',
    order: 4,
  },
  {
    id: 5,
    icon: 'Leaf',
    title: 'Eco-Friendly Products',
    description: 'We use hospital-grade, biodegradable cleaning products safe for kids and pets.',
    status: 'Active',
    order: 5,
  },
  {
    id: 6,
    icon: 'Plane',
    title: 'No Travel Fees',
    description: 'Free travel within our service area — Melbourne metro and inner suburbs.',
    status: 'Active',
    order: 6,
  },
];

const iconOptions = [
  { value: 'ShieldCheck', label: 'Shield Check' },
  { value: 'FileCheck2', label: 'File Check' },
  { value: 'UserCheck', label: 'User Check' },
  { value: 'Tag', label: 'Tag' },
  { value: 'Leaf', label: 'Leaf' },
  { value: 'Plane', label: 'Plane' },
];

const iconMap: Record<string, any> = {
  ShieldCheck: ShieldCheck,
  FileCheck2: FileCheck2,
  UserCheck: UserCheck,
  Tag: Tag,
  Leaf: Leaf,
  Plane: Plane,
};

const statusOptions = ['Active', 'Inactive', 'Draft'];

export default function PromiseContent() {
  const [features, setFeatures] = useState<PromiseFeature[]>(initialFeatures);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PromiseFeature | null>(null);
  const [expandedItems, setExpandedItems] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Filter features
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Features', value: features.length, icon: Package, color: '#3b82f6' },
    { label: 'Active Features', value: features.filter(f => f.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Inactive', value: features.filter(f => f.status === 'Inactive').length, icon: XCircle, color: '#ef4444' },
    { label: 'Draft', value: features.filter(f => f.status === 'Draft').length, icon: Clock, color: '#f59e0b' },
  ];

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      setFeatures(features.filter(f => f.id !== id));
    }
  };

  const handleSave = (featureData: any) => {
    if (editingItem) {
      setFeatures(features.map(f => f.id === editingItem.id ? { ...f, ...featureData } : f));
    } else {
      const newFeature: PromiseFeature = {
        ...featureData,
        id: features.length + 1,
        order: features.length + 1,
        status: 'Active',
      };
      setFeatures([...features, newFeature]);
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
              Promise Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              The Sparkwell Promise
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
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
            Add Feature
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

      {/* Search & View Controls */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: '38px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#cbd5e1',
                padding: '0 16px 0 36px',
                fontSize: '0.9rem',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(148,163,184,0.12)',
              background: viewMode === 'grid' ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: viewMode === 'grid' ? '#3b82f6' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              border: '1px solid rgba(148,163,184,0.12)',
              background: viewMode === 'list' ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: viewMode === 'list' ? '#3b82f6' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.8rem',
            }}
          >
            List
          </button>
        </div>
      </div>

      {/* Features Grid/List */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredFeatures.map((feature) => {
            const Icon = iconMap[feature.icon] || ShieldCheck;
            const isExpanded = expandedItems.includes(feature.id);

            return (
              <div
                key={feature.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.82)',
                  border: '1px solid rgba(148,163,184,0.12)',
                  borderRadius: '24px',
                  padding: '20px',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
              >
                <div style={{ display: 'flex', alignItems: 'start', gap: '14px', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: 'rgba(59,130,246,0.12)',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>
                      {feature.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: getStatusColor(feature.status) }}>
                        {getStatusIcon(feature.status)}
                        {feature.status}
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.7rem' }}>#{feature.id}</span>
                    </div>
                  </div>
                </div>

                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '12px' }}>
                  {feature.description}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Order: #{feature.order}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => { setEditingItem(feature); setShowModal(true); }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.12)',
                        background: 'transparent',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        border: '1px solid rgba(148,163,184,0.12)',
                        background: 'transparent',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#ef4444';
                        e.currentTarget.style.color = '#ef4444';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)';
                        e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'grid', gap: '10px' }}>
            {filteredFeatures.map((feature) => {
              const Icon = iconMap[feature.icon] || ShieldCheck;

              return (
                <div
                  key={feature.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'auto 1fr auto auto auto',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: 'rgba(15, 23, 42, 0.72)',
                    border: '1px solid rgba(148,163,184,0.08)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'rgba(59,130,246,0.12)',
                      color: '#3b82f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#f8fafc', fontWeight: 500 }}>{feature.title}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: getStatusColor(feature.status) }}>
                        {getStatusIcon(feature.status)}
                        {feature.status}
                      </span>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>{feature.description}</p>
                  </div>

                  <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                    #{feature.order}
                  </div>

                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={() => { setEditingItem(feature); setShowModal(true); }}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(feature.id)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filteredFeatures.length === 0 && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#64748b' }}>No features found. Click "Add Feature" to create one.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <PromiseModal
          data={editingItem}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Modal Component
function PromiseModal({ data, onClose, onSave }: any) {
  const [formData, setFormData] = useState(
    data || {
      title: '',
      description: '',
      icon: 'ShieldCheck',
      status: 'Active',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
              {data ? 'Edit Feature' : 'Add New Feature'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {data ? 'Update the feature details below' : 'Fill in the details to create a new feature'}
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
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Feature Title *
            </label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              placeholder="Enter feature title"
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
              placeholder="Describe the feature..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Icon *
              </label>
              <select
                value={formData.icon || 'ShieldCheck'}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
                {iconOptions.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

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