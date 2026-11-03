<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import TailwindIndicator from '@/shared/components/tailwind-indicator.svelte';
	import { Toaster } from '@/shared/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import '../app.css';

	let { data, children } = $props();
	let { supabase, claims } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
			if (newSession?.expires_at !== claims?.exp) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<ModeWatcher />
<Toaster />

{@render children?.()}
{#if dev}
	<TailwindIndicator />
{/if}
