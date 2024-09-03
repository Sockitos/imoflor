/*
 ENUMS
 */
create type public.user_role as enum ('admin', 'manager', 'viewer');
create type public.gender as enum ('male', 'female', 'other');
create type public.marital_status as enum (
	'single',
	'married',
	'union',
	'divorced',
	'widowed'
);
create type public.property_type as enum ('building', 'terrain', 'house', 'garages');
create type public.fraction_type as enum (
	'apartment',
	'store',
	'garage',
	'house',
	'terrain'
);
create type public.contract_type as enum ('renting', 'lending');
create type public.ticket_priority as enum ('low', 'medium', 'high');
create type public.ticket_status as enum ('open', 'in_progress', 'resolved', 'cancelled');
create type public.intervention_type as enum ('new', 'renovation', 'maintenance');
create type public.intervention_status as enum (
	'not_started',
	'in_progress',
	'completed',
	'cancelled'
);
create type public.salary_type as enum ('hourly', 'monthly');
create type public.movement_type as enum (
	'rent',
	'installment_amortization',
	'installment_interest',
	'installment_extra_amortization',
	'intervention',
	'other'
);
/*
 TABLES
 */
/* USERS */
create table public.users (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	role user_role not null,
	display_name text not null,
	image_path text not null
);
/* TENANTS */
create table public.tenants (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	name text not null,
	nif text not null,
	gender gender not null,
	marital_status marital_status not null,
	nationality text not null,
	birth_date timestamp with time zone,
	id_type text,
	id_number text,
	id_expiration_date timestamp with time zone,
	ss_number text,
	country text,
	region text,
	address text,
	postal_code text,
	city text,
	email text,
	mobile text,
	phone text
);
/* VENDORS */
create table public.vendors (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	name text not null,
	nif text not null,
	description text,
	tags text [] not null default '{}'::text [],
	country text,
	region text,
	address text,
	postal_code text,
	city text,
	website text,
	email text,
	mobile text,
	phone text
);
/* EMPLOYEES */
create table public.employees (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	name text not null,
	nif text not null,
	gender gender not null,
	marital_status marital_status not null,
	nationality text not null,
	birth_date timestamp with time zone,
	id_type text,
	id_number text,
	id_expiration_date timestamp with time zone,
	ss_number text,
	country text,
	region text,
	address text,
	postal_code text,
	city text,
	email text,
	mobile text,
	phone text,
	position text not null,
	salary_type salary_type not null,
	salary double precision not null
);
/* MOVEMENTS */
create table public.movements (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	type movement_type not null,
	date timestamp with time zone not null,
	value double precision not null,
	nif text not null,
	description text not null
);
/* PROPERTIES */
create table public.properties (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	type property_type not null,
	is_multi_unit boolean not null,
	matrix text not null,
	sold boolean not null default false,
	area double precision,
	tipology text,
	description text,
	conservatory text,
	patrimonial_value double precision,
	market_value double precision,
	country text not null,
	region text not null,
	address text not null,
	postal_code text,
	city text not null
);
/* FRACTIONS */
create table public.fractions (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	type fraction_type not null,
	matrix text not null,
	sold boolean not null default false,
	area double precision,
	tipology text,
	description text,
	conservatory text,
	patrimonial_value double precision,
	market_value double precision,
	address text not null,
	property_id bigint not null references properties(id) on
    delete cascade
);
/* CONTRACTS */
create table public.contracts (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	type contract_type not null,
	start_date timestamp with time zone not null,
	end_date timestamp with time zone,
	fraction_id bigint not null references fractions(id) on
    delete cascade,
	is_active boolean not null default true,
	unique (id, type),
	unique (fraction_id, is_active)
);
/* CONTRACTS TENANTS */
create table public.contracts_tenants (
	contract_id bigint not null references contracts(id) on
    delete cascade,
	tenant_id bigint not null references tenants(id) on
    delete cascade,
	primary key (contract_id, tenant_id)
);
/* DUE NOTES */
create table public.due_notes (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	contract_id bigint not null references contracts(id) on
    delete cascade,
	due_date timestamp with time zone not null,
	value double precision not null
);
/* RENTING CONTRACTS */
create table public.renting_contracts (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	contract_type contract_type not null generated always as ('renting'::contract_type) stored,
	foreign key (id, contract_type) references contracts(id, type) on
    delete cascade
);
/* RENT UPDATES */
create table public.rent_updates (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	update_date timestamp with time zone not null,
	rent double precision not null,
	contract_id bigint not null references public.renting_contracts(id) on
    delete cascade
);
create index rent_updates_id_inserted_at_idx on public.rent_updates(id, inserted_at);
create index rent_updates_id_update_date_idx on public.rent_updates(id, update_date);
/* RENT PAYMENTS */
create table public.rent_payments (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	contract_id bigint not null references renting_contracts(id) on
    delete cascade,
	movement_id bigint not null references movements(id)
);
/* LENDING CONTRACTS */
create table public.lending_contracts (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	contract_type contract_type not null generated always as ('lending'::contract_type) stored,
	sale_value double precision not null,
	down_payment double precision not null,
	yearly_raise double precision not null,
	foreign key (id, contract_type) references contracts(id, type) on
    delete cascade
);
/* INSTALLMENT UPDATES */
create table public.installment_updates (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone default timezone('utc'::text, now()) not null,
	update_date timestamp with time zone not null,
	installment double precision not null,
	tax double precision not null,
	contract_id bigint not null references public.lending_contracts(id) on
    delete cascade
);
create index installment_updates_id_inserted_at_idx on public.installment_updates(id, inserted_at);
create index installment_updates_id_update_date_idx on public.installment_updates(id, update_date);
/* INSTALLMENT PAYMENTS */
create table public.installment_payments (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	contract_id bigint not null references lending_contracts(id) on
    delete cascade,
	interest_movement_id bigint not null references movements(id),
	amortization_movement_id bigint references movements(id),
	extra_amortization_movement_id bigint references movements(id),
	extra_debt double precision
);
/* TICKETS */
create table public.tickets (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	date timestamp with time zone not null,
	priority ticket_priority not null,
	status ticket_status not null,
	title text not null,
	description text not null,
	property_id bigint not null references properties(id) on
    delete cascade,
	fraction_id bigint references fractions(id)
);
/* INTERVENTIONS */
create table public.interventions (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	type intervention_type not null,
	status intervention_status not null,
	start_date timestamp with time zone not null,
	end_date timestamp with time zone,
	description text not null,
	property_id bigint not null references properties(id) on
    delete cascade,
	fraction_id bigint references fractions(id),
	ticket_id bigint references tickets(id)
);
/* INTERVENTION PAYMENTS */
create table public.intervention_payments (
	id bigint generated by default as identity primary key,
	inserted_at timestamp with time zone not null default timezone ('utc'::text, now()),
	intervention_id bigint not null references interventions(id) on
    delete cascade,
	movement_id bigint not null references movements(id)
);
/*
 VIEWS
 */
/* FRACTIONS */
create view public.fractions_view as
select f.*,
	p.country,
	p.region,
	p.address || ' ' || f.address as address_full,
	p.postal_code,
	p.city
from fractions f
	join properties p on f.property_id = p.id;
/* INTERVENTION PAYMENTS */
create view public.intervention_payments_view as
select ip.intervention_id,
	ip.id,
	m.value,
	m.date,
	m.description
from public.intervention_payments ip
	join public.movements m on ip.movement_id = m.id;
/* RENT PAYMENTS */
create view public.rent_payments_view as
select rp.contract_id,
	rp.id,
	m.value,
	m.date,
	m.description
from public.rent_payments rp
	join public.movements m on rp.movement_id = m.id;
/* INSTALLMENT PAYMENTS */
create view public.installment_payments_view as
select ip.contract_id,
	ip.id,
	a.date,
	a.description,
	i.value as interest,
	a.value as amortization,
	ea.value as extra_amortization,
	ip.extra_debt
from public.installment_payments ip
	join public.movements i on ip.amortization_movement_id = i.id
	join public.movements a on ip.interest_movement_id = a.id
	join public.movements ea on ip.extra_amortization_movement_id = ea.id;
/* CONTRACTS ACCOUNTS */
create view public.contracts_accounts_view as
select dn.contract_id,
	dn.id,
	'due_note' as type,
	dn.due_date as date,
	-1 * dn.value as value
from public.due_notes dn
union
select rp.contract_id,
	rp.id,
	'rent_payment' as type,
	rp.date as date,
	rp.value as value
from public.rent_payments_view rp
union
select ip.contract_id,
	ip.id,
	'installment_payment' as type,
	ip.date as date,
	ip.interest + ip.amortization + ip.extra_amortization as value
from public.installment_payments_view ip;
/* CONTRACTS BALANCES */
create view public.contracts_balances_view as
select ca.contract_id,
	sum(ca.value) as balance
from public.contracts c
	left join public.contracts_accounts_view ca on c.id = ca.contract_id
group by ca.contract_id;
/* RENTING CONTRACTS */
create view public.renting_contracts_view as
select rc.*,
	coalesce(active_updates.rent, 0) as rent,
	case
		when last_updates.update_date is null then null::json
		else json_build_object(
			'update_date',
			last_updates.update_date,
			'rent',
			coalesce(last_updates.rent, 0)
		)
	end as next_update
from public.renting_contracts rc
	left join (
		select distinct on (ru.contract_id) ru.contract_id,
			ru.rent,
			ru.update_date
		from public.rent_updates ru
		order by ru.contract_id,
			ru.inserted_at desc
	) as last_updates on rc.id = last_updates.contract_id
	left join (
		select distinct on (ru.contract_id) ru.contract_id,
			ru.rent,
			ru.update_date
		from public.rent_updates ru
		where ru.update_date <= timezone('utc'::text, now())
		order by ru.contract_id,
			ru.update_date desc
	) as active_updates on rc.id = active_updates.contract_id;
/* LENDING CONTRACTS DEBTS */
create view public.lending_contracts_debts_view as
select lc.id,
	lc.sale_value - lc.down_payment - sum(ip.amortization) as debt,
	sum(ip.extra_debt) as extra_debt,
	max(ip.date) as last_payment_date
from public.lending_contracts lc
	left join public.installment_payments_view ip on lc.id = ip.contract_id
group by lc.id;
/* LENDING CONTRACTS */
create view public.lending_contracts_view as
select lc.*,
	lcd.debt,
	lcd.extra_debt,
	lcd.last_payment_date,
	coalesce(active_updates.installment, 0) as installment,
	coalesce(active_updates.tax, 0) as tax,
	case
		when last_updates.update_date is null then null::json
		else json_build_object(
			'update_date',
			last_updates.update_date,
			'installment',
			coalesce(last_updates.installment, 0),
			'tax',
			coalesce(last_updates.tax, 0)
		)
	end as next_update
from public.lending_contracts lc
	left join public.lending_contracts_debts_view lcd on lc.id = lcd.id
	left join (
		select distinct on (iu.contract_id) iu.contract_id,
			iu.installment,
			iu.tax,
			iu.update_date
		from public.installment_updates iu
		order by iu.contract_id,
			iu.inserted_at desc
	) as last_updates on lc.id = last_updates.contract_id
	left join (
		select distinct on (iu.contract_id) iu.contract_id,
			iu.installment,
			iu.tax,
			iu.update_date
		from public.installment_updates iu
		where iu.update_date <= timezone('utc'::text, now())
		order by iu.contract_id,
			iu.update_date desc
	) as active_updates on lc.id = active_updates.contract_id;
/* CONTRACTS */
create view public.contracts_view as
select c.*,
	cb.balance,
	case
		when c.type = 'lending'::contract_type then json_build_object(
			'sale_value',
			lc.sale_value,
			'down_payment',
			lc.down_payment,
			'yearly_raise',
			lc.yearly_raise,
			'debt',
			lc.debt,
			'extra_debt',
			lc.extra_debt,
			'last_payment_date',
			lc.last_payment_date,
			'installment',
			lc.installment,
			'tax',
			lc.tax,
			'next_update',
			lc.next_update
		)
		when c.type = 'renting'::contract_type then json_build_object(
			'rent',
			rc.rent,
			'next_update',
			rc.next_update
		)
		else null::json
	end as data
from public.contracts c
	left join public.contracts_balances_view cb on c.id = cb.contract_id
	left join public.lending_contracts_view lc on c.id = lc.id
	left join public.renting_contracts_view rc on c.id = rc.id;
/*
 TRIGGERS
 */
/* INSERT FRACTION FROM PROPERTY */
create function public.insert_fraction_from_property() returns trigger as $$ begin if not new.is_multi_unit then
insert into fractions (
		type,
		matrix,
		sold,
		area,
		tipology,
		description,
		conservatory,
		patrimonial_value,
		market_value,
		address,
		property_id
	)
values (
		new.type::fraction_type,
		new.matrix,
		new.sold,
		new.area,
		new.tipology,
		new.description,
		new.conservatory,
		new.patrimonial_value,
		new.market_value,
		'',
		new.id
	);
end if;
return new;
end;
$$ language plpgsql;
create trigger insert_fraction_from_property
after
insert on public.properties for each row execute procedure public.insert_fraction_from_property();
/* UPDATE FRACTION FROM PROPERTY */
create function public.update_fraction_from_property() returns trigger as $$ begin if not new.is_multi_unit then
update fractions
set type = new.type,
	matrix = new.matrix,
	sold = new.sold,
	area = new.area,
	tipology = new.tipology,
	description = new.description,
	conservatory = new.conservatory,
	patrimonial_value = new.patrimonial_value,
	market_value = new.market_value,
	address = ''
where property_id = new.id;
end if;
return new;
end;
$$ language plpgsql;
create trigger update_fraction_from_property
after
update on properties for each row execute procedure public.update_fraction_from_property();
/* INSERT CONTRACT */
create function public.insert_contract() returns trigger as $$
declare contract_id bigint;
begin
insert into contracts (
		type,
		start_date,
		end_date,
		fraction_id
	)
values (
		new.type,
		new.start_date,
		new.end_date,
		new.fraction_id
	)
returning id into contract_id;
if new.type = 'renting' then
insert into renting_contracts (id)
values (contract_id);
insert into rent_updates (contract_id, update_date, rent)
values (
		contract_id,
		new.start_date,
		(new."data"->>'rent')::double precision
	);
elsif new.type = 'lending' then
insert into lending_contracts (id, sale_value, down_payment, yearly_raise)
values (
		contract_id,
		(new."data"->>'sale_value')::double precision,
		(new."data"->>'down_payment')::double precision,
		(new."data"->>'yearly_raise')::double precision
	);
insert into installment_updates (contract_id, update_date, installment, tax)
values (
		contract_id,
		new.start_date,
		(new."data"->>'installment')::double precision,
		(new."data"->>'tax')::double precision
	);
end if;
return new;
end;
$$ language plpgsql;
create trigger insert_contract instead of
insert on contracts_view for each row execute procedure public.insert_contract();
/* UPDATE CONTRACT */
create function public.update_contract() returns trigger as $$
declare contract_id bigint;
begin contract_id := new.id;
update contracts
set start_date = new.start_date,
	end_date = new.end_date,
	fraction_id = new.fraction_id
where id = contract_id;
if new.type = 'renting' then
insert into rent_updates (contract_id, update_date, rent)
values (
		contract_id,
		new.start_date,
		(new."data"->>'rent')::double precision
	);
elsif new.type = 'lending' then
update lending_contracts
set sale_value = (new."data"->>'sale_value')::double precision,
	down_payment = (new."data"->>'down_payment')::double precision,
	yearly_raise = (new."data"->>'yearly_raise')::double precision
where id = contract_id;
insert into installment_updates (contract_id, update_date, installment, tax)
values (
		contract_id,
		new.start_date,
		(new."data"->>'installment')::double precision,
		(new."data"->>'tax')::double precision
	);
end if;
return new;
end;
$$ language plpgsql;
create trigger update_contract instead of
update on contracts_view for each row execute procedure public.update_contract();
/* INSERT RENT PAYMENT */
create function public.insert_rent_payment() returns trigger as $$
declare movement_id bigint;
begin
insert into movements (type, nif, value, date, description)
values (
		'rent'::movement_type,
		new.nif,
		new.value,
		new.date,
		new.description
	)
returning id into movement_id;
insert into rent_payments (contract_id, movement)
values (new.contract_id, movement_id);
return new;
end;
$$ language plpgsql;
create trigger insert_rent_payment instead of
insert on rent_payments_view for each row execute procedure public.insert_rent_payment();
/* REMOVE RENT PAYMENT */
create function public.remove_rent_payment() returns trigger as $$ begin
delete from rent_payments
where id = old.id;
delete from movements
where id = old.movement_id;
return old;
end;
$$ language plpgsql;
create trigger remove_rent_payment instead of delete on rent_payments_view for each row execute procedure public.remove_rent_payment();
/* INSERT INSTALLMENT PAYMENT */
create function public.insert_installment_payment() returns trigger as $$
declare interest_movement_id bigint;
declare amortization_movement_id bigint;
declare extra_amortization_movement_id bigint;
begin
insert into movements (type, nif, value, date, description)
values (
		'installment_interest'::movement_type,
		new.nif,
		new.interest,
		new.date,
		new.description
	)
returning id into interest_movement_id;
insert into movements (type, nif, value, date, description)
values (
		'installment_amortization'::movement_type,
		new.nif,
		new.amortization,
		new.date,
		new.description
	)
returning id into amortization_movement_id;
insert into movements (type, nif, value, date, description)
values (
		'installment_extra_amortization'::movement_type,
		new.nif,
		new.extra_amortization,
		new.date,
		new.description
	)
returning id into extra_amortization_movement_id;
insert into installment_payments (
		contract,
		interest_movement_id,
		amortization_movement_id,
		extra_amortization_movement_id,
		extra_debt
	)
values (
		new.contract_id,
		interest_movement_id,
		amortization_movement_id,
		extra_amortization_movement_id,
		new.extra_debt
	);
return new;
end;
$$ language plpgsql;
create trigger insert_installment_payment instead of
insert on installment_payments_view for each row execute procedure public.insert_installment_payment();
/* REMOVE INSTALLMENT PAYMENT */
create function public.remove_installment_payment() returns trigger as $$ begin
delete from installment_payments
where id = old.id;
delete from movements
where id = old.interest_movement_id;
delete from movements
where id = old.amortization_movement_id;
delete from movements
where id = old.extra_amortization_movement_id;
return old;
end;
$$ language plpgsql;
create trigger remove_installment_payment instead of delete on installment_payments_view for each row execute procedure public.remove_installment_payment();
/* INSERT INTERVENTION PAYMENT */
create function public.insert_intervention_payment() returns trigger as $$
declare movement_id bigint;
begin
insert into movements (type, nif, value, date, description)
values (
		'intervention'::movement_type,
		new.nif,
		new.value,
		new.date,
		new.description
	)
returning id into movement_id;
insert into intervention_payments (intervention, movement)
values (new.intervention_id, movement_id);
return new;
end;
$$ language plpgsql;
create trigger insert_intervention_payment instead of
insert on intervention_payments_view for each row execute procedure public.insert_intervention_payment();
/* REMOVE INTERVENTION PAYMENT */
create function public.remove_intervention_payment() returns trigger as $$ begin
delete from intervention_payments
where id = old.id;
delete from movements
where id = old.movement_id;
return old;
end;
$$ language plpgsql;
create trigger remove_intervention_payment instead of delete on intervention_payments_view for each row execute procedure public.remove_intervention_payment();
/*
 CRON JOBS
 */
/* CREATE DUE NOTES */
create extension pg_cron with schema extensions;
grant usage on schema cron to postgres;
grant all privileges on all tables in schema cron to postgres;
select cron.schedule(
		'create-due-notes',
		'0 5 1 * *',
		$$
		INSERT INTO public.due_notes(date, value, contract)
		SELECT NOW(),
			CASE
				WHEN c.type = 'renting'::contract_type THEN rc.rent
				WHEN c.type = 'lending'::contract_type THEN lc.installment
				ELSE 0
			END,
			id
		FROM public.contracts_view as c
		WHERE c.is_active $$
	);