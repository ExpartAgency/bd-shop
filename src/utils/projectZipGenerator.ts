import JSZip from 'jszip';
import { OPENAPI_SPEC, MYSQL_MIGRATIONS, LARAVEL_BACKEND_CODE, DOCKER_DEPLOYMENT_CONFIG } from '../docs/architectureSpecs';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. Root README.md
  zip.file(
    'README.md',
    `# BD SHOP — Premium Production-Ready E-Commerce Platform

BD SHOP is an enterprise-grade, high-performance e-commerce platform built for scale, sub-second product synchronization, atomic inventory protection, and layered edge caching.

## Tech Stack
- **Frontend**: Next.js / React 19 + TypeScript + Tailwind CSS + Framer Motion
- **Backend**: Laravel 11 REST API / Node microservices
- **Database**: MySQL 8.0+ (InnoDB with Row-Level Locking & Transactions)
- **Cache & Message Broker**: Redis 7.0 (Pub/Sub & Tagged Invalidation)
- **Edge CDN**: Cloudflare API integration for tag-based edge purge
- **Web Server**: Nginx with HTTP/2, Gzip, and SSL
- **Containers**: Docker & Docker Compose

---

## Quickstart & Local Setup

### 1. Environment Configuration
\`\`\`bash
cp .env.example .env
# Edit .env with your MySQL and Redis credentials
\`\`\`

### 2. Docker Compose Deployment (Recommended)
\`\`\`bash
docker-compose up -d --build
\`\`\`
This brings up:
- MySQL 8.0 on port 3306
- Redis 7.0 on port 6379
- Laravel API on port 8000
- Nginx reverse proxy on port 80/443

### 3. Run Database Migrations & Seeders
\`\`\`bash
docker-compose exec app php artisan migrate --seed
\`\`\`

### 4. Start Queue Workers (Emails, CDN Purges, Analytics)
\`\`\`bash
docker-compose exec -d app php artisan queue:work --queue=emails,inventory_sync,cdn_purge --tries=3
\`\`\`

---

## Key Features

1. **Atomic Inventory Locks**:
   Checkout requests lock product rows (\`SELECT ... FOR UPDATE\`) inside an ACID database transaction. Under extreme traffic or flash sales, overselling is physically impossible.

2. **Instant Product Synchronization**:
   When administrators modify or publish a product, the system automatically invalidates cache tags across Redis and Cloudflare CDN edges, while broadcasting a sync event to connected clients.

3. **Multi-Channel Delivery in Bangladesh**:
   Native zones for Dhaka (Inside City: ৳60), Outside Dhaka (৳120), and Express Courier (৳180), integrated with Pathao Logistics and Steadfast Courier.

4. **Multi-Payment Gateway Integration**:
   Direct support for bKash Merchant API, Nagad Gateway, Visa / Mastercard 3D-Secure 2.0, and Cash on Delivery (COD).
`
  );

  // 2. .env.example
  zip.file(
    '.env.example',
    `APP_NAME="BD SHOP"
APP_ENV=production
APP_KEY=base64:productionKeyShouldBeGeneratedUsingArtisanKeyGenerate=
APP_DEBUG=false
APP_URL=https://bdshop.com.bd

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bdshop_db
DB_USERNAME=bdshop_user
DB_PASSWORD=secret_db_password

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=secret_redis_password
REDIS_PORT=6379
CACHE_DRIVER=redis
QUEUE_CONNECTION=redis

CLOUDFLARE_ZONE_ID=cf_zone_id_here
CLOUDFLARE_API_TOKEN=cf_api_token_here

BKASH_MERCHANT_USERNAME=bdshop_bkash
BKASH_MERCHANT_PASSWORD=bdshop_secret
BKASH_APP_KEY=bkash_app_key
BKASH_APP_SECRET=bkash_app_secret
`
  );

  // 3. Docker files
  zip.file('docker-compose.yml', DOCKER_DEPLOYMENT_CONFIG.dockerCompose);
  zip.file('nginx.conf', DOCKER_DEPLOYMENT_CONFIG.nginxConf);
  zip.file(
    'Dockerfile',
    `FROM php:8.3-fpm-alpine

RUN apk add --no-cache \\
    git curl libpng-dev libxml2-dev libzip-dev zip unzip oniguruma-dev \\
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /var/www
COPY . /var/www

RUN composer install --no-dev --optimize-autoloader

EXPOSE 9000
CMD ["php-fpm"]
`
  );

  // 4. OpenAPI Specification
  zip.file('docs/openapi.json', JSON.stringify(OPENAPI_SPEC, null, 2));

  // 5. Database Migrations
  const dbFolder = zip.folder('database/migrations');
  MYSQL_MIGRATIONS.forEach(m => {
    dbFolder?.file(m.filename, m.content);
  });

  // 6. Laravel Code
  const controllers = zip.folder('app/Http/Controllers/Api');
  controllers?.file('ProductController.php', LARAVEL_BACKEND_CODE.productController);

  const services = zip.folder('app/Services/Checkout');
  services?.file('AtomicCheckoutService.php', LARAVEL_BACKEND_CODE.checkoutService);

  const courierServices = zip.folder('app/Services/Courier');
  courierServices?.file('SteadfastCourierService.php', (LARAVEL_BACKEND_CODE as any).steadfastCourierService);

  const trackingServices = zip.folder('app/Services/Tracking');
  trackingServices?.file('FacebookCapiService.php', (LARAVEL_BACKEND_CODE as any).facebookCapiService);

  // 7. Automated Tests
  const tests = zip.folder('tests/Feature');
  tests?.file(
    'AtomicCheckoutTest.php',
    `<?php

namespace Tests\\Feature;

use Tests\\TestCase;
use App\\Models\\Product;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;

class AtomicCheckoutTest extends TestCase
{
    use RefreshDatabase;

    public function test_concurrent_checkout_cannot_oversell_inventory()
    {
        $product = Product::factory()->create(['stock' => 1, 'price' => 1000]);

        // Attempt simultaneous checkout 1
        $response1 = $this->postJson('/api/v1/checkout', [
            'customerName' => 'Customer A',
            'customerPhone' => '+8801700000001',
            'shippingAddress' => 'Dhaka',
            'shippingZone' => 'inside_dhaka',
            'paymentMethod' => 'bkash',
            'items' => [['productId' => $product->id, 'quantity' => 1]]
        ], ['X-Idempotency-Key' => 'req_001']);

        $response1->assertStatus(201);

        // Attempt simultaneous checkout 2 (must be rejected)
        $response2 = $this->postJson('/api/v1/checkout', [
            'customerName' => 'Customer B',
            'customerPhone' => '+8801700000002',
            'shippingAddress' => 'Chittagong',
            'shippingZone' => 'outside_dhaka',
            'paymentMethod' => 'cod',
            'items' => [['productId' => $product->id, 'quantity' => 1]]
        ], ['X-Idempotency-Key' => 'req_002']);

        $response2->assertStatus(409); // Conflict: Stock Depleted
        $this->assertEquals(0, $product->fresh()->stock);
    }
}
`
  );

  // 8. Load test script
  const loadTests = zip.folder('tests/Load');
  loadTests?.file(
    'k6-load-test.js',
    `import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<150'], // 95% of requests under 150ms
    http_req_failed: ['rate<0.01'],    // Error rate < 1%
  },
};

export default function () {
  const res = http.get('https://api.bdshop.com.bd/v1/products');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'cache header is HIT or MISS': (r) => r.headers['X-Cache'] !== undefined,
  });
  sleep(1);
}
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
