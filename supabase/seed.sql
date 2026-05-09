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
	),
	(
		'00000000-0000-0000-0000-000000000000',
		uuid_generate_v4 (),
		'authenticated',
		'authenticated',
		'tomasviana_cof@hotmail.com',
		crypt ('Password123', gen_salt ('bf')),
		current_timestamp,
		current_timestamp,
		current_timestamp,
		'{"provider":"email","providers":["email"]}',
		'{"display_name": "Tomás Figueiredo"}',
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

insert into public.addresses (
		id,
		country,
		region,
		address,
		postal_code,
		city
	)
values (
		1,
		'Portugal',
		'Lisboa',
		'Rua da Escola, 14',
		'1700-123',
		'Lisboa'
	),
	(
		2,
		'Portugal',
		'Porto',
		'Avenida dos Aliados, 210',
		'4000-064',
		'Porto'
	),
	(
		3,
		'Portugal',
		'Faro',
		'Rua do Mercado, 7',
		'8000-269',
		'Faro'
	),
	(
		4,
		'Portugal',
		'Lisboa',
		'Rua do Vale, 22',
		'1900-429',
		'Lisboa'
	),
	(
		5,
		'Portugal',
		'Porto',
		'Rua de Camões, 118',
		'4000-144',
		'Porto'
	),
	(
		6,
		'Portugal',
		'Faro',
		'Estrada de São Luís, 5',
		'8000-123',
		'Faro'
	),
	(
		7,
		'Portugal',
		'Lisboa',
		'Rua das Flores, 18',
		'1200-195',
		'Lisboa'
	),
	(
		8,
		'Portugal',
		'Porto',
		'Rua do Almada, 302',
		'4050-038',
		'Porto'
	),
	(
		9,
		'Portugal',
		'Faro',
		'Rua do Sol, 9',
		'8000-312',
		'Faro'
	),
	(
		10,
		'Portugal',
		'Évora',
		'Caminho da Herdade Nova',
		'7005-837',
		'Évora'
	),
	(
		11,
		'Portugal',
		'Lisboa',
		'Rua da Prata, 10',
		'1100-414',
		'Lisboa'
	),
	(
		12,
		'Portugal',
		'Lisboa',
		'Avenida de Roma, 55',
		'1700-342',
		'Lisboa'
	),
	(
		13,
		'Portugal',
		'Porto',
		'Rua de Cedofeita, 89',
		'4050-174',
		'Porto'
	),
	(
		14,
		'Portugal',
		'Faro',
		'Rua Vasco da Gama, 41',
		'8000-442',
		'Faro'
	);

insert into public.employees (
		id,
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
		address_id,
		email,
		mobile,
		position,
		salary_type,
		salary
	)
values (
		1,
		'Mariana Costa',
		'female',
		'married',
		'Portuguesa',
		'1986-04-12 00:00:00+00',
		'Cartão de Cidadão',
		'2030-04-12 00:00:00+00',
		'15483927 4ZX6',
		'214563987',
		'12004567891',
		1,
		'mariana.costa@imoflor.pt',
		'+351 910 100 101',
		'Gestora de imóveis',
		'monthly',
		1650
	),
	(
		2,
		'Rui Almeida',
		'male',
		'single',
		'Portuguesa',
		'1991-09-22 00:00:00+00',
		'Cartão de Cidadão',
		'2029-09-22 00:00:00+00',
		'18374620 8ZY3',
		'228901456',
		'12008765432',
		2,
		'rui.almeida@imoflor.pt',
		'+351 910 100 102',
		'Técnico de manutenção',
		'monthly',
		1350
	),
	(
		3,
		'Sofia Martins',
		'female',
		'union',
		'Portuguesa',
		'1989-01-08 00:00:00+00',
		'Cartão de Cidadão',
		'2031-01-08 00:00:00+00',
		'19283746 1ZX2',
		'236789012',
		'12003456789',
		3,
		'sofia.martins@imoflor.pt',
		'+351 910 100 103',
		'Administrativa',
		'monthly',
		1200
	);

insert into public.vendors (
		id,
		name,
		tax_id_number,
		description,
		tags,
		address_id,
		email,
		mobile,
		phone,
		website
	)
values (
		1,
		'Canalizações Tejo, Lda.',
		'510234987',
		'Serviços de canalização e deteção de fugas.',
		'{"canalização","urgências","manutenção"}',
		4,
		'geral@canalizacoestejo.pt',
		'+351 910 200 201',
		'+351 218 100 200',
		'https://canalizacoestejo.example'
	),
	(
		2,
		'ElectroNorte Serviços',
		'509876123',
		'Instalações elétricas, quadros e certificações.',
		'{"eletricidade","certificação","obra"}',
		5,
		'contacto@electronorte.example',
		'+351 910 200 202',
		'+351 222 100 300',
		'https://electronorte.example'
	),
	(
		3,
		'Algarve Pinturas',
		'516543210',
		'Pintura interior, exterior e pequenos acabamentos.',
		'{"pintura","acabamentos","renovação"}',
		6,
		'orcamentos@algarvepinturas.example',
		'+351 910 200 203',
		NULL,
		'https://algarvepinturas.example'
	);

insert into public.properties (
		id,
		class,
		type,
		matrix,
		conservatory,
		area,
		tipology,
		fraction,
		description,
		patrimonial_value,
		market_value,
		address_id,
		sold,
		parent_id
	)
values (
		1,
		'urban',
		'building',
		'LX-1123-U',
		'Lisboa 2ª CRP - 45812',
		420,
		NULL,
		NULL,
		'Prédio urbano com habitação, loja e garagem.',
		385000,
		735000,
		7,
		FALSE,
		NULL
	),
	(
		2,
		'urban',
		'building',
		'PT-2048-U',
		'Porto 1ª CRP - 77125',
		260,
		NULL,
		NULL,
		'Edifício no centro do Porto com duas frações.',
		245000,
		495000,
		8,
		FALSE,
		NULL
	),
	(
		3,
		'urban',
		'house',
		'FR-8842-U',
		'Faro CRP - 19045',
		180,
		'T3',
		NULL,
		'Moradia com logradouro próxima do centro.',
		210000,
		365000,
		9,
		FALSE,
		NULL
	),
	(
		4,
		'rustic',
		'terrain',
		'EV-7301-R',
		'Évora CRP - 55291',
		2200,
		NULL,
		NULL,
		'Terreno rústico com acesso por estrada municipal.',
		45000,
		79000,
		10,
		FALSE,
		NULL
	),
	(
		5,
		'urban',
		'apartment',
		'LX-1123-A',
		'Lisboa 2ª CRP - 45812',
		95,
		'T2',
		'1º Esq.',
		'Primeiro andar esquerdo com varanda.',
		98000,
		235000,
		7,
		FALSE,
		1
	),
	(
		6,
		'urban',
		'store',
		'LX-1123-B',
		'Lisboa 2ª CRP - 45812',
		80,
		NULL,
		'Loja A',
		'Loja ao nível da rua com montra.',
		87000,
		190000,
		7,
		FALSE,
		1
	),
	(
		7,
		'urban',
		'garage',
		'LX-1123-C',
		'Lisboa 2ª CRP - 45812',
		24,
		NULL,
		'Garagem 1',
		'Garagem fechada para uma viatura.',
		18000,
		32000,
		7,
		FALSE,
		1
	),
	(
		8,
		'urban',
		'apartment',
		'PT-2048-A',
		'Porto 1ª CRP - 77125',
		110,
		'T3',
		'2º Frente',
		'Apartamento renovado no segundo piso.',
		125000,
		285000,
		8,
		FALSE,
		2
	),
	(
		9,
		'urban',
		'garage',
		'PT-2048-B',
		'Porto 1ª CRP - 77125',
		18,
		NULL,
		'Cave - Lugar 4',
		'Lugar de garagem em cave.',
		14500,
		26000,
		8,
		FALSE,
		2
	);

insert into public.tenants (
		id,
		name,
		gender,
		marital_status,
		nationality,
		birth_date,
		id_type,
		id_expiration_date,
		id_number,
		tax_id_number,
		address_id,
		email,
		mobile,
		phone
	)
values (
		1,
		'Ana Ribeiro',
		'female',
		'single',
		'Portuguesa',
		'1993-05-17 00:00:00+00',
		'Cartão de Cidadão',
		'2030-05-17 00:00:00+00',
		'14567890 5ZX1',
		'245789123',
		11,
		'ana.ribeiro@example.com',
		'+351 930 300 301',
		NULL
	),
	(
		2,
		'Tiago Fernandes',
		'male',
		'married',
		'Portuguesa',
		'1984-11-03 00:00:00+00',
		'Cartão de Cidadão',
		'2028-11-03 00:00:00+00',
		'16789432 7ZY9',
		'213456789',
		12,
		'tiago.fernandes@example.com',
		'+351 930 300 302',
		NULL
	),
	(
		3,
		'Beatriz Sousa',
		'female',
		'divorced',
		'Brasileira',
		'1978-02-28 00:00:00+00',
		'Título de Residência',
		'2027-02-28 00:00:00+00',
		'TR845612',
		'287654321',
		13,
		'beatriz.sousa@example.com',
		'+351 930 300 303',
		'+351 222 333 444'
	),
	(
		4,
		'Miguel Santos',
		'male',
		'union',
		'Portuguesa',
		'1981-07-09 00:00:00+00',
		'Cartão de Cidadão',
		'2029-07-09 00:00:00+00',
		'17654321 9ZX4',
		'224567890',
		14,
		'miguel.santos@example.com',
		'+351 930 300 304',
		NULL
	);

insert into public.contracts (
		id,
		type,
		start_date,
		end_date,
		property_id,
		is_active
	)
values (
		1,
		'renting',
		'2025-01-01 00:00:00+00',
		NULL,
		5,
		TRUE
	),
	(
		2,
		'renting',
		'2025-02-01 00:00:00+00',
		NULL,
		6,
		TRUE
	),
	(
		3,
		'lending',
		'2024-09-01 00:00:00+00',
		NULL,
		3,
		TRUE
	),
	(
		4,
		'renting',
		'2024-01-01 00:00:00+00',
		'2024-12-31 00:00:00+00',
		8,
		FALSE
	);

insert into public.renting_contracts (id)
values (1),
	(2),
	(4);

insert into public.lending_contracts (
		id,
		sale_value,
		down_payment,
		yearly_raise
	)
values (
		3,
		365000,
		50000,
		2.5
	);

insert into public.rent_updates (
		id,
		update_date,
		rent,
		contract_id
	)
values (
		1,
		'2025-01-01 00:00:00+00',
		950,
		1
	),
	(
		2,
		'2026-01-01 00:00:00+00',
		985,
		1
	),
	(
		3,
		'2025-02-01 00:00:00+00',
		1250,
		2
	),
	(
		4,
		'2024-01-01 00:00:00+00',
		1100,
		4
	);

insert into public.installment_updates (
		id,
		update_date,
		installment,
		interest,
		contract_id
	)
values (
		1,
		'2024-09-01 00:00:00+00',
		1400,
		320,
		3
	),
	(
		2,
		'2025-09-01 00:00:00+00',
		1435,
		295,
		3
	);

insert into public.contracts_tenants (contract_id, tenant_id)
values (1, 1),
	(2, 2),
	(2, 3),
	(3, 4),
	(4, 3);

insert into public.due_notes (
		id,
		contract_id,
		due_date,
		value
	)
values (
		1,
		1,
		'2026-04-01 00:00:00+00',
		985
	),
	(
		2,
		2,
		'2026-04-01 00:00:00+00',
		1250
	),
	(
		3,
		3,
		'2026-04-01 00:00:00+00',
		1435
	);

insert into public.movements (
		id,
		type,
		date,
		value,
		tax_id_number,
		description
	)
values (
		1,
		'rent',
		'2026-04-03 00:00:00+00',
		985,
		'245789123',
		'Renda de abril - Rua das Flores 1º Esq.'
	),
	(
		2,
		'rent',
		'2026-04-05 00:00:00+00',
		1250,
		'213456789',
		'Renda de abril - Loja A'
	),
	(
		3,
		'installment_interest',
		'2026-04-10 00:00:00+00',
		295,
		'224567890',
		'Juros da prestação de abril'
	),
	(
		4,
		'installment_amortization',
		'2026-04-10 00:00:00+00',
		1140,
		'224567890',
		'Amortização da prestação de abril'
	),
	(
		5,
		'intervention',
		'2026-03-21 00:00:00+00',
		420,
		'510234987',
		'Reparação de fuga na cozinha'
	),
	(
		6,
		'intervention',
		'2026-02-14 00:00:00+00',
		780,
		'516543210',
		'Pintura do apartamento'
	),
	(
		7,
		'other',
		'2026-04-15 00:00:00+00',
		65,
		NULL,
		'Taxa municipal de conservação'
	);

insert into public.rent_payments (
		id,
		contract_id,
		movement_id
	)
values (
		1,
		1,
		1
	),
	(
		2,
		2,
		2
	);

insert into public.installment_payments (
		id,
		contract_id,
		interest_movement_id,
		amortization_movement_id,
		extra_debt
	)
values (
		1,
		3,
		3,
		4,
		0
	);

insert into public.tickets (
		id,
		date,
		priority,
		status,
		title,
		description,
		property_id
	)
values (
		1,
		'2026-03-18 09:30:00+00',
		'high',
		'resolved',
		'Fuga de água na cozinha',
		'O inquilino reportou humidade junto ao lava-loiça.',
		5
	),
	(
		2,
		'2026-04-08 14:15:00+00',
		'medium',
		'in_progress',
		'Falha no quadro elétrico',
		'Disjuntor dispara quando são ligados vários equipamentos.',
		8
	),
	(
		3,
		'2026-04-20 10:00:00+00',
		'low',
		'open',
		'Limpeza de terreno',
		'Vegetação alta junto à entrada da parcela.',
		4
	);

insert into public.interventions (
		id,
		type,
		status,
		start_date,
		end_date,
		description,
		property_id,
		ticket_id
	)
values (
		1,
		'maintenance',
		'completed',
		'2026-03-20 08:00:00+00',
		'2026-03-20 12:00:00+00',
		'Substituição de sifão e vedação de tubagem.',
		5,
		1
	),
	(
		2,
		'renovation',
		'completed',
		'2026-02-10 08:00:00+00',
		'2026-02-13 18:00:00+00',
		'Pintura geral após saída de inquilino.',
		8,
		NULL
	),
	(
		3,
		'maintenance',
		'in_progress',
		'2026-04-09 09:00:00+00',
		NULL,
		'Diagnóstico e substituição de quadro elétrico.',
		8,
		2
	);

insert into public.intervention_payments (
		id,
		intervention_id,
		movement_id
	)
values (
		1,
		1,
		5
	),
	(
		2,
		2,
		6
	);

select setval(pg_get_serial_sequence('public.employees', 'id'), (select max(id) from public.employees));

select setval(pg_get_serial_sequence('public.vendors', 'id'), (select max(id) from public.vendors));

select setval(pg_get_serial_sequence('public.addresses', 'id'), (select max(id) from public.addresses));

select setval(pg_get_serial_sequence('public.properties', 'id'), (select max(id) from public.properties));

select setval(pg_get_serial_sequence('public.tenants', 'id'), (select max(id) from public.tenants));

select setval(pg_get_serial_sequence('public.contracts', 'id'), (select max(id) from public.contracts));

select setval(pg_get_serial_sequence('public.renting_contracts', 'id'), (select max(id) from public.renting_contracts));

select setval(pg_get_serial_sequence('public.lending_contracts', 'id'), (select max(id) from public.lending_contracts));

select setval(pg_get_serial_sequence('public.rent_updates', 'id'), (select max(id) from public.rent_updates));

select setval(pg_get_serial_sequence('public.installment_updates', 'id'), (select max(id) from public.installment_updates));

select setval(pg_get_serial_sequence('public.due_notes', 'id'), (select max(id) from public.due_notes));

select setval(pg_get_serial_sequence('public.movements', 'id'), (select max(id) from public.movements));

select setval(pg_get_serial_sequence('public.rent_payments', 'id'), (select max(id) from public.rent_payments));

select setval(pg_get_serial_sequence('public.installment_payments', 'id'), (select max(id) from public.installment_payments));

select setval(pg_get_serial_sequence('public.tickets', 'id'), (select max(id) from public.tickets));

select setval(pg_get_serial_sequence('public.interventions', 'id'), (select max(id) from public.interventions));

select setval(pg_get_serial_sequence('public.intervention_payments', 'id'), (select max(id) from public.intervention_payments));