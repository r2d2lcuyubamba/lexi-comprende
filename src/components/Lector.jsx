// Lector de la v1: el texto completo de la lectura, en una sola tarjeta.
export default function Lector({ lectura, nivel, onSalir, onListo }) {
  return (
    <div className="px-5 pt-3 pb-6 flex flex-col min-h-full">
      <div className="flex items-center justify-between">
        <button onClick={onSalir} className="text-2xl font-extrabold w-12 h-12" aria-label="Salir de la lectura">✕</button>
        <span className="chip bg-morado-claro text-morado">Nivel {nivel}</span>
        <span className="w-12" />
      </div>

      <h1 className="text-2xl font-extrabold text-left mt-3">{lectura.titulo}</h1>
      <p className="text-gris text-sm text-left mt-1">{lectura.tipo} · {lectura.minutos} min de lectura</p>
      <article className="tarjeta mt-3 p-5 text-left font-texto leading-[1.75] text-[21px]" lang="es">
        {lectura.texto}
      </article>

      <button onClick={onListo} className="btn-morado mt-5 w-full h-14 text-lg">Ya leí → Preguntas</button>
    </div>
  );
}
