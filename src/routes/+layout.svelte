<script lang="ts">
	import { run } from 'svelte/legacy';

	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import AppSidebar from '@/components/app-sidebar.svelte';
	import TailwindIndicator from '@/components/tailwind-indicator.svelte';
	import TopBar from '@/components/top-bar.svelte';
	import { Toaster } from '@/components/ui/sonner';
	import * as Sidebar from '@/components/ui/sidebar';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.css';

	let { data, children } = $props();
	let { supabase, session } = $derived(data);
	const profile = $derived(data.profile);
	const isAuthRoute = $derived(page.url.pathname.startsWith('/auth'));

	const flash = getFlash(page);

	run(() => {
		if ($flash) {
			if ($flash.type === 'error') {
				toast.error($flash.message);
			} else {
				toast.success($flash.message);
			}

			$flash = undefined;
		}
	});

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
<Toaster />

{#if isAuthRoute}
	{@render children?.()}
{:else}
	<Sidebar.Provider
		style="--sidebar-width: calc(var(--spacing) * 72); --header-height: calc(var(--spacing) * 12);"
	>
		<AppSidebar variant="inset" {profile} />
		<Sidebar.Inset>
			<TopBar />
			<div class="flex flex-1 flex-col">
				<div class="@container/main flex flex-1 flex-col gap-2">
					{@render children?.()}
				</div>
			</div>
		</Sidebar.Inset>
	</Sidebar.Provider>
{/if}
{#if dev}
	<TailwindIndicator />
{/if}
