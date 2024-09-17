<script lang="ts">
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import { PlusCircle } from 'lucide-svelte';
	import TicketForm from './_components/ticket-form.svelte';
	import TicketTable from './_components/ticket-table.svelte';

	export let data;
	$: ({ tickets, createTicketForm } = data);
	let openForm = false;
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div>
			<PageTitle>Tickets ({tickets.length})</PageTitle>
			<PageSubtitle>Manage your tickets and Lorem Ipsum</PageSubtitle>
		</div>
		<Button on:click={() => (openForm = true)}>
			<PlusCircle class="mr-2 h-4 w-4" />
			Add Ticket
		</Button>
	</div>
	<Separator />
	<TicketTable {tickets} />
</div>

<TicketForm data={createTicketForm} action="?/create" bind:open={openForm} />
