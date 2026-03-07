import { Suspense } from "react";
import MenubarApp from "@/components/custom/MenubarApp";

import HomePage from "@/components/custom/HomePage";

export default async function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 py-12">
        <Suspense fallback={<div className="flex justify-center p-12">Loading...</div>}>
          <HomePage />
        </Suspense>
      </div>
    </div>
  );
}
