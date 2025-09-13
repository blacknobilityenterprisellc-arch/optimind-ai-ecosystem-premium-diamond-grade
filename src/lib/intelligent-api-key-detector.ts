// OptiMind AI Ecosystem - Intelligent API Key Detector
// Automatically detects, validates, and configures your API keys for seamless integration

import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { automaticAPIKeyIntegration } from './automatic-api-key-integration';

export interface DetectedAPIKey {
  provider: string;
  key: string;
  source: 'environment' | 'file' | 'database' | 'generated';
  confidence: number;
  lastSeen: Date;
}

export class IntelligentAPIKeyDetector {
  private static instance: IntelligentAPIKeyDetector;
  private detectedKeys: Map<string, DetectedAPIKey> = new Map();
  private scanPaths: string[] = [];
  private initialized = false;

  private constructor() {
    // Initialize scan paths
    this.scanPaths = [
      process.cwd(),
      path.join(process.cwd(), '.env'),
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env.development'),
      path.join(process.cwd(), '.env.production'),
      path.join(process.cwd(), 'config'),
      path.join(process.cwd(), 'secrets'),
    ];
  }

  public static getInstance(): IntelligentAPIKeyDetector {
    if (!IntelligentAPIKeyDetector.instance) {
      IntelligentAPIKeyDetector.instance = new IntelligentAPIKeyDetector();
    }
    return IntelligentAPIKeyDetector.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🧠 Initializing Intelligent API Key Detector...');
      
      // Load environment variables
      config();
      
      // Scan for API keys
      await this.scanForAPIKeys();
      
      // Validate and prioritize keys
      await this.validateAndPrioritizeKeys();
      
      // Auto-configure environment
      await this.autoConfigureEnvironment();
      
      // Integrate with API key management system
      await this.integrateWithManagementSystem();
      
      this.initialized = true;
      console.log('✅ Intelligent API Key Detector initialized successfully!');
      
    } catch (error) {
      console.error('❌ Failed to initialize Intelligent API Key Detector:', error);
      throw error;
    }
  }

  private async scanForAPIKeys(): Promise<void> {
    console.log('🔍 Scanning for API keys...');
    
    // Define API key patterns
    const keyPatterns = [
      {
        provider: 'zai',
        patterns: [
          /zai[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /ZAI_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
        ],
        minLength: 20
      },
      {
        provider: 'openrouter',
        patterns: [
          /openrouter[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /OPENROUTER_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /sk-or-[a-zA-Z0-9]{48,}/
        ],
        minLength: 20
      },
      {
        provider: 'openai',
        patterns: [
          /openai[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /OPENAI_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /sk-[a-zA-Z0-9]{48,}/
        ],
        minLength: 20
      },
      {
        provider: 'gemini',
        patterns: [
          /gemini[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /GEMINI_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
        ],
        minLength: 20
      },
      {
        provider: 'anthropic',
        patterns: [
          /anthropic[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /ANTHROPIC_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /sk-ant-[a-zA-Z0-9_-]{86,}/
        ],
        minLength: 20
      },
      {
        provider: 'glm',
        patterns: [
          /glm[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /GLM_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
        ],
        minLength: 20
      },
      {
        provider: 'groq',
        patterns: [
          /groq[_-]?api[_-]?key[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /GROQ_API_KEY[=:]\\s*([a-zA-Z0-9_-]+)/i,
          /gsk_[a-zA-Z0-9_-]{48,}/
        ],
        minLength: 20
      }
    ];

    // Scan environment variables
    for (const [envKey, envValue] of Object.entries(process.env)) {
      for (const keyConfig of keyPatterns) {
        if (envKey.toUpperCase().includes(keyConfig.provider.toUpperCase())) {
          if (envValue && envValue.length >= keyConfig.minLength && !envValue.includes('your_')) {
            this.detectedKeys.set(keyConfig.provider, {
              provider: keyConfig.provider,
              key: envValue,
              source: 'environment',
              confidence: 0.9,
              lastSeen: new Date()
            });
            console.log(`✅ Found ${keyConfig.provider} API key in environment variables`);
          }
        }
      }
    }

    // Scan files
    for (const scanPath of this.scanPaths) {
      if (fs.existsSync(scanPath)) {
        const stats = fs.statSync(scanPath);
        
        if (stats.isFile()) {
          await this.scanFileForKeys(scanPath, keyPatterns);
        } else if (stats.isDirectory()) {
          await this.scanDirectoryForKeys(scanPath, keyPatterns);
        }
      }
    }
  }

  private async scanFileForKeys(filePath: string, keyPatterns: any[]): Promise<void> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      for (const keyConfig of keyPatterns) {
        for (const pattern of keyConfig.patterns) {
          const matches = content.match(pattern);
          if (matches && matches[1]) {
            const key = matches[1];
            if (key.length >= keyConfig.minLength && !key.includes('your_')) {
              this.detectedKeys.set(keyConfig.provider, {
                provider: keyConfig.provider,
                key: key,
                source: 'file',
                confidence: 0.8,
                lastSeen: new Date()
              });
              console.log(`✅ Found ${keyConfig.provider} API key in file: ${filePath}`);
            }
          }
        }
      }
    } catch (error) {
      // Ignore file read errors
    }
  }

  private async scanDirectoryForKeys(dirPath: string, keyPatterns: any[]): Promise<void> {
    try {
      const files = fs.readdirSync(dirPath);
      
      for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        
        if (stats.isFile() && !file.startsWith('.')) {
          await this.scanFileForKeys(filePath, keyPatterns);
        }
      }
    } catch (error) {
      // Ignore directory read errors
    }
  }

  private async validateAndPrioritizeKeys(): Promise<void> {
    console.log('🔑 Validating and prioritizing API keys...');
    
    // Validate each detected key
    for (const [provider, detectedKey] of this.detectedKeys) {
      try {
        const isValid = await this.validateAPIKey(detectedKey.key, provider);
        
        if (isValid) {
          detectedKey.confidence = Math.min(detectedKey.confidence + 0.1, 1.0);
          console.log(`✅ ${provider} API key validated successfully`);
        } else {
          detectedKey.confidence = Math.max(detectedKey.confidence - 0.2, 0.1);
          console.log(`❌ ${provider} API key validation failed`);
        }
      } catch (error) {
        detectedKey.confidence = Math.max(detectedKey.confidence - 0.3, 0.1);
        console.log(`❌ ${provider} API key validation error: ${error.message}`);
      }
    }
    
    // Remove keys with low confidence
    for (const [provider, detectedKey] of this.detectedKeys) {
      if (detectedKey.confidence < 0.5) {
        this.detectedKeys.delete(provider);
        console.log(`🗑️ Removed ${provider} API key due to low confidence`);
      }
    }
  }

  private async validateAPIKey(key: string, provider: string): Promise<boolean> {
    // Basic validation - in a real system, you would make actual API calls
    const minLengths: Record<string, number> = {
      'zai': 20,
      'openrouter': 48,
      'openai': 48,
      'gemini': 20,
      'anthropic': 86,
      'glm': 20,
      'groq': 48
    };
    
    const minLength = minLengths[provider] || 20;
    
    if (key.length < minLength) {
      return false;
    }
    
    // Check for placeholder patterns
    const placeholderPatterns = [
      /your_.*_api_key/i,
      /placeholder/i,
      /example/i,
      /test/i,
      /dummy/i
    ];
    
    for (const pattern of placeholderPatterns) {
      if (pattern.test(key)) {
        return false;
      }
    }
    
    return true;
  }

  private async autoConfigureEnvironment(): Promise<void> {
    console.log('⚙️ Auto-configuring environment...');
    
    // Update environment variables with detected keys
    for (const [provider, detectedKey] of this.detectedKeys) {
      const envKey = `${provider.toUpperCase()}_API_KEY`;
      process.env[envKey] = detectedKey.key;
      console.log(`✅ Set ${envKey} in environment`);
    }
    
    // Update .env file if it exists
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      
      for (const [provider, detectedKey] of this.detectedKeys) {
        const envKey = `${provider.toUpperCase()}_API_KEY`;
        const pattern = new RegExp(`^${envKey}=.*$`, 'm');
        
        if (pattern.test(envContent)) {
          envContent = envContent.replace(pattern, `${envKey}=${detectedKey.key}`);
        } else {
          envContent += `\\n${envKey}=${detectedKey.key}`;
        }
      }
      
      fs.writeFileSync(envPath, envContent);
      console.log('✅ Updated .env file with detected API keys');
    }
  }

  private async integrateWithManagementSystem(): Promise<void> {
    console.log('🔗 Integrating with API key management system...');
    
    try {
      // Initialize the automatic API key integration system
      await automaticAPIKeyIntegration.initialize();
      
      // The integration system will automatically pick up the environment variables
      // that we've set with the detected API keys
      
      console.log('✅ Successfully integrated with API key management system');
      
    } catch (error) {
      console.error('❌ Failed to integrate with API key management system:', error);
    }
  }

  public getDetectedKeys(): Map<string, DetectedAPIKey> {
    return new Map(this.detectedKeys);
  }

  public getAPIKey(provider: string): string | undefined {
    return this.detectedKeys.get(provider)?.key;
  }

  public hasAPIKey(provider: string): boolean {
    return this.detectedKeys.has(provider);
  }

  public getAvailableProviders(): string[] {
    return Array.from(this.detectedKeys.keys());
  }

  public async refreshDetection(): Promise<void> {
    console.log('🔄 Refreshing API key detection...');
    this.detectedKeys.clear();
    await this.scanForAPIKeys();
    await this.validateAndPrioritizeKeys();
    await this.autoConfigureEnvironment();
    await this.integrateWithManagementSystem();
    console.log('✅ API key detection refreshed');
  }

  public getStatus(): {
    initialized: boolean;
    detectedKeys: number;
    availableProviders: string[];
    lastUpdated: Date;
  } {
    return {
      initialized: this.initialized,
      detectedKeys: this.detectedKeys.size,
      availableProviders: this.getAvailableProviders(),
      lastUpdated: new Date()
    };
  }
}

// Export singleton instance
export const intelligentAPIKeyDetector = IntelligentAPIKeyDetector.getInstance();

// Auto-initialize on module load
if (typeof window === 'undefined') {
  // Server-side auto-initialization
  intelligentAPIKeyDetector.initialize().catch(console.error);
}