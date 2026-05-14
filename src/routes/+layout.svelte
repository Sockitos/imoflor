<script lang="ts">
	import { run } from 'svelte/legacy';

	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/state';
	import TailwindIndicator from '@shared/components/tailwind-indicator.svelte';
	import { Toaster } from '@shared/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.css';

	let { data, children } = $props();
	let { supabase, claims } = $derived(data);

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
