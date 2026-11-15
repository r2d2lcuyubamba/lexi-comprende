-- Pruebas de seguridad (HU-11, HU-15). Ejecutar en el SQL Editor de Supabase
-- y guardar captura del resultado como evidencia.
-- Cada bloque debe terminar con el mensaje "OK".

-- 1) La app del estudiante (rol anon) no ve ninguna respuesta ni aula
--    (RLS activo y sin políticas para anon: las consultas devuelven 0 filas)
set role anon;
select case when (select count(*) from public.respuestas) = 0
             and (select count(*) from public.aulas) = 0
            then 'OK: anon no ve datos' else 'FALLA' end as resultado;
reset role;

-- 2) Una docente no ve las aulas de otra docente
--    Reemplaza el uuid por el id de una docente que NO es dueña del aula 4B7K
set role authenticated;
select set_config('request.jwt.claims', '{"sub":"36c41a4a-2a1b-422c-94bf-26d87a7eb7d4","role":"authenticated"}', false);
select case when count(*) = 0 then 'OK: no ve aulas ajenas' else 'FALLA' end as resultado
from public.aulas where codigo = '4B7K';
reset role;
