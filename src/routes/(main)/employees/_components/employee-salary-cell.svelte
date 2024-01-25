<script lang="ts">
	import { Badge } from '@/components/ui/badge';
	import type { SalaryType } from '@/types';

	export let type: SalaryType;
	export let salary: number;
	$: formatted = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(
		salary
	);
</script>

<div class="flex flex-row items-center gap-x-2">
	<Badge variant="outline">
		{type}
	</Badge>
	{formatted}
</div>
