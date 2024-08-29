// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from '@/types/supabase-types';
import { Session, SupabaseClient, type User } from '@supabase/supabase-js';

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			session: Session | null;
			user: User | null;
			flash?: { type: 'success' | 'error'; message: string };
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
