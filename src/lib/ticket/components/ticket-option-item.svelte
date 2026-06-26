<script lang="ts">
	import type { TicketOption } from '../types';

	interface Props {
		option: TicketOption;
	}

	let { option }: Props = $props();
</script>

<div class="flex flex-row items-center gap-2">
	<span class="text-sm">{option.title}</span>
</div>
