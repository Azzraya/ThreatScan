# Enterprise & AI-Ready Features (v3.0)

## New v3.0 Enterprise Systems

### 1. Network Topology Mapper

**Maps network structure and relationships**

```bash
node index.js 192.168.1.0/24 --topology
```

**Features:**

- Subnet detection and grouping
- Network node mapping
- Edge relationship tracking
- Topology statistics
- Network density calculation

**Output:**

```
=== NETWORK TOPOLOGY ===
Total nodes: 45
Total edges: 44
Network density: 0.0012
Subnets discovered: 1
  192.168.1.0/24: 45 hosts
```

**Use Cases:**

- Network layout visualization
- Redundancy analysis
- Network optimization
- Multi-tier architecture mapping

---

### 2. Vulnerability Scoring Engine

**Calculates risk scores for discovered hosts**

```bash
node index.js 192.168.1.0/24 --vuln-score --fingerprint
```

**Scoring Factors:**

- Service exposure risk (exposed ports)
- Response time anomalies
- Unusual port usage
- Service fingerprinting data

**Risk Levels:**

- Low: 0-30
- Medium: 30-60
- High: 60-100

**Output:**

```
=== VULNERABILITY ASSESSMENT ===
High Risk: 5 | Medium Risk: 12 | Low Risk: 28
Avg Risk Score: 34.2
Top 5 Risk Hosts:
  192.168.1.50: 87.5/100 (high)
  192.168.1.51: 72.3/100 (high)
```

**Use Cases:**

- Security assessment
- Risk prioritization
- Compliance scanning
- Threat modeling

---

### 3. Historical Trend Analyzer

**Tracks network changes over time**

```bash
node index.js @targets.txt --trends
```

**Tracks:**

- Host uptime changes
- Service appearance/disappearance
- Response time trends
- Network capacity changes

**Output:**

```
=== NETWORK TRENDS ===
Snapshot time: 2025-11-15T10:30:00Z
Total hosts: 256
Alive hosts: 187 (73.05%)
Avg response time: 54.2ms
Services found: 8
```

**Use Cases:**

- Network monitoring
- Anomaly detection
- Capacity planning
- SLA tracking

---

### 4. Machine Learning Feature Extractor

**Generates ML-ready feature vectors**

```bash
node index.js 192.168.1.0/24 --ml-data --analytics
```

**Features Extracted (per host):**

1. `isAlive` - Binary (0/1)
2. `hasService` - Binary (0/1)
3. `port` - Integer
4. `responseTime` - Milliseconds
5. `hasError` - Binary (0/1)
6. `riskScore` - 0-100
7. `serviceHash` - Numeric hash
8. `bannerLength` - Character count
9. `probeDuration` - Milliseconds
10. `isTcpFallback` - Binary (0/1)

**Statistics Generated:**

- Alive percentage
- Average response time
- Risk distribution
- Service distribution
- Response time percentiles (P75, P95)

**Output:**

```
=== ML FEATURE EXTRACTION ===
Total features extracted: 256
Features per instance: 10 (ml-ready format)
Alive percentage: 73.05%
Avg response time: 54.2ms
Avg risk score: 34.2
RTT Distribution: min=5ms, p95=234ms
```

**Use Cases:**

- Anomaly detection models
- Network health prediction
- Automated classification
- Pattern recognition
- Time-series forecasting

---

## Combined v3.0 Usage Examples

### Full Security Assessment

```bash
node index.js 10.0.0.0/16 \
  --fingerprint \
  --analytics \
  --vuln-score \
  --topology \
  --output json \
  --out security_report.json \
  --rate-limit 30
```

Generates:

- Service identification
- Risk scores for all hosts
- Network topology
- Performance metrics
- Complete JSON report

### Network Health Monitoring

```bash
node index.js @critical_nets.txt \
  --trends \
  --analytics \
  --cache \
  --output json \
  --out health_snapshot.json
```

Generates:

- Trend snapshots
- Health metrics
- Cached results for efficiency
- JSON for automation

### ML Model Training Dataset

```bash
node index.js 192.168.0.0/16 \
  --ml-data \
  --fingerprint \
  --vuln-score \
  --deduplicate \
  --output json \
  --out training_data.json
```

Generates:

- Feature vectors ready for ML
- Risk labels
- Service identification
- Clean, deduplicated data

### Complete Enterprise Scan

```bash
node index.js @all_subnets.txt \
  --fingerprint \
  --analytics \
  --cache \
  --rate-limit 50 \
  --vuln-score \
  --topology \
  --trends \
  --ml-data \
  --concurrency 100 \
  --output json \
  --out enterprise_report.json
```

Complete insights:

- All enterprise features enabled
- High concurrency for large networks
- Rate limiting for stability
- JSON for integration
- Comprehensive reporting

---

## Architecture Integration

### Data Flow with V3.0

```
Probe Results
    ↓
Service Fingerprinting (v2)
    ↓
Risk Scoring (v3)
    ├─→ Topology Mapping
    ├─→ Trend Analysis
    └─→ ML Feature Extraction
    ↓
Combined Output Report
```

### Feature Interactions

**Topology + Vulnerability Scoring:**

- Identifies risky subnets
- Highlights critical infrastructure
- Maps attack surfaces

**Trends + Analytics:**

- Detects service changes
- Tracks uptime patterns
- Identifies anomalies

**ML Data + All Features:**

- Rich feature vectors
- Context for models
- Actionable insights

---

## Performance Metrics

| Feature    | Overhead | Benefit               |
| ---------- | -------- | --------------------- |
| Topology   | ~2% CPU  | Network visualization |
| Vuln Score | ~5% CPU  | Risk assessment       |
| Trends     | ~1% CPU  | Change detection      |
| ML Data    | ~3% CPU  | Model readiness       |
| Combined   | ~11% CPU | Complete insights     |

---

## Advanced Use Cases

### 1. Automated Security Audits

```bash
for subnet in $(cat subnets.txt); do
  node index.js "$subnet" \
    --vuln-score \
    --fingerprint \
    --output json \
    --out "audit_${subnet}.json"
done
```

### 2. Continuous Network Monitoring

```bash
while true; do
  node index.js @critical_hosts.txt \
    --trends \
    --cache \
    --output json \
    --out snapshot_$(date +%s).json
  sleep 3600
done
```

### 3. ML Model Training Pipeline

```bash
node index.js 10.0.0.0/8 \
  --ml-data \
  --vuln-score \
  --output json \
  > training_dataset.json

# Then use training_dataset.json with your ML framework
python train_model.py training_dataset.json
```

### 4. Network Change Detection

```bash
# Baseline
node index.js @targets.txt --trends --output json --out baseline.json

# Later scan
node index.js @targets.txt --trends --output json --out current.json

# Compare (custom script)
node compare.js baseline.json current.json
```

---

## Integration with External Systems

### JSON Export for Data Lakes

```bash
node index.js 192.168.0.0/16 \
  --ml-data \
  --vuln-score \
  --topology \
  --output json \
  --out scan_data.json

# Import to data lake
aws s3 cp scan_data.json s3://data-lake/network-scans/
```

### Webhook Integration

```bash
node index.js @targets.txt \
  --vuln-score \
  --output json | \
  curl -X POST -d @- https://api.example.com/webhooks/scan
```

### Database Insert

```bash
node index.js 192.168.1.0/24 \
  --fingerprint \
  --analytics \
  --output json | \
  jq '.' | \
  mongoimport --db network --collection scans
```

---

## Extensibility

### Custom Risk Scoring

Extend `VulnerabilityScorer` with additional factors:

```javascript
// Add industry-specific scoring
const customWeights = {
  pciDss: 0.35,
  hipaa: 0.25,
  ...existingWeights,
};
```

### Custom Trend Metrics

Add to `TrendAnalyzer`:

```javascript
// Track custom metrics
recordCustomMetric(name, value);
detectCustomTrends();
```

### Custom ML Features

Extend `MLFeatureExtractor`:

```javascript
// Add domain-specific features
extractCustomFeatures(result);
generateCustomDataset();
```

---

## Output Examples

### Vulnerability Score JSON

```json
{
  "target": "192.168.1.50",
  "alive": true,
  "service": { "service": "ssh", "confidence": "high" },
  "riskScore": 87.5,
  "riskLevel": "high",
  "factors": {
    "exposedPort": true,
    "anomalousRTT": false,
    "unusualPort": false
  }
}
```

### Topology JSON

```json
{
  "totalNodes": 45,
  "totalEdges": 44,
  "density": 0.0012,
  "subnets": [
    {
      "subnet": "192.168.1.0/24",
      "nodeCount": 45,
      "ips": ["192.168.1.1", ...]
    }
  ]
}
```

### ML Features JSON

```json
{
  "target": "192.168.1.50",
  "isAlive": 1,
  "hasService": 1,
  "port": 22,
  "responseTime": 15,
  "riskScore": 87.5,
  "bannerLength": 24,
  "probeDuration": 145
}
```

---

## Enterprise Deployment

### Kubernetes Integration

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: network-scan
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: scanner
              image: network-discovery:v3
              args: ["--ml-data", "--vuln-score", "--topology"]
```

### Terraform Provisioning

```hcl
resource "aws_lambda_function" "network_scanner" {
  filename = "scanner.zip"
  handler  = "index.handler"
  runtime  = "nodejs18.x"

  environment {
    variables = {
      FLAGS = "--vuln-score --topology --ml-data"
    }
  }
}
```

---

## Roadmap

### v3.1 (Planned)

- [ ] Graph database export (Neo4j)
- [ ] GeoIP integration
- [ ] Service version detection
- [ ] CVE integration

### v3.2 (Planned)

- [ ] Real-time correlation
- [ ] Threat intelligence feeds
- [ ] Custom risk models
- [ ] API server mode

### v3.3 (Planned)

- [ ] Web UI dashboard
- [ ] Multi-agent scanning
- [ ] Advanced ML models
- [ ] Automated remediation

---

## Summary

**v3.0 adds enterprise-grade features:**

- 🗺️ Network topology mapping
- ⚠️ Vulnerability scoring
- 📊 Historical trend analysis
- 🤖 ML-ready feature extraction

**Perfect for:**

- Security teams
- Network engineers
- Data scientists
- Compliance auditors
- System administrators
