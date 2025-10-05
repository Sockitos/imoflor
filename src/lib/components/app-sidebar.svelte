<script lang="ts">
	import { resolve } from '$app/paths';
	import type { RouteId } from '$app/types';
	import * as Avatar from '@/components/ui/avatar';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import type { Profile } from '@/types/types';
	import BuildingIcon from '@tabler/icons-svelte/icons/building';
	import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
	import DashboardIcon from '@tabler/icons-svelte/icons/dashboard';
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import FileTextIcon from '@tabler/icons-svelte/icons/file-text';
	import HelpIcon from '@tabler/icons-svelte/icons/help';
	import HomeIcon from '@tabler/icons-svelte/icons/home';
	import LogoutIcon from '@tabler/icons-svelte/icons/logout';
	import NotificationIcon from '@tabler/icons-svelte/icons/notification';
	import SearchIcon from '@tabler/icons-svelte/icons/search';
	import SettingsIcon from '@tabler/icons-svelte/icons/settings';
	import TicketIcon from '@tabler/icons-svelte/icons/ticket';
	import ToolIcon from '@tabler/icons-svelte/icons/tool';
	import UsersIcon from '@tabler/icons-svelte/icons/users';
	import { UserCircleIcon } from 'lucide-svelte';
	import type { ComponentProps, ComponentType } from 'svelte';

	interface props extends ComponentProps<typeof Sidebar.Root> {
		profile?: Profile | null;
	}

	let { profile, ...restProps }: props = $props();

	type NavItem = {
		title: string;
		url: RouteId;
		icon: ComponentType;
	};

	type NavGroup = {
		title: string;
		items: NavItem[];
	};

	type NavData = {
		navMain: NavItem[];
		navGroups: NavGroup[];
		navSecondary: NavItem[];
	};

	const data = {
		navMain: [
			{
				title: 'Dashboard',
				url: '/',
				icon: DashboardIcon,
			},
			{
				title: 'Statistics',
				url: '/',
				icon: ChartBarIcon,
			},
		],
		navGroups: [
			{
				title: 'Commercial',
				items: [
					{
						title: 'Tenants',
						url: '/(main)/tenants',
						icon: UsersIcon,
					},
					{
						title: 'Properties',
						url: '/(main)/properties',
						icon: BuildingIcon,
					},
					{
						title: 'Contracts',
						url: '/(main)/contracts',
						icon: FileTextIcon,
					},
				],
			},
			{
				title: 'Support',
				items: [
					{
						title: 'Tickets',
						url: '/(main)/tickets',
						icon: TicketIcon,
					},
					{
						title: 'Interventions',
						url: '/(main)/interventions',
						icon: ToolIcon,
					},
				],
			},
			{
				title: 'Other',
				items: [
					{
						title: 'Employees',
						url: '/(main)/employees',
						icon: UsersIcon,
					},
					{
						title: 'Vendors',
						url: '/(main)/vendors',
						icon: UsersIcon,
					},
				],
			},
		],
		navSecondary: [
			{
				title: 'Settings',
				url: '/',
				icon: SettingsIcon,
			},
			{
				title: 'Get Help',
				url: '/',
				icon: HelpIcon,
			},
			{
				title: 'Search',
				url: '/',
				icon: SearchIcon,
			},
		],
	} satisfies NavData;

	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:!p-1.5">
					{#snippet child({ props })}
						<a href={resolve('/')} {...props}>
							<HomeIcon class="!size-5" />
							<span class="text-base font-semibold">Imoflor</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupContent class="flex flex-col gap-2">
				<Sidebar.Menu>
					{#each data.navMain as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton tooltipContent={item.title}>
								{#snippet child({ props })}
									<a href={resolve(item.url)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
		{#each data.navGroups as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton tooltipContent={item.title}>
									{#snippet child({ props })}
										<a href={resolve(item.url)} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
		<Sidebar.Group class="mt-auto">
			<Sidebar.GroupContent>
				<Sidebar.Menu>
					{#each data.navSecondary as item (item.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								{#snippet child({ props })}
									<a href={resolve(item.url)} {...props}>
										<item.icon />
										<span>{item.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton
								{...props}
								size="lg"
								class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
							>
								<Avatar.Root class="size-8 rounded-lg grayscale">
									<Avatar.Image src={profile?.image} alt={profile?.display_name} />
									<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{profile?.display_name}</span>
									<span class="text-muted-foreground truncate text-xs">
										{profile?.email}
									</span>
								</div>
								<DotsVerticalIcon class="ml-auto size-4" />
							</Sidebar.MenuButton>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content
						class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
						side={sidebar.isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenu.Label class="p-0 font-normal">
							<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar.Root class="size-8 rounded-lg">
									<Avatar.Image src={profile?.image} alt={profile?.display_name} />
									<Avatar.Fallback class="rounded-lg">
										{profile?.display_name?.charAt(0)}
									</Avatar.Fallback>
								</Avatar.Root>
								<div class="grid flex-1 text-left text-sm leading-tight">
									<span class="truncate font-medium">{profile?.display_name}</span>
									<span class="text-muted-foreground truncate text-xs">
										{profile?.email}
									</span>
								</div>
							</div>
						</DropdownMenu.Label>
						<DropdownMenu.Separator />
						<DropdownMenu.Group>
							<DropdownMenu.Item>
								<UserCircleIcon />
								Account
							</DropdownMenu.Item>
							<DropdownMenu.Item>
								<NotificationIcon />
								Notifications
							</DropdownMenu.Item>
						</DropdownMenu.Group>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<LogoutIcon />
							Log out
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
