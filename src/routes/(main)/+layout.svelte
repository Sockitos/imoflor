<script lang="ts">
	import AppSidebar from '@/shared/components/app-sidebar.svelte';
	import TopBar from '@/shared/components/top-bar.svelte';
	import * as Sidebar from '@/shared/components/ui/sidebar';

	let { children } = $props();
</script>

<Sidebar.Provider
	class="h-svh"
	style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
>
	<AppSidebar variant="inset" />
	<Sidebar.Inset>
		<TopBar />
		<div class="flex min-h-0 flex-1 flex-col">
			<div class="@container/main flex min-h-0 flex-1 flex-col gap-2">
				{@render children?.()}
			</div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>
