// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { Database } from "@/shared/types/supabase-types";
import { Claims, SupabaseClient } from "@supabase/supabase-js";

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>;
		}
		interface PageData {
			supabase: SupabaseClient<Database>;
			claims: Claims;
			flash?: { type: "success" | "error"; message: string };
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};
