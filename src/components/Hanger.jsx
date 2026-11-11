// Gancho + triángulo de percha de madera para el perchero y el logotipo.
export default function Hanger({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 84 52"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      {/* Gancho metálico que abraza la barra */}
      <path
        d="M42 15V9.6a7.6 7.6 0 1 1 7.6-7.6"
        stroke="#45423a"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="49.6" cy="2" r="1.6" fill="#45423a" />
      {/* Cuerpo de madera */}
      <path
        d="M42 16 10.5 42.6A4.8 4.8 0 0 0 13.7 51h56.6a4.8 4.8 0 0 0 3.2-8.4L42 16Z"
        fill="#8a6a4f"
        stroke="#5f4630"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M42 19.5 15.5 43"
        stroke="#a98a68"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.9"
      />
    </svg>
  )
}

export function LogoMark({ size = 30, stroke = '#191914' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="presentation"
      aria-hidden="true"
    >
      <g
        stroke={stroke}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 21v-4a6.2 6.2 0 1 1 12.4-.8" />
        <path d="M32 21 11.5 42.4c-2 2.1.3 5.6 2.9 5.6h35.2c2.6 0 4.9-3.5 2.9-5.6L32 21Z" />
      </g>
    </svg>
  )
}
