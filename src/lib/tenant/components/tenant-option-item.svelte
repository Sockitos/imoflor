<script lang="ts">
	import type { TenantOption } from '../types';

	interface Props {
		option: TenantOption;
	}

	let { option }: Props = $props();
</script>

<div class="flex flex-row items-center gap-2">
	<span class="text-sm">{option.name}</span>
</div>
