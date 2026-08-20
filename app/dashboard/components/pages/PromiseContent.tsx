'use client';

import { useState, useEffect } from 'react';
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
  X,
  Save,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface PromiseFeature {
  id: number;
  icon: string;
  title: string;
  description: string;
  status: 'Active' | 'Inactive' | 'Draft';
  created_at?: string;
  updated_at?: string;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

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
  const [features, setFeatures] = useState<PromiseFeature[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PromiseFeature | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const supabase = createClient();

  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // READ: Load features from Supabase
  const loadFeatures = async () => {
    try {
      setIsLoading(true);
      console.log('🔵 Loading promise features...');

      const { data, error } = await supabase
        .from('promise_features')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('❌ Error loading features:', error);
        showToast('error', 'Failed to load features');
        return;
      }

      console.log('✅ Features loaded:', data?.length || 0);
      setFeatures(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Error loading features');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeatures();
  }, []);

  // CREATE: Add new feature
  const handleCreate = async (featureData: any) => {
    setSaving(true);
    try {
      const newFeature = {
        icon: featureData.icon || 'ShieldCheck',
        title: featureData.title,
        description: featureData.description,
        status: featureData.status || 'Active',
      };

      const { data, error } = await supabase
        .from('promise_features')
        .insert([newFeature])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating feature:', error);
        showToast('error', 'Failed to create feature');
        return;
      }

      setFeatures([...features, data]);
      showToast('success', 'Feature created successfully!');
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to create feature');
    } finally {
      setSaving(false);
    }
  };

  // UPDATE: Edit feature
  const handleUpdate = async (featureData: any) => {
    if (!editingItem) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('promise_features')
        .update({
          icon: featureData.icon,
          title: featureData.title,
          description: featureData.description,
          status: featureData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating feature:', error);
        showToast('error', 'Failed to update feature');
        return;
      }

      setFeatures(features.map(f => f.id === data.id ? data : f));
      showToast('success', 'Feature updated successfully!');
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to update feature');
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Delete feature
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this feature?')) return;

    try {
      const { error } = await supabase
        .from('promise_features')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting feature:', error);
        showToast('error', 'Failed to delete feature');
        return;
      }

      setFeatures(features.filter(f => f.id !== id));
      showToast('success', 'Feature deleted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to delete feature');
    }
  };

  // Handle save (create or update)
  const handleSave = (featureData: any) => {
    if (editingItem) {
      handleUpdate(featureData);
    } else {
      handleCreate(featureData);
    }
  };

  const handleRefresh = () => {
    loadFeatures();
  };

  // Filter features
  const filteredFeatures = features.filter(feature => {
    const matchesSearch = feature.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         feature.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Features', value: features.length, icon: Package, color: '#3b82f6' },
    { label: 'Active', value: features.filter(f => f.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Inactive', value: features.filter(f => f.status === 'Inactive').length, icon: XCircle, color: '#ef4444' },
    { label: 'Draft', value: features.filter(f => f.status === 'Draft').length, icon: Clock, color: '#f59e0b' },
  ];

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
        <span style={{ marginLeft: '12px' }}>Loading features...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '16px 24px',
            borderRadius: '16px',
            background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
            color: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            animation: 'slideIn 0.3s ease-out',
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              opacity: 0.7,
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

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
              The Promise
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
              {features.length} features • Manage your brand promises
            </p>
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

      {/* Search */}
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

        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Showing {filteredFeatures.length} of {features.length} features
        </div>
      </div>

      {/* Features Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {filteredFeatures.map((feature) => {
          const Icon = iconMap[feature.icon] || ShieldCheck;

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
                  ID: #{feature.id}
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
          saving={saving}
        />
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Modal Component
function PromiseModal({ data, onClose, onSave, saving }: any) {
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
              disabled={saving}
              style={{
                flex: 2,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                color: '#ffffff',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
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