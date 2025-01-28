import type { Session } from "next-auth"; // Use `import type` to avoid the unused variable error.

declare module "next-auth" {
  interface Session {
    accessToken?: string;
  }
}
