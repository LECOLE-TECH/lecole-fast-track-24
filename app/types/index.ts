export type UserRole = "admin" | "authenticated" | "non-authenticated";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  secretPhrase?: string;
}
