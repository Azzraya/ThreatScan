# Quick Reference - New Advanced Features

## Essential Commands

### Service Discovery

```bash
node index.js 192.168.1.0/24 --fingerprint --port 22 --grab
```

Identifies SSH, HTTP, FTP, MySQL, and other services.

### Performance Analysis

```bash
node index.js 10.0.0.0/24 --analytics --output json
```

Generates RTT statistics, P95 latencies, and success rates.

### Efficient Large Scans

```bash
node index.js @targets.txt --cache --rate-limit 20 --deduplicate
```

Caches results, limits rate, removes duplicates.

### Filter Results

```bash
node index.js 192.168.1.0/24 --fingerprint --filter alive --output json
```

Shows only reachable hosts with services identified.

---

## New Classes & APIs

### CacheManager

```javascript
const cache = new CacheManager(3600000); // 1 hour TTL
cache.set("key", value);
const result = cache.get("key");
cache.stats(); // { size: N, ttl: 3600000 }
```

### ServiceFingerprintDB

```javascript
const fp = new ServiceFingerprintDB();
const service = fp.identify(banner, port);
// Returns: { service: 'ssh', confidence: 'high' }

// Add custom signatures
fp.addSignature("my-service", [8080, 9000], ["MyService", "v1"]);
```

### PerformanceAnalytics

```javascript
const analytics = new PerformanceAnalytics();
analytics.recordProbe(target, result, duration);
analytics.recordError(error);
const report = analytics.generateReport();
// { totalProbes, successful, failed, probeDuration, rttMetrics, errorRate }
```

### RateLimiter

```javascript
const limiter = new RateLimiter(50); // 50 req/sec
await limiter.acquire(); // Non-blocking wait
```

### QueryFilter

```javascript
const filter = new QueryFilter().alive().hasService("ssh").maxResponseTime(100);

const results = filter.apply(allResults);
filter.describe(); // Get filter summary
```

---

## Output Samples

### Analytics Report

```
=== ANALYTICS ===
Total probes: 256
Success rate: 87.50%
Probe duration: min=45ms, max=2000ms, avg=542.17ms
RTT P95: 1234ms
Retries: 12
```

### Service Summary

```
Services detected: ssh(48), http(32), mysql(8), postgresql(4)
```

### Cache Statistics

```
Cache stats: 187 entries cached
```

---

## Performance Tips

| Scenario               | Recommendation                     |
| ---------------------- | ---------------------------------- |
| Repeated scans         | Use `--cache`                      |
| Large networks         | Use `--rate-limit 20-50`           |
| Service identification | Use `--fingerprint --grab`         |
| Real-time monitoring   | Use `--analytics`                  |
| Clean data             | Use `--deduplicate --filter alive` |

---

## Exit Codes

- `0` - Success
- `1` - Fatal error

## Signal Handling

- `SIGINT` (Ctrl+C) - Saves partial results before exit

---

## Compatibility Notes

- ✅ Node.js 12+
- ✅ Works on Windows, macOS, Linux
- ✅ Backward compatible with all original options
- ✅ No new required dependencies

---
