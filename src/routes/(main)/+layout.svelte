<script lang="ts">
	import AppSidebar from '@/components/app-sidebar.svelte';
	import TopBar from '@/components/top-bar.svelte';
	import * as Sidebar from '@/components/ui/sidebar';

	let { children } = $props();
</script>

<Sidebar.Provider
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar
		variant="inset"
		profile={{
			id: '1',
			email: 'lorem.ipsum@example.com',
			display_name: 'Lorem Ipsum',
			image: 'https://github.com/shadcn.png',
		}}
	/>
	<Sidebar.Inset>
		<TopBar />
		<div class="flex flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-2">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
