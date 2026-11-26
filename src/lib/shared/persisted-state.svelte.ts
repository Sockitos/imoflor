export const PersistedStateKey = {
	TenantTableSorting: 'tenant-table:sorting',
	TenantTableColumnPinning: 'tenant-table:column-pinning',
};

type PersistedStateKeyValue = (typeof PersistedStateKey)[keyof typeof PersistedStateKey];

export function persistedState<T>(key: PersistedStateKeyValue, initial: T) {
	function read(): T {
		try {
			const item = localStorage.getItem(key);
			return item !== null ? (JSON.parse(item) as T) : initial;
		} catch {
			return initial;
		}
	}

	let value = $state<T>(read());

	$effect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch {}
	});

	return {
		get current() {
			return value;
		},
		set current(v: T) {
			value = v;
		},
	};
}
