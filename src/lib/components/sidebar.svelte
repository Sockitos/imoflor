<script lang="ts">
	import { Building2, Construction, ScrollText, Tag, Truck, Users } from 'lucide-svelte';
	import SidebarGroup from './sidebar-group.svelte';
	import SidebarItem from './sidebar-item.svelte';
</script>

<aside class="h-screen space-y-4 py-4 md:border-r md:pt-12 lg:pt-4">
	<h1 class="py-4 text-center text-4xl font-bold md:hidden lg:block">IMOFLOR</h1>
	<SidebarGroup label="Comercial">
		<SidebarItem icon={Users} label="Tenants" href="/tenants" />
		<SidebarItem icon={Building2} label="Propriedades" href="/properties" />
		<SidebarItem icon={ScrollText} label="Contratos" href="/contracts" />
	</SidebarGroup>
	<SidebarGroup label="What">
		<SidebarItem icon={Tag} label="Tickets" href="/tickets" />
		<SidebarItem icon={Construction} label="Interventions" href="/interventions" />
	</SidebarGroup>
	<SidebarGroup label="Resources">
		<SidebarItem icon={Users} label="Employees" href="/employees" />
		<SidebarItem icon={Truck} label="Vendors" href="/vendors" />
	</SidebarGroup>
</aside>
