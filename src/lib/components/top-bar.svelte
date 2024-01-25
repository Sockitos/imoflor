<script lang="ts">
	import { page } from '$app/stores';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import * as Sheet from '@/components/ui/sheet';
	import { Menu } from 'lucide-svelte';
	import ModeToggle from './mode-toggle.svelte';
	import ProfileButton from './profile-button.svelte';
	import Sidebar from './sidebar.svelte';
	import { Button } from './ui/button';

	$: pathParts = $page.url.pathname.split('/').slice(1);
</script>

<div class="flex flex-row items-center gap-x-4 border-b p-4 lg:px-8">
	<div class="md:hidden">
		<Sheet.Root>
			<Sheet.Trigger asChild>
				<Button size={'icon'} variant={'ghost'}>
					<Menu class="h-4 w-4" />
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="w-full max-w-md" side={'left'}>
				<Sidebar />
			</Sheet.Content>
		</Sheet.Root>
	</div>
	<Breadcrumb.Root>
		<Breadcrumb.Item href="/" />
		{#each pathParts as part, i}
			<Breadcrumb.Item href="/" />
		{/each}
	</Breadcrumb.Root>
	<div class="flex-1" />
	<ProfileButton />
	<ModeToggle />
</div>
