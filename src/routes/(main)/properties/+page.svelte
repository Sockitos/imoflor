<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import PropertyForm from './_components/property-form.svelte';
	import PropertyTable from './_components/property-table.svelte';

	export let data;
	$: ({ properties, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<PropertyTable {properties}>
		<PropertyForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Property
				</Button>
			</Sheet.Trigger>
		</PropertyForm>
	</PropertyTable>
</div>
