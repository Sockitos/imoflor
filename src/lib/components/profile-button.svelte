<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import * as Avatar from '@/components/ui/avatar';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from './ui/button';

	const { profile } = $page.data;
	let formEl: HTMLFormElement;

	$: initials =
		profile?.display_name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() ?? 'U';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" class="relative h-8 w-8 rounded-full" builders={[builder]}>
			<Avatar.Root class="h-9 w-9">
				<Avatar.Image src={profile?.image} alt={profile?.display_name} />
				<Avatar.Fallback>{initials}</Avatar.Fallback>
			</Avatar.Root>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm font-medium leading-none">{profile?.display_name}</p>
				<p class="text-xs leading-none text-muted-foreground">{profile?.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item href="/profile">
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item href="/settings">
				Settings
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<form method="POST" action="/logout" use:enhance bind:this={formEl}></form>
		<DropdownMenu.Item on:click={() => formEl.submit()}>
			Log out
			<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
