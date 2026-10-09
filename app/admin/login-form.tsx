"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";

const inputClass =
  "mt-2 w-full rounded-md border border-gold/40 bg-ivory px-3 py-2.5 text-ink focus:border-olive focus:outline-none";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="space-y-5">
      <label className="block text-sm text-olive">
        Մուտքանուն
        <input name="username" autoComplete="username" required className={inputClass} />
      </label>
      <label className="block text-sm text-olive">
        Գաղտնաբառ
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-[#8a4334]">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-olive py-3 text-sm text-ivory transition-colors hover:bg-olive-deep disabled:opacity-70"
      >
        {pending ? "Ստուգվում է…" : "Մուտք գործել"}
      </button>
    </form>
  );
}
