import type { createTenantSchema } from '@tenants/schemas/tenant';
import type { z } from 'zod';

export type Tenant = z.infer<typeof createTenantSchema> & {
	id: number;
};
