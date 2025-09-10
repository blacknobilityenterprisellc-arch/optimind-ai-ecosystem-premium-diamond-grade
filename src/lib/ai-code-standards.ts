
// AI-Generated Code Standards
export const AICodeStandards = {
  // Naming conventions
  naming: {
    components: 'PascalCase',
    functions: 'camelCase',
    variables: 'camelCase',
    constants: 'SCREAMING_SNAKE_CASE',
    types: 'PascalCase',
    interfaces: 'PascalCase starting with I'
  },

  // File structure
  fileStructure: {
    components: 'src/components/',
    pages: 'src/app/',
    lib: 'src/lib/',
    types: 'src/types/',
    hooks: 'src/hooks/',
    services: 'src/services/'
  },

  // Code quality rules
  quality: {
    maxFunctionLength: 50,
    maxFileLength: 500,
    maxComplexity: 10,
    requireComments: true,
    requireTypeDefinitions: true
  },

  // Performance rules
  performance: {
    useMemo: true,
    useCallback: true,
    lazyLoading: true,
    codeSplitting: true,
    imageOptimization: true
  },

  // Security rules
  security: {
    noEval: true,
    noInnerHTML: true,
    inputValidation: true,
    outputEncoding: true,
    csrfProtection: true
  }
};

export const validateCodeStandards = (code: string, filePath: string): string[] => {
  const violations: string[] = [];
  
  // Check for eval usage
  if (code.includes('eval(')) {
    violations.push('eval() usage detected - security risk');
  }
  
  // Check for innerHTML
  if (code.includes('innerHTML')) {
    violations.push('innerHTML usage detected - XSS risk');
  }
  
  // Check function length
  const functionMatches = code.match(/functions+w+s*([^)]*)s*{[sS]*?}/g);
  if (functionMatches) {
    const longFunctions = functionMatches.filter(func => func.length > 2000);
    if (longFunctions.length > 0) {
      violations.push(`${longFunctions.length} functions exceed recommended length`);
    }
  }
  
  return violations;
};
