<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { Separator } from '@/components/ui/separator';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import VendorForm from './_components/vendor-form.svelte';
	import VendorTable from './_components/vendor-table.svelte';

	export let data;
</script>

<div class="px-4 py-6 lg:px-8">
	<VendorTable vendors={data.vendors}>
		<Sheet.Root>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Vendor
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="sm:max-w-[40rem]">
				<Sheet.Header>
					<Sheet.Title>Add new vendor</Sheet.Title>
					<Sheet.Description>Fill the form below to add a new vendor.</Sheet.Description>
				</Sheet.Header>
				<Separator class="my-5" />
				<VendorForm form={data.createForm} />
			</Sheet.Content>
		</Sheet.Root>
	</VendorTable>
</div>
