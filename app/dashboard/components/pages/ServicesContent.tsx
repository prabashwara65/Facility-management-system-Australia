'use client';

import { useState } from 'react';
import { 
  Home, 
  Sparkles, 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  MoreHorizontal,
  ArrowUpRight,
  Package,
  DollarSign,
  Clock,
  Users
} from 'lucide-react';

// Initial service data
const initialServices = [
  {
    id: 1,
    icon: 'Home',
    title: 'End of Lease Clean',
    price: '$280',
    description: 'Bond-back guarantee with our comprehensive end-of-tenancy deep clean. We cover every corner.',
    category: 'Deep Clean',
    duration: '4-6 hours',
    popular: true,
    status: 'Active',
    bookings: 156,
    rating: 4.9,
  },
  {
    id: 2,
    icon: 'Sparkles',
    title: 'Deep / Spring Clean',
    price: '$199',
    description: 'A thorough top-to-bottom reset — inside appliances, behind furniture, skirting boards, and more.',
    category: 'Deep Clean',
    duration: '3-5 hours',
    popular: false,
    status: 'Active',
    bookings: 98,
    rating: 4.8,
  },
  {
    id: 3,
    icon: 'Calendar',
    title: 'Regular Clean',
    price: '$99',
    description: 'Weekly or fortnightly maintenance cleans tailored to your home and schedule.',
    category: 'Maintenance',
    duration: '2-3 hours',
    popular: true,
    status: 'Active',
    bookings: 234,
    rating: 4.7,
  },
];

const categories = ['All', 'Deep Clean', 'Maintenance', 'Specialized'];
const iconMap = {
  Home: Home,
  Sparkles: Sparkles,
  Calendar: Calendar,
};

export default function ServicesContent() {
  const [services, setServices] = useState(initialServices);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesCategory = selectedCategory === 'All' || service.category === selectedCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Services', value: services.length, icon: Package, color: '#3b82f6' },
    { label: 'Active Services', value: services.filter(s => s.status === 'Active').length, icon: Sparkles, color: '#10b981' },
    { label: 'Total Bookings', value: services.reduce((sum, s) => sum + s.bookings, 0), icon: Users, color: '#8b5cf6' },
    { label: 'Avg. Rating', value: '4.8', icon: Calendar, color: '#f59e0b' },
  ];

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setShowAddModal(true);
  };

  const handleSave = (serviceData: any) => {
    if (editingService) {
      // Edit existing
      setServices(services.map(s => 
        s.id === editingService.id ? { ...s, ...serviceData } : s
      ));
    } else {
      // Add new
      const newService = {
        ...serviceData,
        id: services.length + 1,
        bookings: 0,
        rating: 0,
        status: 'Active',
      };
      setServices([...services, newService]);
    }
    setShowAddModal(false);
    setEditingService(null);
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
              Service Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Our Services
            </h2>
          </div>
          <button
            onClick={() => {
              setEditingService(null);
              setShowAddModal(true);
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
            Add Service
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

      {/* Filters */}
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
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: selectedCategory === category ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: selectedCategory === category ? '#3b82f6' : '#94a3b8',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: selectedCategory === category ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search services..."
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
          <button
            style={{
              padding: '6px 14px',
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
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredServices.map((service) => {
          const Icon = iconMap[service.icon as keyof typeof iconMap] || Home;
          
          return (
            <div
              key={service.id}
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
              {/* Popular Badge */}
              {service.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Popular
                </div>
              )}

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
                  <h3 style={{ color: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }}>
                    {service.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      {service.category}
                    </span>
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                      • {service.duration}
                    </span>
                  </div>
                </div>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '12px' }}>
                {service.description}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                <div>
                  <span style={{ color: '#3b82f6', fontSize: '1.3rem', fontWeight: 700 }}>
                    {service.price}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>
                      ★ {service.rating}
                    </span>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      • {service.bookings} bookings
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => handleEdit(service)}
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
                    onClick={() => handleDelete(service.id)}
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

      {/* Add/Edit Modal */}
      {showAddModal && (
        <ServiceModal
          service={editingService}
          onClose={() => {
            setShowAddModal(false);
            setEditingService(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Service Modal Component
function ServiceModal({ service, onClose, onSave }: any) {
  const [formData, setFormData] = useState(
    service || {
      title: '',
      price: '',
      description: '',
      category: 'Deep Clean',
      duration: '2-3 hours',
      icon: 'Home',
      popular: false,
    }
  );

  const iconOptions = ['Home', 'Sparkles', 'Calendar'];

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
        <h3 style={{ color: '#f8fafc', fontSize: '1.3rem', fontWeight: 700, marginBottom: '8px' }}>
          {service ? 'Edit Service' : 'Add New Service'}
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '24px' }}>
          {service ? 'Update the service details below' : 'Fill in the details to create a new service'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Service Title *
            </label>
            <input
              type="text"
              value={formData.title}
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
              placeholder="Enter service title"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Price *
              </label>
              <input
                type="text"
                value={formData.price}
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
                Duration
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
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
                placeholder="e.g. 2-3 hours"
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Description *
            </label>
            <textarea
              value={formData.description}
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
              placeholder="Describe the service..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                value={formData.category}
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
                <option value="Deep Clean">Deep Clean</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Specialized">Specialized</option>
              </select>
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
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
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
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
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
              }}
            >
              {service ? 'Update Service' : 'Create Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}