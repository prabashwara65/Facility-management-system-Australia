'use client';

import { useState, useEffect } from 'react';
import {
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
  MapPin,
  Globe,
  RefreshCw,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

interface Suburb {
  id: number;
  name: string;
  region: string;
  status: 'Active' | 'Inactive' | 'Draft';
  created_at?: string;
  updated_at?: string;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

const regionOptions = ['CBD', 'North', 'East', 'South', 'West'];
const statusOptions = ['Active', 'Inactive', 'Draft'];

export default function ServiceAreasContent() {
  const theme = useDashboardTheme();
  const [suburbs, setSuburbs] = useState<Suburb[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Suburb | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const supabase = createClient();

  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // READ: Load suburbs from Supabase
  const loadSuburbs = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('service_areas')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('❌ Error loading suburbs:', error);
        showToast('error', 'Failed to load suburbs');
        return;
      }

      setSuburbs(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Error loading suburbs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuburbs();
  }, []);

  // CREATE: Add new suburb
  const handleCreate = async (suburbData: any) => {
    setSaving(true);
    try {
      const newSuburb = {
        name: suburbData.name,
        region: suburbData.region,
        status: suburbData.status || 'Active',
      };

      const { data, error } = await supabase
        .from('service_areas')
        .insert([newSuburb])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating suburb:', error);
        showToast('error', 'Failed to create suburb');
        return;
      }

      setSuburbs([...suburbs, data]);
      showToast('success', 'Suburb created successfully!');
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to create suburb');
    } finally {
      setSaving(false);
    }
  };

  // UPDATE: Edit suburb
  const handleUpdate = async (suburbData: any) => {
    if (!editingItem) return;

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('service_areas')
        .update({
          name: suburbData.name,
          region: suburbData.region,
          status: suburbData.status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingItem.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating suburb:', error);
        showToast('error', 'Failed to update suburb');
        return;
      }

      setSuburbs(suburbs.map(s => s.id === data.id ? data : s));
      showToast('success', 'Suburb updated successfully!');
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to update suburb');
    } finally {
      setSaving(false);
    }
  };

  // DELETE: Delete suburb
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this suburb?')) return;

    try {
      const { error } = await supabase
        .from('service_areas')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Error deleting suburb:', error);
        showToast('error', 'Failed to delete suburb');
        return;
      }

      setSuburbs(suburbs.filter(s => s.id !== id));
      showToast('success', 'Suburb deleted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to delete suburb');
    }
  };

  // Handle save (create or update)
  const handleSave = (suburbData: any) => {
    if (editingItem) {
      handleUpdate(suburbData);
    } else {
      handleCreate(suburbData);
    }
  };

  const handleRefresh = () => {
    loadSuburbs();
  };

  // Filter suburbs
  const filteredSuburbs = suburbs.filter((suburb) => {
    const matchesRegion = selectedRegion === 'All' || suburb.region === selectedRegion;
    const matchesSearch = suburb.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Suburbs', value: suburbs.length, icon: MapPin },
    { label: 'Active', value: suburbs.filter(s => s.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Regions', value: regionOptions.length, icon: Globe, color: '#8b5cf6' },
    { label: 'Inactive', value: suburbs.filter(s => s.status === 'Inactive').length, icon: XCircle, color: '#ef4444' },
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

  const getRegionColor = (region: string) => {
    const colors: Record<string, string> = {
      CBD: '#3b82f6',
      North: '#10b981',
      East: '#8b5cf6',
      South: '#f59e0b',
      West: '#ef4444',
    };
    return colors[region] || '#94a3b8';
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
        <span style={{ marginLeft: '12px' }}>Loading suburbs...</span>
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
              Service Areas Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Service Areas
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
              {suburbs.length} suburbs • Manage your service areas
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
              Add Suburb
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
                background: theme.panel,
                border: `1px solid ${theme.border}`,
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
                  background: theme.iconBackground,
                  color: theme.icon,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} />
              </div>
              <div>
                <div style={{ color: theme.muted, fontSize: '0.8rem' }}>{stat.label}</div>
                <div style={{ color: theme.text, fontSize: '1.3rem', fontWeight: 700 }}>{stat.value}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Search */}
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedRegion('All')}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(148,163,184,0.12)',
              background: selectedRegion === 'All' ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: selectedRegion === 'All' ? '#3b82f6' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: selectedRegion === 'All' ? 600 : 400,
            }}
          >
            All
          </button>
          {regionOptions.map((region) => (
            <button
              key={region}
              onClick={() => setSelectedRegion(region)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: selectedRegion === region ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: selectedRegion === region ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: selectedRegion === region ? 600 : 400,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: getRegionColor(region),
                  display: 'inline-block',
                }}
              />
              {region}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search suburbs..."
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
                width: '200px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Suburbs Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {filteredSuburbs.map((suburb) => {
          const regionColor = getRegionColor(suburb.region);

          return (
            <div
              key={suburb.id}
              style={{
                background: 'rgba(15, 23, 42, 0.82)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: '16px',
                padding: '16px',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} style={{ color: regionColor }} />
                  <span style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.95rem' }}>
                    {suburb.name}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.6rem',
                    padding: '2px 10px',
                    borderRadius: '10px',
                    background: `${regionColor}22`,
                    color: regionColor,
                    fontWeight: 600,
                  }}
                >
                  {suburb.region}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: getStatusColor(suburb.status) }}>
                  {getStatusIcon(suburb.status)}
                  {suburb.status}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { setEditingItem(suburb); setShowModal(true); }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#3b82f6')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(suburb.id)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: 'transparent',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuburbs.length === 0 && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#64748b' }}>No suburbs found. Click "Add Suburb" to create one.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <SuburbModal
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
function SuburbModal({ data, onClose, onSave, saving }: any) {
  const [formData, setFormData] = useState(
    data || {
      name: '',
      region: 'CBD',
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
          maxWidth: '500px',
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
              {data ? 'Edit Suburb' : 'Add New Suburb'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {data ? 'Update the suburb details below' : 'Fill in the details to add a new suburb'}
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
              Suburb Name *
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
              placeholder="e.g. South Melbourne"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Region *
              </label>
              <select
                value={formData.region || 'CBD'}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
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
                {regionOptions.map((region) => (
                  <option key={region} value={region}>{region}</option>
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
