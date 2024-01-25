<script lang="ts">
	export let label: string;
</script>

<div class="px-1 py-2 lg:px-3">
	<h2 class="mb-2 block px-4 text-lg font-semibold md:hidden lg:block">
		{label}
	</h2>
	<div class="flex flex-col gap-y-1"><slot /></div>
</div>
