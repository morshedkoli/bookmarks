import { Suspense } from "react";
import MenubarApp from "@/components/custom/MenubarApp";

import HomePage from "@/components/custom/HomePage";

export default async function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<div className="flex justify-center p-8">Loading...</div>}>
          <HomePage />
        </Suspense>
      </div>
    </div>
  );
}
