<script lang="ts">
	import { Building2, Construction, Home, ScrollText, Tag, Truck, Users } from 'lucide-svelte';
	import SidebarItem from './sidebar-item.svelte';
	import { Separator } from './ui/separator';
</script>

<aside class="h-screen bg-card py-4 md:border-r">
	<h1 class="py-8 text-center text-4xl font-bold text-primary md:hidden lg:block">IMOFLOR</h1>
	<nav class="flex flex-col gap-y-2 px-4">
		<SidebarItem icon={Home} label="Dashboard" href="/dashboard" />
		<Separator class="my-2" />
		<SidebarItem icon={Users} label="Tenants" href="/tenants" />
		<SidebarItem icon={Building2} label="Properties" href="/properties" />
		<SidebarItem icon={ScrollText} label="Contracts" href="/contracts" />
		<Separator class="my-2" />
		<SidebarItem icon={Tag} label="Tickets" href="/tickets" />
		<SidebarItem icon={Construction} label="Interventions" href="/interventions" />
		<Separator class="my-2" />
		<SidebarItem icon={Users} label="Employees" href="/employees" />
		<SidebarItem icon={Truck} label="Vendors" href="/vendors" />
	</nav>
</aside>
