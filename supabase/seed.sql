-- Datos de prueba para la demostración (Sprint 2).
-- Antes de ejecutarlo, registra a las docentes en Supabase > Authentication > Users
-- y reemplaza los correos de abajo por los que usaste.
-- Todos los estudiantes son ficticios y seudonimizados.

do $$
declare d1 uuid; v_aula uuid;
begin
  select id into d1 from auth.users where email = 'docente.demo@ejemplo.com';
  if d1 is null then raise exception 'Primero crea la usuaria docente.demo@ejemplo.com en Authentication'; end if;

  insert into public.aulas (nombre, grado, codigo, docente_id)
  values ('4.° grado B', 4, '4B7K', d1)
  on conflict (codigo) do update set docente_id = excluded.docente_id
  returning id into v_aula;

  -- Lucía: buen desempeño, falla la crítica (muestra HU-13b y el gráfico HU-06)
  perform public.registrar_respuesta(gen_random_uuid(), '4B7K', 'lucia', 'Lucía', 'condor-apu', h, c, 2::smallint)
  from (values ('literal', true), ('literal', true), ('inferencial', true), ('inferencial', true), ('critica', false)) as t(h, c);

  -- Tito: dos lecturas con ≤ 40 % → alerta "Urgente" (HU-07)
  perform public.registrar_respuesta(gen_random_uuid(), '4B7K', 'tito', 'Tito', 'llama-lulu', h, c, 1::smallint)
  from (values ('literal', true), ('literal', false), ('inferencial', false), ('inferencial', false), ('critica', false)) as t(h, c);
  perform public.registrar_respuesta(gen_random_uuid(), '4B7K', 'tito', 'Tito', 'chacra-abuela', h, c, 1::smallint)
  from (values ('literal', true), ('literal', true), ('inferencial', false), ('inferencial', false), ('critica', false)) as t(h, c);

  -- Killa: leyó hace 9 días → alerta "Atención" (HU-07)
  perform public.registrar_respuesta(gen_random_uuid(), '4B7K', 'killa', 'Killa', 'llama-lulu', h, c, 2::smallint)
  from (values ('literal', true), ('literal', true), ('inferencial', true), ('inferencial', false), ('critica', true)) as t(h, c);
  update public.respuestas set creado_en = now() - interval '9 days'
  where estudiante_id = (select id from public.estudiantes where aula_id = v_aula and avatar_id = 'killa');
end $$;
