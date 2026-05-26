alter table "public"."tickets" add column "rank" text;

update "public"."tickets" as t
set "rank" = ranked.rank
from (
  select
    id,
    chr(96 + ((rn - 1) / 10 + 1)::integer) || ((rn - 1) % 10)::text as rank
  from (
    select
      id,
      row_number() over (partition by status order by id) as rn
    from "public"."tickets"
  ) as numbered
) as ranked
where t.id = ranked.id
  and t.rank is null;

alter table "public"."tickets" alter column "rank" set not null;

CREATE UNIQUE INDEX uq_tickets_status_rank ON public.tickets USING btree (status, rank);

alter table "public"."tickets" add constraint "uq_tickets_status_rank" UNIQUE using index "uq_tickets_status_rank";

alter table "public"."interventions" add column "rank" text;

update "public"."interventions" as i
set "rank" = ranked.rank
from (
  select
    id,
    chr(96 + ((rn - 1) / 10 + 1)::integer) || ((rn - 1) % 10)::text as rank
  from (
    select
      id,
      row_number() over (partition by status order by id) as rn
    from "public"."interventions"
  ) as numbered
) as ranked
where i.id = ranked.id
  and i.rank is null;

alter table "public"."interventions" alter column "rank" set not null;

CREATE UNIQUE INDEX uq_interventions_status_rank ON public.interventions USING btree (status, rank);

alter table "public"."interventions" add constraint "uq_interventions_status_rank" UNIQUE using index "uq_interventions_status_rank";