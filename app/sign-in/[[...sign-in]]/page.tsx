import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-md rounded-2xl border border-gray-200",
            },
          }}
          redirectUrl="/dashboard/candidate"
          afterSignInUrl="/dashboard/candidate"
        />
      </div>
    </div>
  );
}
