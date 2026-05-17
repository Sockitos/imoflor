<script lang="ts">
	import type { InterventionStatus } from '../types';
	import { statusMap } from './intervention-status-map';

	interface Props {
		status: InterventionStatus;
	}

	let { status }: Props = $props();

	let { label, icon } = $derived(statusMap[status]);

	const SvelteComponent = $derived(icon);
</script>

<div class="flex items-center">
	<SvelteComponent class="mr-2 h-4 w-4 text-muted-foreground" />
	<span>{label}</span>
</div>
