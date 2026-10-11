"use client";

import { useActionState, useState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export default function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#27352f]">
          Email address
        </span>
        <input
          autoComplete="username"
          autoFocus
          className="h-[54px] w-full rounded-xl border border-[#dce2dc] bg-white px-4 text-sm text-[#172522] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#315d50] focus:ring-4 focus:ring-[#315d50]/10"
          name="email"
          placeholder="admin@example.com"
          required
          type="email"
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium text-[#27352f]">
          Password
        </span>
        <span className="relative block">
          <input
            autoComplete="current-password"
            className="h-[54px] w-full rounded-xl border border-[#dce2dc] bg-white px-4 pr-16 text-sm text-[#172522] outline-none transition placeholder:text-[#a0aaa3] focus:border-[#315d50] focus:ring-4 focus:ring-[#315d50]/10"
            name="password"
            placeholder="Enter your password"
            required
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 px-4 text-xs font-medium text-[#68766f] hover:text-[#1c443b]"
            onClick={() => setShowPassword((visible) => !visible)}
            type="button"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </span>
      </label>

      {state.error && (
        <p
          aria-live="polite"
          className="rounded-xl border border-[#f1d4cf] bg-[#fff4f1] px-4 py-3 text-sm leading-5 text-[#a33d32]"
          role="alert"
        >
          {state.error}
        </p>
      )}

      <button
        className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#1c443b] px-5 text-sm font-semibold text-white shadow-[0_8px_22px_rgba(28,68,59,0.16)] transition hover:bg-[#15372f] focus:outline-none focus:ring-4 focus:ring-[#315d50]/20 disabled:cursor-wait disabled:opacity-70"
        disabled={isPending}
        type="submit"
      >
        {isPending ? "Signing in..." : "Sign in"}
        {!isPending && <span aria-hidden="true">→</span>}
      </button>
    </form>
  );
}
