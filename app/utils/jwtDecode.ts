import { jwtDecode } from "jwt-decode";

export interface DecodedToken {
  id: string;
  username: string;
  roles: string;
  iat: number;
  exp: number;
}

export function decodeToken(token: string): DecodedToken {
  return jwtDecode<DecodedToken>(token);
}
