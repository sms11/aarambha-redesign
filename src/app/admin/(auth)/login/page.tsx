'use client';

import { useActionState, useState } from 'react';
import { login } from '@/lib/actions/auth';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#1B2A4A] via-[#1a2d4d] to-[#162340] px-6">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[5%] h-32 w-32 rounded-full bg-[#FF6B35]/10 blur-2xl" />
        <div className="absolute top-[60%] right-[8%] h-40 w-40 rounded-full bg-[#14B8A6]/10 blur-2xl" />
        <div className="absolute bottom-[15%] left-[15%] h-28 w-28 rounded-full bg-[#8B5CF6]/10 blur-2xl" />
        <div className="absolute top-[25%] right-[20%] h-24 w-24 rounded-full bg-[#F59E0B]/10 blur-2xl" />

        {/* Floating emojis */}
        <span className="absolute top-[12%] left-[8%] text-3xl opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>📚</span>
        <span className="absolute top-[20%] right-[12%] text-2xl opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>✏️</span>
        <span className="absolute bottom-[20%] left-[10%] text-2xl opacity-10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🎓</span>
        <span className="absolute bottom-[30%] right-[8%] text-3xl opacity-10 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>⭐</span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20">
          {/* Top gradient bar */}
          <div className="h-2 bg-gradient-to-r from-[#FF6B35] via-[#F59E0B] via-[#14B8A6] to-[#8B5CF6]" />

          <div className="p-8 sm:p-10">
            {/* Logo & Title */}
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#F59E0B] shadow-lg shadow-[#FF6B35]/25">
                <span className="text-2xl font-bold text-white font-[family-name:var(--font-display)]">A</span>
              </div>
              <h1 className="text-2xl font-bold text-[#1B2A4A] font-[family-name:var(--font-display)]">
                Welcome Back!
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                Sign in to manage your school website
              </p>
            </div>

            <form action={formAction} className="space-y-5">
              {/* Error message */}
              {state?.error && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <span>😟</span>
                  {state.error}
                </div>
              )}

              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#1B2A4A]"
                >
                  <span>✉️</span> Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@aarambha.school"
                  className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm text-[#1B2A4A] placeholder:text-gray-400 transition-all focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/10 focus:outline-none"
                />
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-[#1B2A4A]"
                >
                  <span>🔒</span> Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border-2 border-gray-100 bg-gray-50/50 px-5 py-3.5 pr-12 text-sm text-[#1B2A4A] placeholder:text-gray-400 transition-all focus:border-[#FF6B35] focus:bg-white focus:ring-4 focus:ring-[#FF6B35]/10 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-gray-400 transition-colors hover:text-[#1B2A4A]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#F59E0B] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#FF6B35]/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none"
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In →'
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 text-center">
              <a
                href="/"
                className="text-xs text-gray-400 transition-colors hover:text-[#FF6B35]"
              >
                ← Back to website
              </a>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <p className="mt-6 text-center text-xs text-white/30">
          Aarambha Sanskar Vidyalaya — Admin Panel
        </p>
      </div>
    </div>
  );
}
