'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Edit,
  X,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useDashboardTheme } from '../../context/DashboardThemeContext';

interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  service_area: string;
  hours: string;
}

interface ToastMessage {
  type: 'success' | 'error' | 'info';
  message: string;
}

const defaultContactInfo = {
  phone: '1800 123 456',
  email: 'hello@sparkwell.com.au',
  service_area: 'Melbourne, VIC',
  hours: 'Mon–Sat, 7am–6pm',
};

export default function ContactContent() {
  const theme = useDashboardTheme();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const supabase = createClient();

  const contactFields = [
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: 'e.g. 1800 123 456' },
    { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'e.g. hello@sparkwell.com.au' },
    { key: 'service_area', label: 'Service Area', icon: MapPin, placeholder: 'e.g. Melbourne, VIC' },
    { key: 'hours', label: 'Business Hours', icon: Clock, placeholder: 'e.g. Mon-Sat, 7am-6pm' },
  ];

  const showToast = (type: ToastMessage['type'], message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  // READ: Load contact info
  const loadContactInfo = async () => {
    try {
      setLoading(true);
      //('🔵 Loading contact info...');

      // Try to get existing record
      const { data, error } = await supabase
        .from('bookings')
        .select('id, phone, email, service_area, hours')
        .limit(1);

      //('📊 Data:', data);
      //('❌ Error:', error);

      if (error) {
        console.error('Error loading:', error);
        // If no data exists, create default
        if (error.code === 'PGRST116' || !data || data.length === 0) {
          //('📝 No record found, creating default...');
          const { data: inserted, error: insertError } = await supabase
            .from('bookings')
            .insert([defaultContactInfo])
            .select('id, phone, email, service_area, hours');

          //('📊 Insert result:', inserted);
          //('❌ Insert error:', insertError);

          if (insertError) {
            console.error('Insert error:', insertError);
            setContactInfo({ id: 0, ...defaultContactInfo });
          } else if (inserted && inserted.length > 0) {
            setContactInfo(inserted[0]);
          } else {
            setContactInfo({ id: 0, ...defaultContactInfo });
          }
        } else {
          setContactInfo({ id: 0, ...defaultContactInfo });
        }
      } else if (data && data.length > 0) {
        //('✅ Data loaded:', data[0]);
        setContactInfo(data[0]);
      } else {
        //('📝 No data found, creating default...');
        const { data: inserted, error: insertError } = await supabase
          .from('bookings')
          .insert([defaultContactInfo])
          .select('id, phone, email, service_area, hours');

        if (insertError) {
          console.error('Insert error:', insertError);
          setContactInfo({ id: 0, ...defaultContactInfo });
        } else if (inserted && inserted.length > 0) {
          setContactInfo(inserted[0]);
        } else {
          setContactInfo({ id: 0, ...defaultContactInfo });
        }
      }
    } catch (error) {
      console.error('❌ Error:', error);
      setContactInfo({ id: 0, ...defaultContactInfo });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContactInfo();
  }, []);

  const getValue = (key: string) => {
    if (!contactInfo) return '';
    const map: Record<string, string> = {
      phone: contactInfo.phone || '',
      email: contactInfo.email || '',
      service_area: contactInfo.service_area || '',
      hours: contactInfo.hours || '',
    };
    return map[key] || '';
  };

  const handleEdit = (field: string) => {
    setEditingField(field);
    setFormData({ [field]: getValue(field) });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingField || !contactInfo) {
      //('❌ No field or contact info');
      return;
    }

    //(`🟡 Updating ${editingField} to:`, formData[editingField]);

    // If no id, insert new record
    if (contactInfo.id === 0) {
      //('📝 Creating new record...');
      const { data, error } = await supabase
        .from('bookings')
        .insert([{ [editingField]: formData[editingField] }])
        .select('id, phone, email, service_area, hours');

      if (error) {
        console.error('❌ Error creating:', error);
        showToast('error', 'Failed to create record');
        return;
      }

      if (data && data.length > 0) {
        setContactInfo(data[0]);
        showToast('success', 'Record created successfully!');
      }
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update({ [editingField]: formData[editingField] })
        .eq('id', contactInfo.id)
        .select('id, phone, email, service_area, hours');

      if (error) {
        console.error('❌ Error updating:', error);
        showToast('error', 'Failed to update');
        return;
      }

      //('✅ Update successful:', data);

      if (data && data.length > 0) {
        setContactInfo(data[0]);
      } else {
        setContactInfo({ ...contactInfo, [editingField]: formData[editingField] });
      }

      setShowEditModal(false);
      setEditingField(null);
      setFormData({});

      const fieldLabel = contactFields.find(f => f.key === editingField)?.label || 'Field';
      showToast('success', `${fieldLabel} updated successfully!`);
    } catch (error) {
      console.error('❌ Error:', error);
      showToast('error', 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = () => {
    loadContactInfo();
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        color: theme.muted
      }}>
        <RefreshCw size={24} style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ marginLeft: '12px' }}>Loading...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            padding: '16px 24px',
            borderRadius: '16px',
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
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
          background: theme.panel,
          border: `1px solid ${theme.border}`,
          borderRadius: '20px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ color: theme.muted, fontSize: '0.72rem', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Contact Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', color: theme.text }}>
              Contact Information
            </h2>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: `1px solid ${theme.border}`,
              background: 'transparent',
              color: theme.muted,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {/* Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {contactFields.map((field) => {
          const Icon = field.icon;
          const value = getValue(field.key);

          return (
            <div
              key={field.key}
              style={{
                background: theme.panel,
                border: `1px solid ${value ? theme.border : 'rgba(239,68,68,0.15)'}`,
                borderRadius: '20px',
                padding: '24px',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: value ? theme.iconBackground : 'rgba(239,68,68,0.08)',
                    color: value ? theme.icon : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={24} />
                </div>
                <button
                  onClick={() => handleEdit(field.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: `1px solid ${theme.border}`,
                    background: 'transparent',
                    color: theme.muted,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = theme.muted;
                    e.currentTarget.style.color = theme.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = theme.border;
                    e.currentTarget.style.color = theme.muted;
                  }}
                >
                  <Edit size={16} />
                  Edit
                </button>
              </div>

              <div>
                <div style={{ color: theme.muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {field.label}
                </div>
                <div style={{
                  color: value ? theme.text : '#ef4444',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  opacity: value ? 1 : 0.7,
                }}>
                  {value || 'Not set'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
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
          onClick={() => {
            setShowEditModal(false);
            setEditingField(null);
            setFormData({});
          }}
        >
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '28px',
              padding: '32px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: '0 30px 70px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h3 style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700 }}>
                  Edit {contactFields.find(f => f.key === editingField)?.label}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Update the contact information below
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingField(null);
                  setFormData({});
                }}
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

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                  {contactFields.find(f => f.key === editingField)?.label} *
                </label>
                <input
                  type="text"
                  value={editingField ? formData[editingField] || '' : ''}
                  onChange={(e) => editingField && setFormData({ [editingField]: e.target.value })}
                  required
                  placeholder={contactFields.find(f => f.key === editingField)?.placeholder}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    border: '1px solid rgba(148,163,184,0.12)',
                    background: 'rgba(15, 23, 42, 0.72)',
                    color: '#e2e8f0',
                    fontSize: '1rem',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#3b82f6')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingField(null);
                    setFormData({});
                  }}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '14px',
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
                    padding: '14px',
                    borderRadius: '14px',
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
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
