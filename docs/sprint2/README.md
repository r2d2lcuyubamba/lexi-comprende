# Sprint 2 · 26 oct – 6 nov 2026

**Objetivo:** “El docente crea su aula, sus estudiantes ingresan con el código y ve su desempeño
por nivel de comprensión, con alertas tempranas y los datos de los menores protegidos.”

**Plataformas Low Code:** Supabase (backend: tablas, API automática, Auth, RLS) + Appsmith (panel docente).

| Rol | Integrante |
|---|---|
| Product Owner | Lissette Marjory Romero Quispe |
| Scrum Master | Lidia Magali Raá Espinoza |
| Developer | Luis Arturo Cuyubamba Nuñez |

## Sprint Backlog (20 pts · 62 h)

| Historia | Pts | Dónde se implementa | Estado |
|---|---|---|---|
| HU-13b Motor v1.1 | 3 | `src/engine/motor.js` (`REGLAS_ACTIVAS`) | Hecho |
| HU-20 Crear aula y código | 2 | `supabase/schema.sql` + Appsmith *Mis aulas* | |
| HU-21 Respuestas en la nube | 3 | `src/lib/nube.js` | Hecho |
| HU-11 Roles | 3 | Supabase Auth + tabla `perfiles` | |
| HU-15 Protección de datos | 3 | RLS en `supabase/schema.sql`, `supabase/pruebas_rls.sql` | |
| HU-06 Aciertos por nivel | 3 | vista `v_aciertos_habilidad` + Appsmith *Desempeño* | |
| HU-07 Alertas | 3 | vista `v_alertas` + Appsmith *Alertas* | |

Tablero: pestaña **Projects** del repositorio (una *issue* por historia).

## Definición de Terminado

- [ ] Cumple sus criterios de aceptación
- [ ] Pruebas en verde (Actions) y, si toca datos, `pruebas_rls.sql` en OK
- [ ] Revisión de usabilidad dentro de la historia (≤ 5 elementos, ≥ 16 px)
- [ ] Commit con el ID de la historia (p. ej. `HU-07: vista de alertas`) y captura en `docs/capturas/sprint2/`

## Evidencias del Sprint

- [Sprint Planning](planning.md)
- [Daily Scrum](daily.md)
- [Sprint Review](review.md)
- [Retrospectiva](retrospectiva.md)
- Burndown: `docs/capturas/sprint2/burndown.png`
