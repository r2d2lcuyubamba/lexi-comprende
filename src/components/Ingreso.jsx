import { useState } from "react";
import { AVATARES, Avatar } from "./Iconos.jsx";

// HU-19 · RF-04: ingreso con código de aula + avatar, sin correo ni contraseña.
export const CODIGOS_AULA = { "4B7K": "4.° grado “B”" };

export default function Ingreso({ onEntrar, onPruebas, onBorrar, progresoDe }) {
  const [codigo, setCodigo] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const progreso = codigo.length === 4 && CODIGOS_AULA[codigo.toUpperCase()] ? progresoDe(codigo.toUpperCase()) : {};
  const hayPerfiles = Object.keys(progresoDe("4B7K")).length > 0;

  const entrar = (e) => {
    e.preventDefault();
    const aula = CODIGOS_AULA[codigo.toUpperCase()];
    if (!aula) { setError("Ese código no existe. Pídele a tu profe el código de tu aula."); return; }
    onEntrar({ avatarId: avatar.id, nombre: avatar.nombre, aula, codigo: codigo.toUpperCase() });
  };

  return (
    <form onSubmit={entrar} className="px-6 pt-8 pb-6 flex flex-col min-h-full text-center">
      <h1 className="text-[30px] font-extrabold tracking-tight text-morado">Lexi<span className="text-coral">Comprende</span></h1>
      <p className="text-gris text-sm mt-1">¡Hola! ¿Listo para leer?</p>

      <label htmlFor="codigo" className="mt-8 text-left font-bold text-[15px]">1. Escribe el código de tu aula</label>
      <div className="relative mt-3 mx-auto">
        <div className="flex gap-2 pointer-events-none" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-14 h-16 rounded-2xl bg-white border-[3px] flex items-center justify-center text-[28px] font-extrabold ${codigo.length > i ? "border-morado" : "border-[#E2DCD0]"}`}>
              {codigo[i]?.toUpperCase() || ""}
            </div>
          ))}
        </div>
        <input id="codigo" value={codigo} maxLength={4} autoComplete="off" autoCapitalize="characters"
          onChange={(e) => { setCodigo(e.target.value.replace(/[^a-z0-9]/gi, "")); setError(""); }}
          className="absolute inset-0 opacity-0 w-full text-[28px]" aria-label="Código del aula, 4 caracteres" />
      </div>
      {error && <p role="alert" className="mt-3 text-[15px] font-semibold text-[#C23B1E]">{error}</p>}

      <p className="mt-7 text-left font-bold text-[15px]">2. Toca tu avatar</p>
      <div className="grid grid-cols-3 gap-3 mt-3">
        {AVATARES.map((a) => (
          <button type="button" key={a.id} onClick={() => setAvatar(a)} aria-pressed={avatar?.id === a.id}
            className={`tarjeta p-2.5 border-[3px] flex flex-col items-center ${avatar?.id === a.id ? "border-morado" : "border-transparent"}`}>
            <Avatar avatar={a} size={68} />
            <span className="text-[13px] font-semibold mt-1">{a.nombre}</span>
            {progreso[a.id] && <span className="chip bg-morado-claro text-morado mt-1 !text-[11px] !py-0.5">Nivel {progreso[a.id].nivel}</span>}
          </button>
        ))}
      </div>

      <button type="submit" disabled={codigo.length < 4 || !avatar} className="btn-morado mt-7 w-full h-16 text-xl">¡Entrar!</button>
      <p className="text-gris text-xs mt-3">Sin correo ni contraseña · Datos protegidos (Ley 29733)</p>
      <p className="text-gris text-xs mt-1">Código de prueba para la demo: <b className="text-tinta">4B7K</b></p>

      <p className="text-gris text-xs mt-1">Cada avatar guarda su propio progreso en este dispositivo.</p>

      <button type="button" onClick={onPruebas} className="mt-auto pt-6 text-sm font-semibold text-morado underline underline-offset-4">
        Panel de pruebas del motor adaptativo (docente / evaluador)
      </button>
      {hayPerfiles && (confirmar ? (
        <p className="mt-3 text-sm">¿Borrar el progreso de todos los avatares?{" "}
          <button type="button" onClick={() => { onBorrar(); setConfirmar(false); }} className="font-semibold text-[#C23B1E] underline underline-offset-4">Sí, borrar</button>{" · "}
          <button type="button" onClick={() => setConfirmar(false)} className="font-semibold text-gris underline underline-offset-4">Cancelar</button>
        </p>
      ) : (
        <button type="button" onClick={() => setConfirmar(true)} className="mt-3 text-xs font-semibold text-gris underline underline-offset-4">Borrar datos de prueba de este dispositivo</button>
      ))}
    </form>
  );
}
