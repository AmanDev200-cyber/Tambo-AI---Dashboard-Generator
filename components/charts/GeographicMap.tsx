
import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Sphere,
  Graticule,
  ZoomableGroup
} from "react-simple-maps";
import { scaleLinear } from "d3-scale";

// High-fidelity TopoJSON for world countries
const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface GeoPoint {
  name: string;
  lat: number;
  lng: number;
  value: number;
  regionCode?: string; // For choropleth matching (ISO 3-letter code)
}

interface GeographicMapProps {
  title: string;
  data?: GeoPoint[];
  isLoading: boolean;
  onClick?: (label: string, value: any) => void;
  projection?: "geoEqualEarth" | "geoMercator" | "geoAzimuthalEqualArea";
}

const colorScale = scaleLinear<string>()
  .domain([0, 1000])
  .range(["#f8fafc", "#2563eb"]);

const GeographicMap: React.FC<GeographicMapProps> = ({ 
  title, 
  data = [], 
  isLoading, 
  onClick,
  projection = "geoEqualEarth"
}) => {
  const [position, setPosition] = useState({ coordinates: [0, 0] as [number, number], zoom: 1 });

  function handleMoveEnd(position: { coordinates: [number, number]; zoom: number }) {
    setPosition(position);
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-4 z-10">
          <div className="h-4 w-40 shimmer rounded-full"></div>
          <div className="h-8 w-16 shimmer rounded-lg"></div>
        </div>
        <div className="flex-1 bg-slate-50 rounded-2xl flex items-center justify-center relative">
           <div className="w-4/5 h-3/5 shimmer rounded-full opacity-10"></div>
           <div className="absolute top-1/2 left-1/4 w-4 h-4 shimmer rounded-full opacity-50"></div>
           <div className="absolute top-1/3 left-1/2 w-4 h-4 shimmer rounded-full opacity-50"></div>
           <div className="absolute bottom-1/4 right-1/4 w-4 h-4 shimmer rounded-full opacity-50"></div>
        </div>
        <div className="absolute bottom-8 left-10 h-8 w-24 shimmer rounded-full opacity-20"></div>
      </div>
    );
  }

  // Create a map for choropleth lookup if region codes are provided
  const regionDataMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    data.forEach(d => {
      if (d.regionCode) map[d.regionCode] = d.value;
    });
    return map;
  }, [data]);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col group hover:border-blue-400 transition-all overflow-hidden relative">
      <div className="flex items-center justify-between mb-4 z-10">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-600 rounded-full"></div>
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg gap-1 shadow-inner">
            <button 
              onClick={() => setPosition(p => ({ ...p, zoom: p.zoom * 1.5 }))}
              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <i className="fa-solid fa-plus text-[10px]"></i>
            </button>
            <button 
              onClick={() => setPosition(p => ({ ...p, zoom: p.zoom / 1.5 }))}
              className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm text-slate-600 hover:text-blue-600 transition-colors"
            >
              <i className="fa-solid fa-minus text-[10px]"></i>
            </button>
          </div>
          <div className="flex gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
            <span className="w-2 h-2 rounded-full bg-slate-200"></span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
        <ComposableMap
          projection={projection}
          projectionConfig={{
            scale: 160
          }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup
            zoom={position.zoom}
            center={position.coordinates}
            onMoveEnd={handleMoveEnd}
          >
            <Sphere stroke="#E2E8F0" strokeWidth={0.5} fill="transparent" />
            <Graticule stroke="#E2E8F0" strokeWidth={0.3} />
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies && Array.isArray(geographies) ? (
                  geographies.map((geo) => {
                    const countryId = geo.id || geo.properties?.ISO_A3;
                    const value = regionDataMap[countryId];
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={value ? colorScale(value) : "#F8FAFC"}
                        stroke="#CBD5E1"
                        strokeWidth={0.5}
                        onClick={() => onClick?.(geo.properties?.name || countryId, value || 0)}
                        style={{
                          default: { outline: "none", transition: "all 250ms" },
                          hover: { fill: value ? "#1d4ed8" : "#E2E8F0", outline: "none", cursor: "pointer" },
                          pressed: { fill: "#1e3a8a", outline: "none" },
                        }}
                      />
                    );
                  })
                ) : null
              }
            </Geographies>

            {Array.isArray(data) && data.map(({ name, lat, lng, value }, idx) => (
              <Marker 
                key={`${name}-${idx}`} 
                coordinates={[lng, lat]}
                onClick={() => onClick?.(name, value)}
              >
                <g className="cursor-pointer group/marker">
                  <circle
                    r={Math.max(3, (Math.sqrt(Math.abs(value)) / 2 + 2) / position.zoom)}
                    fill="rgba(59, 130, 246, 0.4)"
                    stroke="#2563eb"
                    strokeWidth={1 / position.zoom}
                    className="hover:fill-blue-600 hover:fill-opacity-100 transition-all duration-300"
                  />
                  <text
                    textAnchor="middle"
                    y={-10 / position.zoom}
                    style={{ 
                      fontSize: `${10 / position.zoom}px`, 
                      fontWeight: 'bold', 
                      fill: '#1e293b', 
                      pointerEvents: 'none',
                      textShadow: '0 1px 2px rgba(255,255,255,0.8)'
                    }}
                  >
                    {name}
                  </text>
                  <title>{`${name}: ${value}`}</title>
                </g>
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Legend for Choropleth */}
        {Object.keys(regionDataMap).length > 0 && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200 shadow-xl flex flex-col gap-2 pointer-events-none">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Density Index</span>
            <div className="h-2 w-32 bg-gradient-to-r from-[#f8fafc] to-[#2563eb] rounded-full border border-slate-200"></div>
            <div className="flex justify-between text-[8px] font-bold text-slate-400">
              <span>0</span>
              <span>1000+</span>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="px-3 py-1.5 bg-white/80 backdrop-blur rounded-full border border-slate-200 shadow-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Geospatial Engine Active</span>
            </div>
        </div>

        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-slate-900/10 backdrop-blur rounded-full border border-slate-200 shadow-sm pointer-events-none">
          <i className="fa-solid fa-location-crosshairs text-blue-600 text-[10px]"></i>
          <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
            {projection === 'geoEqualEarth' ? 'Equal Earth Projection' : 'Mercator Projection'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GeographicMap;
