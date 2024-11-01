-- User
insert into auth.users (
		instance_id,
		id,
		aud,
		role,
		email,
		encrypted_password,
		email_confirmed_at,
		recovery_sent_at,
		last_sign_in_at,
		raw_app_meta_data,
		raw_user_meta_data,
		created_at,
		updated_at,
		confirmation_token,
		email_change,
		email_change_token_new,
		recovery_token
	)
values (
		'00000000-0000-0000-0000-000000000000',
		uuid_generate_v4 (),
		'authenticated',
		'authenticated',
		'joao.nogueira@imoflor.pt',
		crypt ('Password123', gen_salt ('bf')),
		current_timestamp,
		current_timestamp,
		current_timestamp,
		'{"provider":"email","providers":["email"]}',
		'{"display_name": "João Nogueira"}',
		current_timestamp,
		current_timestamp,
		'',
		'',
		'',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		uuid_generate_v4 (),
		'authenticated',
		'authenticated',
		'goncalo.nogueira@imoflor.pt',
		crypt ('Password123', gen_salt ('bf')),
		current_timestamp,
		current_timestamp,
		current_timestamp,
		'{"provider":"email","providers":["email"]}',
		'{"display_name": "Gonçalo Nogueira"}',
		current_timestamp,
		current_timestamp,
		'',
		'',
		'',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		uuid_generate_v4 (),
		'authenticated',
		'authenticated',
		'paula.raimundo@imoflor.pt',
		crypt ('Password123', gen_salt ('bf')),
		current_timestamp,
		current_timestamp,
		current_timestamp,
		'{"provider":"email","providers":["email"]}',
		'{"display_name": "Paula Raimundo"}',
		current_timestamp,
		current_timestamp,
		'',
		'',
		'',
		''
	),
	(
		'00000000-0000-0000-0000-000000000000',
		uuid_generate_v4 (),
		'authenticated',
		'authenticated',
		'patricia.pereira@imoflor.pt',
		crypt ('Password123', gen_salt ('bf')),
		current_timestamp,
		current_timestamp,
		current_timestamp,
		'{"provider":"email","providers":["email"]}',
		'{"display_name": "Patrícia Pereira"}',
		current_timestamp,
		current_timestamp,
		'',
		'',
		'',
		''
	);
insert into auth.identities (
		id,
		user_id,
		provider_id,
		identity_data,
		provider,
		last_sign_in_at,
		created_at,
		updated_at
	) (
		select uuid_generate_v4 (),
			id,
			id,
			format('{"sub":"%s","email":"%s"}', id::text, email)::jsonb,
			'email',
			current_timestamp,
			current_timestamp,
			current_timestamp
		from auth.users
	);
insert into public.tenants (
		name,
		gender,
		marital_status,
		nationality,
		birth_date,
		id_type,
		id_expiration_date,
		id_number,
		tax_id_number,
		country,
		region,
		address,
		postal_code,
		city,
		email,
		mobile,
		phone
	)
values (
		'John Lorem Ipsum Doe',
		'male',
		'single',
		'Português',
		'1990-01-01',
		'Cartão de Cidadão',
		'2025-01-01',
		'123456789',
		'123456789',
		'Portugal',
		'Lisboa',
		'Avenida Rua de Lisboa',
		'0000-000',
		'Lisboa',
		'example@example.com',
		'123456789',
		'123456789'
	);
insert into public.vendors (
		name,
		tax_id_number,
		description,
		tags,
		country,
		region,
		address,
		postal_code,
		city,
		email,
		mobile,
		phone,
		website
	)
values (
		'Lorem Ipsum Inc.',
		'123456789',
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio.',
		array ['lorem', 'ipsum'],
		'Portugal',
		'Lisboa',
		'Avenida Rua de Lisboa',
		'0000-000',
		'Lisboa',
		'example@example.com',
		'123456789',
		'123456789',
		'https://www.loremipsum.com'
	);
insert into public.employees (
		name,
		gender,
		marital_status,
		nationality,
		birth_date,
		id_type,
		id_expiration_date,
		id_number,
		tax_id_number,
		ss_number,
		country,
		region,
		address,
		postal_code,
		city,
		email,
		mobile,
		phone,
		position,
		salary_type,
		salary
	)
values (
		'John Lorem Ipsum Doe',
		'male',
		'single',
		'Português',
		'1990-01-01',
		'Cartão de Cidadão',
		'2025-01-01',
		'123456789',
		'123456789',
		'123456789',
		'Portugal',
		'Lisboa',
		'Avenida Rua de Lisboa',
		'0000-000',
		'Lisboa',
		'example@example.com',
		'123456789',
		'123456789',
		'Employee',
		'hourly',
		'10'
	);
insert into public.properties (
		class,
		type,
		is_multi_unit,
		matrix,
		conservatory,
		area,
		tipology,
		description,
		patrimonial_value,
		market_value,
		country,
		region,
		address,
		postal_code,
		city
	)
values (
		'urban',
		'building',
		true,
		'U-001',
		'Lisboa',
		'1000',
		'BIG',
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio.',
		'100000',
		'150000',
		'Portugal',
		'Lisboa',
		'Avenida Rua de Lisboa',
		'0000-000',
		'Lisboa'
	);
insert into public.fractions (
		type,
		matrix,
		area,
		tipology,
		description,
		patrimonial_value,
		market_value,
		address,
		property_id
	)
values (
		'apartment',
		'U-001A',
		'100',
		'T2',
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla nec odio.',
		'100000',
		'150000',
		'Avenida Rua de Lisboa',
		(
			select id
			from public.properties
			limit 1
		)
	);
insert into public.contracts_view (
		type,
		start_date,
		end_date,
		fraction_id,
		is_active,
		data
	)
values (
		'renting',
		'2024-01-01',
		'2025-01-01',
		(
			select id
			from public.fractions
			limit 1
		), true,
		'{"rent": 1000}'
	);
insert into public.contracts_tenants (contract_id, tenant_id)
values (
		(
			select id
			from public.contracts_view
			limit 1
		), (
			select id
			from public.tenants
			limit 1
		)
	);