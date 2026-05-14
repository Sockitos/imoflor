import { createEmployeeSchema, deleteEmployeeSchema } from "@/employee/schemas";
import type { Employee } from "@/employee/types";
import { handleFormAction } from "@/shared/utils";
import { error, fail } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load = async (event) => {
	async function getEmployees(): Promise<Employee[]> {
		const { data: employees, error: employeesError } = await event.locals
			.supabase
			.from("employees")
			.select("*, address:addresses(*)");

		if (employeesError) {
			return error(
				500,
				"Error fetching employees, please try again later.",
			);
		}
		return employees;
	}

	return {
		employees: await getEmployees(),
		createEmployeeForm: await superValidate(zod4(createEmployeeSchema), {
			id: "create-employee",
		}),
		deleteEmployeeForm: await superValidate(zod4(deleteEmployeeSchema), {
			id: "delete-employee",
		}),
	};
};

export const actions = {
	create: async (event) =>
		handleFormAction(
			event,
			createEmployeeSchema,
			"create-employee",
			async (event, userId, form) => {
				const { address: addressData, ...employeeData } = form.data;

				const { data: insertedAddress, error: addressError } =
					await event.locals.supabase
						.from("addresses")
						.insert(addressData)
						.select("id")
						.single();

				if (addressError) {
					setFlash(
						{ type: "error", message: addressError.message },
						event.cookies,
					);
					return fail(500, { message: addressError.message, form });
				}

				const { error } = await event.locals.supabase.from("employees")
					.insert({
						...employeeData,
						address_id: insertedAddress?.id,
					});

				if (error) {
					setFlash(
						{ type: "error", message: error.message },
						event.cookies,
					);
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			},
		),
};
