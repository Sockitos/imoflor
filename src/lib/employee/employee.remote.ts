import { form, getRequestEvent, query } from '$app/server';
import { error, redirect } from '@sveltejs/kit';
import { z } from 'zod';
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
	} = getRequestEvent();

	const { address: addressData, ...employeeData } = data;
	const { id: existingAddressId, ...addressFields } = addressData;

	let addressId = existingAddressId;
	if (addressId) {
		const { error: addressError } = await supabase
			.from('addresses')
			.update(addressFields)
			.eq('id', addressId);

		if (addressError) {
			error(500, addressError.message);
		}
	} else {
		const { data: insertedAddress, error: addressError } = await supabase
			.from('addresses')
			.insert(addressFields)
			.select('id')
			.single();

		if (addressError) {
			error(500, addressError.message);
		}

		addressId = insertedAddress.id;
	}

	if (employeeData.id) {
		const { id, ...fields } = employeeData;

		const { error: updateError } = await supabase
			.from('employees')
			.update({ ...fields, address_id: addressId })
			.eq('id', id);

		if (updateError) {
			error(500, updateError.message);
		}

		getEmployees().refresh();
		getEmployee(id).refresh();
	} else {
		const { id: _id, ...insertFields } = employeeData;
		const { error: insertError } = await supabase.from('employees').insert({
			...insertFields,
			address_id: addressId,
		});

		if (insertError) {
			error(500, insertError.message);
		}

		getEmployees().refresh();
	}
});

export const deleteEmployee = form(deleteEmployeeSchema, async ({ id }) => {
	const {
		locals: { supabase },
	} = getRequestEvent();

	const { error: deleteError } = await supabase.from('employees').delete().eq('id', id);

	if (deleteError) {
		error(500, deleteError.message);
	}

	getEmployees().refresh();

	return redirect(302, '/employees');
});
