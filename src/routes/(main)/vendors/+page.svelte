<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Sheet from '@/components/ui/sheet';
	import { PlusCircle } from 'lucide-svelte';
	import VendorForm from './_components/vendor-form.svelte';
	import VendorTable from './_components/vendor-table.svelte';

	export let data;
	$: ({ vendors, createForm } = data);
</script>

<div class="px-4 py-6 lg:px-8">
	<VendorTable {vendors}>
		<VendorForm data={createForm}>
			<Sheet.Trigger asChild let:builder>
				<Button builders={[builder]}>
					<PlusCircle class="mr-2 h-4 w-4" />
					Add Vendor
				</Button>
			</Sheet.Trigger>
		</VendorForm>
	</VendorTable>
</div>
