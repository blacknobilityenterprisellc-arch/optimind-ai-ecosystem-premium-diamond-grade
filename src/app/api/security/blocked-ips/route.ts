import { NextResponse } from 'next/server';
import { getSecurityMonitor } from '@/lib/security-monitor';

export async function GET() {
  try {
    const monitor = getSecurityMonitor();
    const blockedIPs = monitor.getBlockedIPs();

    return NextResponse.json({
      blocked_ips: blockedIPs,
      total_blocked: blockedIPs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to get blocked IPs:', error);
    return NextResponse.json({ error: 'Failed to retrieve blocked IPs' }, { status: 500 });
  }
}
