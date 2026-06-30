"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";

export default function Navbar() {
  const { isSignedIn } = useUser();

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={30} />
            <span className="font-bold text-gray-900 text-lg tracking-tight">HealthHire</span>
          </Link>

          <div className="flex items-center gap-5">
            <Link href="/jobs" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Jobs
            </Link>
            <Link href="/onboarding/employer" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors hidden sm:block">
              For Employers
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard/candidate" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="text-[#0A66C2] hover:bg-blue-50 border border-[#0A66C2] px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
                >
                  Join now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
