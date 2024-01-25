<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import PropertyForm from './_components/property-form.svelte';
	import PropertyTable from './_components/property-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<PropertyTable properties={data.properties}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Property
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new tenant</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new property.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<PropertyForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</PropertyTable>
</div>
