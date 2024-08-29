<script lang="ts">
	import { page } from '$app/stores';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import type { Intervention } from '@/types/types';
	import { MoreHorizontal } from 'lucide-svelte';
	import InterventionDeleteDialog from './intervention-delete-dialog.svelte';
	import InterventionForm from './intervention-form.svelte';
	import { statusMap } from './intervention-status-map';

	export let intervention: Intervention;
	let openSheet = false;
	let openDeleteDialog = false;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" class="h-8 w-8 p-0" builders={[builder]}>
			<span class="sr-only">Open menu</span>
			<MoreHorizontal class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item href={`/interventions/${intervention.id}`}>Open</DropdownMenu.Item>
		<DropdownMenu.Separator />
		<DropdownMenu.Sub>
			<DropdownMenu.SubTrigger>Status</DropdownMenu.SubTrigger>
			<DropdownMenu.SubContent>
				<DropdownMenu.RadioGroup value={intervention.status}>
					{#each Object.entries(statusMap) as [status, { label }]}
						<DropdownMenu.RadioItem value={status}>
							{label}
						</DropdownMenu.RadioItem>
					{/each}
				</DropdownMenu.RadioGroup>
			</DropdownMenu.SubContent>
		</DropdownMenu.Sub>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (openSheet = true)}>Edit</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (openDeleteDialog = true)}>Delete</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<InterventionForm data={$page.data.updateForm} bind:open={openSheet} />

<InterventionDeleteDialog
	{intervention}
	data={$page.data.deleteForm}
	bind:open={openDeleteDialog}
/>
