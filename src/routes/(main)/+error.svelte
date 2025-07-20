<script lang="ts">
	import { page } from '$app/state';
	import PageSubtitle from '@/components/page-subtitle.svelte';
	import PageTitle from '@/components/page-title.svelte';
	import Button from '@/components/ui/button/button.svelte';
</script>

<div class="flex h-full flex-col items-center justify-center">
	<PageTitle>Error {page.status}</PageTitle>
	<PageSubtitle>{page.error?.message}</PageSubtitle>
	<Button href={page.url.pathname} class="mt-4">Refresh</Button>
</div>
