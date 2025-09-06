/**
 * OptiMind AI Ecosystem - Predictive Analytics Service v2.0
 * Premium Diamond Grade AI-Powered Predictive Analytics Service
 *
 * This service provides high-level predictive analytics operations with
 * enterprise-grade model management, training, and inference capabilities.
 */

import { prisma } from "@/lib/db";

import {
  predictiveAnalyticsV2,
  type PredictiveModelConfig,
  type TrainingData,
  type PredictionResult,
  type PredictiveInsight,
} from "./predictive-analytics";

export interface PredictiveAnalyticsRequest {
  operation:
    | "create_model"
    | "train_model"
    | "predict"
    | "generate_insights"
    | "get_metrics"
    | "health_check";
  modelId?: string;
  config?: PredictiveModelConfig;
  trainingData?: TrainingData;
  inputData?: number[];
  features?: Record<string, number>;
  data?: any[];
  userId: string;
  metadata?: Record<string, any>;
}

export interface PredictiveAnalyticsResponse {
  success: boolean;
  data?: any;
  error?: string;
  timestamp: Date;
  operation: string;
  modelType?: string;
  confidence?: number;
}

export interface ModelManagementRequest {
  userId: string;
  action: "create" | "train" | "deploy" | "archive" | "delete";
  modelId?: string;
  name?: string;
  description?: string;
  config?: PredictiveModelConfig;
}

export interface PredictiveInsightRequest {
  userId: string;
  modelId?: string;
  data: any[];
  insightTypes?: ("trend" | "anomaly" | "forecast" | "recommendation")[];
  timeframe?: string;
}

class PredictiveAnalyticsServiceV2 {
  private readonly serviceName = "PredictiveAnalyticsServiceV2";
  private readonly maxModelsPerUser = 10;
  private readonly maxInsightsPerModel = 100;
  private readonly maxTrainingDataSize = 10000;

  /**
   * Execute predictive analytics operation
   */
  async executeOperation(
    request: PredictiveAnalyticsRequest,
  ): Promise<PredictiveAnalyticsResponse> {
    const startTime = Date.now();

    try {
      // Validate user authentication
      await this.validateUser(request.userId);

      // Execute operation
      let result: any;
      const operationSuccess = true;
      let modelType: string | undefined;
      let confidence: number | undefined;

      switch (request.operation) {
        case "create_model":
          result = await this.handleModelCreation(request);
          modelType = result.config?.type;
          break;
        case "train_model":
          result = await this.handleModelTraining(request);
          modelType = result.config?.type;
          confidence = result.metrics?.accuracy;
          break;
        case "predict":
          result = await this.handlePrediction(request);
          confidence = result.confidence;
          break;
        case "generate_insights":
          result = await this.handleInsightGeneration(request);
          break;
        case "get_metrics":
          result = await this.handleMetricsRetrieval(request);
          break;
        case "health_check":
          result = await this.handleHealthCheck(request);
          break;
        default:
          throw new Error(`Unsupported operation: ${request.operation}`);
      }

      // Log successful operation
      await this.logOperation({
        userId: request.userId,
        operation: request.operation,
        resource: "predictive_analytics",
        success: true,
        details: {
          ...request.metadata,
          modelId: request.modelId,
          executionTime: Date.now() - startTime,
          result: typeof result === "object" ? "success" : result,
        },
      });

      return {
        success: true,
        data: result,
        timestamp: new Date(),
        operation: request.operation,
        modelType,
        confidence,
      };
    } catch (error) {
      // Log failed operation
      await this.logOperation({
        userId: request.userId,
        operation: request.operation,
        resource: "predictive_analytics",
        success: false,
        details: {
          ...request.metadata,
          modelId: request.modelId,
          error: error.message,
          executionTime: Date.now() - startTime,
        },
      });

      return {
        success: false,
        error: error.message,
        timestamp: new Date(),
        operation: request.operation,
      };
    }
  }

  /**
   * Handle model creation
   */
  private async handleModelCreation(
    request: PredictiveAnalyticsRequest,
  ): Promise<any> {
    if (!request.config) {
      throw new Error("Model configuration is required");
    }

    const modelId = crypto.randomUUID();

    // Create the model
    const model = await predictiveAnalyticsV2.createModel(
      modelId,
      request.config,
    );

    // Save model metadata to database
    await prisma.predictiveModel.create({
      data: {
        name: `Model ${modelId}`,
        type: request.config.type.toUpperCase() as any,
        version: "2.0.0",
        description: `Predictive model of type ${request.config.type}`,
        trainingData: {
          features: request.config.features,
          target: request.config.target,
          sampleSize: 0,
        },
        hyperparameters: request.config.hyperparameters,
        status: "CREATED",
        accuracy: 0,
        userId: request.userId,
      },
    });

    return {
      modelId,
      config: request.config,
      status: "created",
      message: "Predictive model created successfully",
    };
  }

  /**
   * Handle model training
   */
  private async handleModelTraining(
    request: PredictiveAnalyticsRequest,
  ): Promise<any> {
    if (!request.modelId) {
      throw new Error("Model ID is required for training");
    }

    if (!request.trainingData) {
      throw new Error("Training data is required for training");
    }

    // Validate model exists and belongs to user
    await this.validateModelOwnership(request.modelId, request.userId);

    // Validate training data size
    if (request.trainingData.inputs.length > this.maxTrainingDataSize) {
      throw new Error(
        `Training data exceeds maximum size of ${this.maxTrainingDataSize}`,
      );
    }

    // Train the model
    const metrics = await predictiveAnalyticsV2.trainModel(
      request.modelId,
      request.trainingData,
    );

    // Update model in database
    await prisma.predictiveModel.update({
      where: { id: request.modelId },
      data: {
        status: "TRAINED",
        accuracy: metrics.accuracy,
        trainingData: {
          ...request.trainingData,
          sampleSize: request.trainingData.inputs.length,
        },
        performance: metrics,
        hyperparameters: request.config?.hyperparameters || {},
      },
    });

    return {
      modelId: request.modelId,
      metrics,
      status: "trained",
      message: "Model trained successfully",
    };
  }

  /**
   * Handle prediction
   */
  private async handlePrediction(
    request: PredictiveAnalyticsRequest,
  ): Promise<PredictionResult> {
    if (!request.modelId) {
      throw new Error("Model ID is required for prediction");
    }

    if (!request.inputData) {
      throw new Error("Input data is required for prediction");
    }

    // Validate model exists and belongs to user
    await this.validateModelOwnership(request.modelId, request.userId);

    // Validate model is trained
    const model = await prisma.predictiveModel.findUnique({
      where: { id: request.modelId },
    });

    if (!model || model.status !== "TRAINED") {
      throw new Error("Model is not trained or not found");
    }

    // Make prediction
    const features = request.features || {};
    const prediction = await predictiveAnalyticsV2.predict(
      request.modelId,
      request.inputData,
      features,
    );

    // Log prediction to database
    await prisma.prediction.create({
      data: {
        userId: request.userId,
        modelId: request.modelId,
        inputData: request.inputData,
        prediction: Array.isArray(prediction.prediction)
          ? prediction.prediction
          : [prediction.prediction],
        confidence: prediction.confidence,
        features: features,
        metadata: {
          timestamp: prediction.timestamp,
          modelVersion: prediction.modelVersion,
        },
      },
    });

    return prediction;
  }

  /**
   * Handle insight generation
   */
  private async handleInsightGeneration(
    request: PredictiveAnalyticsRequest,
  ): Promise<PredictiveInsight[]> {
    if (!request.data) {
      throw new Error("Data is required for insight generation");
    }

    // Generate insights
    const insights = await predictiveAnalyticsV2.generateInsights(
      request.data,
      request.modelId,
    );

    // Store insights in database
    for (const insight of insights) {
      await prisma.predictiveInsight.create({
        data: {
          userId: request.userId,
          modelId: request.modelId,
          type: insight.type.toUpperCase() as any,
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          impact: insight.impact.toUpperCase() as any,
          timeframe: insight.timeframe,
          data: insight.data,
          actionable: insight.actionable,
          createdAt: insight.createdAt,
        },
      });
    }

    return insights;
  }

  /**
   * Handle metrics retrieval
   */
  private async handleMetricsRetrieval(
    request: PredictiveAnalyticsRequest,
  ): Promise<any> {
    if (!request.modelId) {
      throw new Error("Model ID is required for metrics retrieval");
    }

    // Validate model exists and belongs to user
    await this.validateModelOwnership(request.modelId, request.userId);

    // Get model metrics
    const metrics = predictiveAnalyticsV2.getModelMetrics(request.modelId);

    if (!metrics) {
      throw new Error("Model metrics not found");
    }

    return {
      modelId: request.modelId,
      metrics,
      insights: predictiveAnalyticsV2.getInsights(request.modelId),
    };
  }

  /**
   * Handle health check
   */
  private async handleHealthCheck(
    request: PredictiveAnalyticsRequest,
  ): Promise<any> {
    const healthCheck = await predictiveAnalyticsV2.healthCheck();

    return {
      service: "PredictiveAnalyticsServiceV2",
      status: healthCheck.status,
      checks: healthCheck,
      timestamp: new Date(),
    };
  }

  /**
   * Model management operations
   */
  async manageModels(request: ModelManagementRequest): Promise<{
    success: boolean;
    models?: any[];
    message?: string;
    error?: string;
  }> {
    try {
      // Validate user authentication
      await this.validateUser(request.userId);

      switch (request.action) {
        case "create": {
          if (!request.config) {
            throw new Error("Model configuration is required for creation");
          }

          // Check user model limit
          const userModelsCount = await prisma.predictiveModel.count({
            where: { userId: request.userId },
          });

          if (userModelsCount >= this.maxModelsPerUser) {
            throw new Error(
              `Maximum number of models (${this.maxModelsPerUser}) reached for user`,
            );
          }

          const modelId = crypto.randomUUID();
          const name = request.name || `Model ${modelId}`;
          const description =
            request.description ||
            `Predictive model of type ${request.config.type}`;

          // Create model
          await predictiveAnalyticsV2.createModel(modelId, request.config);

          // Save to database
          const model = await prisma.predictiveModel.create({
            data: {
              id: modelId,
              name,
              type: request.config.type.toUpperCase() as any,
              version: "2.0.0",
              description,
              trainingData: {
                features: request.config.features,
                target: request.config.target,
                sampleSize: 0,
              },
              hyperparameters: request.config.hyperparameters,
              status: "CREATED",
              accuracy: 0,
              userId: request.userId,
            },
          });

          return {
            success: true,
            models: [model],
            message: "Predictive model created successfully",
          };
        }

        case "train":
          if (!request.modelId) {
            throw new Error("Model ID is required for training");
          }

          // Validate model ownership
          await this.validateModelOwnership(request.modelId, request.userId);

          // Update model status to training
          await prisma.predictiveModel.update({
            where: { id: request.modelId },
            data: { status: "TRAINING" },
          });

          return {
            success: true,
            message: "Model training initiated",
          };

        case "deploy": {
          if (!request.modelId) {
            throw new Error("Model ID is required for deployment");
          }

          // Validate model ownership and training status
          const model = await prisma.predictiveModel.findUnique({
            where: { id: request.modelId },
          });

          if (!model || model.userId !== request.userId) {
            throw new Error("Model not found or access denied");
          }

          if (model.status !== "TRAINED") {
            throw new Error("Model must be trained before deployment");
          }

          // Update model status to deployed
          await prisma.predictiveModel.update({
            where: { id: request.modelId },
            data: { status: "DEPLOYED" },
          });

          return {
            success: true,
            message: "Model deployed successfully",
          };
        }

        case "archive":
          if (!request.modelId) {
            throw new Error("Model ID is required for archiving");
          }

          // Validate model ownership
          await this.validateModelOwnership(request.modelId, request.userId);

          // Update model status to archived
          await prisma.predictiveModel.update({
            where: { id: request.modelId },
            data: { status: "ARCHIVED" },
          });

          return {
            success: true,
            message: "Model archived successfully",
          };

        case "delete":
          if (!request.modelId) {
            throw new Error("Model ID is required for deletion");
          }

          // Validate model ownership
          await this.validateModelOwnership(request.modelId, request.userId);

          // Delete model and related data
          await prisma.predictiveModel.delete({
            where: { id: request.modelId },
          });

          return {
            success: true,
            message: "Model deleted successfully",
          };

        default:
          throw new Error(
            `Unsupported model management action: ${request.action}`,
          );
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Generate predictive insights
   */
  async generateInsights(request: PredictiveInsightRequest): Promise<{
    success: boolean;
    insights?: PredictiveInsight[];
    total: number;
    error?: string;
  }> {
    try {
      // Validate user authentication
      await this.validateUser(request.userId);

      // Validate model ownership if modelId provided
      if (request.modelId) {
        await this.validateModelOwnership(request.modelId, request.userId);
      }

      // Generate insights
      const insights = await predictiveAnalyticsV2.generateInsights(
        request.data,
        request.modelId,
      );

      // Filter by insight types if specified
      const filteredInsights = request.insightTypes
        ? insights.filter((insight) =>
            request.insightTypes!.includes(insight.type),
          )
        : insights;

      // Store insights in database
      for (const insight of filteredInsights) {
        await prisma.predictiveInsight.create({
          data: {
            userId: request.userId,
            modelId: request.modelId,
            type: insight.type.toUpperCase() as any,
            title: insight.title,
            description: insight.description,
            confidence: insight.confidence,
            impact: insight.impact.toUpperCase() as any,
            timeframe: insight.timeframe,
            data: insight.data,
            actionable: insight.actionable,
            createdAt: insight.createdAt,
          },
        });
      }

      return {
        success: true,
        insights: filteredInsights,
        total: filteredInsights.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get user's predictive insights
   */
  async getUserInsights(
    userId: string,
    limit: number = 50,
  ): Promise<{
    success: boolean;
    insights?: any[];
    total: number;
    error?: string;
  }> {
    try {
      // Validate user authentication
      await this.validateUser(userId);

      const insights = await prisma.predictiveInsight.findMany({
        where: { userId },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        include: {
          model: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      });

      return {
        success: true,
        insights: insights.map((insight) => ({
          id: insight.id,
          type: insight.type.toLowerCase(),
          title: insight.title,
          description: insight.description,
          confidence: insight.confidence,
          impact: insight.impact.toLowerCase(),
          timeframe: insight.timeframe,
          data: insight.data,
          actionable: insight.actionable,
          createdAt: insight.createdAt,
          model: insight.model,
        })),
        total: insights.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get user's predictive models
   */
  async getUserModels(userId: string): Promise<{
    success: boolean;
    models?: any[];
    total: number;
    error?: string;
  }> {
    try {
      // Validate user authentication
      await this.validateUser(userId);

      const models = await prisma.predictiveModel.findMany({
        where: { userId },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          predictions: {
            select: {
              id: true,
              confidence: true,
              createdAt: true,
            },
            take: 5,
            orderBy: {
              createdAt: "desc",
            },
          },
          insights: {
            select: {
              id: true,
              type: true,
              confidence: true,
              createdAt: true,
            },
            take: 5,
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      return {
        success: true,
        models: models.map((model) => ({
          id: model.id,
          name: model.name,
          type: model.type.toLowerCase(),
          version: model.version,
          description: model.description,
          status: model.status.toLowerCase(),
          accuracy: model.accuracy,
          performance: model.performance,
          trainingData: model.trainingData,
          hyperparameters: model.hyperparameters,
          createdAt: model.createdAt,
          updatedAt: model.updatedAt,
          predictions: model.predictions,
          insights: model.insights,
        })),
        total: models.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Perform predictive analytics health check
   */
  async healthCheck(): Promise<{
    success: boolean;
    status: "healthy" | "degraded" | "unhealthy";
    checks?: {
      models: number;
      insights: number;
      tensorflow: boolean;
      memory: any;
    };
    error?: string;
  }> {
    try {
      const healthCheck = await predictiveAnalyticsV2.healthCheck();

      return {
        success: true,
        status: healthCheck.status,
        checks: healthCheck.checks,
      };
    } catch (error) {
      return {
        success: false,
        status: "unhealthy",
        error: error.message,
      };
    }
  }

  /**
   * Validate user exists and is active
   */
  private async validateUser(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    if (!user.isActive) {
      throw new Error("User account is not active");
    }
  }

  /**
   * Validate model ownership
   */
  private async validateModelOwnership(
    modelId: string,
    userId: string,
  ): Promise<void> {
    const model = await prisma.predictiveModel.findUnique({
      where: { id: modelId },
    });

    if (!model || model.userId !== userId) {
      throw new Error("Model not found or access denied");
    }
  }

  /**
   * Log operation event
   */
  private async logOperation(operation: {
    userId: string;
    operation: string;
    resource: string;
    success: boolean;
    details: Record<string, any>;
  }): Promise<void> {
    try {
      await prisma.auditLog.create({
        data: {
          operation: operation.operation,
          userId: operation.userId,
          resource: operation.resource,
          success: operation.success,
          details: operation.details,
          timestamp: new Date(),
          ipAddress: "127.0.0.1", // Would get from request context
          userAgent: "PredictiveAnalyticsService/2.0",
        },
      });
    } catch (error) {
      console.error("Failed to log predictive analytics operation:", error);
    }
  }

  /**
   * Cleanup old insights
   */
  async cleanupOldInsights(maxAge: number = 30): Promise<{
    success: boolean;
    cleanedInsights: number;
    error?: string;
  }> {
    try {
      const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);

      const result = await prisma.predictiveInsight.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });

      // Also cleanup in-memory insights
      predictiveAnalyticsV2.cleanupInsights(maxAge);

      return {
        success: true,
        cleanedInsights: result.count,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

// Export singleton instance
export const predictiveAnalyticsServiceV2 = new PredictiveAnalyticsServiceV2();

// Export types and utilities
export type {
  PredictiveAnalyticsRequest,
  PredictiveAnalyticsResponse,
  ModelManagementRequest,
  PredictiveInsightRequest,
};

// Export utility functions
export const createPredictiveAnalyticsService = () => {
  return new PredictiveAnalyticsServiceV2();
};

export default PredictiveAnalyticsServiceV2;
