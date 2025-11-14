# Advanced Host Discovery Tool - Feature Guide

## New Advanced Features

### 1. Service Fingerprinting

Automatically identify running services based on banner grabbing and service signatures.

```bash
node index.js 192.168.1.0/24 --port 22 --grab --fingerprint
```

Detects:

- SSH, HTTP/HTTPS, FTP, SMTP, DNS
- MySQL, PostgreSQL, Redis, MongoDB
- Elasticsearch, Docker, and more

### 2. Performance Analytics

Generate detailed performance reports including RTT percentiles, retry statistics, and success rates.

```bash
node index.js 192.168.1.0/24 --analytics
```

Generates:

- Success rates and error metrics
- RTT analysis (min, max, avg, P95)
- Retry statistics
- Performance duration breakdown

### 3. Advanced Caching System

Cache probe results to avoid redundant scans within the TTL window (1 hour default).

```bash
node index.js 192.168.1.0/24 --cache
```

Benefits:

- Reduces repeated scans on same targets
- MD5-hashed cache keys
- Automatic TTL expiration
- Per-scan cache statistics

### 4. Rate Limiting

Control the rate of probes to avoid overwhelming target infrastructure.

```bash
node index.js 192.168.1.0/24 --rate-limit 10
```

- Limit to N requests per second
- Token-based rate limiting
- Prevents network saturation

### 5. Query Filtering

Filter results based on multiple criteria before output.

```bash
node index.js 192.168.1.0/24 --filter alive
node index.js 192.168.1.0/24 --filter service:ssh
```

Supported filters:

- `alive` - Only show reachable hosts
- `dead` - Only show unreachable hosts
- `service:SERVICE_NAME` - Filter by detected service
- `port:PORT_NUMBER` - Filter by port

### 6. Deduplication

Remove duplicate targets from expanded ranges.

```bash
node index.js 192.168.1.1,192.168.1.1,192.168.1.2 --deduplicate
```

### 7. Detailed Output

Include additional metadata in results (probe duration, timestamps).

```bash
node index.js 192.168.1.0/24 --detailed --output json
```

Additional fields:

- `probeDuration` - Time taken to probe each host
- `service` - Detected service information
- `port` - Target port (if specified)

### 8. Enhanced CSV/JSON Output

Extended output formats with new fields:

**CSV Headers:**

```
target,alive,time,port,service,tcpFallback,error,probeDuration
```

**JSON Fields:**

```json
{
  "target": "192.168.1.1",
  "alive": true,
  "time": 5,
  "port": 22,
  "service": { "service": "ssh", "confidence": "high" },
  "tcpFallback": true,
  "banner": "SSH-2.0-OpenSSH_7.4",
  "probeDuration": 145
}
```

## Combined Examples

### Full Network Inventory with Analytics

```bash
node index.js 10.0.0.0/24 \
  --fingerprint \
  --analytics \
  --cache \
  --rate-limit 20 \
  --output json \
  --out inventory.json \
  --detailed
```

### Quick Service Discovery with Filtering

```bash
node index.js 192.168.1.0/24 \
  --port 22 \
  --grab \
  --fingerprint \
  --filter alive \
  --deduplicate
```

### High-Performance Large Scale Scan

```bash
node index.js @targets.txt \
  --concurrency 100 \
  --rate-limit 50 \
  --analytics \
  --output csv \
  --out results.csv \
  --max-hosts 10000
```

## Architecture Improvements

### CacheManager

- MD5-based key hashing
- Configurable TTL (default: 1 hour)
- Automatic expiration checking
- Memory usage statistics

### ServiceFingerprintDB

- 12+ predefined service signatures
- Pattern matching on banners
- Confidence scoring
- Extensible signature system

### PerformanceAnalytics

- Per-probe timing metrics
- Error tracking and aggregation
- Percentile calculations (P95)
- Comprehensive report generation

### RateLimiter

- Token-bucket algorithm
- Precise millisecond timing
- Non-blocking acquisition
- Per-second request limiting

### QueryFilter

- Chainable filter API
- Multiple filter types
- Result aggregation
- Filter description output

## Performance Characteristics

| Feature        | Overhead     | Benefit                        |
| -------------- | ------------ | ------------------------------ |
| Caching        | ~1-2% memory | 50-90% speedup on repeats      |
| Analytics      | ~3-5% CPU    | Detailed insights, P95 metrics |
| Fingerprinting | ~10-15% CPU  | Service identification         |
| Rate Limiting  | Negligible   | Network stability              |
| Deduplication  | ~2-5% memory | Reduced scan count             |

## Best Practices

1. **Large Networks**: Use `--rate-limit` to prevent network congestion
2. **Repeated Scans**: Enable `--cache` to avoid redundant probes
3. **Service Discovery**: Combine `--fingerprint`, `--grab`, and `--filter`
4. **Monitoring**: Use `--analytics` with `--output json` for automated reporting
5. **Reliability**: Combine `--retries 3` with `--backoff-base 300` for unstable networks

## Extensibility

### Add Custom Service Signatures

```javascript
const fingerprinter = new ServiceFingerprintDB();
fingerprinter.addSignature(
  "custom-service",
  [9000, 9001],
  ["CustomProto", "v1.0"]
);
```

### Implement Custom Filters

```javascript
const filter = new QueryFilter();
filter.addFilter("custom", (result) => result.time < 50);
const filtered = filter.apply(results);
```
