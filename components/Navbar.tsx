"use client";

import Link from "next/link";
import { useUser, UserButton } from "@clerk/nextjs";
import Logo from "./Logo";

export default function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <Logo size={28} />
            <span className="font-bold text-white text-base tracking-tight">HealthHire</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/employers/candidates" className="text-white/60 hover:text-white text-sm font-medium transition-colors hidden sm:block">
              For Employers
            </Link>

            {isSignedIn ? (
              <div className="flex items-center gap-4">
                <Link
                  href={user?.publicMetadata?.role === "EMPLOYER" ? "/dashboard/employer" : "/dashboard/candidate"}
                  className="text-white/60 hover:text-white text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/sign-in"
                  className="text-white/70 hover:text-white px-4 py-1.5 text-sm font-medium transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/sign-up"
                  className="bg-[#3ECF8E] hover:bg-[#2db87a] text-black px-4 py-1.5 rounded-md text-sm font-semibold transition-colors"
                >
                  Start for free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
