import type { ReactNode } from "react";

export interface User {
  ord: ReactNode;
  user_id: string;
  username: string;
  secret_phrase: string;
  roles: string;
}
