<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import InterventionForm from './_components/intervention-form.svelte';
	import InterventionTable from './_components/intervention-table.svelte';

	export let data;
	$: ({ interventions, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<InterventionTable {interventions}>
		<InterventionForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Intervention
				</Button>
			</Sheet.Trigger>
		</InterventionForm>
	</InterventionTable>
</div>
