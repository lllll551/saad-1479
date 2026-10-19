import React, { useEffect, useState } from 'react';

export const FloatingButterfly: React.FC = () => {
  // Butterfly coordinate state for smooth fluttering flight across the viewport
  const [pos, setPos] = useState({ x: 40, y: 35 });
  const [rotation, setRotation] = useState(15);
  const [direction, setDirection] = useState<'right' | 'left'>('right');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Smooth flight path waypoints
    const waypoints = [
      { x: 15, y: 25, rot: 25, dir: 'right' as const },
      { x: 35, y: 18, rot: -10, dir: 'right' as const },
      { x: 65, y: 30, rot: 20, dir: 'right' as const },
      { x: 85, y: 20, rot: -15, dir: 'right' as const },
      { x: 75, y: 55, rot: -45, dir: 'left' as const },
      { x: 50, y: 45, rot: 10, dir: 'left' as const },
      { x: 25, y: 65, rot: -20, dir: 'left' as const },
      { x: 10, y: 40, rot: 35, dir: 'right' as const },
    ];

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % waypoints.length;
      const target = waypoints[index];
      // Add slight organic randomness
      const jitterX = (Math.random() - 0.5) * 8;
      const jitterY = (Math.random() - 0.5) * 8;

      setPos({
        x: Math.min(90, Math.max(5, target.x + jitterX)),
        y: Math.min(85, Math.max(10, target.y + jitterY)),
      });
      setRotation(target.rot + (Math.random() - 0.5) * 15);
      setDirection(target.dir);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const handleButterflyClick = () => {
    setIsHovered(true);
    // Do a quick playful loop
    setRotation(r => r + 360);
    setTimeout(() => setIsHovered(false), 1200);
  };

  return (
    <div
      className="fixed z-50 pointer-events-none transition-all ease-in-out select-none"
      style={{
        left: `${pos.x}vw`,
        top: `${pos.y}vh`,
        transitionDuration: '3800ms',
        transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${direction === 'left' ? -1 : 1}, 1)`,
      }}
      title="Saad Store Mascot Butterfly"
    >
      <div
        onClick={handleButterflyClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="pointer-events-auto cursor-pointer relative group p-2"
      >
        {/* Glow behind butterfly */}
        <div className="absolute inset-0 bg-amber-400/20 blur-md rounded-full pointer-events-none animate-pulse" />

        {/* 3D SVG Butterfly */}
        <svg
          viewBox="0 0 100 100"
          className={`w-12 h-12 sm:w-14 sm:h-14 drop-shadow-[0_4px_10px_rgba(16,185,129,0.4)] transition-transform duration-300 ${
            isHovered ? 'scale-125' : 'scale-100'
          }`}
        >
          <defs>
            <linearGradient id="emeraldWing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
            <filter id="shadow">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#047857" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Left Wing Group with CSS Flapping Animation */}
          <g className="origin-[50px_50px] animate-[wingFlapLeft_0.28s_infinite_alternate_ease-in-out]">
            {/* Upper Left Wing */}
            <path
              d="M 50 48 C 30 15, 5 25, 12 55 C 18 68, 38 65, 50 52 Z"
              fill="url(#emeraldWing)"
              filter="url(#shadow)"
            />
            {/* Wing pattern */}
            <path
              d="M 45 45 C 32 25, 18 32, 22 52 C 26 60, 38 58, 45 49 Z"
              fill="url(#goldAccent)"
              opacity="0.85"
            />
            <circle cx="25" cy="42" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="34" cy="33" r="2" fill="#ffffff" opacity="0.8" />
            {/* Lower Left Wing */}
            <path
              d="M 50 54 C 35 60, 20 72, 28 85 C 36 94, 48 80, 50 58 Z"
              fill="url(#emeraldWing)"
              filter="url(#shadow)"
            />
            <circle cx="35" cy="74" r="2.5" fill="#fef08a" />
          </g>

          {/* Right Wing Group with CSS Flapping Animation */}
          <g className="origin-[50px_50px] animate-[wingFlapRight_0.28s_infinite_alternate_ease-in-out]">
            {/* Upper Right Wing */}
            <path
              d="M 50 48 C 70 15, 95 25, 88 55 C 82 68, 62 65, 50 52 Z"
              fill="url(#emeraldWing)"
              filter="url(#shadow)"
            />
            {/* Wing pattern */}
            <path
              d="M 55 45 C 68 25, 82 32, 78 52 C 74 60, 62 58, 55 49 Z"
              fill="url(#goldAccent)"
              opacity="0.85"
            />
            <circle cx="75" cy="42" r="3" fill="#ffffff" opacity="0.9" />
            <circle cx="66" cy="33" r="2" fill="#ffffff" opacity="0.8" />
            {/* Lower Right Wing */}
            <path
              d="M 50 54 C 65 60, 80 72, 72 85 C 64 94, 52 80, 50 58 Z"
              fill="url(#emeraldWing)"
              filter="url(#shadow)"
            />
            <circle cx="65" cy="74" r="2.5" fill="#fef08a" />
          </g>

          {/* Center Body & Head */}
          <ellipse cx="50" cy="52" rx="3" ry="16" fill="#1e293b" />
          <circle cx="50" cy="35" r="3.5" fill="#0f172a" />
          {/* Antennae */}
          <path d="M 49 33 Q 44 20, 38 18" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="37" cy="18" r="1.5" fill="#f59e0b" />
          <path d="M 51 33 Q 56 20, 62 18" stroke="#0f172a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <circle cx="63" cy="18" r="1.5" fill="#f59e0b" />
        </svg>

        {/* Playful sparkle tooltip */}
        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full pointer-events-none shadow-sm">
          ✨ Saad Store 🦋
        </span>
      </div>
    </div>
  );
};
