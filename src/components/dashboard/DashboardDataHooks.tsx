'use client';

import { useState, useEffect } from 'react';

export interface SystemMetrics {
  health: number;
  uptime: number;
  latency: number;
  requestsPerSecond: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkLoad: number;
}

export interface SecurityMetrics {
  firewallStatus: string;
  authenticationLevel: string;
  encryptionStrength: string;
  threatDetection: string;
  vulnerabilities: number;
  blockedAttacks: number;
  securityScore: number;
}

export interface NetworkMetrics {
  networkStatus: string;
  globalCoverage: number;
  serverLoad: number;
  bandwidth: number;
  packetLoss: number;
  jitter: number;
  connectionCount: number;
}

export interface StorageMetrics {
  storageUsed: number;
  backupStatus: string;
  dataIntegrity: number;
  compressionRatio: number;
  readSpeed: number;
  writeSpeed: number;
  availableSpace: number;
}

export interface AgentMetrics {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  tasksCompleted: number;
  tasksRunning: number;
  successRate: number;
  responseTime: number;
  lastActivity: Date;
  capabilities: string[];
}

export const useSystemMetrics = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    health: 100,
    uptime: 99.9,
    latency: 0.8,
    requestsPerSecond: 2100000,
    cpuUsage: 42,
    memoryUsage: 68,
    diskUsage: 65,
    networkLoad: 78
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        health: Math.min(100, Math.max(95, prev.health + (Math.random() - 0.5) * 2)),
        latency: Math.max(0.5, Math.min(2.0, prev.latency + (Math.random() - 0.5) * 0.2)),
        requestsPerSecond: Math.max(1800000, Math.min(2500000, prev.requestsPerSecond + (Math.random() - 0.5) * 100000)),
        cpuUsage: Math.max(30, Math.min(70, prev.cpuUsage + (Math.random() - 0.5) * 5)),
        memoryUsage: Math.max(60, Math.min(80, prev.memoryUsage + (Math.random() - 0.5) * 3)),
        diskUsage: Math.max(60, Math.min(75, prev.diskUsage + (Math.random() - 0.5) * 2)),
        networkLoad: Math.max(70, Math.min(85, prev.networkLoad + (Math.random() - 0.5) * 4))
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const useSecurityMetrics = () => {
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    firewallStatus: 'Active',
    authenticationLevel: '2FA',
    encryptionStrength: 'Quantum',
    threatDetection: 'AI-Powered',
    vulnerabilities: 0,
    blockedAttacks: 1247,
    securityScore: 100
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 3),
        securityScore: Math.min(100, Math.max(95, prev.securityScore + (Math.random() - 0.5) * 1))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const useNetworkMetrics = () => {
  const [metrics, setMetrics] = useState<NetworkMetrics>({
    networkStatus: 'Optimal',
    globalCoverage: 180,
    serverLoad: 42,
    bandwidth: 10,
    packetLoss: 0.01,
    jitter: 0.5,
    connectionCount: 12450
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        serverLoad: Math.max(35, Math.min(55, prev.serverLoad + (Math.random() - 0.5) * 3)),
        bandwidth: Math.max(8, Math.min(12, prev.bandwidth + (Math.random() - 0.5) * 0.5)),
        packetLoss: Math.max(0, Math.min(0.05, prev.packetLoss + (Math.random() - 0.5) * 0.01)),
        connectionCount: Math.max(12000, Math.min(13000, prev.connectionCount + (Math.random() - 0.5) * 100))
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const useStorageMetrics = () => {
  const [metrics, setMetrics] = useState<StorageMetrics>({
    storageUsed: 68,
    backupStatus: 'Current',
    dataIntegrity: 100,
    compressionRatio: 92,
    readSpeed: 850,
    writeSpeed: 720,
    availableSpace: 32
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        storageUsed: Math.max(65, Math.min(75, prev.storageUsed + (Math.random() - 0.5) * 1)),
        compressionRatio: Math.max(88, Math.min(95, prev.compressionRatio + (Math.random() - 0.5) * 2)),
        readSpeed: Math.max(800, Math.min(900, prev.readSpeed + (Math.random() - 0.5) * 20)),
        writeSpeed: Math.max(680, Math.min(760, prev.writeSpeed + (Math.random() - 0.5) * 20)),
        availableSpace: 100 - prev.storageUsed
      }));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return metrics;
};

export const useAgentMetrics = () => {
  const [agents, setAgents] = useState<AgentMetrics[]>([
    {
      id: '1',
      name: 'Orchestrator Prime',
      status: 'active',
      tasksCompleted: 1247,
      tasksRunning: 8,
      successRate: 99.2,
      responseTime: 12,
      lastActivity: new Date(),
      capabilities: ['Task Management', 'Resource Allocation', 'System Monitoring']
    },
    {
      id: '2',
      name: 'Security Sentinel',
      status: 'active',
      tasksCompleted: 892,
      tasksRunning: 3,
      successRate: 99.8,
      responseTime: 8,
      lastActivity: new Date(),
      capabilities: ['Threat Detection', 'Security Monitoring', 'Incident Response']
    },
    {
      id: '3',
      name: 'Data Processor',
      status: 'busy',
      tasksCompleted: 2156,
      tasksRunning: 12,
      successRate: 97.5,
      responseTime: 15,
      lastActivity: new Date(),
      capabilities: ['Data Analysis', 'Pattern Recognition', 'Predictive Modeling']
    },
    {
      id: '4',
      name: 'Network Guardian',
      status: 'active',
      tasksCompleted: 745,
      tasksRunning: 5,
      successRate: 99.1,
      responseTime: 10,
      lastActivity: new Date(),
      capabilities: ['Network Monitoring', 'Traffic Analysis', 'Anomaly Detection']
    },
    {
      id: '5',
      name: 'AI Optimizer',
      status: 'idle',
      tasksCompleted: 1567,
      tasksRunning: 0,
      successRate: 98.7,
      responseTime: 18,
      lastActivity: new Date(Date.now() - 300000),
      capabilities: ['Model Training', 'Performance Tuning', 'Resource Optimization']
    },
    {
      id: '6',
      name: 'Compliance Checker',
      status: 'active',
      tasksCompleted: 634,
      tasksRunning: 2,
      successRate: 100,
      responseTime: 6,
      lastActivity: new Date(),
      capabilities: ['Compliance Monitoring', 'Audit Trail', 'Reporting']
    },
    {
      id: '7',
      name: 'Backup Manager',
      status: 'idle',
      tasksCompleted: 423,
      tasksRunning: 0,
      successRate: 99.9,
      responseTime: 25,
      lastActivity: new Date(Date.now() - 600000),
      capabilities: ['Data Backup', 'Recovery Management', 'Integrity Verification']
    },
    {
      id: '8',
      name: 'User Assistant',
      status: 'active',
      tasksCompleted: 3241,
      tasksRunning: 15,
      successRate: 96.8,
      responseTime: 20,
      lastActivity: new Date(),
      capabilities: ['User Support', 'Query Processing', 'Task Automation']
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const shouldUpdate = Math.random() > 0.7;
        if (!shouldUpdate) return agent;

        const statusOptions: AgentMetrics['status'][] = ['active', 'idle', 'busy', 'offline'];
        const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
        
        return {
          ...agent,
          status: newStatus,
          tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 3),
          tasksRunning: Math.max(0, Math.min(20, agent.tasksRunning + (Math.random() > 0.5 ? 1 : -1))),
          successRate: Math.max(90, Math.min(100, agent.successRate + (Math.random() - 0.5) * 0.5)),
          responseTime: Math.max(5, Math.min(30, agent.responseTime + (Math.random() - 0.5) * 2)),
          lastActivity: Math.random() > 0.3 ? new Date() : agent.lastActivity
        };
      }));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return agents;
};