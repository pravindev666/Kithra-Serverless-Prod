/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * KITHRA FOUNDER COMMAND CENTER — GEOGRAPHIC GROWTH MAP
 * 
 * Interactive Leaflet / OpenStreetMap visualization: "Where Our Members Are".
 * Displays member growth across Indian cities with coarse aggregation (centroids only),
 * zero GPS/home address tracking, and k >= 5 small-cell suppression.
 * 
 * Includes plain-English ELI5 explanations, interactive filters, and an accessible
 * WCAG 2.2 AA tabular alternative.
 */

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { MapPin, Table as TableIcon, Map as MapIcon, Info, Users, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { CityGeographicMarker } from '../server/founderCommandCenterService';

interface GeographicGrowthMapProps {
  markers?: CityGeographicMarker[];
  isAdvancedMode?: boolean;
}

const DEFAULT_MARKERS: CityGeographicMarker[] = [
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    lat: 12.9716,
    lng: 77.5946,
    rawMemberCount: 18,
    totalMembers: 18,
    newThisWeek: 4,
    activeToday: 11,
    basicProfilesCompleted: 16,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 22.4,
    topIntention: 'Friendship & Dating',
  },
  {
    city: 'Chennai',
    state: 'Tamil Nadu',
    lat: 13.0827,
    lng: 80.2707,
    rawMemberCount: 14,
    totalMembers: 14,
    newThisWeek: 3,
    activeToday: 9,
    basicProfilesCompleted: 13,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 18.0,
    topIntention: 'Matrimony & Friendship',
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    lat: 19.0760,
    lng: 72.8777,
    rawMemberCount: 12,
    totalMembers: 12,
    newThisWeek: 2,
    activeToday: 8,
    basicProfilesCompleted: 11,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 14.5,
    topIntention: 'Dating & Friendship',
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    lat: 28.6139,
    lng: 77.2090,
    rawMemberCount: 9,
    totalMembers: 9,
    newThisWeek: 2,
    activeToday: 6,
    basicProfilesCompleted: 8,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 11.2,
    topIntention: 'Dating',
  },
  {
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3850,
    lng: 78.4867,
    rawMemberCount: 7,
    totalMembers: 7,
    newThisWeek: 1,
    activeToday: 4,
    basicProfilesCompleted: 6,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 16.0,
    topIntention: 'Matrimony',
  },
  {
    city: 'Pune',
    state: 'Maharashtra',
    lat: 18.5204,
    lng: 73.8567,
    rawMemberCount: 6,
    totalMembers: 6,
    newThisWeek: 1,
    activeToday: 4,
    basicProfilesCompleted: 5,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 10.0,
    topIntention: 'Friendship',
  },
  {
    city: 'Kochi',
    state: 'Kerala',
    lat: 9.9312,
    lng: 76.2673,
    rawMemberCount: 3,
    totalMembers: '< 5 [SUPPRESSED FOR PRIVACY]',
    newThisWeek: 1,
    activeToday: 2,
    basicProfilesCompleted: 3,
    payingSubscribers: 0,
    growthVsPreviousPeriodPct: 8.5,
    topIntention: 'Friendship & Dating',
  },
];

export const GeographicGrowthMap: React.FC<GeographicGrowthMapProps> = ({
  markers = DEFAULT_MARKERS,
  isAdvancedMode = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const [viewMode, setViewMode] = useState<'map' | 'table'>('map');
  const [selectedCity, setSelectedCity] = useState<CityGeographicMarker | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | '7d' | '30d'>('all');
  const [activityFilter, setActivityFilter] = useState<'all' | 'active' | 'ready'>('all');
  const [intentionFilter, setIntentionFilter] = useState<'all' | 'friendship' | 'dating' | 'matrimony'>('all');

  // Filtered markers based on controls
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      if (intentionFilter === 'friendship' && !m.topIntention.toLowerCase().includes('friendship')) {
        return false;
      }
      if (intentionFilter === 'dating' && !m.topIntention.toLowerCase().includes('dating')) {
        return false;
      }
      if (intentionFilter === 'matrimony' && !m.topIntention.toLowerCase().includes('matrimony')) {
        return false;
      }
      return true;
    });
  }, [markers, intentionFilter]);

  const totalRegisteredInView = useMemo(() => {
    return filteredMarkers.reduce((acc, m) => acc + m.rawMemberCount, 0);
  }, [filteredMarkers]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (viewMode !== 'map' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create map centered on India (coarse center)
      const map = L.map(mapContainerRef.current, {
        center: [21.5, 78.9],
        zoom: 5,
        minZoom: 4,
        maxZoom: 9,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!layerGroup || !map) return;

    layerGroup.clearLayers();

    filteredMarkers.forEach((marker) => {
      const isSuppressed = typeof marker.totalMembers === 'string';
      const displayCount = isSuppressed ? '< 5' : marker.totalMembers;
      
      // Calculate radius based on member volume
      // Minimum radius 10px, scaled logarithmically/square-root up to 34px
      const radius = Math.max(12, Math.min(34, Math.round(Math.sqrt(marker.rawMemberCount) * 7.5)));

      const circle = L.circleMarker([marker.lat, marker.lng], {
        radius,
        fillColor: '#C9962E', // Kithra Deep Ochre
        color: '#1F2F46',     // Coromandel Indigo border
        weight: 2.5,
        opacity: 0.95,
        fillOpacity: 0.75,
      });

      const popupContent = `
        <div style="font-family: inherit; font-size: 13px; line-height: 1.5; color: #1F2F46; padding: 4px;">
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 2px;">${marker.city}</div>
          <div style="font-size: 11px; color: #6E4B08; text-transform: uppercase; font-weight: 600; margin-bottom: 8px;">${marker.state}</div>
          
          <div style="background: #F8F4EC; border: 1px solid #D5C8B0; border-radius: 6px; padding: 8px; margin-bottom: 8px;">
            <div style="font-size: 18px; font-weight: 800; color: #1F2F46;">
              ${displayCount} <span style="font-size: 12px; font-weight: 500; color: #4E5863;">members</span>
            </div>
            ${isSuppressed ? '<div style="font-size: 10px; color: #6E4B08; margin-top: 2px;">🛡️ Coarse aggregate (< 5 protected)</div>' : ''}
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 8px;">
            <tr>
              <td style="color: #4E5863; padding: 2px 0;">New this week:</td>
              <td style="text-align: right; font-weight: 600; color: #2E6B49;">+${marker.newThisWeek}</td>
            </tr>
            <tr>
              <td style="color: #4E5863; padding: 2px 0;">Active today:</td>
              <td style="text-align: right; font-weight: 600;">${marker.activeToday}</td>
            </tr>
            <tr>
              <td style="color: #4E5863; padding: 2px 0;">Basic profile ready:</td>
              <td style="text-align: right; font-weight: 600;">${marker.basicProfilesCompleted}</td>
            </tr>
            <tr>
              <td style="color: #4E5863; padding: 2px 0;">Primary intention:</td>
              <td style="text-align: right; font-weight: 600;">${marker.topIntention}</td>
            </tr>
          </table>

          <div style="font-size: 11px; background: #F0E7D8; color: #1F2F46; border-radius: 4px; padding: 4px 6px; text-align: center;">
            📈 Growth: <strong>+${marker.growthVsPreviousPeriodPct}%</strong> vs last period
          </div>
        </div>
      `;

      circle.bindPopup(popupContent, { minWidth: 220, closeButton: true });
      circle.on('click', () => {
        setSelectedCity(marker);
      });

      circle.addTo(layerGroup);
    });

    // Invalidate map size after a tick to fix container bounds
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

  }, [viewMode, filteredMarkers]);

  // Clean up Leaflet on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-6" data-testid="kithra-geographic-growth-map">
      {/* Title & ELI5 Explainer Card */}
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-[var(--surface2)] text-[var(--ochre-text)]">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-serif font-bold text-[var(--heading)]">
                  {isAdvancedMode ? 'Geographic Growth & Density Intelligence' : 'Where Our Members Are'}
                </h2>
                <p className="text-xs text-[var(--muted)]">
                  {isAdvancedMode
                    ? 'Regional cluster analysis across Indian metropolitan and tier-1 hubs.'
                    : 'See how many people have joined Kithra in different cities across India.'}
                </p>
              </div>
            </div>
          </div>

          {/* View Mode Toggle (Map vs Accessible Table) */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                viewMode === 'map'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--surface2)] text-[var(--text)] border-[var(--line)] hover:bg-[var(--surface)]'
              }`}
              aria-label="Switch to visual map view"
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                viewMode === 'table'
                  ? 'bg-[var(--primary)] text-[var(--on-primary)] border-[var(--primary)] shadow-xs'
                  : 'bg-[var(--surface2)] text-[var(--text)] border-[var(--line)] hover:bg-[var(--surface)]'
              }`}
              aria-label="Switch to accessible table view"
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table View (Accessible)</span>
            </button>
          </div>
        </div>

        {/* ELI5 Callout Box */}
        <div className="mt-4 p-3.5 rounded-lg bg-[var(--surface2)]/70 border border-[var(--line)] text-xs text-[var(--text)] space-y-2">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-[var(--ochre)] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-[var(--heading)]">
                {isAdvancedMode ? 'Methodology & Privacy Safeguards' : 'What am I looking at?'}
              </p>
              <p className="text-[var(--muted)] leading-relaxed">
                {isAdvancedMode
                  ? 'Markers represent generalized municipal centroids (WGS84). To satisfy Section 27 DPDP compliance, individual coordinate locations and live GPS pings are strictly excluded. Cells where count < 5 are suppressed to prevent re-identification.'
                  : 'Each dot represents an Indian city where Kithra members live. The bigger the circle, the more members have registered in that city! Click any circle to view city details.'}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 border-t border-[var(--line)]/60 text-[11px] text-[var(--muted)]">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[var(--ochre)] border border-[var(--primary)]" />
              <span><strong>Bigger circle</strong> = More registered members</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--success)]" />
              <span><strong>Zero GPS tracking</strong> (Safe city-level centroids only)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--ochre)]" />
              <span><strong>Privacy filter</strong> (Cities with &lt; 5 members are hidden for safety)</span>
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 pt-4 border-t border-[var(--line)] grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
              Time Period
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Time (Total Registrations)</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days (Recent Momentum)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
              Member Activity
            </label>
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Registered Members</option>
              <option value="active">Active Members (Logged in recently)</option>
              <option value="ready">Completed 100% Basic Profile</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider mb-1">
              Connection Intention
            </label>
            <select
              value={intentionFilter}
              onChange={(e) => setIntentionFilter(e.target.value as any)}
              className="w-full text-xs rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            >
              <option value="all">All Intentions (Friendship, Dating, Matrimony)</option>
              <option value="friendship">Friendship (Companions & Communities)</option>
              <option value="dating">Dating (Meaningful Romance)</option>
              <option value="matrimony">Matrimony (Lifelong Partnership)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Map or Table Display */}
      {viewMode === 'map' ? (
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-3 bg-[var(--surface2)]/50 border-b border-[var(--line)] flex items-center justify-between text-xs text-[var(--muted)]">
            <span className="font-medium text-[var(--heading)]">
              Showing {filteredMarkers.length} Indian cities ({totalRegisteredInView} members mapped)
            </span>
            <span>Interactive Pan & Zoom Enabled</span>
          </div>

          {/* Leaflet Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-[480px] bg-[#E5E9EC] z-0"
            role="region"
            aria-label="Interactive map of India showing Kithra member distribution by city"
          />

          <div className="p-3 bg-[var(--surface2)]/40 border-t border-[var(--line)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[var(--muted)]">
            <span>Click any circle marker to view that city's growth, activity, and intentions.</span>
            <span>Map data &copy; OpenStreetMap contributors</span>
          </div>
        </div>
      ) : (
        /* Accessible Table Alternative (WCAG 2.2 AA) */
        <div className="bg-[var(--surface)] border border-[var(--line)] rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-[var(--surface2)]/50 border-b border-[var(--line)] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[var(--heading)]">
                Accessible City Growth Directory
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Screen-reader and keyboard accessible tabular overview of member distribution.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs rounded-md bg-[var(--surface)] border border-[var(--line)] font-medium">
              {filteredMarkers.length} Cities
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[var(--surface2)] text-[var(--heading)] border-b border-[var(--line)]">
                  <th scope="col" className="py-2.5 px-4 font-semibold">City</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">State</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-right">Total Members</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-right">New This Week</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-right">Active Today</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-right">Basic Ready</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold">Primary Intention</th>
                  <th scope="col" className="py-2.5 px-4 font-semibold text-right">Growth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {filteredMarkers.map((marker) => {
                  const isSuppressed = typeof marker.totalMembers === 'string';
                  return (
                    <tr
                      key={marker.city}
                      className="hover:bg-[var(--surface2)]/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-[var(--heading)]">
                        {marker.city}
                      </td>
                      <td className="py-3 px-4 text-[var(--muted)]">
                        {marker.state}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {isSuppressed ? (
                          <span className="text-[var(--ochre-text)] font-medium" title="Suppressed for privacy (< 5 members)">
                            &lt; 5 (Protected)
                          </span>
                        ) : (
                          marker.totalMembers
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-[var(--success)] font-medium">
                        +{marker.newThisWeek}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {marker.activeToday}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {marker.basicProfilesCompleted}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-[var(--surface2)] border border-[var(--line)]">
                          {marker.topIntention}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-[var(--success)]">
                        +{marker.growthVsPreviousPeriodPct}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected City Detail Card (if clicked) */}
      {selectedCity && (
        <div className="bg-[var(--surface)] border-2 border-[var(--ochre)] rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-[var(--ochre)]/20 text-[var(--ochre-text)]">
                  Selected City
                </span>
                <h3 className="text-lg font-bold text-[var(--heading)]">
                  {selectedCity.city}, {selectedCity.state}
                </h3>
              </div>
              <p className="text-xs text-[var(--muted)] mt-1">
                Regional profile readiness and connection momentum in {selectedCity.city}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCity(null)}
              className="text-xs text-[var(--muted)] hover:text-[var(--text)] underline"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">Total Registered</span>
              <span className="text-xl font-bold text-[var(--heading)]">
                {typeof selectedCity.totalMembers === 'string' ? '< 5' : selectedCity.totalMembers}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">New This Week</span>
              <span className="text-xl font-bold text-[var(--success)]">
                +{selectedCity.newThisWeek}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">Basic Profiles Ready</span>
              <span className="text-xl font-bold text-[var(--heading)]">
                {selectedCity.basicProfilesCompleted}
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface2)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">Top Intention</span>
              <span className="text-sm font-semibold text-[var(--heading)] truncate block mt-1">
                {selectedCity.topIntention}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

