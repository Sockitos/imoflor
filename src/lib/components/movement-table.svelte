<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { createSvelteTable, FlexRender } from '@/components/ui/data-table';
	import { Input } from '@/components/ui/input';
	import { Spinner } from '@/components/ui/spinner';
	import * as Table from '@/components/ui/table';
	import { getMovements } from '@/remotes/movements.remote.js';
	import { getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/table-core';
	import { PlusCircle } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { columns } from './movement-columns';

	interface Props {
		tax_id_number: string;
	}

	let { tax_id_number }: Props = $props();

	const globalFilter = writable('');

	const movements = $derived(await getMovements(tax_id_number));
	const table = createSvelteTable({
		data: movements ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onGlobalFilterChange: globalFilter.set,
		state: {
			get globalFilter() {
				return $globalFilter;
			},
		},
	});
</script>

<svelte:boundary>
	<div class="flex flex-col gap-y-6">
		<div class="flex items-start justify-between">
			<div>
				<h2 class="text-lg font-semibold">Movements</h2>
				<p class="text-sm text-muted-foreground">
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
					ut labore et dolore magna aliqua.
				</p>
			</div>
			<Button>
				<PlusCircle class="mr-2 h-4 w-4" />
				Movement
			</Button>
		</div>
		<div class="flex flex-col gap-y-4">
			<div class="flex flex-row items-center">
				<Input placeholder="Search..." bind:value={$globalFilter} class="w-[150px] lg:w-[250px]" />
			</div>
			<div class="rounded-md border">
				<Table.Root>
					<Table.Header>
						{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
							<Table.Row>
								{#each headerGroup.headers as header (header.id)}
									<Table.Head>
										{#if !header.isPlaceholder}
											<FlexRender
												content={header.column.columnDef.header}
												context={header.getContext()}
											/>
										{/if}
									</Table.Head>
								{/each}
							</Table.Row>
						{/each}
					</Table.Header>
					<Table.Body>
						{#each table.getRowModel().rows as row (row.id)}
							<Table.Row data-state={row.getIsSelected() && 'selected'}>
								{#each row.getVisibleCells() as cell (cell.id)}
									<Table.Cell>
										<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
									</Table.Cell>
								{/each}
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</div>
	</div>

	{#snippet pending()}
		<div class="flex items-center justify-center">
			<Spinner class="size-6" />
		</div>
	{/snippet}

	{#snippet failed(_, reset)}
		<div class="flex flex-col items-center gap-y-4">
			<p class="text-sm text-destructive">Failed to load movements.</p>
			<Button variant="outline" class="w-fit" onclick={reset}>Retry</Button>
		</div>
	{/snippet}
</svelte:boundary>
