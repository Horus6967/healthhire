import Link from "next/link";
import Logo from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <Logo size={48} />
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-3">404</h1>
        <p className="text-gray-500 text-lg mb-8">This page doesn&apos;t exist.</p>
        <Link
          href="/"
          className="bg-[#0A66C2] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-[#004182] transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
