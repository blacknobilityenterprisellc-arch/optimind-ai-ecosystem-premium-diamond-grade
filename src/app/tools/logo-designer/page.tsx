/**
 * OptiMind AI Logo Designer Page
 *
 * Professional logo creation and brand identity design tool.
 * Part of the Creative & Media Suite in the OptiMind AI Ecosystem.
 */

import { Metadata } from 'next';
import LogoDesigner from '@/components/LogoDesigner';

export const metadata: Metadata = {
  title: 'Logo Designer - OptiMind AI Ecosystem',
  description: 'AI-powered logo design and brand identity creation tool. Generate professional logos with advanced AI technology.',
  keywords: [
    'logo design',
    'brand identity',
    'AI design',
    'logo generator',
    'brand creation',
    'OptiMind AI',
    'creative tools',
  ],
};

export default function LogoDesignerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <LogoDesigner />
      </div>
    </div>
  );
}