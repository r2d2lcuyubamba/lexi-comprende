export const AVATARES = [
  { id: "pancho", nombre: "Pancho", fondo: "#FFE3D6", polo: "#FF7A59" },
  { id: "lucia", nombre: "Lucía", fondo: "#E4DDFF", polo: "#5B3FD0" },
  { id: "romulo", nombre: "Rómulo", fondo: "#D8F3EA", polo: "#1FA67A" },
  { id: "killa", nombre: "Killa", fondo: "#FFF1C9", polo: "#F5B82E" },
  { id: "tito", nombre: "Tito", fondo: "#D9ECFF", polo: "#2F7FE0" },
  { id: "sami", nombre: "Sami", fondo: "#FDE0EC", polo: "#E0457B" },
];

export function Avatar({ avatar, size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill={avatar.fondo} />
      <circle cx="32" cy="28" r="14" fill="#FFD9B3" />
      <path d="M18 26c0-10 8-15 14-15s14 5 14 15c-4-5-10-6-14-6s-10 1-14 6z" fill="#3B2A20" />
      <circle cx="27" cy="29" r="2" fill="#1E2340" />
      <circle cx="37" cy="29" r="2" fill="#1E2340" />
      <path d="M27 35q5 4 10 0" stroke="#1E2340" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 60c2-10 9-15 18-15s16 5 18 15z" fill={avatar.polo} />
    </svg>
  );
}

export const Moneda = ({ s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="#F5B82E" stroke="#D99A12" strokeWidth="2" />
    <text x="10" y="14" fontSize="10" textAnchor="middle" fontWeight="700" fill="#8A5A00">L</text>
  </svg>
);

export const Check = ({ s = 22 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12l5 5 9-10" />
  </svg>
);

export function Medalla({ s = 46, cinta = "#FF7A59", cinta2 = "#E05A3A", disco = "#F5B82E", borde = "#D99A12" }) {
  return (
    <svg width={s} height={s} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16 4h6l4 12h-6z" fill={cinta} /><path d="M32 4h-6l-4 12h6z" fill={cinta2} />
      <circle cx="24" cy="30" r="13" fill={disco} stroke={borde} strokeWidth="3" />
      <path d="M24 23l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z" fill="#fff" />
    </svg>
  );
}
