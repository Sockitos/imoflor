<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import * as Sheet from '@/components/ui/sheet';
	import { Home, Menu } from 'lucide-svelte';
	import ModeToggle from './mode-toggle.svelte';
	import NotificationsButton from './notifications-button.svelte';
	import ProfileButton from './profile-button.svelte';
	import Sidebar from './sidebar.svelte';
	import { Button } from './ui/button';

	$: pathParts = $page.url.pathname.split('/').slice(1);

	let openMenu = false;
	beforeNavigate(() => {
		openMenu = false;
	});
</script>

<div class="flex flex-row items-center gap-x-4 border-b p-4 lg:px-8">
	<div class="md:hidden">
		<Sheet.Root bind:open={openMenu}>
			<Sheet.Trigger asChild let:builder>
				<Button size="icon" variant="outline" builders={[builder]}>
					<Menu class="h-4 w-4" />
				</Button>
			</Sheet.Trigger>
			<Sheet.Content class="w-full max-w-sm p-0" side={'left'}>
				<Sidebar />
			</Sheet.Content>
		</Sheet.Root>
	</div>
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/">
					<Home class="h-4 w-4" />
				</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#each pathParts as part, i}
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Link href={`/${pathParts.slice(0, i + 1).join('/')}`}
						>{part.charAt(0).toUpperCase() + part.substring(1)}
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<div class="flex-1" />
	<ModeToggle />
	<NotificationsButton />
	<ProfileButton />
</div>
