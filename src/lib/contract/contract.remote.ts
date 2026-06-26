import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { setFlash } from 'sveltekit-flash-message/server';
import {
	contractSchema,
	createDueNoteSchema,
	createInstallmentPaymentSchema,
	createInstallmentUpdateSchema,
	createRentPaymentSchema,
	createRentUpdateSchema,
	deleteContractSchema,
} from './schemas';
import type { Contract, ContractAccountItem, InstallmentUpdate, RentUpdate } from './types';

export const getContracts = query<Contract[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: contracts, error: contractsError } = await supabase
		.from('contracts_view')
		.select(
			'*, tenants:tenants!inner (id, label:name), property:properties!inner (id, ...addresses(label:address))'
		)
		.returns<Contract[]>();

	if (contractsError) {
		error(500, 'Error fetching contracts, please try again later.');
	}

	return contracts;
});

export const getContract = query<z.ZodNumber, Contract>(z.number(), async (id) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: contract, error: contractError } = await supabase
		.from('contracts_view')
		.select(
			'*, tenants:tenants!inner (id, label:name), property:properties!inner (id, ...addresses(label:address))'
		)
		.eq('id', id)
		.returns<Contract[]>()
		.single();

	if (contractError) {
		error(500, 'Error fetching contract, please try again later.');
	}

	return contract;
});

export const getContractAccount = query<z.ZodNumber, ContractAccountItem[]>(
	z.number(),
	async (contractId) => {
		const {
			locals: { supabase },
		} = getRequestEvent();

		const { data: contractAccount, error: contractAccountError } = await supabase
			.from('contracts_accounts_view')
			.select('*')
			.eq('contract_id', contractId);

		if (contractAccountError) {
			error(500, 'Error fetching contract account, please try again later.');
		}

		return contractAccount;
	}
);

export const getRentUpdates = query<z.ZodNumber, RentUpdate[]>(z.number(), async (contractId) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: rentUpdates, error: rentUpdatesError } = await supabase
		.from('rent_updates')
		.select('*')
		.eq('contract_id', contractId)
		.order('update_date');

	if (rentUpdatesError) {
		error(500, 'Error fetching rent updates, please try again later.');
	}

	return rentUpdates;
});

export const getInstallmentUpdates = query<z.ZodNumber, InstallmentUpdate[]>(
	z.number(),
	async (contractId) => {
		const {
			locals: { supabase },
		} = getRequestEvent();

		const { data: installmentUpdates, error: installmentUpdatesError } = await supabase
			.from('installment_updates')
			.select('*')
			.eq('contract_id', contractId)
			.order('update_date');

		if (installmentUpdatesError) {
			error(500, 'Error fetching installment updates, please try again later.');
		}

		return installmentUpdates;
	}
);

export const upsertContract = form(contractSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { id, type, property_id, start_date, end_date, tenant_id, ...typeData } = data;

	if (id) {
		const { error: updateError } = await supabase
			.from('contracts_view')
			.update({
				property_id,
				start_date,
				end_date,
				type,
				data: typeData,
			})
			.eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		const { error: tenantError } = await supabase.rpc('update_contract_tenants', {
			p_contract_id: id,
			p_tenants: [tenant_id],
		});

		if (tenantError) {
			setFlash({ type: 'error', message: tenantError.message }, cookies);
			error(500, tenantError.message);
		}

		setFlash({ type: 'success', message: 'Contract updated successfully' }, cookies);
		getContracts().refresh();
		getContract(id).refresh();
	} else {
		const { data: inserted, error: insertError } = await supabase
			.from('contracts_view')
			.insert({
				property_id,
				start_date,
				end_date,
				type,
				data: typeData,
			})
			.select()
			.single();

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		const { error: tenantError } = await supabase.rpc('update_contract_tenants', {
			p_contract_id: inserted.id,
			p_tenants: [tenant_id],
		});

		if (tenantError) {
			setFlash({ type: 'error', message: tenantError.message }, cookies);
			error(500, tenantError.message);
		}

		setFlash({ type: 'success', message: 'Contract created successfully' }, cookies);
		getContracts().refresh();
	}
});

export const deleteContract = form(deleteContractSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('contracts').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Contract deleted successfully' }, cookies);
	getContracts().refresh();

	return redirect(302, '/contracts');
});

export const createRentUpdate = form(
	createRentUpdateSchema,
	async ({ contract_id, rent, update_date }) => {
		const {
			locals: { supabase },
			cookies,
		} = getRequestEvent();

		const { error: insertError } = await supabase.from('rent_updates').insert({
			contract_id,
			rent,
			update_date,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Rent update created successfully' }, cookies);
		getRentUpdates(contract_id).refresh();
		getContract(contract_id).refresh();
	}
);

export const createInstallmentUpdate = form(
	createInstallmentUpdateSchema,
	async ({ contract_id, installment, interest, update_date }) => {
		const {
			locals: { supabase },
			cookies,
		} = getRequestEvent();

		const { error: insertError } = await supabase.from('installment_updates').insert({
			contract_id,
			installment,
			interest,
			update_date,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Installment update created successfully' }, cookies);
		getInstallmentUpdates(contract_id).refresh();
		getContract(contract_id).refresh();
	}
);

export const createDueNote = form(createDueNoteSchema, async ({ contract_id, due_date, value }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: insertError } = await supabase.from('due_notes').insert({
		contract_id,
		due_date,
		value,
	});

	if (insertError) {
		setFlash({ type: 'error', message: insertError.message }, cookies);
		error(500, insertError.message);
	}

	setFlash({ type: 'success', message: 'Due note created successfully' }, cookies);
	getContractAccount(contract_id).refresh();
});

export const createRentPayment = form(
	createRentPaymentSchema,
	async ({ contract_id, date, value, description }) => {
		const {
			locals: { supabase },
			cookies,
		} = getRequestEvent();

		const { error: insertError } = await supabase.from('rent_payments_view').insert({
			contract_id,
			date,
			value,
			description,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Rent payment created successfully' }, cookies);
		getContractAccount(contract_id).refresh();
		getContract(contract_id).refresh();
	}
);

export const createInstallmentPayment = form(
	createInstallmentPaymentSchema,
	async ({ contract_id, date, value, amortization, interest, description }) => {
		const {
			locals: { supabase },
			cookies,
		} = getRequestEvent();

		const { error: insertError } = await supabase.from('installment_payments_view').insert({
			contract_id,
			date,
			amortization: amortization < 0 ? 0 : amortization,
			interest: amortization < 0 ? interest + amortization : interest,
			description,
			extra_debt: amortization < 0 ? amortization * -1 : 0,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Installment payment created successfully' }, cookies);
		getContractAccount(contract_id).refresh();
		getContract(contract_id).refresh();
	}
);
