alter table "public"."employees" add constraint "chk_employees_birth_date_at_least_18_years_old" CHECK (((birth_date IS NULL) OR ((birth_date IS NOT NULL) AND (EXTRACT(year FROM age(birth_date)) >= (18)::numeric)))) not valid;

alter table "public"."employees" validate constraint "chk_employees_birth_date_at_least_18_years_old";


