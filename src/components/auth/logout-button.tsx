"use client";

import { logoutAction } from "@/features/auth/actions/logout";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="panel-user-menu-item panel-user-menu-item--danger"
      >
        <LogOut size={13} />
        Wyloguj
      </button>
    </form>
  );
}
