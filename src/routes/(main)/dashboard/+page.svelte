<script lang="ts">
	import PageTitle from '@/components/page-title.svelte';
	import { Button } from '@/components/ui/button';
	import Calendar from '@/components/ui/calendar/calendar.svelte';
	import * as Popover from '@/components/ui/popover';
	import { Separator } from '@/components/ui/separator';
	import * as Tabs from '@/components/ui/tabs';
	import { dateFormatter } from '@/formatters';
	import { cn } from '@/utils';
	import { CalendarIcon } from 'lucide-svelte';

	let dateRange = {
		start: new Date(2024, 1, 1),
		end: new Date(2024, 9, 5),
	};
</script>

<div class="flex flex-col gap-y-6 px-4 py-6 lg:px-8">
	<div class="flex flex-row items-start justify-between">
		<div class="flex flex-col gap-y-2">
			<PageTitle>Hi, Welcome back 👋</PageTitle>
			<Tabs.Root>
				<Tabs.List>
					<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
					<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
		</div>
		<Popover.Root>
			<Popover.Trigger asChild let:builder>
				<Button
					variant="outline"
					class={cn(
						'w-[240px] justify-start text-left font-normal',
						!dateRange && 'text-muted-foreground'
					)}
					builders={[builder]}
				>
					<CalendarIcon class="mr-2 h-4 w-4" />
					{#if dateRange}
						{dateFormatter(dateRange.start.toISOString())} - {dateFormatter(
							dateRange.end.toISOString()
						)}
					{:else}
						Pick a date
					{/if}
				</Button>
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<Calendar />
			</Popover.Content>
		</Popover.Root>
	</div>
	<Separator />
</div>
