-- =====================================================================
-- Lexi Comprende · Sprint 2 · Backend Low Code en Supabase
-- HU-11 (roles) · HU-15 (protección de datos, Ley 29733) · HU-20 (aulas)
-- HU-21 (registro de respuestas) · HU-06 / HU-07 (vistas para el panel)
--
-- Las tablas pueden crearse en el Table Editor de Supabase; este archivo
-- deja la misma configuración versionada y reproducible.
-- Cómo usarlo: Supabase > SQL Editor > New query > pegar y ejecutar.
-- =====================================================================

-- ---------- 1. Perfiles de docentes y administradores (HU-11) ----------
create table if not exists public.perfiles (
  id        uuid primary key references auth.users (id) on delete cascade,
  nombre    text not null,
  rol       text not null default 'docente' check (rol in ('docente', 'admin')),
  creado_en timestamptz not null default now()
);

-- Crea el perfil automáticamente cuando un docente se registra en Supabase Auth
create or replace function public.crear_perfil()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nombre', split_part(new.email, '@', 1)));
  return new;
end $$;

drop trigger if exists al_registrar_docente on auth.users;
create trigger al_registrar_docente after insert on auth.users
  for each row execute function public.crear_perfil();

create or replace function public.es_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin');
$$;

-- ---------- 2. Aulas y código de acceso (HU-20) ----------
-- Código de 4 caracteres sin letras confusas (sin O/0 ni I/1)
create or replace function public.nuevo_codigo()
returns text language plpgsql volatile as $$
declare
  alfabeto text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  c text;
begin
  loop
    c := '';
    for i in 1..4 loop
      c := c || substr(alfabeto, 1 + floor(random() * length(alfabeto))::int, 1);
    end loop;
    exit when not exists (select 1 from public.aulas where codigo = c);
  end loop;
  return c;
end $$;

create table if not exists public.aulas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,                    -- p. ej. "4.° grado B"
  grado      smallint not null check (grado between 1 and 6),
  codigo     char(4) not null unique,
  docente_id uuid not null default auth.uid() references public.perfiles (id) on delete cascade,
  activa     boolean not null default true,
  creado_en  timestamptz not null default now()
);
alter table public.aulas alter column codigo set default public.nuevo_codigo();

-- Renovar el código: el anterior deja de funcionar (criterio de HU-20)
create or replace function public.renovar_codigo(p_aula uuid)
returns text language plpgsql security invoker as $$
declare c text := public.nuevo_codigo();
begin
  update public.aulas set codigo = c where id = p_aula;  -- RLS: solo el docente dueño
  if not found then raise exception 'Aula no encontrada o sin permiso'; end if;
  return c;
end $$;

-- ---------- 3. Estudiantes seudonimizados (HU-15, RNF-07) ----------
-- Sin nombre completo, DNI, correo ni fecha de nacimiento: solo alias + avatar.
create table if not exists public.estudiantes (
  id           uuid primary key default gen_random_uuid(),
  aula_id      uuid not null references public.aulas (id) on delete cascade,
  avatar_id    text not null,
  alias        text not null check (char_length(alias) <= 20),
  nivel_actual smallint not null default 2 check (nivel_actual between 1 and 5),
  creado_en    timestamptz not null default now(),
  unique (aula_id, avatar_id)
);

-- ---------- 4. Respuestas (HU-21) ----------
create table if not exists public.respuestas (
  id            bigint generated always as identity primary key,
  id_cliente    uuid not null unique,          -- evita duplicados al reenviar sin conexión
  estudiante_id uuid not null references public.estudiantes (id) on delete cascade,
  lectura_id    text not null,
  habilidad     text not null check (habilidad in ('literal', 'inferencial', 'critica')),
  correcta      boolean not null,              -- solo el primer intento
  nivel         smallint not null check (nivel between 1 and 5),
  creado_en     timestamptz not null default now()
);
create index if not exists respuestas_estudiante_fecha on public.respuestas (estudiante_id, creado_en desc);

-- ---------- 5. Funciones públicas para la app del estudiante ----------
-- La app NO tiene acceso directo a las tablas: solo puede llamar a estas dos funciones.

-- Valida un código de aula y devuelve solo el nombre del aula
create or replace function public.validar_codigo(p_codigo text)
returns text language sql stable security definer set search_path = public as $$
  select nombre from public.aulas where codigo = upper(p_codigo) and activa;
$$;

-- Registra el primer intento de una respuesta. Idempotente gracias a id_cliente.
create or replace function public.registrar_respuesta(
  p_id_cliente uuid, p_codigo text, p_avatar text, p_alias text,
  p_lectura text, p_habilidad text, p_correcta boolean, p_nivel smallint)
returns void language plpgsql security definer set search_path = public as $$
declare v_aula uuid; v_est uuid;
begin
  select id into v_aula from aulas where codigo = upper(p_codigo) and activa;
  if v_aula is null then raise exception 'Código de aula no válido'; end if;

  insert into estudiantes (aula_id, avatar_id, alias, nivel_actual)
  values (v_aula, p_avatar, left(p_alias, 20), p_nivel)
  on conflict (aula_id, avatar_id) do update set nivel_actual = excluded.nivel_actual
  returning id into v_est;

  insert into respuestas (id_cliente, estudiante_id, lectura_id, habilidad, correcta, nivel)
  values (p_id_cliente, v_est, p_lectura, p_habilidad, p_correcta, p_nivel)
  on conflict (id_cliente) do nothing;
end $$;

revoke all on function public.registrar_respuesta(uuid, text, text, text, text, text, boolean, smallint) from public;
revoke all on function public.validar_codigo(text) from public;
grant execute on function public.registrar_respuesta(uuid, text, text, text, text, text, boolean, smallint) to anon, authenticated;
grant execute on function public.validar_codigo(text) to anon, authenticated;

-- ---------- 6. Seguridad por filas (RLS) — HU-11 y HU-15 ----------
alter table public.perfiles    enable row level security;
alter table public.aulas       enable row level security;
alter table public.estudiantes enable row level security;
alter table public.respuestas  enable row level security;

drop policy if exists "perfil propio" on public.perfiles;
create policy "perfil propio" on public.perfiles
  for select to authenticated using (id = auth.uid() or public.es_admin());

drop policy if exists "docente gestiona sus aulas" on public.aulas;
create policy "docente gestiona sus aulas" on public.aulas
  for all to authenticated
  using (docente_id = auth.uid() or public.es_admin())
  with check (docente_id = auth.uid() or public.es_admin());

drop policy if exists "docente ve estudiantes de sus aulas" on public.estudiantes;
create policy "docente ve estudiantes de sus aulas" on public.estudiantes
  for select to authenticated
  using (exists (select 1 from public.aulas a where a.id = aula_id and (a.docente_id = auth.uid() or public.es_admin())));

drop policy if exists "docente ve respuestas de sus aulas" on public.respuestas;
create policy "docente ve respuestas de sus aulas" on public.respuestas
  for select to authenticated
  using (exists (select 1 from public.estudiantes e join public.aulas a on a.id = e.aula_id
                 where e.id = estudiante_id and (a.docente_id = auth.uid() or public.es_admin())));
-- El rol anon (app del estudiante) no tiene ninguna política: no puede leer ni escribir tablas.

-- ---------- 7. Vistas para el panel docente (Appsmith) ----------
-- security_invoker = true hace que las vistas respeten el RLS de quien consulta.

-- HU-06: % de aciertos por aula, semana y nivel de comprensión
create or replace view public.v_aciertos_habilidad with (security_invoker = true) as
select a.id as aula_id, a.nombre as aula,
       date_trunc('week', r.creado_en)::date as semana,
       r.habilidad,
       count(*) as respuestas,
       round(100.0 * avg(case when r.correcta then 1 else 0 end), 1) as pct_aciertos
from public.respuestas r
join public.estudiantes e on e.id = r.estudiante_id
join public.aulas a on a.id = e.aula_id
group by a.id, a.nombre, semana, r.habilidad;

-- HU-07: alertas tempranas
--   Urgente : ≤ 40 % de aciertos en las 2 últimas lecturas
--   Atención: 7 días o más sin leer
create or replace view public.v_alertas with (security_invoker = true) as
with por_lectura as (
  select r.estudiante_id, r.lectura_id, max(r.creado_en) as fecha,
         avg(case when r.correcta then 1.0 else 0 end) as pct
  from public.respuestas r
  group by r.estudiante_id, r.lectura_id
),
ultimas as (
  select *, row_number() over (partition by estudiante_id order by fecha desc) as n
  from por_lectura
),
resumen as (
  select estudiante_id,
         count(*) filter (where n <= 2)                 as lecturas_recientes,
         max(pct) filter (where n <= 2)                 as mejor_pct_reciente,
         max(fecha)                                     as ultima_lectura
  from ultimas group by estudiante_id
)
select e.id as estudiante_id, e.aula_id, e.alias, e.avatar_id, e.nivel_actual,
       s.ultima_lectura,
       case when s.lecturas_recientes = 2 and s.mejor_pct_reciente <= 0.4 then 'Urgente'
            else 'Atención' end as prioridad,
       case when s.lecturas_recientes = 2 and s.mejor_pct_reciente <= 0.4
              then '≤ 40 % de aciertos en sus 2 últimas lecturas'
            else 'Lleva 7 días o más sin leer' end as motivo,
       case when s.lecturas_recientes = 2 and s.mejor_pct_reciente <= 0.4
              then 'Lectura guiada en pequeño grupo con un texto de su nivel'
            else 'Conversar con el estudiante y su familia sobre su hábito lector' end as accion_sugerida
from public.estudiantes e
join resumen s on s.estudiante_id = e.id
where (s.lecturas_recientes = 2 and s.mejor_pct_reciente <= 0.4)
   or s.ultima_lectura < now() - interval '7 days';
