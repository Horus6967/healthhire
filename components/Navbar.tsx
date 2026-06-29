"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-blue-600 text-2xl">✦</span>
            <span className="font-bold text-xl text-slate-900">HealthHire</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
              Browse Jobs
            </Link>
            <Link href="/onboarding/employer" className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors hidden sm:block">
              For Employers
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard/candidate"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <SignInButton mode="modal">
                  <button className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors">
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                    Get started
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
