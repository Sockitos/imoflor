import { createContractSchema, deleteContractSchema } from '@/schemas/contract';
import { createDueNoteSchema } from '@/schemas/due-note';
import { createInstallmentPaymentSchema } from '@/schemas/installment-payment';
import { createInstallmentUpdateSchema } from '@/schemas/installment-update';
import { createRentPaymentSchema } from '@/schemas/rent-payment';
import { createRentUpdateSchema } from '@/schemas/rent-update';
import type {
	Contract,
	ContractAccountItem,
	IdWithLabel,
	InstallmentUpdate,
	RentUpdate,
} from '@/types/types';
import { calculateInterest, handleFormAction, handleLoginRedirect } from '@/utils';
import { error, redirect } from '@sveltejs/kit';
import { setFlash } from 'sveltekit-flash-message/server';
import { fail, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		return redirect(302, handleLoginRedirect(event));
	}

	async function getContract(): Promise<Contract> {
		const { data: contract, error: contractError } = await event.locals.supabase
			.from('contracts_view')
			.select(
				'*, tenants:tenants!inner (id, label:name), fraction:fractions_view!inner (id, label:address_full)'
			)
			.eq('id', Number(event.params.id))
			.returns<Contract[]>() // TODO: try not to use returns
			.single();

		if (contractError) {
			return error(500, 'Error fetching contract, please try again later.');
		}
		return contract;
	}

	async function getContractAccount(): Promise<ContractAccountItem[]> {
		const { data: contractAccount, error: contractAccountError } = await event.locals.supabase
			.from('contracts_accounts_view')
			.select('*')
			.eq('contract_id', Number(event.params.id));

		if (contractAccountError) {
			return error(500, 'Error fetching contract account, please try again later.');
		}
		return contractAccount;
	}

	async function getRentUpdates(): Promise<RentUpdate[]> {
		const { data: rentUpdates, error: rentUpdatesError } = await event.locals.supabase
			.from('rent_updates')
			.select('*')
			.eq('contract_id', Number(event.params.id))
			.order('update_date');

		if (rentUpdatesError) {
			return error(500, 'Error fetching rent updates, please try again later.');
		}
		return rentUpdates;
	}

	async function getInstallmentUpdates(): Promise<InstallmentUpdate[]> {
		const { data: installmentUpdates, error: installmentUpdatesError } = await event.locals.supabase
			.from('installment_updates')
			.select('*')
			.eq('contract_id', Number(event.params.id))
			.order('update_date');

		if (installmentUpdatesError) {
			return error(500, 'Error fetching installment updates, please try again later.');
		}
		return installmentUpdates;
	}

	async function getFractionOptions(): Promise<IdWithLabel[]> {
		const { data: fractions, error: fractionsError } = await event.locals.supabase
			.from('fractions_view')
			.select('id, label:address_full');

		if (fractionsError) {
			return error(500, 'Error fetching fractions, please try again later.');
		}
		return fractions;
	}

	async function getTenantOptions() {
		const { data: tenants, error: tenantsError } = await event.locals.supabase
			.from('tenants')
			.select('id, label:name');

		if (tenantsError) {
			return error(500, 'Error fetching tenants, please try again later.');
		}
		return tenants;
	}

	const contract = await getContract();

	const interest =
		contract.type === 'lending' ? calculateInterest(contract, new Date().toISOString()) : 0;

	return {
		contract: contract,
		contractAccount: await getContractAccount(),
		rentUpdates: contract.type === 'renting' ? await getRentUpdates() : [],
		installmentUpdates: contract.type === 'lending' ? await getInstallmentUpdates() : [],
		fractionOptions: await getFractionOptions(),
		tenantOptions: await getTenantOptions(),
		updateContractForm: await superValidate(
			{
				type: contract.type,
				fraction_id: contract.fraction.id,
				start_date: contract.start_date,
				end_date: contract.end_date,
				tenant_id: contract.tenants[0].id,
				...contract.data,
			},
			zod(createContractSchema),
			{
				id: 'update-contract',
			}
		),
		deleteContractForm: await superValidate(zod(deleteContractSchema), {
			id: 'delete-contract',
		}),
		createRentUpdateForm: await superValidate(
			{
				rent: contract.type === 'renting' ? contract.data.rent : 0,
				update_date: new Date().toISOString(),
			},
			zod(createRentUpdateSchema),
			{
				id: 'create-rent-update',
			}
		),
		createInstallmentUpdateForm: await superValidate(
			{
				installment: contract.type === 'lending' ? contract.data.installment : 0,
				interest: contract.type === 'lending' ? contract.data.interest : 0,
				update_date: new Date().toISOString(),
			},
			zod(createInstallmentUpdateSchema),
			{
				id: 'create-installment-update',
			}
		),
		createDueNoteForm: await superValidate(
			{
				value: contract.type === 'renting' ? contract.data.rent : contract.data.installment,
				due_date: new Date().toISOString(),
			},
			zod(createDueNoteSchema),
			{
				id: 'create-due-note',
			}
		),
		createRentPaymentForm: await superValidate(
			{
				date: new Date().toISOString(),
				value: contract.type === 'renting' ? contract.data.rent : 0,
			},
			zod(createRentPaymentSchema),
			{
				id: 'create-rent-payment',
			}
		),
		createInstallmentPaymentForm: await superValidate(
			{
				date: new Date().toISOString(),
				value: contract.type === 'lending' ? contract.data.installment : 0,
				amortization: contract.type === 'lending' ? contract.data.installment - interest : 0,
				interest: contract.type === 'lending' ? interest : 0,
			},
			zod(createInstallmentPaymentSchema),
			{
				id: 'create-installment-payment',
			}
		),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createContractSchema,
			'update-contract',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('contracts_view')
					.update({
						fraction_id: form.data.fraction_id,
						start_date: form.data.start_date,
						end_date: form.data.end_date,
						type: form.data.type,
						data: form.data,
					})
					.eq('id', Number(event.params.id));

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				const { error: tenantError } = await event.locals.supabase.rpc('update_contract_tenants', {
					p_contract_id: Number(event.params.id),
					p_tenants: [form.data.tenant_id],
				});

				if (tenantError) {
					setFlash({ type: 'error', message: tenantError.message }, event.cookies);
					return fail(500, { message: tenantError.message, form });
				}

				return { success: true, form };
			}
		),
	delete: async (event) =>
		handleFormAction(
			event,
			deleteContractSchema,
			'delete-contract',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from('contracts')
					.delete()
					.eq('id', form.data.id);

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, '/contracts');
			}
		),
	createRentUpdate: async (event) =>
		handleFormAction(
			event,
			createRentUpdateSchema,
			'create-rent-update',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('rent_updates').insert({
					contract_id: Number(event.params.id),
					rent: form.data.rent,
					update_date: form.data.update_date,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	createInstallmentUpdate: async (event) =>
		handleFormAction(
			event,
			createInstallmentUpdateSchema,
			'create-installment-update',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('installment_updates').insert({
					contract_id: Number(event.params.id),
					installment: form.data.installment,
					interest: form.data.interest,
					update_date: form.data.update_date,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	createDueNote: async (event) =>
		handleFormAction(event, createDueNoteSchema, 'create-due-note', async (event, userId, form) => {
			const { error } = await event.locals.supabase.from('due_notes').insert({
				contract_id: Number(event.params.id),
				due_date: form.data.due_date,
				value: form.data.value,
			});

			if (error) {
				setFlash({ type: 'error', message: error.message }, event.cookies);
				return fail(500, { message: error.message, form });
			}

			return { success: true, form };
		}),
	createRentPayment: async (event) =>
		handleFormAction(
			event,
			createRentPaymentSchema,
			'create-rent-payment',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('rent_payments_view').insert({
					contract_id: Number(event.params.id),
					date: form.data.date,
					value: form.data.value,
					description: form.data.description,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
	createInstallmentPayment: async (event) =>
		handleFormAction(
			event,
			createInstallmentPaymentSchema,
			'create-installment-payment',
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from('installment_payments_view').insert({
					contract_id: Number(event.params.id),
					date: form.data.date,
					amortization: form.data.amortization < 0 ? 0 : form.data.amortization,
					interest:
						form.data.amortization < 0
							? form.data.interest + form.data.amortization
							: form.data.interest,
					description: form.data.description,
					extra_debt: form.data.amortization < 0 ? form.data.amortization * -1 : 0,
				});

				if (error) {
					setFlash({ type: 'error', message: error.message }, event.cookies);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			}
		),
};
