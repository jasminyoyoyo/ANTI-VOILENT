
import React, { useEffect, useRef } from 'react';
import { UserLocation, GroundingSource } from '../types';

interface ResourceMapProps {
  userLocation: UserLocation | null;
  resources: GroundingSource[];
}

const ResourceMap: React.FC<ResourceMapProps> = ({ userLocation, resources }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersLayer = useRef<any>(null);

  useEffect(() => {
    // Fix: Access global Leaflet 'L' by casting window to any to avoid TypeScript property errors
    const L = (window as any).L;
    if (!mapRef.current || !L) return;

    // Initialize map if not exists
    if (!leafletMap.current) {
      const initialLat = userLocation?.latitude || 39.9042; // Beijing default if no loc
      const initialLng = userLocation?.longitude || 116.4074;
      
      // Use L from the local reference
      leafletMap.current = L.map(mapRef.current).setView([initialLat, initialLng], 13);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(leafletMap.current);

      markersLayer.current = L.layerGroup().addTo(leafletMap.current);
    }

    // Update markers
    if (markersLayer.current) {
      markersLayer.current.clearLayers();

      // User location marker
      if (userLocation) {
        L.circleMarker([userLocation.latitude, userLocation.longitude], {
          radius: 8,
          fillColor: "#3b82f6",
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(markersLayer.current).bindPopup("Your Location");
      }

      // Resource markers
      resources.forEach(res => {
        if (res.latitude && res.longitude) {
          const color = res.type === 'police' ? '#ef4444' : '#8b5cf6';
          L.marker([res.latitude, res.longitude], {
            icon: L.divIcon({
              className: 'custom-div-icon',
              html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            })
          }).addTo(markersLayer.current)
            .bindPopup(`
              <div class="p-1">
                <h4 class="font-bold text-sm">${res.title}</h4>
                <a href="${res.uri}" target="_blank" class="text-xs text-blue-600 underline">Open in Maps</a>
              </div>
            `);
        }
      });
      
      // Auto-zoom to fit markers
      if (resources.some(r => r.latitude)) {
         const bounds = resources
           .filter(r => r.latitude && r.longitude)
           .map(r => [r.latitude, r.longitude]);
         if (userLocation) bounds.push([userLocation.latitude, userLocation.longitude]);
         leafletMap.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      // Cleanup not strictly necessary here as we keep the ref
    };
  }, [userLocation, resources]);

  return (
    <div className="w-full h-72 rounded-xl border border-slate-200 shadow-inner overflow-hidden relative">
      <div ref={mapRef} className="w-full h-full" />
      {!userLocation && (
        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center z-[1000] pointer-events-none">
          <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-slate-600 shadow-sm">
            Enable GPS for precise map results
          </span>
        </div>
      )}
    </div>
  );
};

export default ResourceMap;
