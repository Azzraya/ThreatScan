# 📖 Advanced Host Discovery Tool v4.0 - Complete Reference Guide

## 🗺️ Command Reference by Category

### Basic Scanning

```bash
# Single target
node index.js 192.168.1.5

# Multiple targets
node index.js 192.168.1.5,192.168.1.10,192.168.1.15

# CIDR notation
node index.js 192.168.0.0/24

# IP range
node index.js 192.168.1.1-50

# From file
node index.js @targets.txt

# Multiple methods combined
node index.js 192.168.1.5 192.168.0.0/24 @extra.txt
```

### v2.0: Advanced Features

```bash
# Service fingerprinting
node index.js 192.168.0.0/24 --fingerprint

# Performance analytics
node index.js 192.168.0.0/24 --analytics

# Response caching (1-hour TTL)
node index.js 192.168.0.0/24 --cache

# Rate limiting (10 req/sec)
node index.js 192.168.0.0/24 --rate-limit 10

# Result filtering
node index.js 192.168.0.0/24 --filter alive

# Deduplication
node index.js 192.168.0.0/24 --deduplicate

# Detailed output
node index.js 192.168.0.0/24 --detailed
```

### v3.0: Enterprise Features

```bash
# Network topology analysis
node index.js 192.168.0.0/24 --topology

# Vulnerability scoring
node index.js 192.168.0.0/24 --vuln-score

# Historical trend analysis
node index.js 192.168.0.0/24 --trends

# ML feature extraction
node index.js 192.168.0.0/24 --ml-data
```

### v4.0: Autonomous AI Features

```bash
# Pattern correlation analysis
node index.js 192.168.0.0/24 --correlate

# Statistical anomaly detection
node index.js 192.168.0.0/24 --anomalies

# CIS compliance evaluation
node index.js 192.168.0.0/24 --compliance

# AI remediation recommendations
node index.js 192.168.0.0/24 --recommend
```

### Configuration Options

```bash
# Concurrency (default: 50)
node index.js 192.168.0.0/24 --concurrency 100

# Retries (default: 1)
node index.js 192.168.0.0/24 --retries 3

# Timeout in ms (default: 2000)
node index.js 192.168.0.0/24 --timeout 5000

# TCP port to check
node index.js 192.168.0.0/24 --port 8080

# Banner grabbing
node index.js 192.168.0.0/24 --grab

# Max hosts (default: 2000)
node index.js 192.168.0.0/24 --max-hosts 5000

# Verbose logging
node index.js 192.168.0.0/24 --verbose
```

### Output Options

```bash
# Text output (default)
node index.js 192.168.0.0/24 --output text

# JSON output
node index.js 192.168.0.0/24 --output json

# CSV output
node index.js 192.168.0.0/24 --output csv

# Save to file
node index.js 192.168.0.0/24 --out results.txt

# Partial results on interrupt
node index.js 192.168.0.0/24 --partial-out partial.json
```

---

## 🎯 Feature Matrix: All v4.0 Options

| Option           | Type   | Default | Example              | Purpose             |
| ---------------- | ------ | ------- | -------------------- | ------------------- |
| `--concurrency`  | Number | 50      | --concurrency 100    | Parallel probes     |
| `--retries`      | Number | 1       | --retries 3          | Retry attempts      |
| `--timeout`      | Number | 2000    | --timeout 5000       | Probe timeout (ms)  |
| `--port`         | Number | null    | --port 8080          | TCP port target     |
| `--grab`         | Flag   | false   | --grab               | Banner grab         |
| `--backoff-base` | Number | 200     | --backoff-base 500   | Retry backoff (ms)  |
| `--max-hosts`    | Number | 2000    | --max-hosts 5000     | Max target limit    |
| `--fingerprint`  | Flag   | false   | --fingerprint        | Service ID          |
| `--analytics`    | Flag   | false   | --analytics          | Performance metrics |
| `--cache`        | Flag   | false   | --cache              | Response caching    |
| `--rate-limit`   | Number | null    | --rate-limit 10      | Req/sec limit       |
| `--filter`       | String | null    | --filter alive       | Result filter       |
| `--detailed`     | Flag   | false   | --detailed           | Extended output     |
| `--deduplicate`  | Flag   | false   | --deduplicate        | Remove dups         |
| `--topology`     | Flag   | false   | --topology           | Network mapping     |
| `--vuln-score`   | Flag   | false   | --vuln-score         | Risk scoring        |
| `--trends`       | Flag   | false   | --trends             | Trend analysis      |
| `--ml-data`      | Flag   | false   | --ml-data            | ML features         |
| `--correlate`    | Flag   | false   | --correlate          | Pattern correlation |
| `--anomalies`    | Flag   | false   | --anomalies          | Anomaly detection   |
| `--compliance`   | Flag   | false   | --compliance         | CIS compliance      |
| `--recommend`    | Flag   | false   | --recommend          | AI recommendations  |
| `--output`       | String | text    | --output json        | Output format       |
| `--out`          | String | null    | --out file.txt       | Output file         |
| `--partial-out`  | String | null    | --partial-out p.json | Partial output      |
| `--verbose`      | Flag   | false   | --verbose            | Debug logging       |

---

## 🔍 Output Examples by System

### Basic Scan Output

```
Probing 256 targets (concurrency=50, retries=1, timeout=2000ms)...
Progress |████████████████████| 256/256 | ETA: 0s

192.168.1.1 -> alive (45 ms)
192.168.1.2 -> alive (52 ms) [ssh]
192.168.1.3 -> down
192.168.1.4 -> alive (38 ms) [http]

=== SUMMARY ===
Scanned: 256 results shown
Alive: 34 | Down: 222 | TCP Fallback: 0
RTT (ms): min=12, max=234, avg=48.50
Services detected: ssh(12), http(8), postgres(4)
```

### v2.0: Analytics Output

```
=== ANALYTICS ===
Total probes: 256
Success rate: 13.28%
Probe duration: min=45ms, max=2000ms, avg=234ms
RTT P95: 180ms
Retries: 0
```

### v3.0: Topology Output

```
=== NETWORK TOPOLOGY ===
Total nodes: 34
Total edges: 33
Network density: 0.0032
Subnets discovered: 1
  192.168.1.0/24: 34 hosts
```

### v3.0: Vulnerability Output

```
=== VULNERABILITY ASSESSMENT ===
High Risk: 4 | Medium Risk: 8 | Low Risk: 22
Avg Risk Score: 34.50
Top 5 Risk Hosts:
  192.168.1.50: 78.5/100 (high)
  192.168.1.45: 75.0/100 (high)
  192.168.1.40: 72.3/100 (high)
  192.168.1.35: 68.9/100 (high)
  192.168.1.30: 65.4/100 (high)
```

### v3.0: ML Data Output

```
=== ML FEATURE EXTRACTION ===
Total features extracted: 256
Features per instance: 10 (ml-ready format)
Alive percentage: 13.28%
Avg response time: 234.50ms
Avg risk score: 34.50
RTT Distribution: min=12ms, p95=180ms
```

### v4.0: Correlation Output

```
=== CORRELATION ANALYSIS ===
Patterns identified: 7
  avg_rtt: 45.23
  rtt_std_dev: 12.5
  rtt_outliers: 3
  service_ssh: 12
  service_http: 8
  port_distribution: {"22":12,"80":8,"443":2,"3306":1}
```

### v4.0: Anomaly Output

```
=== ANOMALY DETECTION ===
Baseline established: yes
Anomalies detected: 5
Top anomalies:
  192.168.1.45: slow (z-score: 2.8, time: 5234ms)
  192.168.1.67: fast (z-score: 3.1, time: 12ms)
  192.168.1.89: slow (z-score: 2.6, time: 4892ms)
Service anomaly groups: 3
```

### v4.0: Compliance Output

```
=== COMPLIANCE ASSESSMENT ===
Overall CIS Compliance Score: 71.4%
Compliance Level: good
Rules Passed: 5/7
Failed rules:
  [2.1] Enable service firewalls
  [3.1] Limit exposed services
```

### v4.0: Recommendations Output

```
=== AUTONOMOUS RECOMMENDATIONS ===
Total recommendations: 12
Critical: 2 | High: 4 | Medium: 6
Top priority actions:
  [CRITICAL] Never expose Docker socket to untrusted networks
  [CRITICAL] Enable MongoDB authentication and restrict network access
  [HIGH] Disable Telnet immediately, use SSH instead
  [HIGH] Restrict SSH access with firewall rules or VPN
  [HIGH] Restrict MySQL to internal networks only
```

---

## 🎯 Workflow Examples

### Workflow 1: Quick Compliance Check

```bash
# Single command for compliance status
node index.js @production.txt --compliance

# Output: Single compliance score and level
# Use for: Regulatory reporting, quarterly audits
```

### Workflow 2: Baseline Establishment

```bash
# Create baseline from known-good network
node index.js @baseline.txt --correlate --anomalies --output json > baseline.json

# Store for future comparisons
# Use for: Anomaly detection, drift detection
```

### Workflow 3: Comprehensive Audit

```bash
# Full analysis with all features
node index.js 10.0.0.0/8 \
  --fingerprint --analytics --cache \
  --topology --vuln-score \
  --correlate --anomalies --compliance --recommend \
  --output json --out audit-report.json

# Complete enterprise-grade security assessment
# Use for: Annual security reviews, executive reporting
```

### Workflow 4: Continuous Monitoring

```bash
# Daily scan with anomaly detection
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
node index.js @network.txt --anomalies --trends \
  --output json --out results_${TIMESTAMP}.json

# Compare results against baseline
# Alert on anomalies, track trends
```

### Workflow 5: Incident Response

```bash
# Rapid assessment of compromised network
node index.js @suspected-segment.txt \
  --fingerprint --analytics --correlate \
  --anomalies --recommend --detailed \
  --output json --out incident-report.json

# Quick pattern detection, anomaly identification
# Actionable remediation steps
```

---

## 🔐 CIS Compliance Rules (v4.0)

| Rule ID | Rule Name                     | Check                              | Weight |
| ------- | ----------------------------- | ---------------------------------- | ------ |
| 1.1     | Inventory all network devices | Results > 0                        | 10%    |
| 2.1     | Enable service firewalls      | No [22,23,3306,5432] exposed       | 15%    |
| 3.1     | Limit exposed services        | Services < 50% of hosts            | 20%    |
| 4.1     | Monitor response times        | <10% hosts with RTT > 5s           | 15%    |
| 5.1     | Maintain service redundancy   | Services appear on multiple hosts  | 15%    |
| 6.1     | No unnecessary services       | No [21,23] (FTP, Telnet)           | 15%    |
| 7.1     | Regular assessments           | Assessment completed (Results > 0) | 10%    |

**Compliance Levels:**

- ✅ **Excellent**: 80-100%
- ✅ **Good**: 60-79%
- ⚠️ **Fair**: 40-59%
- ❌ **Poor**: 0-39%

---

## 🚀 Performance Tuning

**For speed (small networks):**

```bash
node index.js 192.168.0.0/24 \
  --concurrency 200 --retries 0 --timeout 1000
```

**For accuracy (large networks):**

```bash
node index.js 10.0.0.0/8 \
  --concurrency 50 --retries 2 --timeout 5000 \
  --cache --rate-limit 5
```

**For comprehensive analysis (audit):**

```bash
node index.js 10.0.0.0/8 \
  --concurrency 50 --retries 1 --timeout 3000 \
  --fingerprint --analytics --topology \
  --vuln-score --correlate --anomalies --compliance
```

---

## 📝 JSON Output Schema

**Basic Result:**

```json
{
  "target": "192.168.1.5",
  "alive": true,
  "time": 45,
  "service": {
    "service": "ssh",
    "confidence": "high"
  },
  "riskScore": 55,
  "riskLevel": "medium"
}
```

**v4.0 Complete Result:**

```json
{
  "target": "192.168.1.5",
  "alive": true,
  "time": 45,
  "service": { "service": "ssh", "confidence": "high" },
  "riskScore": 55,
  "riskLevel": "medium",
  "probeDuration": 48,
  "tcpFallback": false,
  "isAlive": 1,
  "hasService": 1,
  "responseTime": 45,
  "serviceHash": 142,
  "bannerLength": 24,
  "isTcpFallback": 0
}
```

---

## 🎓 Advanced Tips

1. **Combine filters for precision:**

   ```bash
   node index.js 192.168.0.0/24 --filter alive --fingerprint --detailed
   ```

2. **Use caching for repeated scans:**

   ```bash
   node index.js @targets.txt --cache --output json
   # Second run much faster
   ```

3. **Export for external tools:**

   ```bash
   node index.js 192.168.0.0/24 --output csv | \
   awk -F, '{print $1, $3}' | sort
   ```

4. **Continuous monitoring script:**

   ```bash
   while true; do
     node index.js @network.txt --anomalies --trends
     sleep 3600  # Every hour
   done
   ```

5. **Compliance trending:**
   ```bash
   for i in {1..7}; do
     echo "=== Day $i ==="
     node index.js @prod.txt --compliance
     sleep 86400
   done
   ```

---

**Command Reference Complete** ✅
