import type { IdAndLabel } from "@/shared/types";
import { handleFormAction } from "@/shared/utils";
import { createTicketSchema, deleteTicketSchema } from "@/ticket/schemas";
import type { Ticket } from "@/ticket/types";
import { error, redirect } from "@sveltejs/kit";
import { setFlash } from "sveltekit-flash-message/server";
import { fail, superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";

export const load = async (event) => {
	async function getTicket(): Promise<Ticket> {
		const { data: ticket, error: ticketError } = await event.locals.supabase
			.from("tickets")
			.select(
				"*, property:properties!inner (id, ...addresses(label:address))",
			)
			.eq("id", Number(event.params.id))
			.single();

		if (ticketError) {
			return error(500, "Error fetching ticket, please try again later.");
		}
		return ticket;
	}

	async function getPropertyOptions(): Promise<IdAndLabel[]> {
		const { data: properties, error: propertiesError } = await event.locals
			.supabase
			.from("properties")
			.select("id, ...addresses(label:address)");

		if (propertiesError) {
			return error(
				500,
				"Error fetching properties, please try again later.",
			);
		}
		return properties;
	}

	const ticket = await getTicket();

	return {
		ticket: ticket,
		propertyOptions: await getPropertyOptions(),
		updateTicketForm: await superValidate(
			ticket,
			zod4(createTicketSchema),
			{
				id: "update-ticket",
			},
		),
		deleteTicketForm: await superValidate(
			{ id: Number(event.params.id) },
			zod4(deleteTicketSchema),
			{
				id: "delete-ticket",
			},
		),
	};
};

export const actions = {
	update: async (event) =>
		handleFormAction(
			event,
			createTicketSchema,
			"update-ticket",
			async (event, userId, form) => {
				const { error } = await event.locals.supabase
					.from("tickets")
					.update(form.data)
					.eq("id", Number(event.params.id));

				if (error) {
					return fail(500, { message: error.message, form });
				}

				return { success: true, form };
			},
		),
	delete: async (event) =>
		handleFormAction(
			event,
			deleteTicketSchema,
			"delete-ticket",
			async (event, userId, form) => {
				const { error } = await event.locals.supabase.from("tickets")
					.delete().eq("id", form.data.id);

				if (error) {
					setFlash(
						{ type: "error", message: error.message },
						event.cookies,
					);
					return fail(500, { message: error.message, form });
				}

				return redirect(302, "/tickets");
			},
		),
};
