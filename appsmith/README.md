# Panel docente en Appsmith (Sprint 2 · Low Code)

El panel docente se construye **sin programar el backend**, con widgets de arrastrar y soltar de
[Appsmith](https://www.appsmith.com) conectados a Supabase.

> **Entrega obligatoria:** exportar la app desde Appsmith (menú de la app → *Export*) y guardar el
> archivo aquí como `appsmith/panel-docente.json`. Así la docente puede importarla y revisar cada
> pantalla y consulta.

## 1. Conectar Supabase (datasource)

1. En Supabase: *Project Settings → Database → Connection string* (usar el *Session pooler*).
2. En Appsmith: *Data → New datasource → PostgreSQL* y pegar host, puerto, base, usuario y contraseña.
3. Para el inicio de sesión de la docente, crear un segundo datasource *REST API* apuntando a
   `https://TU-PROYECTO.supabase.co/auth/v1` con el header `apikey: <clave anon>`.

> Las consultas de Appsmith deben filtrar por la docente que inició sesión
> (`docente_id = '{{appsmith.store.usuario.id}}'`) o usar la API REST con su token, para que
> se aplique el RLS de `supabase/schema.sql`.

## 2. Pantallas y widgets

| Pantalla | Widgets | Consulta (query) | Historia |
|---|---|---|---|
| Inicio de sesión | Input correo, Input contraseña, Button | `login`: POST `/token?grant_type=password` → guarda el token en `appsmith.store` | HU-11 |
| Mis aulas | Table, Form (nombre, grado), Button *Renovar código*, Text grande con el código | `listar_aulas`, `crear_aula` (INSERT en `aulas`), `renovar` (`select renovar_codigo(...)`) | HU-20 |
| Desempeño del aula | 3 Stat box, Chart (barras), Select de semana | `select * from v_aciertos_habilidad where aula_id = ... and semana = ...` | HU-06 |
| Alertas tempranas | Table con columna de color/ícono para prioridad | `select * from v_alertas where aula_id = ... order by prioridad desc` | HU-07 |
| Detalle del estudiante | Text, List | respuestas del estudiante seleccionado | HU-06 |

## 3. Reglas de diseño (DoD)

- Máximo 5 elementos interactivos por zona de trabajo; textos ≥ 16 px.
- Colores de alerta siempre con palabra e ícono (“Urgente”, “Atención”).
- Lenguaje docente: “Comprensión literal / inferencial / crítica”.

## 4. Capturas

Guardar en `docs/capturas/sprint2/`: `panel_01_login.png`, `panel_02_aulas.png`,
`panel_03_desempeno.png`, `panel_04_alertas.png`.
