# v5.0 Integration & Operations Guide

## Quick Start

```bash
# Activate all v5.0 threat detection systems
node index.js <target_network> --predict --threats --network --orchestrate

# Example: Scan your local network for threats
node index.js 192.168.1.1-254 --threats --network

# Example: Predict uptime and get recommendations
node index.js 192.168.1.1-254 --predict

# Example: Full security analysis with JSON output
node index.js 192.168.1.1-254 \
  --predict --threats --network --orchestrate \
  --json --stats
```

---

## Feature Flags (v5.0)

### `--predict`

Activates **PredictiveAnalyzer** - forecasts uptime and service stability

- Output Section: `=== PREDICTIVE ANALYTICS ===`
- Captures: Predicted uptime %, trend (improving/declining/stable), confidence %, service volatility
- Use Case: Infrastructure capacity planning, SLA compliance prediction

### `--threats`

Activates **ThreatDetector** - scans for exploitable vulnerabilities

- Output Section: `=== THREAT DETECTION ===`
- Captures: Threat score (0-100), threat level (LOW/MEDIUM/HIGH/CRITICAL), threat list
- Use Case: Pre-incident threat hunting, vulnerability management

### `--network`

Activates **AdvancedNetworkMapper** - maps topology and clusters vulnerabilities

- Output Section: `=== ADVANCED NETWORK ANALYSIS ===`
- Captures: Subnet breakdown, service density, vulnerable host locations
- Use Case: Network segmentation planning, attack surface analysis

### `--orchestrate`

Activates **SecurityOrchestrator** - generates automated response playbooks

- Output Section: `=== SECURITY ORCHESTRATION ===`
- Captures: Workflows, execution steps, failsafe mechanisms
- Use Case: Incident response automation, SOC playbook generation

---

## Output Format Examples

### Predictive Analytics Output

```
=== PREDICTIVE ANALYTICS ===
Predicted Uptime: 92.3%
Trend: improving (+2.1% over last 5 snapshots)
Confidence: 88%
Service Volatility: 0.8 (stable services)
```

### Threat Detection Output

```
=== THREAT DETECTION ===
Overall Threat Score: 65.0/100
Threat Level: HIGH
Total Threats Detected: 4

[1] CRITICAL: Exposed Legacy Service (25 pts)
    Host: 192.168.1.100:445 (SMB)
    Risk: Ransomware propagation & lateral movement

[2] CRITICAL: Exposed Legacy Service (25 pts)
    Host: 192.168.1.100:135 (RPC)
    Risk: Remote code execution & privilege escalation

[3] HIGH: Network Anomaly (15 pts)
    Affected: 192.168.1.50
    RTT Variance: 45ms → 850ms
    Indicator: Possible DDoS or routing hijacking

[4] MEDIUM: High Service Concentration (5 pts)
    Host: 192.168.1.100 (6 services)
    Risk: Exploitation target / lateral movement hub
```

### Advanced Network Analysis Output

```
=== ADVANCED NETWORK ANALYSIS ===
Total Subnets: 2
Total Alive Hosts: 12
Vulnerable Hosts: 3

Subnet: 192.168.1.0/24
  ├─ Hosts: 8 (3 vulnerable)
  ├─ Service Density: 2.4 services/host
  ├─ Risk Level: HIGH
  └─ Vulnerable Hosts: 192.168.1.50, 192.168.1.100, 192.168.1.200

Subnet: 192.168.2.0/24
  ├─ Hosts: 4 (0 vulnerable)
  ├─ Service Density: 1.1 services/host
  ├─ Risk Level: LOW
  └─ Vulnerable Hosts: None
```

### Security Orchestration Output

```
=== SECURITY ORCHESTRATION ===
Workflows Generated: 2

[1] ISOLATE_COMPROMISED_HOSTS
    Priority: CRITICAL
    Severity: HIGH_THREAT_DETECTED
    Execution Order: 1

    Steps:
      → Block SMB traffic to/from 192.168.1.100
      → Increase logging verbosity on 192.168.1.100
      → Capture network traffic for 1 hour
      → Alert security team (immediate escalation)
      → Preserve forensic evidence

[2] ENHANCED_MONITORING
    Priority: HIGH
    Severity: MEDIUM_THREAT_DETECTED
    Execution Order: 2

    Steps:
      → Enable packet capture on 192.168.1.0/24
      → Monitor for lateral movement patterns
      → Log all service discovery attempts
      → Daily threat report generation

Failsafe Mechanisms:
  ✓ human_verification_required (all CRITICAL actions need SOC approval)
  ✓ rollback_capability (changes reversible for 24 hours)
  ✓ monitoring_enabled (continuous verification of effectiveness)
```

---

## Integration Scenarios

### Scenario 1: Daily Threat Assessment

```bash
# Run every morning to check overnight threats
node index.js corp-network.txt --threats --network --json > threat_report_$(date +%Y%m%d).json

# Parse results for critical threats
if grep -q "CRITICAL" threat_report_*.json; then
  # Send alert to security team
  echo "CRITICAL threats detected" | mail -s "Alert" security@company.com
fi
```

### Scenario 2: Capacity Planning

```bash
# Weekly uptime prediction for SLA compliance
node index.js 192.168.0.0/16 --predict --stats

# Export predictions for BI tools
node index.js 192.168.0.0/16 --predict --json | jq '.predictiveAnalytics' > uptime_forecast.json
```

### Scenario 3: Incident Response Automation

```bash
# Immediate threat assessment + response generation
node index.js compromised-network.txt \
  --threats --network --orchestrate \
  --json > incident_response_plan.json

# Execute response playbook (requires manual approval)
# Automated response steps shown in orchestrate output
```

### Scenario 4: SIEM Integration

```bash
# Export all data for SIEM consumption
node index.js 192.168.0.0/16 \
  --scan --stats \
  --predict --threats --network --orchestrate \
  --json | jq '.threatDetection, .advancedNetworkAnalysis' > siem_feed.json

# Send to SIEM via REST API
curl -X POST https://siem.company.com/api/events \
  -H "Authorization: Bearer TOKEN" \
  -d @siem_feed.json
```

---

## Performance Considerations

### Resource Usage

- **Memory**: ~20 MB for 1000-host network (v5.0 adds ~8 MB)
- **CPU**: Single-threaded scanning + v5.0 analysis
- **Network I/O**: ~1 packet per target host + banners

### Optimization Tips

1. **Use `--threads` flag** for parallelization

   ```bash
   node index.js 192.168.0.0/16 --threads 100 --threats
   ```

2. **Filter targets before scanning**

   ```bash
   node index.js 192.168.1.0/24 --query "online" --threats
   ```

3. **Use JSON output for SIEM** (smaller than stdout)

   ```bash
   node index.js targets --threats --json > threats.json
   ```

4. **Run v5.0 selectively**

   ```bash
   # Quick scan: no v5.0
   node index.js targets --scan

   # Threat check only: focused analysis
   node index.js targets --threats

   # Deep analysis: all systems
   node index.js targets --predict --threats --network --orchestrate
   ```

---

## Backward Compatibility Matrix

| Feature                    | v1  | v2  | v3  | v4  | v5  | Notes                            |
| -------------------------- | --- | --- | --- | --- | --- | -------------------------------- |
| Ping/TCP discovery         | ✓   | ✓   | ✓   | ✓   | ✓   | Core functionality               |
| Service fingerprinting     | ✓   | ✓   | ✓   | ✓   | ✓   | Works with v5.0 threat detection |
| Performance analytics      | —   | ✓   | ✓   | ✓   | ✓   | Enhanced in v5.0                 |
| Enterprise topology        | —   | —   | ✓   | ✓   | ✓   | Integrated with v5.0 mapper      |
| Autonomous recommendations | —   | —   | —   | ✓   | ✓   | Combined with v5.0 orchestration |
| Threat detection           | —   | —   | —   | —   | ✓   | New in v5.0                      |
| Service forecasting        | —   | —   | —   | —   | ✓   | New in v5.0                      |
| Response orchestration     | —   | —   | —   | —   | ✓   | New in v5.0                      |

✅ **All v1-4 features work seamlessly with v5.0**

---

## Troubleshooting

### No threats detected

- **Expected**: Zero threats on localhost with no legacy services
- **Check**: Scan real networks with exposed services
- **Verify**: Threat detection algorithm by checking output

```bash
# Should show LOW threat level
node index.js localhost --threats --stats

# Will show MEDIUM/HIGH on risky networks
node index.js 192.168.1.0/24 --threats --stats
```

### Low uptime predictions

- **Cause**: Initial data (requires multiple snapshots)
- **Solution**: Run multiple scans to build time series
- **Note**: Confidence increases as more data collected

### Empty orchestration playbooks

- **Expected**: Normal operation is minimal workflows
- **Check**: Run with `--threats` to generate threat-based playbooks

```bash
# Generates minimal workflows (normal state)
node index.js localhost --orchestrate

# Generates threat-based playbooks
node index.js localhost --threats --orchestrate
```

---

## Advanced Configuration

### Custom Target Lists

```bash
# From file
node index.js @targets.txt --threats

# From CIDR
node index.js 192.168.0.0/16 --threats

# From comma-separated
node index.js "192.168.1.1,192.168.1.100,10.0.0.1" --threats
```

### Scheduling (Linux/Mac)

```bash
# Crontab entry: Run every 6 hours
0 */6 * * * node /path/to/index.js corp-network --threats --json >> /logs/threats.log 2>&1
```

### Scheduling (Windows)

```batch
REM Task Scheduler: Run daily at 2 AM
powershell -Command "& {node C:\scripts\index.js corp-network --threats --json | Tee-Object -FilePath C:\logs\threats-$(Get-Date -Format yyyyMMdd).log}"
```

---

## Success Metrics

**v5.0 is working correctly if**:

1. ✅ `--predict` shows uptime % and trend
2. ✅ `--threats` calculates threat score (0-100)
3. ✅ `--network` maps subnets and clusters
4. ✅ `--orchestrate` generates playbooks
5. ✅ All features work independently OR combined
6. ✅ No syntax errors on `node -c index.js`
7. ✅ All v1-4 features still functional

---

## Support & Documentation

- **Feature Reference**: See `V5_SHOWCASE.md`
- **System Architecture**: See `ARCHITECTURE.md`
- **Quick Reference**: See `QUICK_REFERENCE.md`
- **Version History**: See `CHANGELOG.md`
- **Enterprise Features**: See `V3_ENTERPRISE_FEATURES.md`

---

## Next Steps

1. **Run your first scan**:

   ```bash
   node index.js localhost --predict --threats --network --orchestrate
   ```

2. **Review threat detection** in your network:

   ```bash
   node index.js your-network.txt --threats --stats
   ```

3. **Export to SIEM/Dashboard**:

   ```bash
   node index.js targets --predict --threats --network --json > security_report.json
   ```

4. **Automate periodic scans** (cron/Task Scheduler)

5. **Integrate response workflows** with your SOC

---

**v5.0 - Intelligent Threat Detection | Production Ready**
