<script lang="ts">
	import { page } from '$app/state';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { Button } from './ui/button';

	export let icon: ComponentType<Icon>;
	export let label: string;
	export let href: string;

	$: isSelected = page.url.pathname.startsWith(href);
</script>

<Button
	{href}
	variant={isSelected ? 'secondary' : 'ghost'}
	class="flex w-full justify-start md:hidden lg:flex"
>
	<svelte:component this={icon} class="text-muted-foreground mr-2 h-4 w-4" />
	{label}
</Button>
<Button
	{href}
	size="icon"
	variant={isSelected ? 'secondary' : 'ghost'}
	class="hidden md:flex lg:hidden"
>
	<svelte:component this={icon} class="h-4 w-4" />
</Button>
