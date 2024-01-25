<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import InterventionForm from './_components/intervention-form.svelte';
	import InterventionTable from './_components/intervention-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<InterventionTable interventions={data.interventions}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Intervention
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new tenant</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new intervention.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<InterventionForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</InterventionTable>
</div>
