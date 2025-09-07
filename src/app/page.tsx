import OptiMindEcosystem from "@/components/OptiMindEcosystem";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center">
          OptiMind AI Ecosystem
        </h1>
        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl mx-auto">
          Premium Diamond Grade AI Solutions for Enterprise Transformation
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <OptiMindEcosystem />
        </div>
      </div>
    </main>
  );
}
