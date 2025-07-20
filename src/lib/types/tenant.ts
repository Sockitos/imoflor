import type { createTenantSchema } from '$lib/schemas/tenant';
import type { z } from 'zod';

export type Tenant = z.infer<typeof createTenantSchema> & {
	id: number;
};
