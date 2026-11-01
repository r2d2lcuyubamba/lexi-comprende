import { useEffect, useState } from "react";
import Ingreso from "./components/Ingreso.jsx";
import Inicio from "./components/Inicio.jsx";
import Lector from "./components/Lector.jsx";
import Preguntas from "./components/Preguntas.jsx";
import Resultado from "./components/Resultado.jsx";
import PanelPruebas from "./components/PanelPruebas.jsx";
import { registrarRespuesta, REGLAS_V1 } from "./engine/motor.js";
import { cargarDatos, guardarDatos, entrar, salir, actualizarActivo, nivelesPorAvatar, borrarTodo } from "./perfiles.js";

export default function App() {
  // Varios perfiles en el mismo dispositivo: cada código de aula + avatar guarda su propio progreso
  const [datos, setDatos] = useState(cargarDatos);
  const perfil = datos.activo ? datos.perfiles[datos.activo] : null;
  const setPerfil = (cambio) => setDatos((d) => actualizarActivo(d, cambio));
  const [pantalla, setPantalla] = useState(perfil ? "inicio" : "ingreso");
  const [lectura, setLectura] = useState(null);
  const [sesion, setSesion] = useState(null);
  const [nivelAntes, setNivelAntes] = useState(null);
  const [volverA, setVolverA] = useState("ingreso");

  useEffect(() => guardarDatos(datos), [datos]);
  useEffect(() => { window.scrollTo(0, 0); }, [pantalla]);

  // ← Punto de integración con el motor: cada primer intento entra a la ventana y se decide el nivel
  const onRespuesta = (habilidad, correcta) =>
    setPerfil((p) => {
      const { estado, evento } = registrarRespuesta(p.motor, habilidad, correcta, REGLAS_V1);
      return { ...p, motor: estado, registro: [...p.registro, { ...evento, fecha: Date.now() }] };
    });

  const abrirPruebas = (desde) => { setVolverA(desde); setPantalla("pruebas"); };

  if (pantalla === "pruebas")
    return <PanelPruebas registro={perfil?.registro || []} onVolver={() => setPantalla(perfil ? volverA : "ingreso")} />;

  return (
    <main className="min-h-[100dvh] sm:py-6">
      <div className="mx-auto max-w-[420px] min-h-[100dvh] sm:min-h-[820px] bg-crema sm:rounded-[36px] sm:shadow-[0_0_0_10px_#1E2340,0_20px_40px_rgba(0,0,0,.25)] overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col">
          {pantalla === "ingreso" && (
            <Ingreso progresoDe={(codigo) => nivelesPorAvatar(datos, codigo)}
              onEntrar={(u) => { setDatos((d) => entrar(d, u)); setPantalla("inicio"); }}
              onBorrar={() => setDatos(borrarTodo())}
              onPruebas={() => abrirPruebas("ingreso")} />
          )}
          {pantalla === "inicio" && perfil && (
            <Inicio perfil={perfil}
              onComenzar={(l) => { setLectura(l); setNivelAntes(perfil.motor.nivel); setPantalla("lector"); }}
              onSalir={() => { setDatos(salir); setPantalla("ingreso"); }}
              onPruebas={() => abrirPruebas("inicio")} />
          )}
          {pantalla === "lector" && (
            <Lector lectura={lectura} nivel={perfil.motor.nivel} onSalir={() => setPantalla("inicio")} onListo={() => setPantalla("preguntas")} />
          )}
          {pantalla === "preguntas" && (
            <Preguntas lectura={lectura} nombre={perfil.usuario.nombre} onRespuesta={onRespuesta} onSalir={() => setPantalla("inicio")}
              onTerminar={(s) => {
                setSesion(s);
                const perfecta = s.resultados.every((r) => r.primerIntento);
                setPerfil((p) => ({ ...p, monedas: p.monedas + s.monedas, lecturas: p.lecturas + 1, perfectas: p.perfectas + (perfecta ? 1 : 0) }));
                setPantalla("resultado");
              }} />
          )}
          {pantalla === "resultado" && (
            <Resultado lectura={lectura} sesion={sesion} nivelAntes={nivelAntes} perfil={perfil}
              onInicio={() => setPantalla("inicio")} onPruebas={() => abrirPruebas("resultado")} />
          )}
        </div>
      </div>
    </main>
  );
}
