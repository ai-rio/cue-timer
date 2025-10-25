# Deployment Guide

**Production deployment, configuration, and maintenance for the CueTimer Blog
Management System**

---

## 🎯 Overview

This guide covers comprehensive deployment strategies for the CueTimer Blog
Management System, including production setup, environment configuration,
performance optimization, security considerations, and ongoing maintenance
procedures.

## 🏗️ Deployment Architecture

### Production Environment Architecture

```mermaid
graph TB
    A[Load Balancer] --> B[Web Server 1]
    A --> C[Web Server 2]
    A --> D[Web Server N]

    B --> E[Application Server]
    C --> E
    D --> E

    E --> F[Database Cluster]
    E --> G[Cache Layer]
    E --> H[File Storage]

    I[CI/CD Pipeline] --> J[Docker Registry]
    J --> B
    J --> C
    J --> D

    K[Monitoring] --> L[Metrics Collection]
    L --> M[Alerting System]
    N[Log Aggregation] --> O[Log Analysis]
```

### Recommended Infrastructure

#### Production Setup

| Component        | Recommendation               | Purpose                            |
| ---------------- | ---------------------------- | ---------------------------------- |
| **Web Server**   | Nginx 1.24+                  | Static file serving, reverse proxy |
| **Application**  | Node.js 18+ or Bun 1.0+      | Application runtime                |
| **Database**     | PostgreSQL 15+               | Content storage and metadata       |
| **Cache**        | Redis 7.0+                   | Session and content caching        |
| **File Storage** | AWS S3 or equivalent         | Media file storage                 |
| **CDN**          | CloudFlare or AWS CloudFront | Global content delivery            |
| **Monitoring**   | Prometheus + Grafana         | Performance monitoring             |
| **Logging**      | ELK Stack or similar         | Log aggregation and analysis       |

#### Minimum Requirements

**Small Deployment (1-10K users/month)**

- **CPU**: 2 vCPUs
- **Memory**: 4GB RAM
- **Storage**: 50GB SSD
- **Bandwidth**: 100GB/month
- **Database**: Small managed instance

**Medium Deployment (10K-100K users/month)**

- **CPU**: 4 vCPUs
- **Memory**: 8GB RAM
- **Storage**: 200GB SSD
- **Bandwidth**: 500GB/month
- **Database**: Medium managed instance

**Large Deployment (100K+ users/month)**

- **CPU**: 8+ vCPUs
- **Memory**: 16GB+ RAM
- **Storage**: 500GB+ SSD
- **Bandwidth**: 1TB+/month
- **Database**: Large managed instance with read replicas

---

## 🚀 Deployment Methods

### 1. Docker Deployment (Recommended)

#### Dockerfile

```dockerfile
# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install -g bun
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN bun run build

# Production stage
FROM node:18-alpine AS production

# Install production dependencies
WORKDIR /app
COPY package.json bun.lockb ./
RUN npm install -g bun
RUN bun install --frozen-lockfile --production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set correct permissions
RUN mkdir -p /app/.next && chown nextjs:nodejs /app/.next
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["bun", "start"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}
      - CUETIMER_API_KEY=${CUETIMER_API_KEY}
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    volumes:
      - ./content:/app/content:ro
      - ./uploads:/app/uploads
    networks:
      - cuetimer-network

  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql:ro
    restart: unless-stopped
    networks:
      - cuetimer-network

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped
    networks:
      - cuetimer-network

  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl:ro
      - ./uploads:/var/www/uploads:ro
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - cuetimer-network

volumes:
  postgres_data:
  redis_data:

networks:
  cuetimer-network:
    driver: bridge
```

#### Nginx Configuration

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=upload:10m rate=1r/s;

    server {
        listen 80;
        server_name your-domain.com www.your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com www.your-domain.com;

        # SSL configuration
        ssl_certificate /etc/ssl/cert.pem;
        ssl_certificate_key /etc/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Gzip compression
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

        # Static files
        location /_next/static {
            alias /var/www/_next/static;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location /static {
            alias /var/www/static;
            expires 30d;
            add_header Cache-Control "public";
        }

        # Upload endpoints
        location /api/upload {
            limit_req zone=upload burst=5 nodelay;
            proxy_pass http://app;
            client_max_body_size 50M;
        }

        # API endpoints
        location /api/ {
            limit_req zone=api burst=20 nodelay;
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Main application
        location / {
            proxy_pass http://app;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

### 2. Kubernetes Deployment

#### Deployment Manifest

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cuetimer-blog
  labels:
    app: cuetimer-blog
spec:
  replicas: 3
  selector:
    matchLabels:
      app: cuetimer-blog
  template:
    metadata:
      labels:
        app: cuetimer-blog
    spec:
      containers:
        - name: cuetimer-blog
          image: cuetimer/blog:latest
          ports:
            - containerPort: 3000
          env:
            - name: NODE_ENV
              value: 'production'
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: cuetimer-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: cuetimer-secrets
                  key: redis-url
          resources:
            requests:
              memory: '512Mi'
              cpu: '250m'
            limits:
              memory: '1Gi'
              cpu: '500m'
          livenessProbe:
            httpGet:
              path: /api/health
              port: 3000
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /api/ready
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 5
          volumeMounts:
            - name: content-volume
              mountPath: /app/content
              readOnly: true
      volumes:
        - name: content-volume
          persistentVolumeClaim:
            claimName: content-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: cuetimer-blog-service
spec:
  selector:
    app: cuetimer-blog
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3000
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cuetimer-blog-ingress
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: '100'
spec:
  tls:
    - hosts:
        - your-domain.com
      secretName: cuetimer-tls
  rules:
    - host: your-domain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: cuetimer-blog-service
                port:
                  number: 80
```

### 3. Cloud Platform Deployment

#### AWS Deployment

```yaml
# aws-infrastructure.yml (CloudFormation)
AWSTemplateFormatVersion: '2010-09-09'
Description: 'CueTimer Blog Infrastructure'

Parameters:
  Environment:
    Type: String
    Default: production
    AllowedValues: [development, staging, production]

Resources:
  # VPC and Networking
  VPC:
    Type: AWS::EC2::VPC
    Properties:
      CidrBlock: 10.0.0.0/16
      EnableDnsHostnames: true
      EnableDnsSupport: true
      Tags:
        - Key: Name
          Value: !Sub '${Environment}-cuetimer-vpc'

  # ECS Cluster
  ECSCluster:
    Type: AWS::ECS::Cluster
    Properties:
      ClusterName: !Sub '${Environment}-cuetimer-cluster'
      CapacityProviders:
        - FARGATE
        - FARGATE_SPOT

  # Application Load Balancer
  LoadBalancer:
    Type: AWS::ElasticLoadBalancingV2::LoadBalancer
    Properties:
      Name: !Sub '${Environment}-cuetimer-alb'
      Scheme: internet-facing
      Type: application
      Subnets:
        - !Ref PublicSubnet1
        - !Ref PublicSubnet2
      SecurityGroups:
        - !Ref LoadBalancerSecurityGroup

  # RDS Database
  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceIdentifier: !Sub '${Environment}-cuetimer-db'
      DBInstanceClass: db.t3.micro
      Engine: postgres
      EngineVersion: '15.3'
      AllocatedStorage: 20
      StorageType: gp2
      DBName: cuetimer
      MasterUsername: !Ref DatabaseUsername
      MasterUserPassword: !Ref DatabasePassword
      VPCSecurityGroups:
        - !Ref DatabaseSecurityGroup

  # ElastiCache Redis
  RedisCluster:
    Type: AWS::ElastiCache::ReplicationGroup
    Properties:
      ReplicationGroupId: !Sub '${Environment}-cuetimer-redis'
      Description: 'Redis cluster for CueTimer blog'
      NumCacheClusters: 2
      Engine: redis
      CacheNodeType: cache.t3.micro
      SecurityGroupIds:
        - !Ref RedisSecurityGroup

  # S3 Bucket for content
  ContentBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub '${Environment}-cuetimer-content'
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        BlockPublicPolicy: true
        IgnorePublicAcls: true
        RestrictPublicBuckets: true

  # CloudFront Distribution
  CloudFrontDistribution:
    Type: AWS::CloudFront::Distribution
    Properties:
      DistributionConfig:
        Origins:
          - Id: S3Origin
            DomainName: !GetAtt ContentBucket.DomainName
            S3OriginConfig:
              OriginAccessIdentity: !Sub 'origin-access-identity/cloudfront/${OriginAccessIdentity}'
        DefaultCacheBehavior:
          TargetOriginId: S3Origin
          ViewerProtocolPolicy: redirect-to-https
          CachePolicyId: 4135ea2d-6df8-44a3-9df3-4b5a84be39ad
        Enabled: true
        HttpVersion: http2
```

---

## ⚙️ Environment Configuration

### Environment Variables

#### Production Environment Variables

```bash
# Application Configuration
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# Database Configuration
DATABASE_URL=postgresql://username:password@host:5432/database
DATABASE_POOL_SIZE=20
DATABASE_TIMEOUT=30000

# Cache Configuration
REDIS_URL=redis://host:6379
CACHE_TTL=300000
CACHE_MAX_SIZE=1000

# Security Configuration
SESSION_SECRET=your-super-secret-session-key
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-32-character-encryption-key

# API Configuration
CUETIMER_API_KEY=your-api-key
API_BASE_URL=https://api.cuetimer.com
API_TIMEOUT=30000

# Content Configuration
CONTENT_DIR=/app/content
UPLOAD_DIR=/app/uploads
MAX_FILE_SIZE=50MB

# SEO and Analytics
GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
GOOGLE_SEARCH_CONSOLE_VERIFICATION=verification-code

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# CDN Configuration
CDN_URL=https://cdn.your-domain.com
ASSET_PREFIX=/static

# Monitoring and Logging
LOG_LEVEL=info
SENTRY_DSN=your-sentry-dsn
NEW_RELIC_LICENSE_KEY=your-newrelic-key

# Performance Configuration
ENABLE_COMPRESSION=true
ENABLE_CACHING=true
ENABLE_RATE_LIMITING=true
```

#### Configuration Management

```typescript
// config/production.ts
export const productionConfig = {
  app: {
    name: 'CueTimer Blog',
    version: process.env.npm_package_version,
    environment: 'production',
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || '0.0.0.0',
  },

  database: {
    url: process.env.DATABASE_URL!,
    poolSize: parseInt(process.env.DATABASE_POOL_SIZE || '20', 10),
    timeout: parseInt(process.env.DATABASE_TIMEOUT || '30000', 10),
  },

  cache: {
    redis: {
      url: process.env.REDIS_URL!,
      ttl: parseInt(process.env.CACHE_TTL || '300000', 10),
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || '1000', 10),
    },
  },

  security: {
    sessionSecret: process.env.SESSION_SECRET!,
    jwtSecret: process.env.JWT_SECRET!,
    encryptionKey: process.env.ENCRYPTION_KEY!,
    bcryptRounds: 12,
  },

  api: {
    cueTimer: {
      apiKey: process.env.CUETIMER_API_KEY!,
      baseURL: process.env.API_BASE_URL || 'https://api.cuetimer.com',
      timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    },
  },

  content: {
    directory: process.env.CONTENT_DIR || '/app/content',
    uploadDirectory: process.env.UPLOAD_DIR || '/app/uploads',
    maxFileSize: process.env.MAX_FILE_SIZE || '50MB',
    allowedFileTypes: [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ],
  },

  performance: {
    compression: process.env.ENABLE_COMPRESSION === 'true',
    caching: process.env.ENABLE_CACHING === 'true',
    rateLimiting: process.env.ENABLE_RATE_LIMITING === 'true',
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    },
  },
};
```

---

## 🔧 Performance Optimization

### Application Performance

#### 1. Next.js Optimization

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    domains: ['your-domain.com', 'cdn.your-domain.com'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };
    }
    return config;
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

#### 2. Database Optimization

```sql
-- Database optimization queries

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_blog_posts_category ON blog_posts(category);
CREATE INDEX CONCURRENTLY idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX CONCURRENTLY idx_blog_posts_language ON blog_posts(language);
CREATE INDEX CONCURRENTLY idx_blog_posts_slug ON blog_posts(slug);

-- Composite indexes for common queries
CREATE INDEX CONCURRENTLY idx_blog_posts_category_published ON blog_posts(category, published_at DESC);
CREATE INDEX CONCURRENTLY idx_blog_posts_language_published ON blog_posts(language, published_at DESC);

-- Partial indexes for draft management
CREATE INDEX CONCURRENTLY idx_blog_posts_published ON blog_posts(published_at DESC) WHERE NOT draft;
CREATE INDEX CONCURRENTLY idx_blog_posts_drafts ON blog_posts(created_at DESC) WHERE draft;

-- Analyze table statistics
ANALYZE blog_posts;
ANALYZE blog_post_translations;
ANALYZE analytics_data;

-- Set up vacuuming for performance
ALTER TABLE blog_posts SET (autovacuum_vacuum_scale_factor = 0.1);
ALTER TABLE analytics_data SET (autovacuum_vacuum_scale_factor = 0.05);
```

#### 3. Caching Strategy

```typescript
// lib/cache.ts
import Redis from 'ioredis';

export class CacheManager {
  private redis: Redis;
  private localCache: Map<string, { data: any; expiry: number }> = new Map();

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL!);
  }

  async get<T>(key: string): Promise<T | null> {
    // Check local cache first
    const local = this.localCache.get(key);
    if (local && Date.now() < local.expiry) {
      return local.data;
    }

    // Check Redis cache
    const cached = await this.redis.get(key);
    if (cached) {
      const data = JSON.parse(cached);

      // Cache locally for faster access
      this.localCache.set(key, {
        data,
        expiry: Date.now() + 60000, // 1 minute local cache
      });

      return data;
    }

    return null;
  }

  async set<T>(key: string, value: T, ttl: number = 300): Promise<void> {
    const serialized = JSON.stringify(value);

    // Set in Redis
    await this.redis.setex(key, ttl, serialized);

    // Set in local cache
    this.localCache.set(key, {
      data: value,
      expiry: Date.now() + Math.min(ttl * 1000, 60000),
    });
  }

  async invalidate(pattern: string): Promise<void> {
    // Remove from local cache
    for (const key of this.localCache.keys()) {
      if (key.includes(pattern)) {
        this.localCache.delete(key);
      }
    }

    // Remove from Redis
    const keys = await this.redis.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
  }

  // Cache blog posts with smart invalidation
  async cacheBlogPost(post: BlogPost): Promise<void> {
    const keys = [
      `blog:post:${post.slug}:${post.language}`,
      `blog:category:${post.category}`,
      `blog:language:${post.language}`,
      `blog:recent`,
    ];

    const promises = keys.map(
      (key) => this.set(key, post, 1800) // 30 minutes
    );

    await Promise.all(promises);
  }

  // Invalidate related caches when post is updated
  async invalidateBlogPostCaches(post: BlogPost): Promise<void> {
    await Promise.all([
      this.invalidate(`blog:post:${post.slug}`),
      this.invalidate(`blog:category:${post.category}`),
      this.invalidate(`blog:language:${post.language}`),
      this.invalidate('blog:recent'),
    ]);
  }
}
```

---

## 🔒 Security Configuration

### 1. Security Headers and Middleware

```typescript
// middleware/security.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self'",
    "connect-src 'self' https://api.cuetimer.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.ip || 'unknown';
    const rateLimitKey = `rate_limit:${ip}`;

    // Implement rate limiting logic here
    // You might use Redis or a database to track requests
  }

  return response;
}
```

### 2. Data Encryption

```typescript
// lib/encryption.ts
import crypto from 'crypto';

export class EncryptionService {
  private algorithm = 'aes-256-gcm';
  private key: Buffer;

  constructor() {
    this.key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');
  }

  encrypt(text: string): { encrypted: string; iv: string; tag: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.algorithm, this.key);
    cipher.setAAD(Buffer.from('cuetimer-blog', 'utf8'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex'),
    };
  }

  decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }): string {
    const decipher = crypto.createDecipher(this.algorithm, this.key);
    decipher.setAAD(Buffer.from('cuetimer-blog', 'utf8'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }

  // Encrypt sensitive user data
  encryptUserData(userData: any): any {
    const sensitiveFields = ['email', 'phone', 'address'];
    const encrypted = { ...userData };

    for (const field of sensitiveFields) {
      if (encrypted[field]) {
        const encryptedValue = this.encrypt(encrypted[field]);
        encrypted[field] = encryptedValue;
      }
    }

    return encrypted;
  }

  // Decrypt sensitive user data
  decryptUserData(encryptedData: any): any {
    const sensitiveFields = ['email', 'phone', 'address'];
    const decrypted = { ...encryptedData };

    for (const field of sensitiveFields) {
      if (decrypted[field] && typeof decrypted[field] === 'object') {
        decrypted[field] = this.decrypt(decrypted[field]);
      }
    }

    return decrypted;
  }
}
```

### 3. Authentication and Authorization

```typescript
// lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
    maxAge: 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  providers: [
    // Your authentication providers
  ],
};

// Role-based access control
export function hasPermission(user: any, permission: string): boolean {
  return user?.permissions?.includes(permission) || user?.role === 'admin';
}

export function requireAuth(permissions?: string[]) {
  return async (request: Request) => {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new Error('Unauthorized');
    }

    if (permissions && permissions.length > 0) {
      const hasRequiredPermission = permissions.some((permission) =>
        hasPermission(session.user, permission)
      );

      if (!hasRequiredPermission) {
        throw new Error('Forbidden');
      }
    }

    return session;
  };
}
```

---

## 📊 Monitoring and Logging

### 1. Application Monitoring

```typescript
// lib/monitoring.ts
import { createPrometheusMetrics } from 'prom-client';

// Create metrics
const httpRequestDuration = new createPrometheusMetrics.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

const httpRequestTotal = new createPrometheusMetrics.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

const activeConnections = new createPrometheusMetrics.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

export class MonitoringService {
  static trackHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number
  ) {
    httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration / 1000);

    httpRequestTotal.labels(method, route, statusCode.toString()).inc();
  }

  static incrementActiveConnections() {
    activeConnections.inc();
  }

  static decrementActiveConnections() {
    activeConnections.dec();
  }

  static getMetrics() {
    return {
      httpRequestDuration: httpRequestDuration.get(),
      httpRequestTotal: httpRequestTotal.get(),
      activeConnections: activeConnections.get(),
    };
  }
}
```

### 2. Error Tracking

```typescript
// lib/error-tracking.ts
import * as Sentry from '@sentry/nextjs';

export class ErrorTrackingService {
  static init() {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 1.0,
      beforeSend(event) {
        // Filter out certain errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.value?.includes('Expected error')) {
            return null; // Don't send expected errors
          }
        }
        return event;
      },
    });
  }

  static captureError(error: Error, context?: any) {
    Sentry.captureException(error, {
      contexts: { custom: context },
    });
  }

  static captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
    Sentry.captureMessage(message, level);
  }

  static setUser(user: any) {
    Sentry.setUser({
      id: user.id,
      email: user.email,
      role: user.role,
    });
  }

  static clearUser() {
    Sentry.setUser(null);
  }
}
```

### 3. Performance Monitoring

```typescript
// lib/performance.ts
export class PerformanceMonitor {
  private static metrics = new Map<string, number[]>();

  static startTimer(name: string): () => void {
    const start = performance.now();

    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  static recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    const values = this.metrics.get(name)!;
    values.push(value);

    // Keep only last 1000 measurements
    if (values.length > 1000) {
      values.shift();
    }
  }

  static getMetricStats(name: string) {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((a, b) => a + b, 0);

    return {
      count: values.length,
      min: sorted[0],
      max: sorted[sorted.length - 1],
      mean: sum / values.length,
      median: sorted[Math.floor(sorted.length / 2)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)],
    };
  }

  static async measureFunction<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    const endTimer = this.startTimer(name);
    try {
      const result = await fn();
      endTimer();
      return result;
    } catch (error) {
      endTimer();
      throw error;
    }
  }
}
```

---

## 🔧 Maintenance Procedures

### 1. Database Maintenance

```bash
#!/bin/bash
# scripts/database-maintenance.sh

set -e

echo "🔧 Starting database maintenance..."

# Backup database
echo "📦 Creating database backup..."
pg_dump $DATABASE_URL > "backups/database-$(date +%Y%m%d-%H%M%S).sql"

# Analyze tables for query optimization
echo "📊 Analyzing table statistics..."
psql $DATABASE_URL -c "ANALYZE;"

# Rebuild indexes if fragmented
echo "🔨 Rebuilding fragmented indexes..."
psql $DATABASE_URL -c "
SELECT 'REINDEX INDEX ' || indexname || ';'
FROM pg_stat_user_indexes
WHERE idx_scan > 1000 AND (idx_tup_read / idx_scan) > 1000;
"

# Clean up old analytics data
echo "🧹 Cleaning up old analytics data..."
psql $DATABASE_URL -c "
DELETE FROM analytics_data
WHERE created_at < NOW() - INTERVAL '1 year';
"

# Update table statistics
echo "📈 Updating table statistics..."
psql $DATABASE_URL -c "VACUUM ANALYZE;"

echo "✅ Database maintenance completed"
```

### 2. Cache Management

```bash
#!/bin/bash
# scripts/cache-maintenance.sh

echo "🔄 Cache maintenance..."

# Clear Redis cache
echo "🧹 Clearing Redis cache..."
redis-cli -u $REDIS_URL FLUSHALL

# Warm up critical caches
echo "🔥 Warming up caches..."
curl -s "https://your-domain.com/api/warm-cache" > /dev/null

# Monitor cache hit rates
echo "📊 Cache statistics..."
redis-cli -u $REDIS_URL INFO stats | grep keyspace

echo "✅ Cache maintenance completed"
```

### 3. Log Rotation

```bash
# /etc/logrotate.d/cuetimer
/var/log/cuetimer/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
        systemctl restart cuetimer-blog
    endscript
}
```

### 4. Health Checks

```typescript
// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PerformanceMonitor } from '@/lib/performance';
import { CacheManager } from '@/lib/cache';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const endTimer = PerformanceMonitor.startTimer('health-check');

  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        external: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      services: {
        database: await checkDatabase(),
        cache: await checkCache(),
        storage: await checkStorage(),
      },
      metrics: PerformanceMonitor.getMetricStats('api-request'),
    };

    endTimer();

    // Return 200 if all services are healthy
    const allHealthy = Object.values(health.services).every(
      (service) => service.status === 'healthy'
    );

    res.status(allHealthy ? 200 : 503).json(health);
  } catch (error) {
    endTimer();

    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
    });
  }
}

async function checkDatabase() {
  try {
    // Perform a simple database query
    await db.query('SELECT 1');
    return { status: 'healthy', responseTime: Date.now() };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkCache() {
  try {
    const cache = new CacheManager();
    await cache.set('health-check', 'ok', 10);
    const value = await cache.get('health-check');
    return value === 'ok'
      ? { status: 'healthy' }
      : { status: 'unhealthy', error: 'Cache read/write failed' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}

async function checkStorage() {
  try {
    // Check file system access
    await fs.access('./content', fs.constants.R_OK);
    return { status: 'healthy' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

---

## 🚨 Backup and Disaster Recovery

### 1. Automated Backup Script

```bash
#!/bin/bash
# scripts/backup.sh

set -e

BACKUP_DIR="/backups/cuetimer"
DATE=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="cuetimer-backup-$DATE"

echo "🔧 Starting backup process..."

# Create backup directory
mkdir -p "$BACKUP_DIR/$BACKUP_NAME"

# Backup database
echo "📦 Backing up database..."
pg_dump $DATABASE_URL | gzip > "$BACKUP_DIR/$BACKUP_NAME/database.sql.gz"

# Backup content files
echo "📁 Backing up content files..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME/content.tar.gz" ./content/

# Backup uploads
echo "📤 Backing up uploads..."
tar -czf "$BACKUP_DIR/$BACKUP_NAME/uploads.tar.gz" ./uploads/

# Backup configuration
echo "⚙️ Backing up configuration..."
cp .env.production "$BACKUP_DIR/$BACKUP_NAME/"
cp docker-compose.yml "$BACKUP_DIR/$BACKUP_NAME/"

# Create backup manifest
cat > "$BACKUP_DIR/$BACKUP_NAME/manifest.json" << EOF
{
  "backupDate": "$(date -Iseconds)",
  "version": "$(cat package.json | jq -r .version)",
  "database": "database.sql.gz",
  "content": "content.tar.gz",
  "uploads": "uploads.tar.gz",
  "configuration": [".env.production", "docker-compose.yml"]
}
EOF

# Upload to cloud storage (optional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
  echo "☁️ Uploading to S3..."
  aws s3 sync "$BACKUP_DIR/$BACKUP_NAME" "s3://$AWS_S3_BUCKET/backups/$BACKUP_NAME/"
fi

# Clean up old backups (keep last 30 days)
echo "🧹 Cleaning up old backups..."
find "$BACKUP_DIR" -type d -name "cuetimer-backup-*" -mtime +30 -exec rm -rf {} +

echo "✅ Backup completed: $BACKUP_NAME"
```

### 2. Recovery Script

```bash
#!/bin/bash
# scripts/recover.sh

set -e

BACKUP_NAME=$1

if [ -z "$BACKUP_NAME" ]; then
  echo "Usage: $0 <backup-name>"
  exit 1
fi

BACKUP_DIR="/backups/cuetimer/$BACKUP_NAME"

if [ ! -d "$BACKUP_DIR" ]; then
  echo "Backup not found: $BACKUP_NAME"
  exit 1
fi

echo "🔄 Starting recovery from backup: $BACKUP_NAME"

# Stop application
echo "⏹️ Stopping application..."
docker-compose down

# Restore database
echo "💾 Restoring database..."
gunzip -c "$BACKUP_DIR/database.sql.gz" | psql $DATABASE_URL

# Restore content files
echo "📁 Restoring content files..."
tar -xzf "$BACKUP_DIR/content.tar.gz"

# Restore uploads
echo "📤 Restoring uploads..."
tar -xzf "$BACKUP_DIR/uploads.tar.gz"

# Restore configuration
echo "⚙️ Restoring configuration..."
cp "$BACKUP_DIR/.env.production" ./
cp "$BACKUP_DIR/docker-compose.yml" ./

# Start application
echo "▶️ Starting application..."
docker-compose up -d

# Wait for application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 30

# Health check
echo "🏥 Performing health check..."
curl -f "http://localhost:3000/api/health" || {
  echo "❌ Health check failed"
  exit 1
}

echo "✅ Recovery completed successfully"
```

---

## 📋 Deployment Checklist

### Pre-Deployment Checklist

- [ ] **Code Review**: All changes reviewed and approved
- [ ] **Testing**: Unit, integration, and E2E tests passing
- [ ] **Security**: Security scan completed, no vulnerabilities
- [ ] **Performance**: Performance benchmarks meet requirements
- [ ] **Documentation**: Documentation updated
- [ ] **Backup**: Current backup created
- [ ] **Rollback Plan**: Rollback procedure tested
- [ ] **Monitoring**: Monitoring and alerting configured

### Deployment Checklist

- [ ] **Environment Variables**: All required variables set
- [ ] **Database**: Database migrations applied
- [ ] **Assets**: Static assets built and deployed
- [ ] **Cache**: Cache cleared and warmed
- [ ] **SSL**: SSL certificates valid
- [ ] **DNS**: DNS records updated
- [ ] **Load Balancer**: Configuration updated
- [ ] **Health Checks**: All health checks passing

### Post-Deployment Checklist

- [ ] **Verification**: Application functioning correctly
- [ ] **Performance**: Performance metrics within acceptable range
- [ ] **Error Monitoring**: No critical errors detected
- [ ] **User Testing**: User acceptance testing completed
- [ ] **Analytics**: Analytics tracking verified
- [ ] **Backup**: Post-deployment backup created
- [ ] **Documentation**: Deployment documented
- [ ] **Team Notification**: Team notified of deployment

---

## 📞 Support and Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check connection string
   - Verify database server is running
   - Check firewall rules

2. **Cache Issues**
   - Clear Redis cache
   - Check Redis connection
   - Verify cache configuration

3. **Performance Issues**
   - Check database query performance
   - Verify cache hit rates
   - Monitor resource usage

4. **SSL Certificate Issues**
   - Verify certificate validity
   - Check certificate chain
   - Renew expired certificates

### Emergency Procedures

1. **Application Down**
   - Check health endpoints
   - Review error logs
   - Restart services if needed

2. **Database Issues**
   - Switch to read replica if available
   - Restore from recent backup
   - Contact database administrator

3. **High Traffic Load**
   - Scale up resources
   - Enable rate limiting
   - Activate CDN caching

---

_For additional deployment support or questions, please refer to our
[troubleshooting guide](./TROUBLESHOOTING.md) or contact our DevOps team._
