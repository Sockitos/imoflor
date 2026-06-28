import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
import { setFlash } from 'sveltekit-flash-message/server';
import { deleteEmployeeSchema, employeeSchema } from './schemas';
import type { Employee } from './types';

export const getEmployees = query<Employee[]>(async () => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: employees, error: employeesError } = await supabase
		.from('employees')
		.select('*, address:addresses(*)');

	if (employeesError) {
		error(500, 'Error fetching employees, please try again later.');
	}

	return employees;
});

export const getEmployee = query(z.number(), async (id): Promise<Employee> => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { data: employee, error: employeeError } = await supabase
		.from('employees')
		.select('*, address:addresses(*)')
		.eq('id', id)
		.single();

	if (employeeError) {
		error(500, 'Error fetching employee, please try again later.');
	}

	return employee;
});

export const upsertEmployee = form(employeeSchema, async (data) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { address: addressData, ...employeeData } = data;

	let addressId = addressData.id;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressData)
			.eq('id', addressId);

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}
	} else {
		const { data: insertedAddress, error: addressError } = await supabase
			.from('addresses')
			.insert(addressData)
			.select('id')
			.single();

		if (addressError) {
			setFlash({ type: 'error', message: addressError.message }, cookies);
			error(500, addressError.message);
		}

		addressId = insertedAddress.id;
	}

	if (employeeData.birth_date?.length == 0) {
		employeeData.birth_date = undefined;
	}
	if (employeeData.id_expiration_date?.length == 0) {
		employeeData.id_expiration_date = undefined;
	}

	if (employeeData.id) {
		const { id, ...fields } = employeeData;

		const { error: updateError } = await supabase
			.from('employees')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (updateError) {
			setFlash({ type: 'error', message: updateError.message }, cookies);
			error(500, updateError.message);
		}

		setFlash({ type: 'success', message: 'Employee updated successfully' }, cookies);
		getEmployees().refresh();
		getEmployee(id).refresh();
	} else {
		const { error: insertError } = await supabase.from('employees').insert({
			...employeeData,
			address_id: addressId,
		});

		if (insertError) {
			setFlash({ type: 'error', message: insertError.message }, cookies);
			error(500, insertError.message);
		}

		setFlash({ type: 'success', message: 'Employee created successfully' }, cookies);
		getEmployees().refresh();
	}
});

export const deleteEmployee = form(deleteEmployeeSchema, async ({ id }) => {
	const {
		locals: { supabase },
		cookies,
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('employees').delete().eq('id', id);

	if (deleteError) {
		setFlash({ type: 'error', message: deleteError.message }, cookies);
		error(500, deleteError.message);
	}

	setFlash({ type: 'success', message: 'Employee deleted successfully' }, cookies);
	getEmployees().refresh();

	return redirect(302, '/employees');
});
