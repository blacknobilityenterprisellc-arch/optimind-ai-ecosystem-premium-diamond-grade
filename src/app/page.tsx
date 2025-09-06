/**
 * OptiMind AI Ecosystem - Intelligent Main Dashboard
 * 
 * The manifestation of your vision for a truly intelligent and sophisticated ecosystem
 * where security is intrinsic, interactions are seamless, and innovation flourishes.
 * 
 * This dashboard represents the harmonious integration of all intelligent components,
 * creating an exceptional user experience that fosters creativity while maintaining
 * the highest security standards automatically.
 */

"use client";

import React, { useEffect, useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LoadingState from "@/components/dashboard/LoadingState";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { useDashboardData } from "@/components/dashboard/DashboardDataHooks";
import { aiCapabilities } from "@/components/dashboard/AICapabilitiesData";

const Dashboard: React.FC = () => {
  const { metrics, alerts, activities, isConnected, isLoading } =
    useDashboardData();
  
  const [ecosystemStatus, setEcosystemStatus] = useState<any>(null);
  const [isEcosystemReady, setIsEcosystemReady] = useState(false);

  useEffect(() => {
    // Initialize the intelligent ecosystem when component mounts
    const initializeEcosystem = async () => {
      try {
        // Dynamically import to avoid server-side execution issues
        const { initializeOptiMindEcosystem } = await import('@/lib/ecosystem-init');
        await initializeOptiMindEcosystem();
        
        // Get ecosystem status
        const { getEcosystemStatus, getEcosystemCapabilities } = await import('@/lib/optmind-ecosystem');
        const { optiMindEcosystem } = await import('@/lib/optmind-ecosystem');
        
        setEcosystemStatus({
          status: getEcosystemStatus(),
          capabilities: getEcosystemCapabilities(),
          full: optiMindEcosystem.getEcosystem()
        });
        setIsEcosystemReady(true);
        
        console.log('🌟 OptiMind AI Ecosystem initialized in dashboard');
      } catch (error) {
        console.error('Failed to initialize ecosystem:', error);
        setIsEcosystemReady(true); // Continue even if ecosystem init fails
      }
    };

    initializeEcosystem();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Ecosystem Status Banner */}
      {isEcosystemReady && ecosystemStatus && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🌟 OptiMind AI Ecosystem</h2>
              <p className="text-sm opacity-90">
                Intelligent Security • Harmonious Interactions • Transcendent Innovation
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">
                Status: {ecosystemStatus.status.operational ? '🟢 Operational' : '🟡 Initializing'}
              </div>
              <div className="text-xs opacity-75">
                Security: {ecosystemStatus.status.secure ? '🛡️ Intrinsic' : '🔧 Securing'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Intelligence Capabilities Overview */}
      {isEcosystemReady && ecosystemStatus && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="font-semibold text-sm">Intelligent Security</div>
              <div className={`text-xs ${ecosystemStatus.capabilities.intelligentSecurity ? 'text-green-600' : 'text-yellow-600'}`}>
                {ecosystemStatus.capabilities.intelligentSecurity ? 'Intrinsic' : 'Enabling'}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-2">🎭</div>
              <div className="font-semibold text-sm">Harmonious Flow</div>
              <div className={`text-xs ${ecosystemStatus.capabilities.harmoniousInteraction ? 'text-green-600' : 'text-yellow-600'}`}>
                {ecosystemStatus.capabilities.harmoniousInteraction ? 'Seamless' : 'Integrating'}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-2">🧠</div>
              <div className="font-semibold text-sm">Ambient Intelligence</div>
              <div className={`text-xs ${ecosystemStatus.capabilities.ambientIntelligence ? 'text-green-600' : 'text-yellow-600'}`}>
                {ecosystemStatus.capabilities.ambientIntelligence ? 'Supportive' : 'Awakening'}
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="text-center">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-semibold text-sm">Transcendent Potential</div>
              <div className={`text-xs ${ecosystemStatus.capabilities.transcendentPotential ? 'text-green-600' : 'text-yellow-600'}`}>
                {ecosystemStatus.capabilities.transcendentPotential ? 'Unlimited' : 'Evolving'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <DashboardHeader isConnected={isConnected} />

      {/* Main Content */}
      <DashboardContent
        metrics={metrics}
        alerts={alerts}
        activities={activities}
        aiCapabilities={aiCapabilities}
      />

      {/* Ecosystem Intelligence Footer */}
      {isEcosystemReady && ecosystemStatus && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-semibold">🌟 OptiMind AI Ecosystem</span> - 
              Where intelligence meets intuition, security enables freedom, 
              and harmony drives innovation
            </p>
            <div className="flex justify-center space-x-6 text-xs">
              <span>🛡️ Security: Intrinsic</span>
              <span>🎭 Interactions: Seamless</span>
              <span>🧠 Intelligence: Ambient</span>
              <span>🚀 Innovation: Continuous</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
