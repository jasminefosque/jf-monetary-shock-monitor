# Security

Security practices and guidelines for the Monetary Shock Monitor.

## Overview

This portfolio project follows security best practices to protect sensitive information and demonstrate professional development standards. **No production secrets, API keys, or proprietary data are included.**

## What's Not Included

### ❌ API Keys
- No API keys committed to source control
- No authentication tokens
- No OAuth credentials
- No service account keys

### ❌ Production Endpoints
- No production database URLs
- No production API endpoints
- No internal service URLs
- No IP addresses or hostnames

### ❌ Database Credentials
- No database passwords
- No connection strings
- No Supabase project URLs
- No database migration files

### ❌ Proprietary Data
- No real market data from paid sources
- No customer data
- No internal business data
- No licensed datasets

## What's Included

### ✅ Synthetic Data
- Generated on the fly
- No real market data
- Safe to share publicly
- Demonstrates capabilities

### ✅ Public Interfaces
- Data provider contract
- Component APIs
- Type definitions
- Architecture patterns

### ✅ Configuration Templates
- `.env.example` with placeholders
- Environment variable documentation
- Setup instructions

## Environment Variables

### Configuration

All sensitive configuration is externalized to environment variables:

```bash
# .env (NOT committed)
VITE_DATA_MODE=synthetic
VITE_FRED_API_KEY=your_key_here
```

### Best Practices

1. **Never commit `.env`** - Included in `.gitignore`
2. **Use `.env.example`** - Document required variables without values
3. **Prefix with `VITE_`** - Only `VITE_` prefixed vars exposed to client
4. **Document in README** - Explain each variable's purpose
5. **Validate at startup** - Check for required variables

### Checking Exposed Variables

Vite only exposes variables prefixed with `VITE_`:

```typescript
// ✅ Safe - explicitly prefixed
const mode = import.meta.env.VITE_DATA_MODE;

// ❌ Not exposed - no VITE_ prefix
const secret = import.meta.env.SECRET_KEY; // undefined
```

## API Key Management

### For Development

1. **Create `.env` from template**:
   ```bash
   cp .env.example .env
   ```

2. **Add your keys** (never commit):
   ```bash
   VITE_FRED_API_KEY=your_actual_key_here
   ```

3. **Verify `.gitignore`**:
   ```
   .env
   .env.local
   .env.*.local
   ```

### For Production

1. **Use environment variables** from hosting platform
2. **Rotate keys regularly**
3. **Use least-privilege access**
4. **Monitor usage** for anomalies

### Open Data Sources

When using open data sources:

1. **Choose keyless sources** when possible
2. **If key required**, document in `.env.example`
3. **Link to registration** in README
4. **Respect rate limits**
5. **Handle errors gracefully**

## Data Validation

All data is validated to prevent injection attacks:

### Zod Schemas

```typescript
// Strict validation of external data
const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  observations: z.array(ObservationSchema),
  // ...
});

// Runtime check
const validated = TimeSeriesSchema.parse(externalData);
```

### Benefits

- **Type safety** at runtime
- **Prevents malformed data** crashes
- **Validates ranges** and formats
- **Rejects unexpected fields**

## Git Security

### .gitignore

Critical files excluded from git:

```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/

# Build artifacts
dist/
dist-ssr/

# IDE
.vscode/
.idea/

# OS
.DS_Store
```

### Pre-commit Checks

Consider adding pre-commit hooks:

```bash
# Install husky
npm install --save-dev husky

# Add pre-commit hook to check for secrets
npx husky add .husky/pre-commit "npm run check-secrets"
```

### Scanning for Secrets

Use tools like `git-secrets` or `trufflehog`:

```bash
# Install git-secrets
brew install git-secrets  # macOS

# Scan repository
git secrets --scan
```

## Dependency Security

### Audit Dependencies

```bash
# Check for vulnerabilities
npm audit

# Fix automatically if possible
npm audit fix
```

### Keep Dependencies Updated

```bash
# Check for outdated packages
npm outdated

# Update carefully
npm update
```

### Lock File

- **Commit `package-lock.json`** for reproducible builds
- **Review changes** in lock file updates
- **Verify integrity** after npm install

## HTTPS Only

### Development

Vite dev server uses HTTP by default (localhost is safe).

For HTTPS in development:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    https: true,
  },
});
```

### Production

- **Always use HTTPS** in production
- **Configure CSP headers**
- **Enable HSTS**

## Content Security Policy

Example CSP for production:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data:;">
```

## Authentication (If Added)

If adding user authentication:

1. **Use established libraries** (Auth0, Firebase Auth)
2. **Never roll your own** crypto
3. **Use secure session storage**
4. **Implement CSRF protection**
5. **Add rate limiting**

## Reporting Security Issues

If you find a security vulnerability:

1. **Do not open a public issue**
2. **Email directly** to repository owner
3. **Provide details** and reproduction steps
4. **Allow time** for fix before disclosure

## Compliance Considerations

This is a portfolio project for demonstration purposes:

- **No GDPR requirements** (no personal data)
- **No PCI compliance** (no payment data)
- **No HIPAA requirements** (no health data)
- **No SOC 2** (not a production service)

## Security Checklist

Before deploying or sharing:

- [ ] No API keys in source code
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` documented
- [ ] Dependencies audited (`npm audit`)
- [ ] No hardcoded secrets
- [ ] HTTPS in production
- [ ] Error messages don't leak sensitive info
- [ ] Data validated with schemas
- [ ] Rate limiting on API calls (if applicable)
- [ ] Logging doesn't include secrets

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Vite Security](https://vitejs.dev/guide/env-and-mode.html)
- [React Security](https://react.dev/learn/passing-data-deeply-with-context#security-considerations)

## Conclusion

This project demonstrates production-ready security practices for a frontend application. All sensitive data is externalized, validated, and protected. No real credentials or proprietary information is included.
