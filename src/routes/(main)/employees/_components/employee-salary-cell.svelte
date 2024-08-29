<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import { currencyFormatter } from '@/formatters';
	import type { SalaryType } from '@/types/types';

	export let type: SalaryType;
	export let salary: number;
	$: formatted = currencyFormatter.format(salary);
</script>

<div class="flex flex-row items-center gap-x-2">
	<Badge variant="outline">
		{type}
	</Badge>
	{formatted}
</div>
