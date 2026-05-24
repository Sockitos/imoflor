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