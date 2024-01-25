<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import TicketForm from './_components/ticket-form.svelte';
	import TicketTable from './_components/ticket-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<TicketTable tickets={data.tickets}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Ticket
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new tenant</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new ticket.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<TicketForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</TicketTable>
</div>
