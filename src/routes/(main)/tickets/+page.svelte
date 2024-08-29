<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import TicketForm from './_components/ticket-form.svelte';
	import TicketTable from './_components/ticket-table.svelte';

	export let data;
	$: ({ tickets, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<TicketTable {tickets}>
		<TicketForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Ticket
				</Button>
			</Sheet.Trigger>
		</TicketForm>
	</TicketTable>
</div>
