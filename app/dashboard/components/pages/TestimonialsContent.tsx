'use client';

import { useState } from 'react';
import {
  Star,
  Check,
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
  User,
  MapPin,
  Quote,
} from 'lucide-react';

// Initial data from TestimonialsSection
const initialTestimonials = [
  {
    id: 1,
    quote: '"Absolutely spotless. Our property manager was blown away — we got our full bond back the same day. Will be using SparkWell for our new place too."',
    name: 'Sarah M.',
    location: 'South Yarra',
    rating: 5,
    verified: true,
    status: 'Active',
    order: 1,
  },
  {
    id: 2,
    quote: '"Booked a spring clean before hosting a dinner party. The team arrived on time, were incredibly thorough, and even folded the toilet paper — a lovely touch."',
    name: 'James R.',
    location: 'Fitzroy',
    rating: 5,
    verified: true,
    status: 'Active',
    order: 2,
  },
  {
    id: 3,
    quote: '"I\'ve tried three other cleaning companies this year. SparkWell is a cut above — professional, responsive, and genuinely good at what they do."',
    name: 'Priya K.',
    location: 'Richmond',
    rating: 5,
    verified: true,
    status: 'Active',
    order: 3,
  },
  {
    id: 4,
    quote: '"Regular fortnightly cleans since March. The same team every time, they know our home, and it\'s always immaculate. Can\'t recommend enough."',
    name: 'Tom & Wei L.',
    location: 'Carlton',
    rating: 5,
    verified: true,
    status: 'Active',
    order: 4,
  },
];

const statusOptions = ['Active', 'Inactive', 'Draft'];

export default function TestimonialsContent() {
  const [testimonials, setTestimonials] = useState(initialTestimonials);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedItems, setExpandedItems] = useState([]);

  // Filter testimonials
  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         testimonial.quote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Testimonials', value: testimonials.length, icon: Package, color: '#3b82f6' },
    { label: 'Active', value: testimonials.filter((t) => t.status === 'Active').length, icon: CheckCircle, color: '#10b981' },
    { label: '5-Star Reviews', value: testimonials.filter((t) => t.rating === 5).length, icon: Star, color: '#f59e0b' },
    { label: 'Verified', value: testimonials.filter((t) => t.verified).length, icon: Check, color: '#8b5cf6' },
  ];

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
    }
  };

  const handleSave = (testimonialData) => {
    if (editingItem) {
      setTestimonials(testimonials.map((t) => 
        t.id === editingItem.id ? { ...t, ...testimonialData } : t
      ));
    } else {
      const newTestimonial = {
        ...testimonialData,
        id: testimonials.length + 1,
        order: testimonials.length + 1,
        status: 'Active',
        verified: true,
        rating: 5,
      };
      setTestimonials([...testimonials, newTestimonial]);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
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

  const renderStars = (rating) => {
    return (
      <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill={i < rating ? '#f59e0b' : 'none'} />
        ))}
      </div>
    );
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
              Testimonials Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              Customer Testimonials
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
            Add Testimonial
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
              placeholder="Search testimonials..."
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

      {/* Testimonials Grid/List */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
          {filteredTestimonials.map((testimonial) => {
            const isExpanded = expandedItems.includes(testimonial.id);

            return (
              <div
                key={testimonial.id}
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
                {/* Rating Stars */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                  <div style={{ color: '#f59e0b', display: 'flex', gap: '2px' }}>
                    {renderStars(testimonial.rating)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: getStatusColor(testimonial.status) }}>
                      {getStatusIcon(testimonial.status)}
                      {testimonial.status}
                    </span>
                    {testimonial.verified && (
                      <span style={{ fontSize: '0.6rem', padding: '2px 8px', borderRadius: '10px', background: 'rgba(16,185,129,0.2)', color: '#10b981', fontWeight: 600 }}>
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Quote */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <Quote size={20} style={{ color: 'rgba(59,130,246,0.2)', position: 'absolute', top: '-4px', left: '-4px' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6', paddingLeft: '20px' }}>
                    {testimonial.quote}
                  </p>
                </div>

                {/* Author */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(59,130,246,0.12)',
                          color: '#3b82f6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <User size={16} />
                      </div>
                      <div>
                        <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '0.9rem' }}>
                          {testimonial.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b', fontSize: '0.75rem' }}>
                          <MapPin size={12} />
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => { setEditingItem(testimonial); setShowModal(true); }}
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
                      onClick={() => handleDelete(testimonial.id)}
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
            {filteredTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
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
                <div style={{ color: '#f59e0b', display: 'flex', gap: '2px' }}>
                  {renderStars(testimonial.rating)}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#f8fafc', fontWeight: 500 }}>{testimonial.name}</span>
                    <span style={{ color: '#64748b', fontSize: '0.8rem' }}>• {testimonial.location}</span>
                    {testimonial.verified && (
                      <span style={{ fontSize: '0.6rem', padding: '1px 8px', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>
                        ✓
                      </span>
                    )}
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.65rem', color: getStatusColor(testimonial.status) }}>
                      {getStatusIcon(testimonial.status)}
                      {testimonial.status}
                    </span>
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px', maxWidth: '500px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {testimonial.quote}
                  </p>
                </div>

                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  #{testimonial.id}
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    onClick={() => { setEditingItem(testimonial); setShowModal(true); }}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredTestimonials.length === 0 && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#64748b' }}>No testimonials found. Click "Add Testimonial" to create one.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <TestimonialModal
          data={editingItem}
          onClose={() => { setShowModal(false); setEditingItem(null); }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Modal Component
function TestimonialModal({ data, onClose, onSave }) {
  const [formData, setFormData] = useState(
    data || {
      name: '',
      location: '',
      quote: '',
      rating: 5,
      status: 'Active',
      verified: true,
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
              {data ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
              {data ? 'Update the testimonial details below' : 'Fill in the details to create a new testimonial'}
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Customer Name *
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
                placeholder="e.g. Sarah M."
              />
            </div>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Location *
              </label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                placeholder="e.g. South Yarra"
              />
            </div>
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
              Testimonial Quote *
            </label>
            <textarea
              value={formData.quote || ''}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
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
              placeholder="Enter the testimonial quote..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>
                Rating
              </label>
              <select
                value={formData.rating || 5}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
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
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ color: '#94a3b8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={formData.verified || false}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: '#3b82f6',
                  cursor: 'pointer',
                }}
              />
              Verified Customer
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