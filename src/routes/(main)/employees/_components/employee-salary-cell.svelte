<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import { currencyFormatter } from '@/formatters';
	import type { SalaryType } from '@/types/types';

	interface Props {
		type: SalaryType;
		salary: number;
	}

	let { type, salary }: Props = $props();
	let formatted = $derived(currencyFormatter.format(salary));
</script>

<div class="flex flex-row items-center gap-x-2">
	<Badge variant="outline">
		{type}
	</Badge>
	{formatted}
</div>
