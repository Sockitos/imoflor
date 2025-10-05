<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import * as Avatar from '@/components/ui/avatar';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from './ui/button';
	const { profile } = page.data;
	let formEl: HTMLFormElement | undefined = $state();

	let initials = $derived(
		profile?.display_name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase() ?? 'U'
	);
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" class="relative h-8 w-8 rounded-full" {...props}>
				<Avatar.Root class="h-9 w-9">
					<Avatar.Image src={profile?.image} alt={profile?.display_name} />
					<Avatar.Fallback>{initials}</Avatar.Fallback>
				</Avatar.Root>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class="text-sm leading-none font-medium">{profile?.display_name}</p>
				<p class="text-muted-foreground text-xs leading-none">{profile?.email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<DropdownMenu.Item onclick={() => goto(resolve('/'))}>
				Profile
				<DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => goto(resolve('/'))}>
				Settings
				<DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<form method="POST" action="/logout" use:enhance bind:this={formEl}>
			<DropdownMenu.Item onclick={() => formEl?.submit()}>
				Log out
				<DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
			</DropdownMenu.Item>
		</form></DropdownMenu.Content
	>
</DropdownMenu.Root>
