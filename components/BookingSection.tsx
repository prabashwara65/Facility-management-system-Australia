'use client';

import { useState } from 'react';
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Package,
  ChevronDown,
  ChevronUp,
  X,
  Save,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
  Printer,
} from 'lucide-react';

// Initial booking data
const initialBookings = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    phone: '0412 345 678',
    email: 'sarah@email.com',
    serviceType: 'End of Lease / Bond Clean',
    bedrooms: 2,
    bathrooms: 1,
    address: '45 Collins Street',
    suburb: 'South Yarra',
    preferredDate: '2026-12-15',
    specialInstructions: 'Please focus extra time on oven and bathrooms.',
    status: 'Pending',
    createdAt: '2026-12-10T10:30:00',
    totalPrice: 319,
  },
  {
    id: 2,
    firstName: 'James',
    lastName: 'Wilson',
    phone: '0415 987 654',
    email: 'james@email.com',
    serviceType: 'Deep Clean',
    bedrooms: 3,
    bathrooms: 2,
    address: '12 Brunswick Street',
    suburb: 'Fitzroy',
    preferredDate: '2026-12-18',
    specialInstructions: '',
    status: 'Confirmed',
    createdAt: '2026-12-11T14:20:00',
    totalPrice: 249,
  },
  {
    id: 3,
    firstName: 'Priya',
    lastName: 'Kumar',
    phone: '0432 456 789',
    email: 'priya@email.com',
    serviceType: 'Regular Clean',
    bedrooms: 2,
    bathrooms: 1,
    address: '78 Chapel Street',
    suburb: 'Prahran',
    preferredDate: '2026-12-20',
    specialInstructions: 'Weekly clean, every Friday',
    status: 'Completed',
    createdAt: '2026-12-12T09:15:00',
    totalPrice: 99,
  },
  {
    id: 4,
    firstName: 'Tom',
    lastName: 'Lee',
    phone: '0423 789 123',
    email: 'tom@email.com',
    serviceType: 'End of Lease / Bond Clean',
    bedrooms: 4,
    bathrooms: 2,
    address: '23 Victoria Street',
    suburb: 'Carlton',
    preferredDate: '2026-12-22',
    specialInstructions: 'Need extra cleaning for carpet stains',
    status: 'Pending',
    createdAt: '2026-12-13T16:45:00',
    totalPrice: 319,
  },
  {
    id: 5,
    firstName: 'Emma',
    lastName: 'Davis',
    phone: '0444 567 890',
    email: 'emma@email.com',
    serviceType: 'Deep Clean',
    bedrooms: 3,
    bathrooms: 2,
    address: '56 High Street',
    suburb: 'Northcote',
    preferredDate: '2026-12-25',
    specialInstructions: 'Please bring eco-friendly products',
    status: 'Cancelled',
    createdAt: '2026-12-14T11:30:00',
    totalPrice: 249,
  },
];

const serviceTypeOptions = ['All', 'End of Lease / Bond Clean', 'Regular Clean', 'Deep Clean'];
const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function BookingsContent() {
  const [bookings, setBookings] = useState(initialBookings);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState([]);

  // Filter bookings
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus = selectedStatus === 'All' || booking.status === selectedStatus;
    const matchesServiceType = selectedServiceType === 'All' || booking.serviceType === selectedServiceType;
    const matchesSearch = 
      booking.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.phone.includes(searchQuery) ||
      booking.suburb.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesServiceType && matchesSearch;
  });

  // Stats
  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: Calendar, color: '#3b82f6' },
    { label: 'Pending', value: bookings.filter((b) => b.status === 'Pending').length, icon: ClockIcon, color: '#f59e0b' },
    { label: 'Confirmed', value: bookings.filter((b) => b.status === 'Confirmed').length, icon: CheckCircle, color: '#10b981' },
    { label: 'Completed', value: bookings.filter((b) => b.status === 'Completed').length, icon: CheckCircle, color: '#8b5cf6' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#f59e0b';
      case 'Confirmed': return '#10b981';
      case 'Completed': return '#8b5cf6';
      case 'Cancelled': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return <ClockIcon size={14} />;
      case 'Confirmed': return <CheckCircle size={14} />;
      case 'Completed': return <CheckCircle size={14} />;
      case 'Cancelled': return <XCircle size={14} />;
      default: return null;
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'Pending': return 'rgba(245,158,11,0.15)';
      case 'Confirmed': return 'rgba(16,185,129,0.15)';
      case 'Completed': return 'rgba(139,92,246,0.15)';
      case 'Cancelled': return 'rgba(239,68,68,0.15)';
      default: return 'rgba(148,163,184,0.15)';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-AU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setBookings(bookings.map((b) => 
      b.id === id ? { ...b, status: newStatus } : b
    ));
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
              Bookings Management
            </div>
            <h2 style={{ margin: '8px 0 0', fontSize: '1.5rem', letterSpacing: '-0.05em', color: '#f8fafc' }}>
              All Bookings
            </h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
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
              <Download size={16} />
              Export
            </button>
            <button
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
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
              <Printer size={16} />
              Print
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

      {/* Filters */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '20px',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              style={{
                padding: '6px 14px',
                borderRadius: '10px',
                border: '1px solid rgba(148,163,184,0.12)',
                background: 'rgba(15, 23, 42, 0.72)',
                color: '#cbd5e1',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {serviceTypeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', top: '50%', left: '12px', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search bookings..."
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
        </div>
      </div>

      {/* Bookings Grid/List */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
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
              {/* Status Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  color: getStatusColor(booking.status),
                  background: getStatusBg(booking.status),
                }}
              >
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>

              {/* Customer Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    flexShrink: 0,
                  }}
                >
                  {booking.firstName[0]}{booking.lastName[0]}
                </div>
                <div>
                  <div style={{ color: '#f8fafc', fontWeight: 600, fontSize: '1rem' }}>
                    {booking.firstName} {booking.lastName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <Phone size={12} style={{ color: '#64748b' }} />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{booking.phone}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={12} style={{ color: '#64748b' }} />
                    <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{booking.email}</span>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Service
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 500 }}>
                    {booking.serviceType}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Price
                  </div>
                  <div style={{ color: '#3b82f6', fontSize: '1rem', fontWeight: 700 }}>
                    ${booking.totalPrice}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Rooms
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                    {booking.bedrooms} BR, {booking.bathrooms} BA
                  </div>
                </div>
                <div>
                  <div style={{ color: '#64748b', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Date
                  </div>
                  <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>
                    {formatDate(booking.preferredDate)}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(15, 23, 42, 0.5)', marginBottom: '12px' }}>
                <MapPin size={14} style={{ color: '#64748b' }} />
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
                  {booking.address}, {booking.suburb}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid rgba(148,163,184,0.08)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                  Created: {formatDateTime(booking.createdAt)}
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '8px',
                      border: '1px solid rgba(148,163,184,0.12)',
                      background: 'rgba(15, 23, 42, 0.72)',
                      color: '#cbd5e1',
                      fontSize: '0.75rem',
                      outline: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {statusOptions.filter(s => s !== 'All').map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    style={{
                      padding: '4px 8px',
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
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
            overflow: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.08)' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Customer
                </th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Service
                </th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Date
                </th>
                <th style={{ textAlign: 'left', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Status
                </th>
                <th style={{ textAlign: 'right', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Price
                </th>
                <th style={{ textAlign: 'center', padding: '10px 12px', color: '#94a3b8', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking.id} style={{ borderBottom: '1px solid rgba(148,163,184,0.05)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #7c3aed, #3b82f6)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                        }}
                      >
                        {booking.firstName[0]}{booking.lastName[0]}
                      </div>
                      <div>
                        <div style={{ color: '#f8fafc', fontWeight: 500 }}>
                          {booking.firstName} {booking.lastName}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                          {booking.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>
                    {booking.serviceType}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {booking.bedrooms} BR, {booking.bathrooms} BA
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', color: '#e2e8f0' }}>
                    {formatDate(booking.preferredDate)}
                    <div style={{ color: '#64748b', fontSize: '0.75rem' }}>
                      {booking.suburb}
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: getStatusColor(booking.status),
                        background: getStatusBg(booking.status),
                      }}
                    >
                      {getStatusIcon(booking.status)}
                      {booking.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#3b82f6', fontWeight: 700 }}>
                    ${booking.totalPrice}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid rgba(148,163,184,0.12)',
                          background: 'rgba(15, 23, 42, 0.72)',
                          color: '#cbd5e1',
                          fontSize: '0.7rem',
                          outline: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {statusOptions.filter(s => s !== 'All').map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(booking.id)}
                        style={{
                          padding: '2px 6px',
                          borderRadius: '6px',
                          border: 'none',
                          background: 'transparent',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#ef4444')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredBookings.length === 0 && (
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ color: '#64748b' }}>No bookings found matching your filters.</p>
        </div>
      )}
    </div>
  );
}