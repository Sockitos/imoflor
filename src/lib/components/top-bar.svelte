<script lang="ts">
	import { page } from '$app/state';
	import ModeToggle from '@/components/mode-toggle.svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import { Separator } from '@/components/ui/separator';
	import * as Sidebar from '@/components/ui/sidebar';

	let pathParts = $derived(page.url.pathname.split('/').slice(1));
</script>

<header
	class="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<Breadcrumb.Root>
			<Breadcrumb.List>
				{#each pathParts as part, i (part)}
					{#if i > 0}
						<Breadcrumb.Separator />
					{/if}
					<Breadcrumb.Item>
						{#if i === pathParts.length - 1}
							<Breadcrumb.Page>{part.charAt(0).toUpperCase() + part.substring(1)}</Breadcrumb.Page>
						{:else}
							<Breadcrumb.Link href={`/${pathParts.slice(0, i + 1).join('/')}`}
								>{part.charAt(0).toUpperCase() + part.substring(1)}
							</Breadcrumb.Link>
						{/if}
					</Breadcrumb.Item>
				{/each}
			</Breadcrumb.List>
		</Breadcrumb.Root>
		<div class="ml-auto flex items-center gap-2">
			<ModeToggle />
		</div>
	</div>
</header>
