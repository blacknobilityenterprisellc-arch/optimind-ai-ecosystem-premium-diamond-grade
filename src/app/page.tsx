'use client';

import OptiMindEcosystem from '@/components/OptiMindEcosystem';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-6 leading-tight">
            OptiMind AI Ecosystem
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            Premium Diamond Grade AI Solutions for Enterprise Transformation
          </p>
        </div>

        <div className="flex justify-center">
          <OptiMindEcosystem />
        </div>
      </div>
    </main>
  );
}
