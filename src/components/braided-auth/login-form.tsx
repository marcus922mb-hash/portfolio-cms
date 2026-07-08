"use client";

import { useActionState } from "react";
import { loginAction } from "@/features/auth/actions/login";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="login-form" noValidate>
      <div className="login-field">
        <label className="login-label" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          disabled={isPending}
          className="login-input"
          placeholder="twoj@email.pl"
        />
      </div>

      <div className="login-field">
        <label className="login-label" htmlFor="password">
          Hasło
        </label>
        <div className="login-input-wrap">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            disabled={isPending}
            className="login-input"
            placeholder="••••••••"
          />
          <button
            type="button"
            className="login-eye"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {state?.error && (
        <p className="login-error" role="alert">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={isPending} className="login-submit">
        {isPending ? (
          <>
            <Loader2 size={15} className="login-spinner" />
            Logowanie…
          </>
        ) : (
          "Zaloguj się"
        )}
      </button>
    </form>
  );
}
