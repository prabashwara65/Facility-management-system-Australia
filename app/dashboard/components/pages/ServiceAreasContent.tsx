'use client';

import { useState } from 'react';
import {
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
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Globe,
} from 'lucide-react';

// Initial data from ServiceAreasSection
const initialSuburbs = [
  { id: 1, name: 'Melbourne CBD', region: 'CBD', status: 'Active' },
  { id: 2, name: 'South Yarra', region: 'South', status: 'Active' },
  { id: 3, name: 'Fitzroy', region: 'North', status: 'Active' },
  { id: 4, name: 'Richmond', region: 'East', status: 'Active' },
  { id: 5, name: 'Carlton', region: 'North', status: 'Active' },
  { id: 6, name: 'Prahran', region: 'South', status: 'Active' },
  { id: 7, name: 'St Kilda', region: 'South', status: 'Active' },
  { id: 8, name: 'Docklands', region: 'CBD', status: 'Active' },
  { id: 9, name: 'Collingwood', region: 'North', status: 'Active' },
  { id: 10, name: 'Brunswick', region: 'North', status: 'Active' },
  { id: 11, name: 'Hawthorn', region: 'East', status: 'Active' },
  { id: 12, name: 'Camberwell', region: 'East', status: 'Active' },
  { id: 13, name: 'Toorak', region: 'South', status: 'Active' },
  { id: 14, name: 'Malvern', region: 'South', status: 'Active' },
  { id: 15, name: 'Armadale', region: 'South', status: 'Active' },
  { id: 16, name: 'Northcote', region: 'North', status: 'Active' },
  { id: 17, name: 'Clifton Hill', region: 'North', status: 'Active' },
  { id: 18, name: 'Albert Park', region: 'South', status: 'Active' },
  { id: 19, name: 'Port Melbourne', region: 'South', status: 'Active' },
  { id: 20, name: 'Windsor', region: 'South', status: 'Active' },
];

const regionOptions = ['CBD', 'North', 'East', 'South', 'West'];
const statusOptions = ['Active', 'Inactive', 'Draft'];

export default function ServiceAreasContent() {
  const [suburbs, setSuburbs] = useState(initialSuburbs);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Filter suburbs
  const filteredSuburbs = suburbs.filter((suburb) => {
    const matchesRegion = selectedRegion === 'All' || suburb.region === selectedRegion;
    const matchesSearch = suburb.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Suburbs', value: suburbs.length, icon: MapPin, color: '#3b82f6' },
    { label: 'Active', value: suburbs.filter((s) => s.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Regions', value: regionOptions.length, icon: Globe, color: '#8b5cf6' },
    { label: 'Inactive', value: suburbs.filter((s) => s.status === 'Inactive').length, icon: XCircle, color: '#ef4444' },
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this suburb?')) {
      setSuburbs(suburbs.filter((s) => s.id !== id));
    }
  };

  const handleSave = (suburbData) => {
    if (editingItem) {
      setSuburbs(suburbs.map((s) => 
        s.id === editingItem.id ? { ...s, ...suburbData } : s
      ));
    } else {
      const newSuburb = {
        ...suburbData,
        id: suburbs.length + 1,
        status: 'Active',
      };
      setSuburbs([...suburbs, newSuburb]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#10b981';
      case 'Inactive': return '#ef4444';
      case 'Draft': return '#f59e0b';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active': return <CheckCircle size={14} />;
      case 'Inactive': return <XCircle size={14} />;
      case 'Draft': return <Clock size={14} />;
      default: return null;
    }
  };

  const getRegionColor = (region) => {
    const colors = {
      CBD: '#3b82f6',
      North: '#10b981',
      East: '#8b5cf6',
      South: '#f59e0b',
      West: '#ef4444',
    };
    return colors[region] || '#94a3b8';
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
              Service Areas Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Melbourne Service Areas
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
            Add Suburb
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
        />
      )}
    </div>
  );
}

// Modal Component
function SuburbModal({ data, onClose, onSave }) {
  const [formData, setFormData] = useState(
    data || {
      name: '',
      region: 'CBD',
      status: 'Active',
    }
  );

  const handleSubmit = (e) => {
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