import { AVATARES, Avatar, Moneda, Medalla } from "./Iconos.jsx";
import { lecturaParaNivel } from "../data/lecturas.js";

// HU-01: inicio del estudiante con "Aventura del Día", progreso y logros.
export default function Inicio({ perfil, onComenzar, onSalir, onPruebas }) {
  const avatar = AVATARES.find((a) => a.id === perfil.usuario.avatarId);
  const { nivel, ventana } = perfil.motor;
  const lectura = lecturaParaNivel(nivel);
  const aciertos = ventana.filter((r) => r.correcta).length;
  const avance = Math.round((aciertos / 5) * 100);
  const logros = [
    { nombre: "1ra lectura", ok: perfil.lecturas >= 1, c: {} },
    { nombre: "3 lecturas", ok: perfil.lecturas >= 3, c: { cinta: "#5B3FD0", cinta2: "#3E27A3", disco: "#9AA4B8", borde: "#7B8499" } },
    { nombre: "Detective (5/5)", ok: perfil.perfectas >= 1, c: { cinta: "#1FA67A", cinta2: "#168060", disco: "#F5B82E", borde: "#D99A12" } },
  ];
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "¡Buenos días!" : hora < 19 ? "¡Buenas tardes!" : "¡Buenas noches!";

  return (
    <div className="px-5 pt-4 pb-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar avatar={avatar} size={50} />
          <div className="text-left"><p className="text-gris text-xs">{saludo}</p><p className="font-extrabold text-xl">{perfil.usuario.nombre}</p></div>
        </div>
        <span className="chip bg-white shadow-[0_2px_0_#E2DCD0]"><Moneda /> {perfil.monedas}</span>
      </header>

      <section className="mt-5 rounded-[28px] p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(135deg,#5B3FD0,#8B6CF6)" }}>
        <p className="text-[13px] font-semibold opacity-85">AVENTURA DEL DÍA</p>
        <h2 className="text-[22px] font-extrabold leading-tight mt-1.5 max-w-[230px]">{lectura.titulo}</h2>
        <p className="text-[13px] opacity-90 mt-1.5">{lectura.tipo} · {lectura.minutos} min · {lectura.preguntas.length} preguntas</p>
        <button onClick={() => onComenzar(lectura)} className="btn-sol mt-4 h-14 px-7 text-lg">▶ Comenzar</button>
        <svg className="absolute -right-2 -bottom-1" width="130" height="120" viewBox="0 0 130 120" aria-hidden="true">
          <circle cx="80" cy="70" r="60" fill="rgba(255,255,255,.12)" />
          <path d="M30 80q30-50 60-20q20-30 40-10q-30 0-40 30q-30-20-60 0z" fill="#fff" opacity=".9" />
        </svg>
      </section>

      <section className="tarjeta mt-5 p-5 text-left">
        <div className="flex justify-between font-bold"><span>Mi nivel de lectura</span><span className="text-morado">Nivel {nivel}</span></div>
        <div className="h-4 bg-morado-claro rounded-full mt-2.5" role="progressbar" aria-valuenow={avance} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-morado rounded-full transition-all duration-700" style={{ width: `${avance}%` }} />
        </div>
        <p className="text-gris text-xs mt-2">{ventana.length === 0 ? `Acierta 4 de 5 preguntas para subir al Nivel ${Math.min(nivel + 1, 5)}` : `Llevas ${aciertos} de ${ventana.length} correctas · necesitas 4 de 5 para subir`}</p>
      </section>

      <h3 className="mt-5 font-bold text-left">Mis logros</h3>
      <div className="flex gap-3 mt-2.5">
        {logros.map((l) => (
          <div key={l.nombre} className={`tarjeta flex-1 py-3 px-1.5 flex flex-col items-center ${l.ok ? "" : "opacity-40 grayscale"}`}>
            <Medalla {...l.c} />
            <span className="text-[11px] font-semibold mt-1">{l.nombre}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 text-sm font-semibold">
        <button onClick={onSalir} className="text-gris underline underline-offset-4">Cambiar de usuario</button>
        <button onClick={onPruebas} className="text-morado underline underline-offset-4">Ver el motor por dentro</button>
      </div>
    </div>
  );
}
