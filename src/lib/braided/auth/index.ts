export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

export function isAuthenticated(): boolean {
  return false;
}

export function getUser(): AuthUser | null {
  return null;
}
