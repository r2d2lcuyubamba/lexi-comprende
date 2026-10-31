// Textos piloto del Sprint 1 (tarea T5) y preguntas con pistas (tarea T6).
// Cada pregunta: habilidad (literal | inferencial | critica), 3 opciones,
// índice correcto, explicación que cita el texto y pista graduada.

export const LECTURAS = [
  {
    id: "llama-lulu",
    nivel: 1,
    titulo: "Lulú, la llama curiosa",
    tipo: "Cuento",
    minutos: 3,
    texto:
      "Lulú era una llama blanca que vivía en Puno, cerca del lago Titicaca. Le gustaba mucho caminar. " +
      "Una mañana vio una flor amarilla al lado del camino. Lulú se acercó despacio y la olió. " +
      "La flor tenía un perfume dulce. Lulú sonrió y siguió su paseo muy contenta.",
    preguntas: [
      { habilidad: "literal", pregunta: "¿Dónde vivía Lulú?", opciones: ["En Puno", "En Lima", "En la selva"], correcta: 0,
        explicacion: "El texto dice: “vivía en Puno, cerca del lago Titicaca”.", pista: "Busca en la primera oración el nombre de un lugar." },
      { habilidad: "literal", pregunta: "¿De qué color era la flor?", opciones: ["Roja", "Amarilla", "Azul"], correcta: 1,
        explicacion: "El texto dice: “vio una flor amarilla”.", pista: "Lee otra vez la oración donde Lulú ve la flor." },
      { habilidad: "inferencial", pregunta: "¿Por qué Lulú se acercó despacio a la flor?", opciones: ["Porque estaba cansada", "Para no dañarla y olerla", "Porque tenía miedo"], correcta: 1,
        explicacion: "Lulú quería oler la flor; al acercarse despacio la cuidaba.", pista: "¿Qué hizo Lulú justo después de acercarse?" },
      { habilidad: "inferencial", pregunta: "¿Cómo se sintió Lulú al final?", opciones: ["Triste", "Enojada", "Feliz"], correcta: 2,
        explicacion: "El texto dice: “Lulú sonrió y siguió su paseo muy contenta”.", pista: "Mira la última oración: ¿qué hizo Lulú con su cara?" },
      { habilidad: "critica", pregunta: "¿Qué nos enseña la historia de Lulú?", opciones: ["A disfrutar y cuidar la naturaleza", "A caminar rápido", "A no salir de casa"], correcta: 0,
        explicacion: "Lulú se detiene a disfrutar la flor sin arrancarla: aprecia y cuida la naturaleza.", pista: "Piensa en lo que hizo Lulú con la flor: ¿la arrancó o solo la olió?" },
    ],
  },
  {
    id: "condor-apu",
    nivel: 2,
    titulo: "El cóndor que no quería volar",
    tipo: "Cuento",
    minutos: 4,
    texto:
      "En lo alto de los Andes vivía un cóndor joven llamado Apu. Todos los días miraba a sus hermanos planear sobre las montañas, " +
      "pero él tenía miedo de soltar la roca. Una tarde, el viento sopló fuerte y una pluma de su madre cayó al vacío. " +
      "Sin pensarlo, Apu abrió sus enormes alas y se lanzó a buscarla. El aire lo sostuvo como una mano invisible. " +
      "Cuando atrapó la pluma, descubrió que estaba volando. Desde ese día, Apu esperaba el viento de la tarde con alegría.",
    preguntas: [
      { habilidad: "literal", pregunta: "¿Por qué Apu no quería soltar la roca?", opciones: ["Porque estaba cansado", "Porque tenía miedo", "Porque no tenía alas"], correcta: 1,
        explicacion: "El texto dice: “él tenía miedo de soltar la roca”.", pista: "Busca la palabra que dice lo que sentía Apu en la segunda oración." },
      { habilidad: "literal", pregunta: "¿Qué cayó al vacío?", opciones: ["Una pluma de su madre", "Una piedra", "Un huevo"], correcta: 0,
        explicacion: "El texto dice: “una pluma de su madre cayó al vacío”.", pista: "Lee la oración donde el viento sopla fuerte." },
      { habilidad: "inferencial", pregunta: "¿Cómo se sentía Apu al ver volar a sus hermanos?", opciones: ["Muy feliz y tranquilo", "Con ganas, pero asustado", "Enojado con ellos"], correcta: 1,
        explicacion: "Apu los miraba todos los días (quería volar), pero tenía miedo.", pista: "Apu miraba a sus hermanos todos los días, pero tenía miedo. ¿Qué siente alguien que mira algo que quiere hacer?" },
      { habilidad: "inferencial", pregunta: "¿Qué significa “el aire lo sostuvo como una mano invisible”?", opciones: ["Que alguien lo cargó", "Que el viento lo ayudó a mantenerse arriba", "Que se cayó"], correcta: 1,
        explicacion: "Es una comparación: el viento lo sostenía, como si una mano lo cargara.", pista: "¿Quién ayuda a volar a los cóndores: una persona o el viento?" },
      { habilidad: "critica", pregunta: "¿Qué ayudó a Apu a vencer su miedo?", opciones: ["Querer ayudar a su madre", "Que lo empujaron", "Dormir mucho"], correcta: 0,
        explicacion: "Apu se lanzó “sin pensarlo” para recuperar la pluma de su madre: el cariño fue más fuerte que el miedo.", pista: "¿Qué estaba buscando Apu cuando abrió las alas?" },
    ],
  },
  {
    id: "chacra-abuela",
    nivel: 3,
    titulo: "El secreto de la chacra de la abuela",
    tipo: "Relato",
    minutos: 5,
    texto:
      "Cada año, la abuela Rosa sembraba maíz, frijol y zapallo juntos en la misma chacra. Su nieto Mateo pensaba que era un desorden. " +
      "—Abuela, ¿por qué no siembras cada planta en su lugar? —preguntó. La abuela sonrió y le pidió que observara. " +
      "Con las semanas, Mateo vio que el frijol trepaba por el tallo del maíz como por una escalera, " +
      "y que las hojas grandes del zapallo cubrían la tierra, guardando la humedad y evitando la mala hierba. " +
      "—Las tres se ayudan —explicó la abuela—. Nuestros abuelos lo aprendieron mirando la tierra con paciencia. " +
      "Mateo entendió que lo que parecía desorden era, en realidad, un trabajo en equipo.",
    preguntas: [
      { habilidad: "literal", pregunta: "¿Qué plantas sembraba juntas la abuela Rosa?", opciones: ["Papa, oca y olluco", "Maíz, frijol y zapallo", "Trigo, cebada y quinua"], correcta: 1,
        explicacion: "El texto dice: “sembraba maíz, frijol y zapallo juntos”.", pista: "La respuesta está en la primera oración." },
      { habilidad: "literal", pregunta: "¿Para qué servían las hojas grandes del zapallo?", opciones: ["Para dar sombra a la abuela", "Para guardar la humedad y evitar la mala hierba", "Para alimentar a los animales"], correcta: 1,
        explicacion: "El texto dice que cubrían la tierra “guardando la humedad y evitando la mala hierba”.", pista: "Busca la oración que habla de las hojas del zapallo." },
      { habilidad: "inferencial", pregunta: "¿Por qué el texto compara el tallo del maíz con una escalera?", opciones: ["Porque el frijol sube apoyándose en él", "Porque el maíz es de madera", "Porque Mateo subía por él"], correcta: 0,
        explicacion: "El frijol “trepaba por el tallo del maíz”: lo usaba para subir, como una escalera.", pista: "¿Qué planta trepaba y por dónde?" },
      { habilidad: "inferencial", pregunta: "Al inicio, ¿qué pensaba Mateo de la chacra?", opciones: ["Que era perfecta", "Que era un desorden", "Que era muy pequeña"], correcta: 1,
        explicacion: "El texto dice: “Mateo pensaba que era un desorden”.", pista: "Lee lo que pensaba Mateo antes de observar." },
      { habilidad: "critica", pregunta: "¿Qué valor muestra la abuela al pedirle a Mateo que observe en lugar de explicarle todo?", opciones: ["La prisa", "La paciencia para aprender observando", "El enojo"], correcta: 1,
        explicacion: "La abuela deja que Mateo descubra mirando “con paciencia”, como aprendieron los abuelos.", pista: "¿Cómo aprendieron los abuelos, según la abuela Rosa?" },
    ],
  },
];

export function lecturaParaNivel(nivel) {
  const n = Math.min(Math.max(nivel, 1), 3); // Sprint 1: 3 textos piloto (niveles 4–5 llegan con HU-12)
  return LECTURAS.find((l) => l.nivel === n);
}

export const NOMBRE_HABILIDAD = { literal: "Comprensión literal", inferencial: "Comprensión inferencial", critica: "Comprensión crítica" };
