'use client';

import {
  ArrowUpRight,
  FileText,
  MoreHorizontal,
  Plus,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Database,
  Download,
  Link2,
  DollarSign,
  Home,
  Building,
  Users,
  Star,
} from 'lucide-react';
import { useState } from 'react';
import PricingSection from '../components/pages/PricingSection';

export default function HomeContent() {
  const [showPricingPreview, setShowPricingPreview] = useState(false);

  const statCards = [
    { label: 'Storage used', value: '4.8 TB', delta: '+12.4%', tone: '#8b5cf6' },
    { label: 'Active files', value: '18.6K', delta: '+2.1%', tone: '#3b82f6' },
    { label: 'Shared folders', value: '326', delta: '+18.7%', tone: '#10b981' },
    { label: 'Sync status', value: '97%', delta: '+0.8%', tone: '#f59e0b' },
  ];

  const recentFiles = [
    { name: 'Marketing plan.pdf', size: '2.4 MB', type: 'PDF', status: 'Ready' },
    { name: 'Brand kit.fig', size: '16.8 MB', type: 'FIG', status: 'Review' },
    { name: 'Campaign assets.zip', size: '48.2 MB', type: 'ZIP', status: 'Syncing' },
    { name: 'Q2 dashboard.xlsx', size: '1.1 MB', type: 'XLSX', status: 'Ready' },
  ];

  const usageBars = [58, 76, 54, 82, 69, 92, 64];

  const quickActions = [
    { icon: Database, label: 'Auto backup', detail: 'Every 6 hours', color: '#8b5cf6' },
    { icon: Download, label: 'Download queue', detail: '12 files', color: '#3b82f6' },
    { icon: Link2, label: 'Shared links', detail: '7 active', color: '#10b981' },
    { icon: DollarSign, label: 'Pricing', detail: 'View pricing plans', color: '#f59e0b' },
  ];

  const serviceStats = [
    { label: 'Total Services', value: '6', icon: Home, color: '#3b82f6' },
    { label: 'Residential', value: '3', icon: Home, color: '#10b981' },
    { label: 'Commercial', value: '3', icon: Building, color: '#8b5cf6' },
    { label: 'Avg. Rating', value: '4.8', icon: Star, color: '#f59e0b' },
  ];

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      {/* Overview Section */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(30,41,59,0.92), rgba(17,24,39,0.95))',
          border: '1px solid rgba(148,163,184,0.12)',
          borderRadius: '30px',
          padding: '24px 24px 20px',
          boxShadow: '0 20px 55px rgba(2, 6, 23, 0.35)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px',
          }}
        >
          <div>
            <div
              style={{
                color: '#94a3b8',
                fontSize: '0.76rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
              }}
            >
              Overview
            </div>
            <h1
              style={{
                margin: '8px 0 0',
                fontSize: 'clamp(2rem, 3vw, 3rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.07em',
                color: '#f8fafc',
              }}
            >
              Good morning
            </h1>
          </div>
          <button
            onClick={() => setShowPricingPreview(!showPricingPreview)}
            style={{
              border: '1px solid rgba(148,163,184,0.18)',
              background: 'rgba(59,130,246,0.12)',
              color: '#dbeafe',
              borderRadius: '12px',
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
          >
            <DollarSign size={15} />
            {showPricingPreview ? 'Hide Pricing' : 'View Pricing'}
          </button>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '16px' }}>
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: 'rgba(15, 23, 42, 0.72)',
                border: '1px solid rgba(148,163,184,0.12)',
                borderRadius: '20px',
                padding: '18px 16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.12)')}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {card.label}
                </div>
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: card.tone,
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: '14px',
                  fontSize: '2rem',
                  fontWeight: 800,
                  letterSpacing: '-0.06em',
                  color: '#f8fafc',
                }}
              >
                {card.value}
              </div>
              <div
                style={{
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#86efac',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                }}
              >
                <ArrowUpRight size={14} />
                {card.delta}
              </div>
            </div>
          ))}
        </div>

        {/* Service Stats Mini Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '16px' }}>
          {serviceStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(148,163,184,0.08)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: `${stat.color}22`,
                    color: stat.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '0.7rem' }}>{stat.label}</div>
                  <div style={{ color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>{stat.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Section Preview */}
      {showPricingPreview && (
        <div
          style={{
            borderRadius: '30px',
            overflow: 'hidden',
            border: '1px solid rgba(148,163,184,0.12)',
            background: 'rgba(15, 23, 42, 0.82)',
          }}
        >
          <PricingSection />
        </div>
      )}

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '20px' }}>
        {/* Left Column - Storage Overview */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(148,163,184,0.12)',
            borderRadius: '30px',
            padding: '24px',
            boxShadow: '0 20px 50px rgba(2, 6, 23, 0.28)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}
          >
            <div>
              <div
                style={{
                  color: '#94a3b8',
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                Recent files
              </div>
              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: '1.5rem',
                  letterSpacing: '-0.05em',
                  color: '#f8fafc',
                }}
              >
                Storage overview
              </h2>
            </div>
            <button
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(59,130,246,0.12)',
                color: '#dbeafe',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(59,130,246,0.12)')}
            >
              <Plus size={15} />
              New file
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
            {/* File List */}
            <div>
              <div style={{ display: 'grid', gap: '12px' }}>
                {recentFiles.map((file) => (
                  <div
                    key={file.name}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.2fr 0.7fr 0.6fr 0.7fr',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '16px',
                      background: 'rgba(15, 23, 42, 0.72)',
                      border: '1px solid rgba(148,163,184,0.08)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e2e8f0' }}>
                      <div
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(96,165,250,0.14)',
                          color: '#93c5fd',
                        }}
                      >
                        <FileText size={16} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{file.name}</div>
                      </div>
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{file.size}</div>
                    <div style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>{file.type}</div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.85rem',
                          color:
                            file.status === 'Syncing'
                              ? '#fbbf24'
                              : file.status === 'Review'
                              ? '#a78bfa'
                              : '#86efac',
                        }}
                      >
                        {file.status}
                      </span>
                      <button
                        style={{
                          border: 'none',
                          background: 'transparent',
                          color: '#94a3b8',
                          cursor: 'pointer',
                        }}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Storage Chart */}
            <div
              style={{
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.96))',
                border: '1px solid rgba(148,163,184,0.1)',
                borderRadius: '24px',
                padding: '20px 18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '18px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#94a3b8',
                  }}
                >
                  Storage
                </div>
                <button
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#cbd5e1',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Donut Chart */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div
                  style={{
                    width: '180px',
                    height: '180px',
                    borderRadius: '50%',
                    position: 'relative',
                    display: 'grid',
                    placeItems: 'center',
                    background: 'conic-gradient(#8b5cf6 0 68%, rgba(148,163,184,0.15) 68% 100%)',
                  }}
                >
                  <div
                    style={{
                      width: '122px',
                      height: '122px',
                      borderRadius: '50%',
                      background: '#0f172a',
                      border: '1px solid rgba(148,163,184,0.12)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f8fafc',
                    }}
                  >
                    <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.06em' }}>
                      68%
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      used
                    </div>
                  </div>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div style={{ display: 'grid', gap: '10px' }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Documents</span>
                  <span>2.3 TB</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '999px',
                    background: 'rgba(148,163,184,0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '64%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #8b5cf6, #60a5fa)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#e2e8f0',
                    fontSize: '0.9rem',
                  }}
                >
                  <span>Backups</span>
                  <span>1.5 TB</span>
                </div>
                <div
                  style={{
                    height: '8px',
                    borderRadius: '999px',
                    background: 'rgba(148,163,184,0.12)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: '48%',
                      height: '100%',
                      background: 'linear-gradient(90deg, #10b981, #34d399)',
                      borderRadius: '999px',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Activity / Traffic Chart */}
          <div
            style={{
              background: 'linear-gradient(180deg, rgba(15,23,42,0.82), rgba(20,31,53,0.98))',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Activity
                </div>
                <h2
                  style={{
                    margin: '8px 0 0',
                    fontSize: '1.5rem',
                    letterSpacing: '-0.05em',
                    color: '#f8fafc',
                  }}
                >
                  Traffic
                </h2>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#86efac',
                  fontWeight: 700,
                }}
              >
                <TrendingUp size={15} />
                +24%
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                gap: '10px',
                height: '180px',
                marginTop: '18px',
              }}
            >
              {usageBars.map((bar, index) => (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '22px',
                      height: `${bar}%`,
                      minHeight: '24px',
                      borderRadius: '12px 12px 6px 6px',
                      background:
                        index === usageBars.length - 1
                          ? 'linear-gradient(180deg, #60a5fa, #8b5cf6)'
                          : 'linear-gradient(180deg, rgba(96,165,250,0.7), rgba(59,130,246,0.3))',
                      boxShadow: '0 8px 18px rgba(96, 165, 250, 0.25)',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              background: 'rgba(15, 23, 42, 0.82)',
              border: '1px solid rgba(148,163,184,0.12)',
              borderRadius: '30px',
              padding: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <div>
                <div
                  style={{
                    color: '#94a3b8',
                    fontSize: '0.72rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Quick actions
                </div>
                <h2
                  style={{
                    margin: '8px 0 0',
                    fontSize: '1.5rem',
                    letterSpacing: '-0.05em',
                    color: '#f8fafc',
                  }}
                >
                  Uploads
                </h2>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'rgba(15, 23, 42, 0.72)',
                      border: '1px solid rgba(148,163,184,0.08)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)')}
                  >
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        background: `${action.color}22`,
                        color: action.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: '#f8fafc', fontWeight: 700 }}>{action.label}</div>
                      <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '2px' }}>
                        {action.detail}
                      </div>
                    </div>
                    <ArrowUpRight size={16} color="#94a3b8" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}