-- META-PETS-003: allow the Facebook->WhatsApp bridge page's two new
-- trackPets() events into the existing first-party lifecycle-events log.
-- Without this, psa_pets_lifecycle_events silently rejects the insert under
-- RLS (Vercel Analytics + the Meta Pixel still receive the event either way
-- - only this internal log was affected).
--
-- The original inline `check (event in (...))` constraint has no fixed name
-- to rely on across environments, so locate it by its actual definition
-- (not just "some single-column check on event") before dropping and
-- re-adding it with an explicit name. Matching on conkey/attname alone would
-- risk dropping a different, unrelated single-column check on `event` if one
-- is ever added; matching on the known original allow-list values pins this
-- to the specific enum constraint. Safe to rerun: each run re-verifies the
-- current constraint's definition before touching it.
do $$
declare
  v_constraint_name text;
begin
  select con.conname into v_constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_attribute att on att.attrelid = rel.oid and att.attnum = any (con.conkey)
  where rel.relname = 'psa_pets_lifecycle_events'
    and con.contype = 'c'
    and att.attname = 'event'
    and array_length(con.conkey, 1) = 1
    and pg_get_constraintdef(con.oid) like '%pets_catalog_viewed%'
    and pg_get_constraintdef(con.oid) like '%pets_reorder_started%';

  if v_constraint_name is not null then
    execute format('alter table public.psa_pets_lifecycle_events drop constraint %I', v_constraint_name);
  end if;
end $$;

alter table public.psa_pets_lifecycle_events
  add constraint psa_pets_lifecycle_events_event_check check (event in (
    'pets_catalog_viewed',
    'pets_research_navigator_started',
    'pets_research_navigator_completed',
    'pets_evidence_opened',
    'pets_waitlist_started',
    'pets_waitlist_joined',
    'pets_collagen_added',
    'pets_checkout_started',
    'pets_checkout_consent_accepted',
    'pets_marketing_consent_granted',
    'pets_order_created',
    'pets_eft_instructions_shown',
    'pets_portal_viewed',
    'pets_portal_orders_viewed',
    'pets_portal_reports_viewed',
    'pets_reorder_started',
    'pets_bridge_viewed',
    'pets_whatsapp_click'
  ));

drop policy if exists psa_pets_lifecycle_events_anon_insert on public.psa_pets_lifecycle_events;
create policy psa_pets_lifecycle_events_anon_insert
on public.psa_pets_lifecycle_events
for insert
to anon
with check (
  event in (
    'pets_catalog_viewed',
    'pets_research_navigator_started',
    'pets_research_navigator_completed',
    'pets_evidence_opened',
    'pets_waitlist_started',
    'pets_waitlist_joined',
    'pets_collagen_added',
    'pets_checkout_started',
    'pets_bridge_viewed',
    'pets_whatsapp_click'
  )
  and user_id is null
  and order_id is null
);
