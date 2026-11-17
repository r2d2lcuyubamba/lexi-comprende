# Panel docente en Appsmith (Sprint 2 · Low Code)

Panel para docentes construido **sin programar el backend**: pantallas de arrastrar y soltar en
[Appsmith](https://www.appsmith.com) conectadas a la API REST que Supabase genera automáticamente.

| Qué | Dónde |
|---|---|
| Panel publicado | https://lexicomprende.appsmith.com/app/panel-docente-lexi/inicio-de-sesion-6afa2353615795a1c895834e |
| Usuario de prueba | `docente.demo@ejemplo.com` (datos ficticios) |
| App exportada | [`panel-docente.json`](panel-docente.json) (Appsmith → *Import*) |
| Capturas | [`docs/capturas/sprint2/`](../docs/capturas/sprint2/) |

## Por qué se conecta por la API REST

Si Appsmith se conectara directamente a PostgreSQL con la contraseña maestra, vería los datos de
todas las aulas y se saltaría la seguridad por filas (RLS). Por eso cada consulta envía el token de
la docente que inició sesión, y Supabase solo le devuelve **sus** aulas (HU-11, HU-15).

## Conexiones (datasources)

| Nombre | Tipo | URL base | Header fijo |
|---|---|---|---|
| `SupabaseAuth` | Authenticated API | `https://<proyecto>.supabase.co/auth/v1` | `apikey: <clave anon>` |
| `SupabaseDatos` | Authenticated API | `https://<proyecto>.supabase.co/rest/v1` | `apikey: <clave anon>` |

Todas las consultas de `SupabaseDatos` llevan además `Authorization: Bearer {{appsmith.store.token}}`.

## Pantallas y consultas

| Página | Qué ve la docente | Consultas | Historia |
|---|---|---|---|
| Inicio de Sesion | Correo, contraseña y botón *Ingresar* | `login`: POST `/token?grant_type=password`; guarda el token con `storeValue` | HU-11 |
| Mis Aulas | Tabla de aulas, formulario *Nueva aula*, código grande y botón *Cambiar código* | `listar_aulas` (GET `/aulas`), `crear_aula` (POST `/aulas`), `renovar_codigo` (POST `/rpc/renovar_codigo`) | HU-20 |
| Desempeño | Selector de aula y semana; gráfico de % de aciertos literal, inferencial y crítico | `aulas`, `aciertos` (GET `/v_aciertos_habilidad`) | HU-06 |
| Alertas | Selector de aula; tabla con estudiante, prioridad (color + palabra), motivo y acción sugerida | `aulas_alertas`, `alertas` (GET `/v_alertas`) | HU-07 |

## Diseño

- Tema: fuente Nunito Sans, color principal `#5B3FD0` (el morado de la app del estudiante), fondo `#FAF7F2`.
- Un solo botón principal por tarjeta; acciones secundarias con borde.
- Las alertas usan color **y** palabra (“Urgente”, “Atención”), para no depender solo del color.
- Lenguaje docente: “Comprensión literal / inferencial / crítica”.

## Notas de uso

- El permiso de inicio de sesión dura cerca de 1 hora; después hay que volver a ingresar.
- El plan gratuito de Supabase pausa los proyectos sin uso: abrirlo antes de una demostración.