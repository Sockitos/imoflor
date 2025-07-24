<script lang="ts">
	import { page } from '$app/state';
	import type { Icon } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { Button } from './ui/button';

	interface Props {
		icon: ComponentType<Icon>;
		label: string;
		href: string;
	}

	let { icon, label, href }: Props = $props();

	let isSelected = $derived(page.url.pathname.startsWith(href));
</script>

<Button
	{href}
	variant={isSelected ? 'secondary' : 'ghost'}
	class="flex w-full justify-start md:hidden lg:flex"
>
	{@const SvelteComponent = icon}
	<SvelteComponent class="text-muted-foreground mr-2 h-4 w-4" />
	{label}
</Button>
<Button
	{href}
	size="icon"
	variant={isSelected ? 'secondary' : 'ghost'}
	class="hidden md:flex lg:hidden"
>
	{@const SvelteComponent_1 = icon}
	<SvelteComponent_1 class="h-4 w-4" />
</Button>
