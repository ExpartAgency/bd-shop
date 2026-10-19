export const OPENAPI_SPEC = {
  openapi: "3.0.3",
  info: {
    title: "BD SHOP REST API",
    version: "1.0.0",
    description: "Production-grade, highly scalable e-commerce REST API for BD SHOP platform featuring instant product synchronization, atomic inventory checkout, and layered cache invalidation.",
    contact: {
      name: "BD SHOP Engineering Architecture",
      email: "api@bdshop.com.bd"
    }
  },
  servers: [
    {
      url: "https://api.bdshop.com.bd/v1",
      description: "Production Cloudflare Protected Gateway"
    },
    {
      url: "http://localhost:8000/api/v1",
      description: "Local Laravel Development Server"
    }
  ],
  paths: {
    "/products": {
      get: {
        summary: "List published products with filtering, search & pagination",
        tags: ["Products"],
        parameters: [
          { name: "category", in: "query", schema: { type: "string" }, description: "Filter by category slug" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Search query across titles, SKUs, and tags" },
          { name: "sort", in: "query", schema: { type: "string", enum: ["featured", "price_asc", "price_desc", "rating", "newest"] } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 24 } }
        ],
        responses: {
          200: {
            description: "Paginated list of published products with edge cache headers (X-Cache: HIT)",
            headers: {
              "Cache-Control": { schema: { type: "string", example: "public, max-age=3600, s-maxage=86400, stale-while-revalidate=300" } },
              "ETag": { schema: { type: "string", example: "W/\"94b0f-8c312a\"" } }
            }
          }
        }
      },
      post: {
        summary: "Create product (Admin only)",
        security: [{ BearerAuth: [] }],
        tags: ["Admin Products"],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/ProductInput" } } }
        },
        responses: {
          201: { description: "Product created, Redis and CDN tags invalidated" },
          401: { description: "Unauthorized" },
          422: { description: "Validation error" }
        }
      }
    },
    "/checkout": {
      post: {
        summary: "Atomic Checkout & Order Placement",
        tags: ["Orders & Checkout"],
        parameters: [
          { name: "X-Idempotency-Key", in: "header", required: true, schema: { type: "string" }, description: "Unique UUID preventing duplicate order creation" }
        ],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/CheckoutRequest" } } }
        },
        responses: {
          201: { description: "Order confirmed, inventory atomically decremented, tracking generated" },
          409: { description: "Conflict: Insufficient inventory stock" },
          422: { description: "Invalid coupon or missing address" }
        }
      }
    },
    "/orders/track/{orderNumber}": {
      get: {
        summary: "Customer Order Tracking by Order Number (e.g. BDS-2026-8941)",
        tags: ["Orders & Checkout"],
        parameters: [
          { name: "orderNumber", in: "path", required: true, schema: { type: "string" } }
        ],
        responses: {
          200: { description: "Live order timeline, courier dispatch info, and items" },
          404: { description: "Order not found" }
        }
      }
    },
    "/admin/cache/purge": {
      post: {
        summary: "Invalidate Redis & Cloudflare CDN cache tags",
        tags: ["Admin System"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  tags: { type: "array", items: { type: "string" }, example: ["products", "homepage"] }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "Cache tags flushed across edge nodes" }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ProductInput: {
        type: "object",
        required: ["title", "sku", "price", "stock", "categoryId"],
        properties: {
          title: { type: "string", example: "Sony WH-1000XM5 Noise Canceling Headphones" },
          sku: { type: "string", example: "SNY-WH-XM5-BLK" },
          categoryId: { type: "string", example: "cat_audio" },
          price: { type: "number", example: 38500 },
          stock: { type: "integer", example: 25 },
          isPublished: { type: "boolean", default: true }
        }
      },
      CheckoutRequest: {
        type: "object",
        required: ["customerName", "customerPhone", "shippingAddress", "paymentMethod", "items"],
        properties: {
          customerName: { type: "string" },
          customerEmail: { type: "string" },
          customerPhone: { type: "string" },
          shippingAddress: { type: "string" },
          shippingZone: { type: "string", enum: ["inside_dhaka", "outside_dhaka", "express"] },
          paymentMethod: { type: "string", enum: ["bkash", "nagad", "card", "cod"] },
          couponCode: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                productId: { type: "string" },
                quantity: { type: "integer" }
              }
            }
          }
        }
      }
    }
  }
};

export const MYSQL_MIGRATIONS = [
  {
    filename: "2026_01_01_000001_create_users_and_roles_table.sql",
    title: "Users, Roles & RBAC Permissions",
    content: `-- BD SHOP Database Architecture: Users & Roles
-- Compatible with MySQL 8.0+ and InnoDB strict engine

CREATE TABLE IF NOT EXISTS roles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    permissions JSON NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    role_id BIGINT UNSIGNED NOT NULL DEFAULT 3,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    phone VARCHAR(30) NULL,
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('active', 'suspended', 'pending') DEFAULT 'active',
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role_id),
    INDEX idx_users_email (email),
    INDEX idx_users_status (status),
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    filename: "2026_01_01_000002_create_catalog_and_inventory_tables.sql",
    title: "Categories, Brands, Products, Variants & Inventory",
    content: `-- BD SHOP Database Architecture: Catalog & Authoritative Inventory

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT UNSIGNED NULL,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    description TEXT NULL,
    image_url VARCHAR(500) NULL,
    icon_name VARCHAR(60) NULL,
    sort_order INT UNSIGNED DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug),
    INDEX idx_categories_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS brands (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    logo_url VARCHAR(500) NULL,
    origin_country VARCHAR(80) NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT UNSIGNED NOT NULL,
    brand_id BIGINT UNSIGNED NULL,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(280) NOT NULL UNIQUE,
    price DECIMAL(12, 2) NOT NULL,
    compare_at_price DECIMAL(12, 2) NULL,
    cost_price DECIMAL(12, 2) NULL,
    stock INT NOT NULL DEFAULT 0,
    low_stock_threshold INT NOT NULL DEFAULT 5,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    short_description TEXT NULL,
    description LONGTEXT NULL,
    primary_image VARCHAR(500) NOT NULL,
    gallery_images JSON NULL,
    specifications JSON NULL,
    rating_average DECIMAL(3, 2) DEFAULT 5.00,
    reviews_count INT UNSIGNED DEFAULT 0,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_published (is_published),
    INDEX idx_products_category (category_id),
    INDEX idx_products_price (price),
    INDEX idx_products_created (created_at),
    FULLTEXT INDEX ftx_products_search (title, sku),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id),
    CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS product_variants (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    sku VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(120) NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    attributes JSON NOT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    filename: "2026_01_01_000003_create_orders_and_checkout_tables.sql",
    title: "Atomic Orders, Order Items, Payments & Shipments",
    content: `-- BD SHOP Database Architecture: Atomic Orders & Transaction Locks

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(64) NOT NULL UNIQUE,
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    customer_id BIGINT UNSIGNED NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(191) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    postal_code VARCHAR(20) NULL,
    shipping_zone ENUM('inside_dhaka', 'outside_dhaka', 'express') NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method ENUM('bkash', 'nagad', 'card', 'cod') NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    order_status ENUM('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    subtotal DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0.00,
    coupon_code VARCHAR(50) NULL,
    grand_total DECIMAL(12, 2) NOT NULL,
    tracking_courier VARCHAR(100) NULL,
    tracking_number VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_status (order_status),
    INDEX idx_orders_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    variant_id BIGINT UNSIGNED NULL,
    sku VARCHAR(64) NOT NULL,
    product_title VARCHAR(255) NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    subtotal DECIMAL(12, 2) NOT NULL,
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  },
  {
    filename: "2026_01_01_000004_create_cache_and_audit_tables.sql",
    title: "Coupons, Reviews, Audit Logs & Queue Jobs",
    content: `-- BD SHOP Database Architecture: Coupons, Reviews, Audit & Queue Monitoring

CREATE TABLE IF NOT EXISTS coupons (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type ENUM('percentage', 'fixed') NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_spend DECIMAL(12, 2) DEFAULT 0.00,
    max_discount DECIMAL(12, 2) NULL,
    usage_limit INT UNSIGNED DEFAULT 1000,
    used_count INT UNSIGNED DEFAULT 0,
    expires_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT UNSIGNED NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    rating TINYINT UNSIGNED NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    verified_purchase BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'approved',
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reviews_product (product_id, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(80) NOT NULL,
    entity_id VARCHAR(80) NOT NULL,
    old_values JSON NULL,
    new_values JSON NULL,
    ip_address VARCHAR(45) NULL,
    user_agent VARCHAR(255) NULL,
    created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`
  }
];

export const LARAVEL_BACKEND_CODE = {
  productController: `<?php

namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Product;
use App\\Services\\Cache\\ProductCacheService;
use App\\Events\\ProductUpdatedEvent;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class ProductController extends Controller
{
    protected ProductCacheService $cache;

    public function __construct(ProductCacheService $cache)
    {
        $this->cache = $cache;
    }

    /**
     * Storefront: List published products with edge cache & tag-based revalidation
     */
    public function index(Request $request)
    {
        $category = $request->query('category');
        $search = $request->query('search');
        $page = $request->query('page', 1);

        $cacheKey = "products:list:cat_{$category}:q_{$search}:p_{$page}";

        return $this->cache->remember($cacheKey, 3600, ['products', 'catalog'], function () use ($category, $search) {
            return Product::query()
                ->where('is_published', true)
                ->when($category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $category)))
                ->when($search, fn($q) => $q->where('title', 'LIKE', "%{$search}%"))
                ->with(['category', 'variants'])
                ->paginate(24);
        });
    }

    /**
     * Admin: Atomic Product Creation + Event Broadcast + Cache Invalidation
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'sku' => 'required|string|unique:products,sku',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'is_published' => 'boolean',
            'primary_image' => 'required|url',
        ]);

        return DB::transaction(function () use ($validated) {
            $product = Product::create([
                ...$validated,
                'slug' => Str::slug($validated['title']) . '-' . Str::random(4),
            ]);

            // Invalidate Redis tags & purge Cloudflare CDN edge
            $this->cache->tags(['products', 'homepage'])->flush();

            // Broadcast real-time event via WebSocket / Redis PubSub
            event(new ProductUpdatedEvent($product->id, 'PRODUCT_CREATED'));

            return response()->json($product, 201);
        });
    }
}`,

  checkoutService: `<?php

namespace App\\Services\\Checkout;

use App\\Models\\Order;
use App\\Models\\Product;
use App\\Models\\OrderItem;
use App\\Events\\OrderPlacedEvent;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;
use App\\Exceptions\\InsufficientInventoryException;

class AtomicCheckoutService
{
    /**
     * Execute atomic order placement with pessimistic locking (SELECT ... FOR UPDATE)
     * preventing overselling under high concurrency.
     */
    public function processCheckout(array $data, string $idempotencyKey): Order
    {
        // 1. Check idempotency key to prevent double charging
        if ($existing = Order::where('idempotency_key', $idempotencyKey)->first()) {
            return $existing;
        }

        return DB::transaction(function () use ($data, $idempotencyKey) {
            $orderNumber = 'BDS-' . date('Y') . '-' . mt_rand(1000, 9999);
            $subtotal = 0;
            $itemsToAttach = [];

            // 2. Lock each product row with SELECT ... FOR UPDATE
            foreach ($data['items'] as $item) {
                $product = Product::where('id', $item['productId'])->lockForUpdate()->firstOrFail();

                if ($product->stock < $item['quantity']) {
                    throw new InsufficientInventoryException(
                        "Stock depleted for {$product->title}. Available: {$product->stock}"
                    );
                }

                // 3. Atomically decrement stock
                $product->decrement('stock', $item['quantity']);

                $lineSubtotal = $product->price * $item['quantity'];
                $subtotal += $lineSubtotal;

                $itemsToAttach[] = [
                    'product_id' => $product->id,
                    'sku' => $product->sku,
                    'product_title' => $product->title,
                    'unit_price' => $product->price,
                    'quantity' => $item['quantity'],
                    'subtotal' => $lineSubtotal,
                ];
            }

            // 4. Calculate total and create order record
            $discount = $data['discount_amount'] ?? 0;
            $grandTotal = max(0, $subtotal - $discount + $data['shipping_fee']);

            $order = Order::create([
                'order_number' => $orderNumber,
                'idempotency_key' => $idempotencyKey,
                'customer_name' => $data['customerName'],
                'customer_email' => $data['customerEmail'],
                'customer_phone' => $data['customerPhone'],
                'shipping_address' => $data['shippingAddress'],
                'city' => $data['city'],
                'shipping_zone' => $data['shippingZone'],
                'shipping_fee' => $data['shippingFee'],
                'payment_method' => $data['paymentMethod'],
                'payment_status' => $data['paymentMethod'] === 'cod' ? 'pending' : 'paid',
                'order_status' => 'confirmed',
                'subtotal' => $subtotal,
                'discount_amount' => $discount,
                'grand_total' => $grandTotal,
            ]);

            $order->items()->createMany($itemsToAttach);

            // 5. Fire async queue events (Email, SMS OTP, Courier Dispatch)
            event(new OrderPlacedEvent($order));

            return $order;
        }, 5); // 5 retries on deadlock
    }
}`,

  steadfastCourierService: `<?php

namespace App\\Services\\Courier;

use Illuminate\\Support\\Facades\\Http;
use App\\Models\\Order;

class SteadfastCourierService
{
    protected string $apiKey;
    protected string $secretKey;
    protected string $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.steadfast.api_key');
        $this->secretKey = config('services.steadfast.secret_key');
        $this->baseUrl = 'https://portal.steadfast.com.bd/api/v1';
    }

    /**
     * 1-Click Order Dispatch to Steadfast Courier API
     */
    public function createConsignment(Order $order): array
    {
        $codAmount = $order->payment_method === 'cod' ? (int) $order->grand_total : 0;

        $response = Http::withHeaders([
            'Api-Key' => $this->apiKey,
            'Secret-Key' => $this->secretKey,
            'Content-Type' => 'application/json',
        ])->post("{$this->baseUrl}/create_order", [
            'invoice' => $order->order_number,
            'recipient_name' => $order->customer_name,
            'recipient_phone' => $order->customer_phone,
            'recipient_address' => "{$order->shipping_address}, {$order->city}",
            'cod_amount' => $codAmount,
            'note' => $order->notes ?? 'Handle with care - BD SHOP Flagship item',
        ]);

        if ($response->successful() && $response->json('status') === 200) {
            $data = $response->json('consignment');
            $order->update([
                'order_status' => 'shipped',
                'tracking_courier' => 'Steadfast Courier Express',
                'tracking_number' => $data['tracking_code'],
            ]);

            return [
                'success' => true,
                'consignment_id' => $data['consignment_id'],
                'tracking_code' => $data['tracking_code'],
            ];
        }

        throw new \\Exception('Steadfast API error: ' . $response->body());
    }
}`,

  facebookCapiService: `<?php

namespace App\\Services\\Tracking;

use Illuminate\\Support\\Facades\\Http;
use App\\Models\\Order;

class FacebookCapiService
{
    protected string $pixelId;
    protected string $accessToken;
    protected ?string $testCode;

    public function __construct()
    {
        $this->pixelId = config('services.facebook.pixel_id');
        $this->accessToken = config('services.facebook.capi_token');
        $this->testCode = config('services.facebook.test_event_code');
    }

    /**
     * Dispatch Server-Side Purchase Conversion to Meta Graph API
     */
    public function sendPurchaseEvent(Order $order, string $ipAddress, string $userAgent): bool
    {
        $payload = [
            'data' => [
                [
                    'event_name' => 'Purchase',
                    'event_time' => time(),
                    'event_id' => 'ord_' . $order->id,
                    'action_source' => 'website',
                    'user_data' => [
                        'em' => [hash('sha256', strtolower(trim($order->customer_email)))],
                        'ph' => [hash('sha256', preg_replace('/[^0-9]/', '', $order->customer_phone))],
                        'client_ip_address' => $ipAddress,
                        'client_user_agent' => $userAgent,
                    ],
                    'custom_data' => [
                        'currency' => 'BDT',
                        'value' => (float) $order->grand_total,
                        'order_id' => $order->order_number,
                    ],
                ]
            ],
            'access_token' => $this->accessToken,
        ];

        if ($this->testCode) {
            $payload['test_event_code'] = $this->testCode;
        }

        $response = Http::post("https://graph.facebook.com/v19.0/{$this->pixelId}/events", $payload);

        return $response->successful();
    }
}`
};

export const DOCKER_DEPLOYMENT_CONFIG = {
  dockerCompose: `version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: bdshop_api
    restart: always
    environment:
      APP_NAME: "BD SHOP"
      APP_ENV: production
      APP_KEY: base64:dummyProdKeyToReplaceDuringDeploy=
      DB_CONNECTION: mysql
      DB_HOST: mysql
      DB_PORT: 3306
      DB_DATABASE: bdshop_db
      DB_USERNAME: bdshop_user
      DB_PASSWORD: \${DB_PASSWORD}
      REDIS_HOST: redis
      REDIS_PORT: 6379
      CACHE_DRIVER: redis
      QUEUE_CONNECTION: redis
    depends_on:
      - mysql
      - redis
    networks:
      - bdshop_net

  mysql:
    image: mysql:8.0
    container_name: bdshop_mysql
    restart: always
    environment:
      MYSQL_DATABASE: bdshop_db
      MYSQL_USER: bdshop_user
      MYSQL_PASSWORD: \${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - bdshop_net

  redis:
    image: redis:7.0-alpine
    container_name: bdshop_redis
    restart: always
    command: redis-server --appendonly yes --requirepass \${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - bdshop_net

  nginx:
    image: nginx:alpine
    container_name: bdshop_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/ssl/certs:ro
    depends_on:
      - app
    networks:
      - bdshop_net

volumes:
  db_data:
  redis_data:

networks:
  bdshop_net:
    driver: bridge`,

  nginxConf: `user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Performance Tuning & Gzip
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml image/svg+xml;

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
    limit_req_zone $binary_remote_addr zone=checkout_limit:10m rate=5r/s;

    server {
        listen 80;
        server_name bdshop.com.bd api.bdshop.com.bd;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name bdshop.com.bd;

        ssl_certificate /etc/ssl/certs/bdshop.crt;
        ssl_certificate_key /etc/ssl/certs/bdshop.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        location / {
            proxy_pass http://app:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        location /api/checkout {
            limit_req zone=checkout_limit burst=10 nodelay;
            proxy_pass http://app:8000;
        }

        location /api/ {
            limit_req zone=api_limit burst=40 nodelay;
            proxy_pass http://app:8000;
        }
    }
}`
};
