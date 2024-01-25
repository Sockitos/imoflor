<script>
	import Sidebar from '@/components/sidebar.svelte';
	import TopBar from '@/components/top-bar.svelte';
</script>

<div class="flex h-screen flex-row">
	<div class="h-full md:block lg:w-72">
		<Sidebar />
	</div>
	<main class="flex flex-1 flex-col overflow-y-auto">
		<TopBar />
		<div class="flex-1"><slot /></div>
	</main>
</div>
