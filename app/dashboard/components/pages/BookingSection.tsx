'use client';

import { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Plus,
  Edit,
  Trash2,
  Search,
  Package,
  Eye,
  X,
  Save,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

// Initial contact data
const initialContactInfo = {
  phone: '1800 123 456',
  email: 'hello@sparkwell.com.au',
  serviceArea: 'Melbourne, VIC',
  hours: 'Mon–Sat, 7am–6pm',
  guarantee: {
    title: 'Bond-Back Guarantee',
    description: "If your property manager isn't satisfied, we return free of charge. That's our promise.",
  },
};

export default function ContactContent() {
  const [contactInfo, setContactInfo] = useState(initialContactInfo);
  const [editingField, setEditingField] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [showGuaranteeModal, setShowGuaranteeModal] = useState(false);

  // Stats
  const stats = [
    { label: 'Contact Methods', value: '4', icon: Phone, color: '#3b82f6' },
    { label: 'Phone', value: contactInfo.phone, icon: Phone, color: '#10b981' },
    { label: 'Email', value: contactInfo.email, icon: Mail, color: '#8b5cf6' },
    { label: 'Service Area', value: contactInfo.serviceArea.split(',')[0], icon: MapPin, color: '#f59e0b' },
  ];

  const handleEdit = (field, value) => {
    setEditingField(field);
    setFormData({ [field]: value });
    setShowEditModal(true);
  };

  const handleSave = () => {
    setContactInfo({ ...contactInfo, ...formData });
    setShowEditModal(false);
    setEditingField(null);
    setFormData({});
  };

  const handleGuaranteeSave = () => {
    setShowGuaranteeModal(false);
  };

  const contactFields = [
    { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: 'e.g. 1800 123 456' },
    { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'e.g. hello@sparkwell.com.au' },
    { key: 'serviceArea', label: 'Service Area', icon: MapPin, placeholder: 'e.g. Melbourne, VIC' },
    { key: 'hours', label: 'Business Hours', icon: Clock, placeholder: 'e.g. Mon–Sat, 7am–6pm' },
  ];

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
              Contact Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Contact Information
            </h2>
          </div>
          <button
            onClick={() => setShowGuaranteeModal(true)}
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
            <ShieldCheck size={18} />
            Edit Guarantee
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
                <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, wordBreak: 'break-all' }}>
                  {stat.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contact Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {contactFields.map((field) => {
          const Icon = field.icon;
          const value = contactInfo[field.key];

          return (
            <div
              key={field.key}
              style={{
                background: 'rgba(15, 23, 42, 0.82)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: '24px',
                padding: '24px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
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
                  }}
                >
                  <Icon size={24} />
                </div>
                <button
                  onClick={() => handleEdit(field.key, value)}
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
              </div>

              <div>
                <div style={{ color: '#94a3b8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                  {field.label}
                </div>
                <div style={{ color: '#f8fafc', fontSize: '1.1rem', fontWeight: 600, wordBreak: 'break-all' }}>
                  {value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guarantee Section */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1.1rem' }}>
              Bond-Back Guarantee
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              This appears on the contact page
            </p>
          </div>
          <button
            onClick={() => setShowGuaranteeModal(true)}
            style={{
              padding: '6px 14px',
              borderRadius: '10px',
              border: '1px solid rgba(148,163,184,0.12)',
              background: 'rgba(59,130,246,0.12)',
              color: '#3b82f6',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <Edit size={14} />
            Edit
          </button>
        </div>

        <div
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--theme-secondary)' }} />
            <span style={{ color: '#f8fafc', fontWeight: 600 }}>
              {contactInfo.guarantee.title}
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', paddingLeft: '32px' }}>
            {contactInfo.guarantee.description}
          </p>
        </div>
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
                  value={formData[editingField] || ''}
                  onChange={(e) => setFormData({ [editingField]: e.target.value })}
                  required
                  placeholder={contactFields.find(f => f.key === editingField)?.placeholder}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guarantee Edit Modal */}
      {showGuaranteeModal && (
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
          onClick={() => setShowGuaranteeModal(false)}
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
                  Edit Guarantee
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Update the guarantee text displayed on the contact page
                </p>
              </div>
              <button
                onClick={() => setShowGuaranteeModal(false)}
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

            <form onSubmit={(e) => { e.preventDefault(); handleGuaranteeSave(); }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                  Title *
                </label>
                <input
                  type="text"
                  value={contactInfo.guarantee.title}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    guarantee: { ...contactInfo.guarantee, title: e.target.value }
                  })}
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
                  placeholder="e.g. Bond-Back Guarantee"
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                  Description *
                </label>
                <textarea
                  value={contactInfo.guarantee.description}
                  onChange={(e) => setContactInfo({
                    ...contactInfo,
                    guarantee: { ...contactInfo.guarantee, description: e.target.value }
                  })}
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
                  placeholder="Describe the guarantee..."
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowGuaranteeModal(false)}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}