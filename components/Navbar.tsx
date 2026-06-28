"use client";

import Link from "next/link";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-blue-600 text-2xl">✦</span>
            <span className="font-bold text-xl text-slate-900">HealthHire</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/jobs" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
              Browse Jobs
            </Link>

            {isSignedIn ? (
              <>
                <Link
                  href="/dashboard/candidate"
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium"
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                    Sign in
                  </button>
                </SignInButton>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                    Get started
                  </button>
                </SignInButton>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
