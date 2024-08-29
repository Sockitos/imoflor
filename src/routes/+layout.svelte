<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidate } from '$app/navigation';
	import { page } from '$app/stores';
	import TailwindIndicator from '@/components/tailwind-indicator.svelte';
	import { Toaster } from '@/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { getFlash } from 'sveltekit-flash-message';
	import '../app.pcss';

	export let data;

	$: ({ supabase, session } = data);

	const flash = getFlash(page);
	$: if ($flash) {
		if ($flash.type === 'error') {
			toast.error($flash.message);
		} else {
			toast.success($flash.message);
		}
		// Clear the flash message to avoid double-toasting.
		$flash = undefined;
	}

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

<slot />
{#if dev}
	<TailwindIndicator />
{/if}
