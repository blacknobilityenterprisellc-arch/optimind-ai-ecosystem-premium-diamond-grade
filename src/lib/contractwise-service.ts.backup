// ContractWise AI Service
// AI-powered contract intelligence platform

import {
  mcpServiceOrchestrator,
  MCPBusinessRequest,
  MCPBusinessResponse,
} from './mcp-service-orchestrator';
import { db } from './db';

export interface ContractAnalysisRequest {
  contractTitle: string;
  contractType: string;
  contractText?: string;
  fileUrl?: string;
  extractedText?: string;
  jurisdiction?: string;
  industry?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface ContractAnalysisResult {
  overview: {
    contractType: string;
    totalClauses: number;
    riskLevel: 'low' | 'medium' | 'high';
    overallConfidence: number;
  };
  riskAssessment: {
    highRiskClauses: Array<{
      clause: string;
      risk: string;
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    mediumRiskClauses: Array<{
      clause: string;
      risk: string;
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
    lowRiskClauses: Array<{
      clause: string;
      risk: string;
      severity: 'low' | 'medium' | 'high';
      recommendation: string;
    }>;
  };
  clauses: {
    identified: Array<{
      type: string;
      title: string;
      content: string;
      importance: 'critical' | 'important' | 'standard';
    }>;
    missing: Array<{
      type: string;
      importance: 'critical' | 'important' | 'standard';
      recommendation: string;
    }>;
  };
  plainLanguage: {
    summary: string;
    keyPoints: string[];
    simplifiedClauses: Array<{
      original: string;
      simplified: string;
    }>;
  };
  complianceCheck: {
    jurisdiction: string;
    compliant: boolean;
    issues: Array<{
      regulation: string;
      issue: string;
      severity: 'low' | 'medium' | 'high';
      fix: string;
    }>;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    negotiationPoints: string[];
  };
  metadata: {
    processingTime: number;
    modelsUsed: string[];
    confidence: number;
    cost: number;
  };
}

class ContractWiseService {
  async analyzeContract(
    request: ContractAnalysisRequest,
    userId: string,
    projectId?: string
  ): Promise<{ result: ContractAnalysisResult; dbRecord: any }> {
    const mcpRequest: MCPBusinessRequest = {
      id: `contract-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      businessType: 'contractwise',
      userId,
      projectId,
      inputData: request,
      options: {
        enableEnsemble: true,
        priority: request.priority === 'high' ? 'accuracy' : 'balanced',
        temperature: 0.3,
        maxTokens: 3000,
      },
    };

    // Process with MCP orchestrator
    const mcpResponse = await mcpServiceOrchestrator.processBusinessRequest(mcpRequest);

    if (!mcpResponse.success) {
      throw new Error(`Contract analysis failed: ${mcpResponse.error}`);
    }

    // Parse and structure the response
    const contractResult = this.parseContractAnalysisResult(mcpResponse.result);

    // Save to database
    const dbRecord = await this.saveToDatabase(
      userId,
      projectId,
      request,
      contractResult,
      mcpResponse
    );

    return {
      result: contractResult,
      dbRecord,
    };
  }

  private parseContractAnalysisResult(mcpResult: any): ContractAnalysisResult {
    try {
      // If the result is already in the expected format, return it
      if (mcpResult.analysis && mcpResult.actionPlan) {
        return this.structureAnalysisResult(mcpResult.analysis);
      }

      // If the result is a raw response, parse it
      if (typeof mcpResult === 'string') {
        const parsed = JSON.parse(mcpResult);
        return this.structureAnalysisResult(parsed);
      }

      return this.structureAnalysisResult(mcpResult);
    } catch (error) {
      console.error('Failed to parse contract analysis result:', error);
      // Return a default structure
      return this.getDefaultAnalysisResult();
    }
  }

  private structureAnalysisResult(analysis: any): ContractAnalysisResult {
    return {
      overview: {
        contractType: analysis.contractType || 'Unknown',
        totalClauses: analysis.totalClauses || 0,
        riskLevel: analysis.riskLevel || 'medium',
        overallConfidence: analysis.overallConfidence || 0.8,
      },
      riskAssessment: {
        highRiskClauses: analysis.highRiskClauses || [],
        mediumRiskClauses: analysis.mediumRiskClauses || [],
        lowRiskClauses: analysis.lowRiskClauses || [],
      },
      clauses: {
        identified: analysis.identifiedClauses || [],
        missing: analysis.missingClauses || [],
      },
      plainLanguage: {
        summary: analysis.summary || 'No summary available',
        keyPoints: analysis.keyPoints || [],
        simplifiedClauses: analysis.simplifiedClauses || [],
      },
      complianceCheck: {
        jurisdiction: analysis.jurisdiction || 'Unknown',
        compliant: analysis.compliant || false,
        issues: analysis.complianceIssues || [],
      },
      recommendations: {
        immediate: analysis.immediateRecommendations || [],
        shortTerm: analysis.shortTermRecommendations || [],
        longTerm: analysis.longTermRecommendations || [],
        negotiationPoints: analysis.negotiationPoints || [],
      },
      metadata: {
        processingTime: analysis.processingTime || 0,
        modelsUsed: analysis.modelsUsed || [],
        confidence: analysis.confidence || 0.8,
        cost: analysis.cost || 0,
      },
    };
  }

  private getDefaultAnalysisResult(): ContractAnalysisResult {
    return {
      overview: {
        contractType: 'Unknown',
        totalClauses: 0,
        riskLevel: 'medium',
        overallConfidence: 0.5,
      },
      riskAssessment: {
        highRiskClauses: [],
        mediumRiskClauses: [],
        lowRiskClauses: [],
      },
      clauses: {
        identified: [],
        missing: [],
      },
      plainLanguage: {
        summary: 'Analysis could not be completed due to processing errors.',
        keyPoints: [],
        simplifiedClauses: [],
      },
      complianceCheck: {
        jurisdiction: 'Unknown',
        compliant: false,
        issues: [],
      },
      recommendations: {
        immediate: ['Please review the contract manually'],
        shortTerm: ['Consider professional legal review'],
        longTerm: ['Implement contract management system'],
        negotiationPoints: [],
      },
      metadata: {
        processingTime: 0,
        modelsUsed: [],
        confidence: 0.5,
        cost: 0,
      },
    };
  }

  private async saveToDatabase(
    userId: string,
    projectId: string | undefined,
    request: ContractAnalysisRequest,
    result: ContractAnalysisResult,
    mcpResponse: MCPBusinessResponse
  ) {
    try {
      const contractData = {
        userId,
        projectId,
        contractTitle: request.contractTitle,
        contractType: this.mapContractType(request.contractType),
        fileUrl: request.fileUrl,
        extractedText: request.extractedText || request.contractText,
        riskAssessment: result.riskAssessment,
        clauses: result.clauses,
        plainLanguage: result.plainLanguage,
        complianceCheck: result.complianceCheck,
        recommendations: result.recommendations,
        confidence: mcpResponse.confidence,
        processingTime: mcpResponse.processingTime,
        status: 'COMPLETED' as const,
        metadata: {
          jurisdiction: request.jurisdiction,
          industry: request.industry,
          priority: request.priority,
          mcpResponse: {
            modelResults: mcpResponse.modelResults,
            cost: mcpResponse.cost,
            timestamp: mcpResponse.timestamp,
          },
        },
      };

      const savedRecord = await db.contractAnalysis.create({
        data: contractData,
      });

      return savedRecord;
    } catch (error) {
      console.error('Failed to save contract analysis to database:', error);
      throw new Error('Failed to save analysis results');
    }
  }

  private mapContractType(contractType: string): any {
    const typeMap: Record<string, any> = {
      employment: 'EMPLOYMENT',
      service: 'SERVICE_AGREEMENT',
      nda: 'NDA',
      partnership: 'PARTNERSHIP',
      sales: 'SALES_CONTRACT',
      lease: 'LEASE_AGREEMENT',
      license: 'LICENSE_AGREEMENT',
      franchise: 'FRANCHISE',
      merger: 'MERGER_ACQUISITION',
      acquisition: 'MERGER_ACQUISITION',
    };

    return typeMap[contractType.toLowerCase()] || 'OTHER';
  }

  async getContractAnalysis(id: string, userId: string) {
    try {
      const contract = await db.contractAnalysis.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!contract) {
        throw new Error('Contract analysis not found');
      }

      return contract;
    } catch (error) {
      console.error('Failed to get contract analysis:', error);
      throw new Error('Failed to retrieve contract analysis');
    }
  }

  async getUserContractAnalyses(userId: string, limit: number = 20, offset: number = 0) {
    try {
      const contracts = await db.contractAnalysis.findMany({
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      });

      return contracts;
    } catch (error) {
      console.error('Failed to get user contract analyses:', error);
      throw new Error('Failed to retrieve contract analyses');
    }
  }

  async deleteContractAnalysis(id: string, userId: string) {
    try {
      const deleted = await db.contractAnalysis.deleteMany({
        where: {
          id,
          userId,
        },
      });

      if (deleted.count === 0) {
        throw new Error('Contract analysis not found');
      }

      return true;
    } catch (error) {
      console.error('Failed to delete contract analysis:', error);
      throw new Error('Failed to delete contract analysis');
    }
  }

  async generateContractTemplate(
    contractType: string,
    requirements: any,
    userId: string
  ): Promise<{ template: string; suggestions: string[] }> {
    const mcpRequest: MCPBusinessRequest = {
      id: `template-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      businessType: 'contractwise',
      userId,
      inputData: {
        action: 'generate_template',
        contractType,
        requirements,
      },
      options: {
        enableEnsemble: false,
        priority: 'accuracy',
        temperature: 0.4,
        maxTokens: 4000,
      },
    };

    const mcpResponse = await mcpServiceOrchestrator.processBusinessRequest(mcpRequest);

    if (!mcpResponse.success) {
      throw new Error(`Template generation failed: ${mcpResponse.error}`);
    }

    // Parse the template and suggestions from the response
    const result = mcpResponse.result;
    const template = result.template || result.content || JSON.stringify(result);
    const suggestions = result.suggestions || result.recommendations || [];

    return {
      template,
      suggestions,
    };
  }

  async compareContracts(
    contractId1: string,
    contractId2: string,
    userId: string
  ): Promise<{ comparison: any; insights: string[] }> {
    // Get both contracts from database
    const [contract1, contract2] = await Promise.all([
      this.getContractAnalysis(contractId1, userId),
      this.getContractAnalysis(contractId2, userId),
    ]);

    const mcpRequest: MCPBusinessRequest = {
      id: `compare-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      businessType: 'contractwise',
      userId,
      inputData: {
        action: 'compare_contracts',
        contract1: {
          type: contract1.contractType,
          clauses: contract1.clauses,
          riskAssessment: contract1.riskAssessment,
        },
        contract2: {
          type: contract2.contractType,
          clauses: contract2.clauses,
          riskAssessment: contract2.riskAssessment,
        },
      },
      options: {
        enableEnsemble: true,
        priority: 'accuracy',
        temperature: 0.3,
        maxTokens: 3000,
      },
    };

    const mcpResponse = await mcpServiceOrchestrator.processBusinessRequest(mcpRequest);

    if (!mcpResponse.success) {
      throw new Error(`Contract comparison failed: ${mcpResponse.error}`);
    }

    const result = mcpResponse.result;
    const comparison = result.comparison || result;
    const insights = result.insights || result.recommendations || [];

    return {
      comparison,
      insights,
    };
  }

  // Utility methods
  getContractTypes(): Array<{
    value: string;
    label: string;
    description: string;
  }> {
    return [
      {
        value: 'employment',
        label: 'Employment Contract',
        description: 'Employee-employer agreements',
      },
      {
        value: 'service',
        label: 'Service Agreement',
        description: 'Service provision contracts',
      },
      { value: 'nda', label: 'NDA', description: 'Non-disclosure agreements' },
      {
        value: 'partnership',
        label: 'Partnership Agreement',
        description: 'Business partnership contracts',
      },
      {
        value: 'sales',
        label: 'Sales Contract',
        description: 'Goods and services sales',
      },
      {
        value: 'lease',
        label: 'Lease Agreement',
        description: 'Property and equipment leases',
      },
      {
        value: 'license',
        label: 'License Agreement',
        description: 'Intellectual property licenses',
      },
      {
        value: 'franchise',
        label: 'Franchise Agreement',
        description: 'Franchise business agreements',
      },
      {
        value: 'merger',
        label: 'Merger Agreement',
        description: 'Business merger contracts',
      },
      {
        value: 'acquisition',
        label: 'Acquisition Agreement',
        description: 'Business acquisition contracts',
      },
    ];
  }

  getRiskLevelColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  getRiskLevelIcon(riskLevel: string): string {
    switch (riskLevel) {
      case 'low':
        return '✓';
      case 'medium':
        return '⚠';
      case 'high':
        return '✗';
      default:
        return '?';
    }
  }
}

// Export singleton instance
export const contractWiseService = new ContractWiseService();
