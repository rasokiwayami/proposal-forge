interface LogoMarkProps {
  size?: number;
  animated?: boolean;
}

export function LogoMark({ size = 22, animated = false }: LogoMarkProps) {
  return (
    <span className="pf-mark" style={{ width: size, height: size, display: 'inline-block' }}>
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <defs>
          <linearGradient id="pf-g" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(86% 0.08 78)" />
            <stop offset="1" stopColor="oklch(60% 0.12 68)" />
          </linearGradient>
        </defs>
        <path
          d="M4 6 L20 6 L18 10 L13 10 L13 14 L16 14 L16 18 L8 18 L8 14 L11 14 L11 10 L6 10 Z"
          fill="url(#pf-g)"
          style={animated ? { transformOrigin: 'center', animation: 'logo-pulse 2.4s var(--ease-spring) infinite' } : {}}
        />
        <path d="M9 3 L15 3" stroke="oklch(86% 0.08 78)" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function ForgeAnvil({ size = 320 }: { size?: number }) {
  return (
    <div style={{ position: 'relative', width: size, height: size * 0.72, margin: '0 auto' }}>
      <svg viewBox="0 0 320 230" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="fa-gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(88% 0.09 78)" />
            <stop offset="0.5" stopColor="oklch(78% 0.12 72)" />
            <stop offset="1" stopColor="oklch(58% 0.10 65)" />
          </linearGradient>
          <linearGradient id="fa-steel" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--fg-2)" />
            <stop offset="1" stopColor="var(--fg-3)" />
          </linearGradient>
          <radialGradient id="fa-heat" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="oklch(85% 0.18 60)" stopOpacity="0.9" />
            <stop offset="0.6" stopColor="oklch(70% 0.18 45)" stopOpacity="0.3" />
            <stop offset="1" stopColor="oklch(70% 0.18 45)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="148" rx="90" ry="22" fill="url(#fa-heat)">
          <animate attributeName="rx" values="70;100;70" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.6s" repeatCount="indefinite" />
        </ellipse>

        <g>
          <rect x="100" y="162" width="120" height="10" rx="2" fill="url(#fa-steel)" />
          <rect x="118" y="172" width="84" height="26" fill="url(#fa-steel)" opacity="0.6" />
          <rect x="90" y="198" width="140" height="14" rx="2" fill="url(#fa-steel)" />
        </g>

        <g transform="translate(160 145)">
          <rect x="-32" y="-14" width="24" height="18" rx="2" fill="url(#fa-gold)">
            <animate attributeName="x" values="-32;-10;-32" dur="2s" repeatCount="indefinite" keyTimes="0;0.4;1" />
            <animate attributeName="width" values="24;20;24" dur="2s" repeatCount="indefinite" keyTimes="0;0.4;1" />
          </rect>
          <rect x="8" y="-14" width="24" height="18" rx="2" fill="url(#fa-gold)">
            <animate attributeName="x" values="8;-10;8" dur="2s" repeatCount="indefinite" keyTimes="0;0.4;1" />
            <animate attributeName="width" values="24;20;24" dur="2s" repeatCount="indefinite" keyTimes="0;0.4;1" />
          </rect>
          <rect x="-14" y="-15" width="28" height="20" rx="3" fill="oklch(95% 0.15 80)" opacity="0">
            <animate attributeName="opacity" values="0;0;1;0;0" dur="2s" repeatCount="indefinite" keyTimes="0;0.35;0.42;0.5;1" />
          </rect>
        </g>

        <g style={{ transformOrigin: '220px 50px', animation: 'pf-hammer 2s var(--ease-spring) infinite' }}>
          <line x1="220" y1="50" x2="220" y2="135" stroke="var(--fg-2)" strokeWidth="5" strokeLinecap="round" />
          <rect x="190" y="125" width="60" height="22" rx="3" fill="url(#fa-steel)" />
          <rect x="190" y="125" width="60" height="6" rx="3" fill="oklch(100% 0 0 / .2)" />
        </g>

        {[-40, -24, -8, 10, 26, 42].map((dx, i) => (
          <circle key={i} cx={160 + dx} cy="148" r="1.6" fill="var(--accent)" opacity="0">
            <animate attributeName="opacity" values="0;0;1;0" dur="2s" begin={`${0.35 + i * 0.02}s`} repeatCount="indefinite" />
            <animate attributeName="cy" values="148;148;130;120" dur="2s" begin={`${0.35 + i * 0.02}s`} repeatCount="indefinite" />
            <animate attributeName="r" values="1.6;1.6;2.4;0.4" dur="2s" begin={`${0.35 + i * 0.02}s`} repeatCount="indefinite" />
          </circle>
        ))}

        <line x1="20" y1="213" x2="300" y2="213" stroke="var(--line-soft)" strokeDasharray="2 4" />
        <text x="50" y="225" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-3)" letterSpacing="1">INPUT</text>
        <text x="150" y="225" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent)" letterSpacing="1">FORGE</text>
        <text x="245" y="225" fontFamily="var(--font-mono)" fontSize="9" fill="var(--fg-3)" letterSpacing="1">OUTPUT</text>
      </svg>
    </div>
  );
}
