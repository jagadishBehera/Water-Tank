import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

const EfFlowStation = () => {
  const [flow, setFlow] = useState(12.45);
  const [totalVol, setTotalVol] = useState(0);
  const [shiftVol, setShiftVol] = useState(0);
  const [shiftSecs, setShiftSecs] = useState(0);
  const [trendData, setTrendData] = useState([]);
  const [rotorAngle, setRotorAngle] = useState(0);
  const [active, setActive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const rotorAnimationRef = useRef(null);
  
  const padNum = useCallback((n, len = 6) => {
    const parts = n.toFixed(1).split('.');
    const intPart = parts[0].padStart(len, '0');
    return intPart + '.' + parts[1];
  }, []);
  
  const getStatus = useCallback((flowVal, isActive) => {
    if (!isActive) return ['STANDBY', 'warning'];
    if (flowVal > 17.2) return ['HH ALARM', 'danger'];
    if (flowVal > 15.5) return ['HIGH', 'warning'];
    return ['NORMAL', 'success'];
  }, []);
  
  const updateSparkline = useCallback((data) => {
    if (data.length < 2) return { linePath: '', fillPath: '', minV: 0, maxV: 0 };
    const W = 600, H = 60, pad = 4;
    const maxV = Math.max(...data.map(d => d.v), 0.1);
    const minV = Math.min(...data.map(d => d.v));
    const range = maxV - minV || 1;
    const pts = data.map((d, i) => {
      const x = (i / (data.length - 1)) * W;
      const y = H - pad - ((d.v - minV) / range) * (H - pad * 2);
      return [x.toFixed(1), y.toFixed(1)];
    });
    const linePath = 'M ' + pts.map(p => p.join(',')).join(' L ');
    const fillPath = linePath + ` L ${pts[pts.length-1][0]},${H} L 0,${H} Z`;
    return { linePath, fillPath, minV, maxV };
  }, []);
  
  useEffect(() => {
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const isActive = Math.sin(tick * 0.04) > -0.2;
      setActive(isActive);
      
      const newFlow = isActive
        ? Math.max(0, 12.45 + Math.sin(tick * 0.07) * 3.2 + (Math.random() - 0.5) * 0.8)
        : 0;
      
      setFlow(newFlow);
      
      const dt = 1;
      if (isActive) {
        setTotalVol(prev => prev + newFlow / 3600 * dt);
        setShiftVol(prev => prev + newFlow / 3600 * dt);
      }
      setShiftSecs(prev => prev + dt);
      
      setTrendData(prev => {
        const newData = [...prev, { v: newFlow }];
        if (newData.length > 60) newData.shift();
        return newData;
      });
      
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const animateRotor = () => {
      const flowRate = flow;
      const speed = flowRate > 0 ? (flowRate / 15) * 4 : 0.3;
      setRotorAngle(prev => (prev + speed) % 360);
      rotorAnimationRef.current = requestAnimationFrame(animateRotor);
    };
    
    rotorAnimationRef.current = requestAnimationFrame(animateRotor);
    return () => {
      if (rotorAnimationRef.current) {
        cancelAnimationFrame(rotorAnimationRef.current);
      }
    };
  }, [flow]);
  
  const pct = Math.min(100, (flow / 20) * 100);
  const [statusLabel, statusType] = getStatus(flow, active);
  const barColor = statusType === 'danger' ? '#dc2626'
    : statusType === 'warning' ? '#f59e0b' : '#378ADD';
  
  const statusColors = {
    success: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' },
    warning: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' },
    danger: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' }
  };
  
  const flowAnimationDuration = active ? Math.max(0.4, 1.8 - flow / 15) : 3;
  
  const { linePath, fillPath, minV, maxV } = updateSparkline(trendData);
  
  const clockTime = currentTime.toLocaleTimeString('en-US', { hour12: false });
  
  return (
    <div className="p-5 px-4 w-full font-mono bg-white rounded-xl shadow-lg">
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
        @keyframes flow { from{stroke-dashoffset:60} to{stroke-dashoffset:0} }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .flow-dot { animation: flow 1.2s linear infinite; }
        .blink { animation: pulse 1.2s ease-in-out infinite; }
      `}</style>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] text-gray-500 tracking-[2px] uppercase">
            STPL · FMS-04 · ESR-1000
          </div>
          <div className="text-[15px] font-medium text-gray-900 mt-0.5">
            EFM Flow Station
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] tracking-[1px] ${
          active 
            ? 'bg-emerald-100 text-emerald-800 border-emerald-500' 
            : 'bg-amber-100 text-amber-800 border-amber-500'
        }`}>
          <span className="blink w-1.5 h-1.5 rounded-full inline-block bg-current"></span>
          <span>{active ? 'FLOW ACTIVE' : 'STANDBY'}</span>
        </div>
      </div>
      
      {/* EFM Machine Visual */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4 shadow-sm">
        <div className="text-[10px] text-gray-500 tracking-[1.5px] mb-3 uppercase">
          Process View — EFM Turbine Unit
        </div>
        <svg width="100%" viewBox="0 0 640 120" style={{ overflow: 'visible' }}>
          <rect x="30" y="46" width="580" height="28" rx="6" fill="#f9fafb" stroke="#9ca3af" strokeWidth="1.5"/>
          <text x="16" y="58" fontSize="10" fill="#6b7280" fontFamily="monospace" textAnchor="middle">IN</text>
          <text x="16" y="70" fontSize="10" fill="#6b7280" fontFamily="monospace" textAnchor="middle">M1</text>
          <text x="624" y="58" fontSize="10" fill="#6b7280" fontFamily="monospace" textAnchor="middle">OUT</text>
          <text x="624" y="70" fontSize="10" fill="#6b7280" fontFamily="monospace" textAnchor="middle">M2</text>
          
          <line x1="60" y1="60" x2="570" y2="60" stroke="#378ADD" strokeWidth="2.5" strokeDasharray="10 14" 
                className="flow-dot" style={{ animationDuration: `${flowAnimationDuration}s` }}/>
          
          <rect x="270" y="30" width="100" height="60" rx="8" fill="#ffffff" stroke="#6b7280" strokeWidth="1.5"/>
          <text x="320" y="42" fontSize="9" fill="#374151" fontFamily="monospace" textAnchor="middle" letterSpacing="1" fontWeight="bold">EFM</text>
          
          <g style={{ transformOrigin: '320px 62px', transform: `rotate(${rotorAngle.toFixed(1)}deg)` }}>
            <line x1="320" y1="48" x2="320" y2="76" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="306" y1="55" x2="334" y2="69" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="334" y1="55" x2="306" y2="69" stroke="#378ADD" strokeWidth="2.5" strokeLinecap="round"/>
            <circle cx="320" cy="62" r="4.5" fill="#378ADD"/>
          </g>
          <text x="320" y="85" fontSize="9" fill="#6b7280" fontFamily="monospace" textAnchor="middle">TB-201</text>
          
          <line x1="240" y1="46" x2="240" y2="30" stroke="#9ca3af" strokeWidth="1.5"/>
          <circle cx="240" cy="28" r="5" fill="#f9fafb" stroke="#9ca3af" strokeWidth="1.5"/>
          <text x="240" y="18" fontSize="9" fill="#6b7280" fontFamily="monospace" textAnchor="middle">P1</text>
          
          <line x1="400" y1="46" x2="400" y2="30" stroke="#9ca3af" strokeWidth="1.5"/>
          <circle cx="400" cy="28" r="5" fill="#f9fafb" stroke="#9ca3af" strokeWidth="1.5"/>
          <text x="400" y="18" fontSize="9" fill="#6b7280" fontFamily="monospace" textAnchor="middle">P2</text>
          
          <line x1="160" y1="74" x2="160" y2="95" stroke="#9ca3af" strokeWidth="1.5"/>
          <rect x="152" y="95" width="16" height="20" rx="3" fill="#f9fafb" stroke="#9ca3af" strokeWidth="1.5"/>
          <text x="160" y="108" fontSize="8" fill="#6b7280" fontFamily="monospace" textAnchor="middle">TT</text>
        </svg>
      </div>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        
        {/* Current Flow Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 px-[18px] shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-[1.5px] uppercase mb-2">
            Current Flow Rate
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[36px] font-semibold text-gray-900 tracking-[-1px] tabular-nums">
              {flow.toFixed(2)}
            </span>
            <span className="text-[13px] text-gray-500 font-medium">m³/h</span>
          </div>
          <div className="mt-2.5 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="h-full rounded-full"
              style={{ background: barColor }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-gray-500 font-medium">0</span>
            <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusColors[statusType].bg} ${statusColors[statusType].text} ${statusColors[statusType].border}`}>
              {statusLabel}
            </div>
            <span className="text-[10px] text-gray-500 font-medium">20 m³/h</span>
          </div>
          <div className="mt-2 text-[10px] text-gray-500">
            Tag: FC-301 &nbsp;|&nbsp; HH: 17.2 m³/h
          </div>
        </div>
        
        {/* Totalizer */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 px-[18px] shadow-sm">
          <div className="text-[10px] text-gray-500 tracking-[1.5px] uppercase mb-2">
            Totalizer
          </div>
          <div className="bg-gray-100 border border-gray-300 rounded-md px-2.5 py-1.5 inline-flex items-baseline gap-1.5 mb-2.5 shadow-inner">
            <span className="text-[28px] font-semibold text-gray-900 tracking-[2px] tabular-nums">
              {padNum(totalVol, 6)}
            </span>
            <span className="text-xs text-gray-600 font-medium">m³</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="bg-gray-100 rounded-md p-1.5 px-2 border border-gray-200">
              <div className="text-[9px] text-gray-600 uppercase tracking-[1px] font-semibold">Shift Vol</div>
              <div className="flex items-baseline gap-0.5">
                <span className="text-[15px] font-semibold text-gray-900 tabular-nums">
                  {shiftVol < 1000 ? shiftVol.toFixed(1) : (shiftVol / 1000).toFixed(2) + 'k'}
                </span>
                <span className="text-[10px] text-gray-600 font-medium">m³</span>
              </div>
            </div>
            <div className="bg-gray-100 rounded-md p-1.5 px-2 border border-gray-200">
              <div className="text-[9px] text-gray-600 uppercase tracking-[1px] font-semibold">Shift Time</div>
              <span className="text-[15px] font-semibold text-gray-900">
                {Math.floor(shiftSecs / 3600)}h {Math.floor((shiftSecs % 3600) / 60)}m
              </span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-gray-500">
            Tag: FT-301 &nbsp;|&nbsp; Updated live
          </div>
        </div>
      </div>
      
      {/* Trend Sparkline */}
      <div className="bg-white border border-gray-200 rounded-xl p-[14px] px-4 mb-3 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[10px] text-gray-500 tracking-[1.5px] uppercase font-semibold">
            Flow Trend — Last 60s
          </div>
          <span className="text-[10px] text-gray-600 font-medium">
            {trendData.length > 0 ? `${minV.toFixed(1)} – ${maxV.toFixed(1)} m³/h` : '— m³/h'}
          </span>
        </div>
        <svg width="100%" viewBox="0 0 600 60" preserveAspectRatio="none">
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#378ADD" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#378ADD" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={fillPath} fill="url(#sg)"/>
          <path d={linePath} fill="none" stroke="#378ADD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <div className="flex justify-between text-[9px] text-gray-500 font-medium mt-1">
          <span>–60s</span><span>–45s</span><span>–30s</span><span>–15s</span><span>Now</span>
        </div>
      </div>
      
      {/* Footer */}
      <div className="flex justify-between text-[10px] text-gray-500 pt-1 font-medium">
        <span>SCADA v4.2.1 · ESR-1000 Series</span>
        <span>{clockTime}</span>
      </div>
    </div>
  );
};

export default EfFlowStation;