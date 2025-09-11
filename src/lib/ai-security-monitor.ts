
// AI-Generated Security Monitor
export class AISecurityMonitor {
  private suspiciousPatterns = [
    /eval(/i,
    /innerHTML/i,
    /document.write/i,
    /setIntervals*(/i,
    /setTimeouts*(/i
  ];

  private sqlInjectionPatterns = [
    /(s|^)(DROP|DELETE|UPDATE|INSERT)s+/i,
    /(s|^)(UNIONs+SELECT)/i,
    /(s|^)(ORs+1s*=s*1)/i
  ];

  private xssPatterns = [
    /<script[^>]*>.*?</script>/i,
    /javascript:/i,
    /onw+s*=/i
  ];

  scanForVulnerabilities(code: string): string[] {
    const vulnerabilities: string[] = [];

    // Check for suspicious patterns
    this.suspiciousPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        vulnerabilities.push(`Suspicious pattern detected: ${pattern}`);
      }
    });

    // Check for SQL injection
    this.sqlInjectionPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        vulnerabilities.push(`Potential SQL injection: ${pattern}`);
      }
    });

    // Check for XSS
    this.xssPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        vulnerabilities.push(`Potential XSS vulnerability: ${pattern}`);
      }
    });

    return vulnerabilities;
  }

  validateInput(input: string): boolean {
    const dangerousPatterns = /[<>"'&]/;
    return !dangerousPatterns.test(input);
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/&/g, '&amp;');
  }
}

export const aiSecurityMonitor = new AISecurityMonitor();
