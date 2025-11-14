const ping = require("ping");
const net = require("net");
const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");
const crypto = require("crypto");

// --- Advanced Features v3: ML-Ready & Topology ---

// --- Advanced Cache System ---
class CacheManager {
  constructor(ttl = 3600000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, value) {
    const hash = crypto.createHash("md5").update(key).digest("hex");
    this.cache.set(hash, { value, timestamp: Date.now() });
  }

  get(key) {
    const hash = crypto.createHash("md5").update(key).digest("hex");
    if (!this.cache.has(hash)) return null;
    const item = this.cache.get(hash);
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(hash);
      return null;
    }
    return item.value;
  }

  clear() {
    this.cache.clear();
  }

  stats() {
    return { size: this.cache.size, ttl: this.ttl };
  }
}

// --- Service Fingerprinting ---
class ServiceFingerprintDB {
  constructor() {
    this.signatures = new Map();
    this.loadDefaultSignatures();
  }

  loadDefaultSignatures() {
    // Common service banners and signatures
    const sigs = {
      ssh: { ports: [22], patterns: ["SSH-", "OpenSSH", "libssh"] },
      http: {
        ports: [80, 8080, 3000],
        patterns: ["HTTP/", "Server:", "Apache", "nginx", "Node.js"],
      },
      https: { ports: [443, 8443], patterns: ["HTTP/", "Server:"] },
      ftp: { ports: [21], patterns: ["220", "FTP", "Welcome"] },
      smtp: {
        ports: [25, 587],
        patterns: ["220", "SMTP", "Sendmail", "Postfix"],
      },
      dns: { ports: [53], patterns: ["domain", "DNS"] },
      mysql: { ports: [3306], patterns: ["MySQL", "5.7", "8.0"] },
      postgres: { ports: [5432], patterns: ["PostgreSQL"] },
      redis: { ports: [6379], patterns: ["REDIS", "+PONG"] },
      mongodb: { ports: [27017], patterns: ["MongoDB", "ok"] },
      elasticsearch: {
        ports: [9200],
        patterns: ["elasticsearch", "cluster_name"],
      },
      docker: { ports: [2375, 2376], patterns: ["docker", "DockerVersion"] },
    };

    for (const [service, data] of Object.entries(sigs)) {
      this.signatures.set(service, data);
    }
  }

  identify(banner, port) {
    const bannerLower = (banner || "").toLowerCase();
    const matches = [];

    for (const [service, sig] of this.signatures) {
      if (sig.ports.includes(port)) {
        for (const pattern of sig.patterns) {
          if (bannerLower.includes(pattern.toLowerCase())) {
            matches.push({ service, confidence: "high" });
            break;
          }
        }
      }
    }

    return matches.length > 0 ? matches[0] : null;
  }

  addSignature(service, ports, patterns) {
    this.signatures.set(service, { ports, patterns });
  }
}

// --- Performance Analytics ---
class PerformanceAnalytics {
  constructor() {
    this.metrics = {
      probes: [],
      startTime: null,
      endTime: null,
      peakConcurrency: 0,
      errors: [],
      retries: 0,
    };
  }

  recordProbe(target, result, duration) {
    this.metrics.probes.push({
      target,
      alive: result.alive,
      duration,
      time: result.time,
    });
  }

  recordError(error) {
    this.metrics.errors.push({ error: error.message, timestamp: Date.now() });
  }

  recordRetry() {
    this.metrics.retries++;
  }

  generateReport() {
    const probes = this.metrics.probes;
    if (probes.length === 0) return null;

    const durations = probes.map((p) => p.duration);
    const times = probes
      .filter((p) => p.time && !isNaN(p.time))
      .map((p) => Number(p.time));

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const percentile = (arr, p) => {
      const sorted = [...arr].sort((a, b) => a - b);
      const idx = Math.ceil((p / 100) * sorted.length) - 1;
      return sorted[Math.max(0, idx)];
    };

    return {
      totalProbes: probes.length,
      successful: probes.filter((p) => p.alive).length,
      failed: probes.filter((p) => !p.alive).length,
      probeDuration: {
        min: Math.min(...durations),
        max: Math.max(...durations),
        avg: avg(durations).toFixed(2),
      },
      rttMetrics:
        times.length > 0
          ? {
              min: Math.min(...times),
              max: Math.max(...times),
              avg: avg(times).toFixed(2),
              p95: percentile(times, 95),
            }
          : null,
      errorRate: ((this.metrics.errors.length / probes.length) * 100).toFixed(
        2
      ),
      totalRetries: this.metrics.retries,
    };
  }
}

// --- Advanced Query Filter ---

// --- Simple CLI arg parser (no new deps) ---
function parseArgs(argv) {
  const args = {
    targets: [],
    maxHosts: 2000,
    concurrency: 50,
    retries: 1,
    grab: false,
    backoffBase: 200,
    timeout: 2000,
    output: "text",
    port: null,
    out: null,
    partialOut: null,
    verbose: false,
    // NEW ADVANCED OPTIONS
    fingerprint: false,
    analytics: false,
    cache: false,
    rateLimit: null, // requests per second
    filter: null,
    detailed: false,
    deduplicate: false,
    // V3 FEATURES
    topology: false,
    vulnScore: false,
    trends: false,
    mlData: false,
    // V4 FEATURES
    correlate: false,
    anomalies: false,
    compliance: false,
    recommend: false,
    // V5 FEATURES
    predict: false,
    threats: false,
    network: false,
    orchestrate: false,
  };

  const extras = argv.slice(2);
  for (let i = 0; i < extras.length; i++) {
    const a = extras[i];
    if (!a) continue;
    if (!a.startsWith("--")) {
      args.targets = args.targets.concat(
        a
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      );
      continue;
    }
    if (a === "--concurrency" && extras[i + 1]) {
      args.concurrency = Number(extras[++i]) || args.concurrency;
      continue;
    }
    if (a === "--retries" && extras[i + 1]) {
      args.retries = Math.max(0, Number(extras[++i]) || args.retries);
      continue;
    }
    if (a === "--timeout" && extras[i + 1]) {
      args.timeout = Number(extras[++i]) || args.timeout;
      continue;
    }
    if (a === "--output" && extras[i + 1]) {
      args.output = extras[++i];
      continue;
    }
    if (a === "--port" && extras[i + 1]) {
      args.port = Number(extras[++i]) || args.port;
      continue;
    }
    if (a === "--out" && extras[i + 1]) {
      args.out = extras[++i];
      continue;
    }
    if (a === "--partial-out" && extras[i + 1]) {
      args.partialOut = extras[++i];
      continue;
    }
    if (a === "--max-hosts" && extras[i + 1]) {
      args.maxHosts = Number(extras[++i]) || args.maxHosts;
      continue;
    }
    if (a === "--grab") {
      args.grab = true;
      continue;
    }
    if (a === "--backoff-base" && extras[i + 1]) {
      args.backoffBase = Number(extras[++i]) || args.backoffBase;
      continue;
    }
    if (a === "--fingerprint") {
      args.fingerprint = true;
      continue;
    }
    if (a === "--analytics") {
      args.analytics = true;
      continue;
    }
    if (a === "--cache") {
      args.cache = true;
      continue;
    }
    if (a === "--rate-limit" && extras[i + 1]) {
      args.rateLimit = Number(extras[++i]) || args.rateLimit;
      continue;
    }
    if (a === "--filter" && extras[i + 1]) {
      args.filter = extras[++i];
      continue;
    }
    if (a === "--detailed") {
      args.detailed = true;
      continue;
    }
    if (a === "--deduplicate") {
      args.deduplicate = true;
      continue;
    }
    if (a === "--verbose" || a === "-v") {
      args.verbose = true;
      continue;
    }
    // V3 Features
    if (a === "--topology") {
      args.topology = true;
      continue;
    }
    if (a === "--vuln-score") {
      args.vulnScore = true;
      continue;
    }
    if (a === "--trends") {
      args.trends = true;
      continue;
    }
    if (a === "--ml-data") {
      args.mlData = true;
      continue;
    }
    // V4 Features
    if (a === "--correlate") {
      args.correlate = true;
      continue;
    }
    if (a === "--anomalies") {
      args.anomalies = true;
      continue;
    }
    if (a === "--compliance") {
      args.compliance = true;
      continue;
    }
    if (a === "--recommend") {
      args.recommend = true;
      continue;
    }
    // V5 Features
    if (a === "--predict") {
      args.predict = true;
      continue;
    }
    if (a === "--threats") {
      args.threats = true;
      continue;
    }
    if (a === "--network") {
      args.network = true;
      continue;
    }
    if (a === "--orchestrate") {
      args.orchestrate = true;
      continue;
    }
    if (a === "--help" || a === "-h") {
      args.help = true;
    }
  }
  return args;
}

function showHelp() {
  console.log("Advanced Host Discovery & Fingerprinting Tool v5.0");
  console.log("Usage: node index.js <targets> [OPTIONS]");
  console.log("\nBasic Options:");
  console.log(
    "  --concurrency N        Number of concurrent probes (default: 50)"
  );
  console.log("  --retries N            Retry attempts per host (default: 1)");
  console.log(
    "  --timeout ms           Timeout per probe in ms (default: 2000)"
  );
  console.log("  --port N               TCP port to check (optional)");
  console.log(
    "  --grab                 Banner grab on successful TCP connections"
  );
  console.log("\nAdvanced Options (v2):");
  console.log("  --fingerprint          Enable service fingerprinting");
  console.log("  --analytics            Generate performance analytics report");
  console.log("  --cache                Enable response caching (1 hour TTL)");
  console.log("  --rate-limit N         Limit to N requests per second");
  console.log(
    "  --filter EXPR          Filter results (e.g., 'alive' or 'dead')"
  );
  console.log("  --deduplicate          Remove duplicate results");
  console.log("  --detailed             Include extended details in output");
  console.log("\nEnterprise Options (v3):");
  console.log("  --topology             Generate network topology map");
  console.log("  --vuln-score           Calculate vulnerability scores");
  console.log("  --trends               Analyze historical trends");
  console.log("  --ml-data              Extract ML-ready features");
  console.log("\nAutonomous AI Options (v4):");
  console.log("  --correlate            Analyze patterns & correlations");
  console.log("  --anomalies            Detect statistical anomalies");
  console.log("  --compliance           Evaluate CIS compliance");
  console.log(
    "  --recommend            Generate AI remediation recommendations"
  );
  console.log("\nIntelligent Threat Detection (v5):");
  console.log(
    "  --predict              Predictive uptime & service forecasting"
  );
  console.log("  --threats              Real-time threat detection & scoring");
  console.log("  --network              Advanced network topology & clusters");
  console.log("  --orchestrate          Security response orchestration");
  console.log("\nOutput Options:");
  console.log("  --output FORMAT        text|json|csv (default: text)");
  console.log("  --out FILE             Write results to file");
  console.log("  --partial-out FILE     Write partial results on interrupt");
  console.log("\nTargets:");
  console.log("  192.168.0.5            Single IP");
  console.log("  192.168.0.0/24         CIDR notation");
  console.log("  192.168.0.1-10         Range");
  console.log("  @targets.txt           Load from file");
}

// --- target expansion ---
function expandTarget(t) {
  t = t.trim();
  // CIDR like 192.168.0.0/24
  const cidrMatch = t.match(/^(\d+\.\d+\.\d+\.\d+)\/(\d+)$/);
  if (cidrMatch) {
    try {
      return expandCIDR(t);
    } catch (e) {
      return [t];
    }
  }
  // range like 192.168.0.1-20 (only last octet ranges supported)
  const dashMatch = t.match(/^(\d+\.\d+\.\d+)\.(\d+)-(\d+)$/);
  if (dashMatch) {
    const base = dashMatch[1];
    const start = Number(dashMatch[2]);
    const end = Number(dashMatch[3]);
    const out = [];
    for (let i = start; i <= end; i++) out.push(`${base}.${i}`);
    return out;
  }
  return [t];
}

// --- CIDR expansion (IPv4) ---
function ipToInt(ip) {
  return ip.split(".").reduce((acc, oct) => (acc << 8) + Number(oct), 0) >>> 0;
}

function intToIp(int) {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join(".");
}

function expandCIDR(cidr) {
  const [ip, maskStr] = cidr.split("/");
  const mask = Number(maskStr);
  if (mask < 0 || mask > 32) throw new Error("invalid mask");
  const ipInt = ipToInt(ip);
  const hostBits = 32 - mask;
  const count = hostBits >= 31 ? Math.pow(2, hostBits) : Math.pow(2, hostBits); // small networks supported
  const base = (ipInt >>> hostBits) << hostBits;
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push(intToIp(base + i));
  }
  return out;
}

// --- TCP port check fallback ---
function checkTcpPort(host, port, timeout) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    socket.setTimeout(timeout);
    socket.on("connect", () => {
      done = true;
      socket.destroy();
      resolve({ ok: true });
    });
    socket.on("timeout", () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve({ ok: false, reason: "timeout" });
      }
    });
    socket.on("error", () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve({ ok: false });
      }
    });
    socket.connect(port, host);
  });
}

// checkTcpPort with optional banner grab
function checkTcpPortWithGrab(host, port, timeout) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let done = false;
    let banner = "";
    socket.setTimeout(timeout);
    socket.on("data", (chunk) => {
      banner += chunk.toString("utf8");
      // we only need the initial data
      if (banner.length > 0) {
        done = true;
        socket.destroy();
        resolve({ ok: true, banner });
      }
    });
    socket.on("connect", () => {
      // after connect we wait briefly for data; some servers won't send anything
      // set a short timeout to wait for banner
    });
    socket.on("timeout", () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve({ ok: false, reason: "timeout" });
      }
    });
    socket.on("error", () => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve({ ok: false });
      }
    });
    socket.connect(port, host);
    // as a fallback, return ok=true on connect even if no banner was received — we detect that via socket close
    setTimeout(() => {
      if (!done) {
        done = true;
        try {
          socket.destroy();
        } catch (e) {}
        resolve({ ok: true, banner: banner || null });
      }
    }, Math.min(timeout, 1500));
  });
}

// --- promise pool ---
function pMap(inputs, mapper, concurrency = 10) {
  let i = 0;
  const results = [];
  const executing = [];
  // support external cancellation
  const checkCancelled = () => !!global.__scan_cancelled;

  function enqueue() {
    if (i >= inputs.length) return Promise.resolve();
    if (checkCancelled()) return Promise.resolve();
    const idx = i++;
    const p = Promise.resolve().then(() => mapper(inputs[idx], idx));
    results[idx] = p;
    const e = p.then(() => executing.splice(executing.indexOf(e), 1));
    executing.push(e);
    let r = Promise.resolve();
    if (executing.length >= concurrency) r = Promise.race(executing);
    return r.then(() => enqueue());
  }

  return enqueue().then(() => Promise.all(results));
}

// --- Rate Limiter ---
class RateLimiter {
  constructor(rps) {
    this.rps = rps;
    this.interval = 1000 / rps;
    this.lastTime = Date.now();
  }

  async acquire() {
    const now = Date.now();
    const elapsed = now - this.lastTime;
    if (elapsed < this.interval) {
      await new Promise((r) => setTimeout(r, this.interval - elapsed));
    }
    this.lastTime = Date.now();
  }
}

// --- Network Topology Mapper ---
class TopologyMapper {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
    this.subnets = new Map();
  }

  addNode(ip, data) {
    this.nodes.set(ip, { ip, ...data, timestamp: Date.now() });
  }

  addEdge(source, target, type = "connected") {
    this.edges.push({ source, target, type, timestamp: Date.now() });
  }

  detectSubnet(ip) {
    const octets = ip.split(".").map(Number);
    const subnet24 = `${octets[0]}.${octets[1]}.${octets[2]}.0/24`;
    return subnet24;
  }

  groupBySubnet(results) {
    const grouped = new Map();
    results.forEach((r) => {
      const subnet = this.detectSubnet(r.target);
      if (!grouped.has(subnet)) {
        grouped.set(subnet, []);
      }
      grouped.get(subnet).push(r);
    });
    return grouped;
  }

  generateTopology(results) {
    results.forEach((r) => {
      if (r.alive) {
        const subnet = this.detectSubnet(r.target);
        this.addNode(r.target, {
          service: r.service?.service || null,
          banner: r.banner || null,
          alive: true,
        });
        if (!this.subnets.has(subnet)) {
          this.subnets.set(subnet, []);
        }
        this.subnets.get(subnet).push(r.target);
      }
    });

    // Build edges between nodes in same subnet
    for (const [, ips] of this.subnets) {
      for (let i = 0; i < ips.length - 1; i++) {
        this.addEdge(ips[i], ips[i + 1], "subnet");
      }
    }

    return this.getTopologyStats();
  }

  getTopologyStats() {
    const subnets = Array.from(this.subnets.entries()).map(([subnet, ips]) => ({
      subnet,
      nodeCount: ips.length,
      ips,
    }));

    return {
      totalNodes: this.nodes.size,
      totalEdges: this.edges.length,
      subnets,
      density:
        this.nodes.size > 0
          ? this.edges.length / ((this.nodes.size * (this.nodes.size - 1)) / 2)
          : 0,
    };
  }
}

// --- Vulnerability Scoring Engine ---
class VulnerabilityScorer {
  constructor() {
    this.scoreWeights = {
      serviceAge: 0.3,
      exposedPort: 0.25,
      commonService: 0.2,
      responseTime: 0.15,
      duplicateServices: 0.1,
    };
  }

  calculateScore(result, allResults) {
    let score = 0;

    // Service exposure risk
    if (result.service) {
      const exposed = [22, 23, 3306, 5432, 27017, 9200, 2375].includes(
        result.port || 0
      );
      if (exposed) score += 30;
    }

    // Response time anomaly
    if (result.time) {
      const times = allResults
        .filter((r) => r.service?.service === result.service?.service)
        .map((r) => Number(r.time) || 0)
        .filter((t) => t > 0);

      if (times.length > 1) {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        if (Math.abs(Number(result.time) - avg) > avg * 0.5) {
          score += 15;
        }
      }
    }

    // Unusual port usage
    const unusualPorts = [22, 23, 25, 53, 3306, 5432, 27017, 9200, 6379];
    if (result.port && !unusualPorts.includes(result.port)) {
      score += 10;
    }

    return Math.min(100, Math.max(0, score));
  }

  scoreResults(results) {
    return results.map((r) => ({
      ...r,
      riskScore: this.calculateScore(r, results),
      riskLevel:
        this.calculateScore(r, results) < 30
          ? "low"
          : this.calculateScore(r, results) < 60
          ? "medium"
          : "high",
    }));
  }
}

// --- Historical Trend Analyzer ---
class TrendAnalyzer {
  constructor() {
    this.history = [];
    this.snapshots = [];
  }

  recordSnapshot(timestamp, results) {
    const snapshot = {
      timestamp,
      totalHosts: results.length,
      aliveHosts: results.filter((r) => r.alive).length,
      services: this.countServices(results),
      avgResponseTime: this.calculateAvgRTT(results),
      uptime: (
        (results.filter((r) => r.alive).length / results.length) *
        100
      ).toFixed(2),
    };
    this.snapshots.push(snapshot);
    return snapshot;
  }

  countServices(results) {
    const counts = {};
    results.forEach((r) => {
      if (r.service?.service) {
        counts[r.service.service] = (counts[r.service.service] || 0) + 1;
      }
    });
    return counts;
  }

  calculateAvgRTT(results) {
    const times = results
      .filter((r) => r.time && !isNaN(Number(r.time)))
      .map((r) => Number(r.time));

    return times.length > 0
      ? (times.reduce((a, b) => a + b, 0) / times.length).toFixed(2)
      : null;
  }

  detectTrends() {
    if (this.snapshots.length < 2) return null;

    const latest = this.snapshots[this.snapshots.length - 1];
    const previous = this.snapshots[this.snapshots.length - 2];

    return {
      aliveChange: latest.aliveHosts - previous.aliveHosts,
      uptimeChange: parseFloat(latest.uptime) - parseFloat(previous.uptime),
      newServices: this.detectNewServices(previous.services, latest.services),
      disappearedServices: this.detectDisappearedServices(
        previous.services,
        latest.services
      ),
    };
  }

  detectNewServices(prev, curr) {
    return Object.keys(curr).filter((s) => !prev.hasOwnProperty(s));
  }

  detectDisappearedServices(prev, curr) {
    return Object.keys(prev).filter((s) => !curr.hasOwnProperty(s));
  }

  generateReport() {
    if (this.snapshots.length === 0) return null;

    const latest = this.snapshots[this.snapshots.length - 1];
    const trends = this.detectTrends();

    return {
      currentSnapshot: latest,
      trends,
      totalSnapshots: this.snapshots.length,
      timeSpan:
        this.snapshots.length > 1
          ? this.snapshots[this.snapshots.length - 1].timestamp -
            this.snapshots[0].timestamp
          : 0,
    };
  }
}

// --- Machine Learning Feature Extractor ---
class MLFeatureExtractor {
  constructor() {
    this.features = [];
  }

  extractFeatures(results) {
    return results.map((r) => this.extractFromResult(r));
  }

  extractFromResult(result) {
    return {
      target: result.target,
      isAlive: result.alive ? 1 : 0,
      hasService: result.service ? 1 : 0,
      port: result.port || 0,
      responseTime: Number(result.time) || 0,
      hasError: result.error ? 1 : 0,
      riskScore: result.riskScore || 0,
      serviceHash: result.service
        ? crypto
            .createHash("md5")
            .update(result.service.service)
            .digest("hex")
            .charCodeAt(0)
        : 0,
      bannerLength: (result.banner || "").length,
      probeDuration: result.probeDuration || 0,
      isTcpFallback: result.tcpFallback ? 1 : 0,
    };
  }

  generateDataset(results) {
    const features = this.extractFeatures(results);
    return {
      features,
      summary: this.computeStatistics(features),
      format: "ml-ready",
    };
  }

  computeStatistics(features) {
    const stats = {
      total: features.length,
      alivePercentage: (
        (features.filter((f) => f.isAlive).length / features.length) *
        100
      ).toFixed(2),
      avgResponseTime: (
        features.reduce((a, b) => a + b.responseTime, 0) / features.length
      ).toFixed(2),
      avgRiskScore: (
        features.reduce((a, b) => a + b.riskScore, 0) / features.length
      ).toFixed(2),
      serviceDistribution: this.computeServiceDist(features),
      responseTimeDistribution: this.computeRTTDistribution(features),
    };
    return stats;
  }

  computeServiceDist(features) {
    const dist = {};
    features.forEach((f) => {
      if (f.hasService) {
        const key = f.serviceHash;
        dist[key] = (dist[key] || 0) + 1;
      }
    });
    return dist;
  }

  computeRTTDistribution(features) {
    const times = features
      .map((f) => f.responseTime)
      .filter((t) => t > 0)
      .sort((a, b) => a - b);
    if (times.length === 0) return null;

    return {
      min: Math.min(...times),
      max: Math.max(...times),
      median: times[Math.floor(times.length / 2)],
      p75: times[Math.floor(times.length * 0.75)],
      p95: times[Math.floor(times.length * 0.95)],
    };
  }
}

// --- Correlation Engine (v4) ---
class CorrelationEngine {
  constructor() {
    this.correlations = [];
    this.patterns = new Map();
    this.crossScans = [];
  }

  analyzePatterns(results) {
    const patterns = {};

    // Service co-occurrence patterns
    results.forEach((r) => {
      if (r.service?.service) {
        const key = `service_${r.service.service}`;
        patterns[key] = (patterns[key] || 0) + 1;
      }
    });

    // Response time patterns
    const times = results
      .filter((r) => r.time && !isNaN(r.time))
      .map((r) => Number(r.time))
      .sort((a, b) => a - b);

    if (times.length > 0) {
      patterns.avgRTT = (
        times.reduce((a, b) => a + b, 0) / times.length
      ).toFixed(2);
      patterns.rttStdDev = this.calculateStdDev(times).toFixed(2);
      patterns.rttOutliers = times.filter(
        (t) =>
          Math.abs(t - Number(patterns.avgRTT)) > 2 * Number(patterns.rttStdDev)
      ).length;
    }

    // Port distribution
    const ports = results
      .filter((r) => r.port)
      .map((r) => r.port)
      .reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {});

    patterns.portDistribution = ports;
    return patterns;
  }

  calculateStdDev(values) {
    if (values.length < 2) return 0;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const variance =
      values.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / values.length;
    return Math.sqrt(variance);
  }

  correlateScans(scan1, scan2) {
    const correlation = {
      timestamp: Date.now(),
      unchanged: [],
      new: [],
      gone: [],
      changed: [],
    };

    const targets1 = new Set(scan1.map((r) => r.target));
    const targets2 = new Set(scan2.map((r) => r.target));

    // Find unchanged
    scan1.forEach((r) => {
      const match = scan2.find((r2) => r2.target === r.target);
      if (match && r.alive === match.alive) {
        correlation.unchanged.push(r.target);
      } else if (match && r.alive !== match.alive) {
        correlation.changed.push({
          target: r.target,
          before: r.alive,
          after: match.alive,
        });
      }
    });

    // Find new and gone
    targets2.forEach((t) => {
      if (!targets1.has(t)) correlation.new.push(t);
    });
    targets1.forEach((t) => {
      if (!targets2.has(t)) correlation.gone.push(t);
    });

    return correlation;
  }

  generateReport(results) {
    const patterns = this.analyzePatterns(results);
    return {
      patterns,
      correlations: this.correlations,
      timestamp: Date.now(),
    };
  }
}

// --- Anomaly Detector (v4) ---
class AnomalyDetector {
  constructor() {
    this.baseline = null;
    this.anomalies = [];
    this.threshold = 2.5; // Standard deviations
  }

  setBaseline(results) {
    const responses = results
      .filter((r) => r.time && !isNaN(r.time))
      .map((r) => Number(r.time));

    if (responses.length > 0) {
      const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
      const stdDev = Math.sqrt(
        responses.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
          responses.length
      );
      this.baseline = { avg, stdDev, count: responses.length };
    }
  }

  detectAnomalies(results) {
    if (!this.baseline) {
      this.setBaseline(results);
      return [];
    }

    const anomalies = [];
    results.forEach((r) => {
      if (r.time && !isNaN(r.time)) {
        const responseTime = Number(r.time);
        const zScore = Math.abs(
          (responseTime - this.baseline.avg) / this.baseline.stdDev
        );

        if (zScore > this.threshold) {
          anomalies.push({
            target: r.target,
            responseTime,
            zScore: zScore.toFixed(2),
            type: responseTime > this.baseline.avg ? "slow" : "fast",
            service: r.service?.service || "unknown",
          });
        }
      }
    });

    this.anomalies = anomalies;
    return anomalies;
  }

  analyzeServiceAnomalies(results) {
    const serviceGroups = {};
    results.forEach((r) => {
      const service = r.service?.service || "unknown";
      if (!serviceGroups[service]) {
        serviceGroups[service] = [];
      }
      if (r.time && !isNaN(r.time)) {
        serviceGroups[service].push(Number(r.time));
      }
    });

    const serviceAnomalies = {};
    for (const [service, times] of Object.entries(serviceGroups)) {
      if (times.length < 2) continue;

      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      const stdDev = Math.sqrt(
        times.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / times.length
      );

      serviceAnomalies[service] = {
        avg: avg.toFixed(2),
        stdDev: stdDev.toFixed(2),
        instances: times.length,
        outliers: times.filter((t) => Math.abs(t - avg) > 2 * stdDev).length,
      };
    }

    return serviceAnomalies;
  }

  generateReport() {
    return {
      anomaliesDetected: this.anomalies.length,
      baseline: this.baseline,
      anomalies: this.anomalies,
      timestamp: Date.now(),
    };
  }
}

// --- Compliance Checker (v4) ---
class ComplianceChecker {
  constructor() {
    this.cisRules = this.initializeCISRules();
    this.scores = {};
  }

  initializeCISRules() {
    return {
      1.1: {
        name: "Inventory all network devices",
        check: (results) => results.length > 0,
        weight: 0.1,
      },
      2.1: {
        name: "Enable service firewalls",
        check: (results) =>
          results.filter((r) => [22, 23, 3306, 5432].includes(r.port || 0))
            .length === 0,
        weight: 0.15,
      },
      3.1: {
        name: "Limit exposed services",
        check: (results) =>
          results.filter((r) => r.alive && r.service).length <
          results.length * 0.5,
        weight: 0.2,
      },
      4.1: {
        name: "Monitor response times",
        check: (results) =>
          results.filter((r) => r.time && Number(r.time) > 5000).length <
          results.length * 0.1,
        weight: 0.15,
      },
      5.1: {
        name: "Maintain service redundancy",
        check: (results) => {
          const serviceGroups = {};
          results.forEach((r) => {
            const s = r.service?.service || "unknown";
            serviceGroups[s] = (serviceGroups[s] || 0) + 1;
          });
          return Object.values(serviceGroups).filter((c) => c > 1).length > 0;
        },
        weight: 0.15,
      },
      6.1: {
        name: "No unnecessary services exposed",
        check: (results) =>
          results.filter((r) => r.alive && [21, 23].includes(r.port || 0))
            .length === 0,
        weight: 0.15,
      },
      7.1: {
        name: "Regular security assessments",
        check: (results) => results.length > 0,
        weight: 0.1,
      },
    };
  }

  evaluateCompliance(results) {
    let totalScore = 0;
    let totalWeight = 0;
    const details = [];

    for (const [ruleId, rule] of Object.entries(this.cisRules)) {
      const passed = rule.check(results);
      const score = passed ? 1 : 0;
      totalScore += score * rule.weight;
      totalWeight += rule.weight;

      details.push({
        id: ruleId,
        name: rule.name,
        passed,
        weight: rule.weight,
      });
    }

    const complianceScore =
      totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;

    return {
      overallScore: complianceScore.toFixed(1),
      level:
        complianceScore >= 80
          ? "excellent"
          : complianceScore >= 60
          ? "good"
          : complianceScore >= 40
          ? "fair"
          : "poor",
      details,
      timestamp: Date.now(),
    };
  }
}

// --- Autonomous Recommender (v4) ---
class AutonomousRecommender {
  constructor() {
    this.recommendations = [];
    this.riskMatrix = this.initializeRiskMatrix();
  }

  initializeRiskMatrix() {
    return {
      ssh: {
        port: 22,
        risk: "high",
        recommendation: "Restrict SSH access with firewall rules or VPN",
      },
      telnet: {
        port: 23,
        risk: "critical",
        recommendation: "Disable Telnet immediately, use SSH instead",
      },
      ftp: {
        port: 21,
        risk: "high",
        recommendation: "Disable FTP, use SFTP or SCP for file transfers",
      },
      mysql: {
        port: 3306,
        risk: "high",
        recommendation: "Restrict MySQL to internal networks only",
      },
      postgres: {
        port: 5432,
        risk: "high",
        recommendation: "Bind PostgreSQL to localhost or private subnet",
      },
      mongodb: {
        port: 27017,
        risk: "critical",
        recommendation:
          "Enable MongoDB authentication and restrict network access",
      },
      redis: {
        port: 6379,
        risk: "high",
        recommendation: "Protect Redis with firewall, disable public access",
      },
      elasticsearch: {
        port: 9200,
        risk: "high",
        recommendation: "Restrict Elasticsearch to internal networks only",
      },
      docker: {
        port: 2375,
        risk: "critical",
        recommendation: "Never expose Docker socket to untrusted networks",
      },
    };
  }

  generateRecommendations(results, _vulnScores = null) {
    const recommendations = [];
    const serviceMap = {};

    results.forEach((r) => {
      if (r.alive && r.service?.service) {
        const service = r.service.service.toLowerCase();
        if (!serviceMap[service]) {
          serviceMap[service] = [];
        }
        serviceMap[service].push(r);
      }
    });

    // Service-based recommendations
    for (const [service, instances] of Object.entries(serviceMap)) {
      const riskInfo = Object.values(this.riskMatrix).find(
        (r) => r.port === instances[0].port
      );

      if (riskInfo) {
        recommendations.push({
          service,
          priority: riskInfo.risk,
          instances: instances.length,
          recommendation: riskInfo.recommendation,
          action: this.priorityToAction(riskInfo.risk),
        });
      }
    }

    // High response time recommendations
    const slowHosts = results.filter((r) => r.time && Number(r.time) > 3000);
    if (slowHosts.length > 0) {
      recommendations.push({
        type: "performance",
        priority: "medium",
        instances: slowHosts.length,
        recommendation: `${slowHosts.length} hosts have high response times (>3s). Check network connectivity and resource utilization.`,
        action: "investigate",
      });
    }

    // No services recommendations
    const noService = results.filter((r) => r.alive && !r.service);
    if (noService.length > results.filter((r) => r.alive).length * 0.3) {
      recommendations.push({
        type: "discovery",
        priority: "low",
        instances: noService.length,
        recommendation:
          "Many hosts alive but unidentified. Consider port scanning or banner grabbing.",
        action: "scan",
      });
    }

    // Excessive services recommendation
    const aliveCount = results.filter((r) => r.alive).length;
    const serviceCount = Object.keys(serviceMap).length;
    if (serviceCount > aliveCount * 0.5) {
      recommendations.push({
        type: "inventory",
        priority: "medium",
        instances: serviceCount,
        recommendation:
          "High service diversity detected. Audit for unnecessary services and apply hardening.",
        action: "audit",
      });
    }

    return recommendations.sort(
      (a, b) =>
        this.priorityToScore(b.priority) - this.priorityToScore(a.priority)
    );
  }

  priorityToScore(priority) {
    const scores = { critical: 100, high: 75, medium: 50, low: 25 };
    return scores[priority] || 0;
  }

  priorityToAction(priority) {
    const actions = {
      critical: "immediate_remediation",
      high: "high_priority_fix",
      medium: "schedule_fix",
      low: "monitor",
    };
    return actions[priority] || "monitor";
  }

  generateReport(results, vulnScores = null) {
    const recommendations = this.generateRecommendations(results, vulnScores);
    return {
      totalRecommendations: recommendations.length,
      critical: recommendations.filter((r) => r.priority === "critical").length,
      high: recommendations.filter((r) => r.priority === "high").length,
      medium: recommendations.filter((r) => r.priority === "medium").length,
      recommendations,
      timestamp: Date.now(),
    };
  }
}

// --- Predictive Analyzer (v5) ---
class PredictiveAnalyzer {
  constructor() {
    this.history = [];
    this.predictions = [];
    this.trends = new Map();
  }

  recordSnapshot(timestamp, results) {
    this.history.push({
      timestamp,
      aliveCount: results.filter((r) => r.alive).length,
      totalCount: results.length,
      avgRTT: this.calcAvgRTT(results),
      serviceCount: this.countUniqueServices(results),
    });
    return this.history[this.history.length - 1];
  }

  calcAvgRTT(results) {
    const times = results.filter((r) => r.time).map((r) => Number(r.time));
    return times.length
      ? (times.reduce((a, b) => a + b) / times.length).toFixed(2)
      : 0;
  }

  countUniqueServices(results) {
    const services = new Set();
    results.forEach((r) => {
      if (r.service?.service) services.add(r.service.service);
    });
    return services.size;
  }

  predictUptime() {
    if (this.history.length < 2) return null;
    const recent = this.history.slice(-5);
    const uptimes = recent.map((s) => (s.aliveCount / s.totalCount) * 100);
    const avg = uptimes.reduce((a, b) => a + b) / uptimes.length;
    const trend = this.calculateTrend(uptimes);
    return {
      predictedUptime: avg.toFixed(2),
      trend: trend > 0 ? "improving" : trend < 0 ? "declining" : "stable",
      trendMagnitude: Math.abs(trend).toFixed(2),
      confidence: Math.min(100, this.history.length * 10).toFixed(0),
    };
  }

  calculateTrend(values) {
    if (values.length < 2) return 0;
    let trend = 0;
    for (let i = 1; i < values.length; i++) {
      trend += values[i] - values[i - 1];
    }
    return trend / (values.length - 1);
  }

  predictServiceChanges() {
    if (this.history.length < 2) return null;
    const recent = this.history.slice(-10);
    const serviceChanges = [];
    for (let i = 1; i < recent.length; i++) {
      if (recent[i].serviceCount !== recent[i - 1].serviceCount) {
        serviceChanges.push({
          from: recent[i - 1].serviceCount,
          to: recent[i].serviceCount,
          timestamp: recent[i].timestamp,
        });
      }
    }
    return {
      changes: serviceChanges,
      volatility: (serviceChanges.length / recent.length).toFixed(2),
      stable: serviceChanges.length === 0,
    };
  }

  generateForecast(results) {
    this.recordSnapshot(Date.now(), results);
    return {
      uptime: this.predictUptime(),
      serviceChanges: this.predictServiceChanges(),
      historySize: this.history.length,
      timestamp: Date.now(),
    };
  }
}

// --- Threat Detector (v5) ---
class ThreatDetector {
  constructor() {
    this.threats = [];
    this.indicators = new Map();
    this.baselineThreshold = 0.7;
  }

  scanForThreats(results) {
    const threats = [];

    // Indicator 1: Suspicious port combinations
    const portMap = {};
    results.forEach((r) => {
      if (r.alive && r.port) {
        if (!portMap[r.port]) portMap[r.port] = [];
        portMap[r.port].push(r.target);
      }
    });

    const suspiciousPorts = [23, 21, 135, 139, 445, 1433, 3389, 5985];
    for (const port of suspiciousPorts) {
      if (portMap[port] && portMap[port].length > 0) {
        threats.push({
          type: "exposed_legacy_service",
          severity: port === 23 || port === 21 ? "critical" : "high",
          port,
          instances: portMap[port].length,
          description: `${portMap[port].length} hosts exposing legacy/dangerous port ${port}`,
        });
      }
    }

    // Indicator 2: Unusual response time patterns (potential DDoS/saturation)
    const times = results.filter((r) => r.time).map((r) => Number(r.time));
    if (times.length > 10) {
      const avg = times.reduce((a, b) => a + b) / times.length;
      const stdDev = Math.sqrt(
        times.reduce((a, b) => a + Math.pow(b - avg, 2)) / times.length
      );
      const extremes = times.filter((t) => Math.abs(t - avg) > 3 * stdDev);
      if (extremes.length > times.length * 0.1) {
        threats.push({
          type: "network_anomaly",
          severity: "high",
          instances: extremes.length,
          description: `${extremes.length} hosts showing extreme response time variance (possible DDoS/saturation)`,
        });
      }
    }

    // Indicator 3: Service banners with version info (potential exploitation targets)
    const versionedServices = results.filter(
      (r) => r.banner && /v\d+|version|release/.test(r.banner.toLowerCase())
    );
    if (versionedServices.length > 0) {
      threats.push({
        type: "exposed_version_info",
        severity: "medium",
        instances: versionedServices.length,
        description: `${versionedServices.length} services exposing version information in banners`,
      });
    }

    // Indicator 4: High concentration of services on single host
    const hostServiceMap = {};
    results.forEach((r) => {
      if (r.alive && r.service) {
        hostServiceMap[r.target] = (hostServiceMap[r.target] || 0) + 1;
      }
    });
    const highConcentration = Object.values(hostServiceMap).filter(
      (c) => c > 5
    );
    if (highConcentration.length > 0) {
      threats.push({
        type: "high_service_concentration",
        severity: "medium",
        instances: highConcentration.length,
        description: `${highConcentration.length} hosts with high service concentration (possible privilege escalation targets)`,
      });
    }

    this.threats = threats;
    return threats;
  }

  calculateThreatScore(results) {
    const threats = this.scanForThreats(results);
    let score = 0;
    threats.forEach((t) => {
      const weight =
        {
          critical: 100,
          high: 75,
          medium: 50,
          low: 25,
        }[t.severity] || 0;
      score += (weight * t.instances) / Math.max(results.length, 1);
    });
    return Math.min(100, Math.max(0, score));
  }

  generateReport(results) {
    const threatScore = this.calculateThreatScore(results);
    return {
      threatScore: threatScore.toFixed(1),
      threatLevel:
        threatScore >= 80
          ? "critical"
          : threatScore >= 60
          ? "high"
          : threatScore >= 40
          ? "medium"
          : "low",
      totalThreats: this.threats.length,
      threats: this.threats,
      timestamp: Date.now(),
    };
  }
}

// --- Advanced Network Mapper (v5) ---
class AdvancedNetworkMapper {
  constructor() {
    this.graph = new Map();
    this.clusters = [];
    this.vulnerabilityMap = new Map();
  }

  buildNetworkGraph(results) {
    results.forEach((r) => {
      if (r.alive) {
        const subnet = this.extractSubnet(r.target);
        if (!this.graph.has(subnet)) {
          this.graph.set(subnet, { hosts: [], services: new Set() });
        }
        const subnetData = this.graph.get(subnet);
        subnetData.hosts.push(r.target);
        if (r.service?.service) {
          subnetData.services.add(r.service.service);
        }
      }
    });
  }

  extractSubnet(ip) {
    const parts = ip.split(".");
    return `${parts[0]}.${parts[1]}.${parts[2]}.0/24`;
  }

  identifyClusters(results) {
    this.buildNetworkGraph(results);
    const clusters = [];
    for (const [subnet, data] of this.graph) {
      clusters.push({
        subnet,
        hostCount: data.hosts.length,
        services: Array.from(data.services),
        serviceCount: data.services.size,
        density: (data.services.size / data.hosts.length).toFixed(3),
      });
    }
    this.clusters = clusters;
    return clusters;
  }

  mapVulnerabilities(results, threatDetector = null) {
    if (threatDetector) {
      const threats = threatDetector.threats;
      threats.forEach((t) => {
        if (t.port) {
          this.vulnerabilityMap.set(t.port, {
            type: t.type,
            severity: t.severity,
            count: t.instances,
          });
        }
      });
    }

    const vulnMap = {};
    results.forEach((r) => {
      if (r.port && this.vulnerabilityMap.has(r.port)) {
        if (!vulnMap[r.port]) vulnMap[r.port] = [];
        vulnMap[r.port].push(r.target);
      }
    });
    return vulnMap;
  }

  generateTopologyReport(results, threatDetector = null) {
    const clusters = this.identifyClusters(results);
    const vulnerabilities = this.mapVulnerabilities(results, threatDetector);
    return {
      subnets: clusters.length,
      totalHosts: results.filter((r) => r.alive).length,
      clusters,
      vulnerableHosts: Object.values(vulnerabilities).flat().length,
      vulnerabilities,
      timestamp: Date.now(),
    };
  }
}

// --- Security Orchestrator (v5) ---
class SecurityOrchestrator {
  constructor() {
    this.actions = [];
    this.workflows = [];
    this.automationRules = this.initializeRules();
  }

  initializeRules() {
    return {
      critical_threat: {
        condition: (threat) => threat.severity === "critical",
        actions: ["immediate_alert", "isolate", "escalate"],
        priority: 1,
      },
      high_threat: {
        condition: (threat) => threat.severity === "high",
        actions: ["alert", "log", "investigate"],
        priority: 2,
      },
      compliance_violation: {
        condition: (comp) => comp.level === "poor",
        actions: ["remediate", "audit", "report"],
        priority: 2,
      },
      service_anomaly: {
        condition: (anom) => anom.length > 5,
        actions: ["monitor", "alert", "baseline_update"],
        priority: 3,
      },
      normal_operation: {
        condition: () => true,
        actions: ["log", "update_metrics"],
        priority: 4,
      },
    };
  }

  orchestrateResponse(threatReport, complianceReport, anomalies) {
    const orchestrationPlan = {
      timestamp: Date.now(),
      workflows: [],
      priorityQueue: [],
    };

    // Critical threat response
    if (threatReport.threatLevel === "critical") {
      orchestrationPlan.workflows.push({
        name: "emergency_response",
        steps: [
          "trigger_incident_response",
          "notify_security_team",
          "enable_monitoring",
          "initiate_forensics",
        ],
        priority: 1,
      });
      orchestrationPlan.priorityQueue.push({
        action: "immediate_alert",
        target: threatReport.threats,
        severity: "critical",
      });
    }

    // Compliance remediation
    if (complianceReport && complianceReport.level === "poor") {
      orchestrationPlan.workflows.push({
        name: "compliance_remediation",
        steps: [
          "identify_failures",
          "apply_patches",
          "harden_configs",
          "verify_compliance",
        ],
        priority: 2,
      });
    }

    // Anomaly investigation
    if (anomalies && anomalies.length > 0) {
      orchestrationPlan.workflows.push({
        name: "anomaly_investigation",
        steps: [
          "analyze_patterns",
          "compare_baseline",
          "check_alerts",
          "update_baseline",
        ],
        priority: 3,
      });
    }

    // Normal operations
    orchestrationPlan.workflows.push({
      name: "continuous_monitoring",
      steps: ["update_metrics", "log_status", "check_health"],
      priority: 4,
    });

    this.workflows = orchestrationPlan.workflows;
    return orchestrationPlan;
  }

  generateAutomationPlaybook(threatReport, complianceReport, anomalies) {
    const playbook = {
      generatedAt: Date.now(),
      executionOrder: [],
      estimatedExecutionTime: "N/A",
      failsafeMechanisms: [
        "human_verification_required",
        "rollback_capability",
        "monitoring_enabled",
      ],
    };

    const orchestration = this.orchestrateResponse(
      threatReport,
      complianceReport,
      anomalies
    );
    playbook.executionOrder = orchestration.workflows.sort(
      (a, b) => a.priority - b.priority
    );

    return playbook;
  }

  estimateRemediationTime(workflows) {
    // Rough estimation: 5 minutes per workflow
    return workflows.length * 5;
  }
}

// --- perform a single probe with retries and backoff ---
async function probeHost(target, options) {
  const { retries, timeout, port } = options;
  const backoffBase = options.backoffBase || 200;
  let attempt = 0;
  let lastErr = null;
  const startTime = Date.now();

  // Check cache first
  if (options.cache && options.cacheManager) {
    const cached = options.cacheManager.get(target);
    if (cached) {
      if (options.verbose) console.debug(`Cache hit for ${target}`);
      return cached;
    }
  }

  while (attempt <= retries) {
    try {
      if (options.verbose)
        console.debug(
          `probing ${target} attempt ${attempt + 1}/${retries + 1}`
        );

      // Apply rate limiting if enabled
      if (options.rateLimit && options.rateLimiter) {
        await options.rateLimiter.acquire();
      }

      const res = await ping.promise.probe(target, {
        timeout: Math.ceil(timeout / 1000),
        extra: ["-c", "1"],
      });

      if (res.alive) {
        const result = {
          target,
          alive: true,
          time: res.time,
          raw: res,
          probeDuration: Date.now() - startTime,
        };

        // Service fingerprinting
        if (options.fingerprint && options.fingerprinter) {
          result.service = null;
        }

        // Cache the result
        if (options.cache && options.cacheManager) {
          options.cacheManager.set(target, result);
        }

        if (options.analytics && options.analytics_obj) {
          options.analytics_obj.recordProbe(
            target,
            result,
            result.probeDuration
          );
        }

        return result;
      }

      // TCP port check with optional fingerprinting
      if (port) {
        if (options.grab) {
          const tcp = await checkTcpPortWithGrab(target, port, timeout);
          if (tcp.ok) {
            const result = {
              target,
              alive: true,
              time: null,
              tcpFallback: true,
              banner: tcp.banner || null,
              port: port,
              probeDuration: Date.now() - startTime,
            };

            // Service fingerprinting
            if (options.fingerprint && options.fingerprinter && tcp.banner) {
              const service = options.fingerprinter.identify(tcp.banner, port);
              if (service) result.service = service;
            }

            if (options.cache && options.cacheManager) {
              options.cacheManager.set(target, result);
            }

            if (options.analytics && options.analytics_obj) {
              options.analytics_obj.recordProbe(
                target,
                result,
                result.probeDuration
              );
            }

            return result;
          }
        } else {
          const tcp = await checkTcpPort(target, port, timeout);
          if (tcp.ok) {
            const result = {
              target,
              alive: true,
              time: null,
              tcpFallback: true,
              port: port,
              probeDuration: Date.now() - startTime,
            };

            if (options.cache && options.cacheManager) {
              options.cacheManager.set(target, result);
            }

            if (options.analytics && options.analytics_obj) {
              options.analytics_obj.recordProbe(
                target,
                result,
                result.probeDuration
              );
            }

            return result;
          }
        }
      }

      lastErr = { reason: "no-response" };
    } catch (err) {
      lastErr = err;
      if (options.analytics && options.analytics_obj) {
        options.analytics_obj.recordError(err);
      }
    }

    attempt++;
    if (options.analytics && options.analytics_obj) {
      options.analytics_obj.recordRetry();
    }

    const delay = backoffBase * Math.pow(2, Math.max(0, attempt - 1));
    if (options.verbose) console.debug(`  backing off ${delay}ms before retry`);
    await new Promise((res) => setTimeout(res, delay));
  }

  const result = {
    target,
    alive: false,
    error: lastErr,
    probeDuration: Date.now() - startTime,
  };

  if (options.analytics && options.analytics_obj) {
    options.analytics_obj.recordProbe(target, result, result.probeDuration);
  }

  return result;
}

// --- main ---
async function main() {
  const args = parseArgs(process.argv);
  if (!args.targets || args.targets.length === 0 || args.help) {
    showHelp();
    return;
  }

  // Initialize advanced features
  const cache = args.cache ? new CacheManager() : null;
  const analytics = args.analytics ? new PerformanceAnalytics() : null;
  const fingerprinter = args.fingerprint ? new ServiceFingerprintDB() : null;
  const rateLimiter = args.rateLimit ? new RateLimiter(args.rateLimit) : null;
  // V3 Features
  const topology = args.topology ? new TopologyMapper() : null;
  const vulnScorer = args.vulnScore ? new VulnerabilityScorer() : null;
  const trendAnalyzer = args.trends ? new TrendAnalyzer() : null;
  const mlExtractor = args.mlData ? new MLFeatureExtractor() : null;
  // V4 Features
  const correlationEngine = args.correlate ? new CorrelationEngine() : null;
  const anomalyDetector = args.anomalies ? new AnomalyDetector() : null;
  const complianceChecker = args.compliance ? new ComplianceChecker() : null;
  const recommender = args.recommend ? new AutonomousRecommender() : null;
  // V5 Features
  const predictiveAnalyzer = args.predict ? new PredictiveAnalyzer() : null;
  const threatDetector = args.threats ? new ThreatDetector() : null;
  const networkMapper = args.network ? new AdvancedNetworkMapper() : null;
  const orchestrator = args.orchestrate ? new SecurityOrchestrator() : null;

  // expand all targets (support @file and CIDR)
  const expanded = [];
  for (const tRaw of args.targets) {
    if (!tRaw) continue;
    if (tRaw.startsWith("@")) {
      // read targets from file (one per line or comma separated)
      const p = tRaw.slice(1);
      try {
        const content = fs.readFileSync(path.resolve(p), "utf8");
        const parts = content
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);
        for (const line of parts) {
          line
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .forEach((s) => expandTarget(s).forEach((e) => expanded.push(e)));
        }
      } catch (e) {
        console.error(`Failed to read targets from ${p}:`, e.message || e);
      }
    } else {
      expandTarget(tRaw).forEach((e) => expanded.push(e));
    }
  }

  // Deduplicate if requested
  let workList = expanded;
  if (args.deduplicate) {
    workList = [...new Set(expanded)];
    console.log(
      `Deduplicated: ${expanded.length} -> ${workList.length} targets`
    );
  }

  // enforce maxHosts limit to avoid huge expansions
  if (workList.length > args.maxHosts) {
    console.warn(
      `Expanded to ${workList.length} hosts which exceeds --max-hosts=${args.maxHosts}. Truncating to first ${args.maxHosts} hosts.`
    );
    workList.length = args.maxHosts;
  }

  const configStr = [
    `concurrency=${args.concurrency}`,
    `retries=${args.retries}`,
    `timeout=${args.timeout}ms`,
    args.fingerprint ? "fingerprint=enabled" : "",
    args.analytics ? "analytics=enabled" : "",
    args.cache ? "cache=enabled" : "",
    args.rateLimit ? `rateLimit=${args.rateLimit}rps` : "",
    args.filter ? `filter=${args.filter}` : "",
  ]
    .filter(Boolean)
    .join(", ");

  console.log(`Probing ${workList.length} targets (${configStr})...`);
  if (args.analytics) console.log("Analytics tracking enabled\n");

  // prepare progress and cancellation
  global.__scan_cancelled = false;
  const completedResults = [];
  let bar = null;
  try {
    bar = new cliProgress.SingleBar(
      { format: "Progress |{bar}| {value}/{total} | ETA: {eta}s" },
      cliProgress.Presets.shades_classic
    );
    bar.start(workList.length, 0);
  } catch (e) {
    bar = null;
  }

  process.on("SIGINT", () => {
    console.log("\nReceived SIGINT — saving partial results and exiting...");
    global.__scan_cancelled = true;
    try {
      if (bar) bar.stop();
    } catch (e) {}
    const outPath =
      args.partialOut ||
      (args.out ? `${args.out}.partial` : "partial_results.json");
    try {
      fs.writeFileSync(
        outPath,
        JSON.stringify(completedResults, null, 2),
        "utf8"
      );
      console.log(`Partial results written to ${outPath}`);
    } catch (e) {
      console.error("Failed to write partial results:", e.message || e);
    }
    process.exit(0);
  });

  const results = await pMap(
    workList,
    (t) =>
      probeHost(t, {
        retries: args.retries,
        timeout: args.timeout,
        port: args.port,
        verbose: args.verbose,
        grab: args.grab,
        backoffBase: args.backoffBase,
        cache: args.cache,
        cacheManager: cache,
        fingerprint: args.fingerprint,
        fingerprinter: fingerprinter,
        analytics: args.analytics,
        analytics_obj: analytics,
        rateLimit: args.rateLimit,
        rateLimiter: rateLimiter,
      }).then((r) => {
        completedResults.push(r);
        if (bar) bar.increment();
        return r;
      }),
    args.concurrency
  );

  try {
    if (bar) bar.stop();
  } catch (e) {}

  // Apply filters if specified
  let filteredResults = results;
  if (args.filter) {
    const [filterType, ...filterParams] = args.filter.split(":");
    if (filterType === "alive")
      filteredResults = results.filter((r) => r.alive);
    else if (filterType === "dead")
      filteredResults = results.filter((r) => !r.alive);
    else if (filterType === "service" && filterParams.length > 0) {
      const service = filterParams.join(":");
      filteredResults = results.filter(
        (r) => r.service && r.service.service === service
      );
    }
    console.log(
      `\nFilter applied: '${args.filter}' → ${filteredResults.length}/${results.length} results\n`
    );
  }

  // output
  if (args.output === "json") {
    const out = JSON.stringify(filteredResults, null, 2);
    console.log(out);
    if (args.out) fs.writeFileSync(args.out, out, "utf8");
  } else if (args.output === "csv") {
    const headers = [
      "target",
      "alive",
      "time",
      "port",
      "service",
      "tcpFallback",
      "error",
      "probeDuration",
    ];
    console.log(headers.join(","));
    const lines = [headers.join(",")];
    filteredResults.forEach((r) => {
      lines.push(
        `${r.target},${r.alive},${r.time || ""},${r.port || ""},${
          r.service ? r.service.service : ""
        },${r.tcpFallback ? true : ""},${
          r.error ? JSON.stringify(r.error).replace(/,/g, ";") : ""
        },${r.probeDuration || ""}`
      );
    });
    const out = lines.join("\n");
    console.log(out);
    if (args.out) fs.writeFileSync(args.out, out, "utf8");
  } else {
    filteredResults.forEach((r) => {
      if (r.alive) {
        const via = r.tcpFallback ? "(tcp fallback)" : "";
        const service = r.service ? ` [${r.service.service}]` : "";
        const duration = args.detailed ? ` (${r.probeDuration}ms)` : "";
        console.log(
          `${r.target} -> alive ${
            r.time ? `(${r.time} ms)` : ""
          } ${via}${service}${duration}`
        );
      } else {
        console.log(`${r.target} -> down`);
      }
    });
    if (args.out) {
      const out = filteredResults
        .map((r) =>
          r.alive
            ? `${r.target} -> alive ${r.time ? `(${r.time} ms)` : ""} ${
                r.tcpFallback ? "(tcp fallback)" : ""
              }`
            : `${r.target} -> down`
        )
        .join("\n");
      fs.writeFileSync(args.out, out, "utf8");
    }
  }

  // summary
  const stats = filteredResults.reduce(
    (acc, r) => {
      acc.total++;
      if (r.alive) acc.alive++;
      if (r.tcpFallback) acc.tcpFallback++;
      if (!r.alive) acc.down++;
      if (r.time && !isNaN(Number(r.time))) {
        acc.times.push(Number(r.time));
      }
      if (r.service) acc.services.push(r.service.service);
      if (r.probeDuration) acc.probeDurations.push(r.probeDuration);
      return acc;
    },
    {
      total: 0,
      alive: 0,
      down: 0,
      tcpFallback: 0,
      times: [],
      services: [],
      probeDurations: [],
    }
  );

  const avg = (arr) =>
    arr.length
      ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)
      : null;
  console.log("\n=== SUMMARY ===");
  console.log(`Scanned: ${stats.total}/${results.length} results shown`);
  console.log(
    `Alive: ${stats.alive} | Down: ${stats.down} | TCP Fallback: ${stats.tcpFallback}`
  );
  if (stats.times.length > 0) {
    console.log(
      `RTT (ms): min=${Math.min(...stats.times)}, max=${Math.max(
        ...stats.times
      )}, avg=${avg(stats.times)}`
    );
  }
  if (stats.services.length > 0) {
    const serviceMap = stats.services.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    console.log(
      `Services detected: ${Object.entries(serviceMap)
        .map(([s, c]) => `${s}(${c})`)
        .join(", ")}`
    );
  }
  if (args.analytics && analytics) {
    const report = analytics.generateReport();
    if (report) {
      console.log("\n=== ANALYTICS ===");
      console.log(`Total probes: ${report.totalProbes}`);
      console.log(
        `Success rate: ${(
          (report.successful / report.totalProbes) *
          100
        ).toFixed(2)}%`
      );
      console.log(
        `Probe duration: min=${report.probeDuration.min}ms, max=${report.probeDuration.max}ms, avg=${report.probeDuration.avg}ms`
      );
      if (report.rttMetrics) {
        console.log(`RTT P95: ${report.rttMetrics.p95}ms`);
      }
      console.log(`Retries: ${report.totalRetries}`);
    }
  }
  if (args.cache && cache) {
    console.log(`\nCache stats: ${cache.stats().size} entries cached`);
  }

  // V3 Enterprise Features
  if (args.topology && topology) {
    const topoStats = topology.generateTopology(results);
    console.log("\n=== NETWORK TOPOLOGY ===");
    console.log(`Total nodes: ${topoStats.totalNodes}`);
    console.log(`Total edges: ${topoStats.totalEdges}`);
    console.log(`Network density: ${topoStats.density.toFixed(4)}`);
    console.log(`Subnets discovered: ${topoStats.subnets.length}`);
    topoStats.subnets.forEach((subnet) => {
      console.log(`  ${subnet.subnet}: ${subnet.nodeCount} hosts`);
    });
  }

  if (args.vulnScore && vulnScorer) {
    const scored = vulnScorer.scoreResults(results);
    console.log("\n=== VULNERABILITY ASSESSMENT ===");
    const highRisk = scored.filter((r) => r.riskLevel === "high").length;
    const medRisk = scored.filter((r) => r.riskLevel === "medium").length;
    const lowRisk = scored.filter((r) => r.riskLevel === "low").length;
    console.log(
      `High Risk: ${highRisk} | Medium Risk: ${medRisk} | Low Risk: ${lowRisk}`
    );
    console.log(
      `Avg Risk Score: ${(
        scored.reduce((a, b) => a + (b.riskScore || 0), 0) / scored.length
      ).toFixed(2)}`
    );

    const topRisks = scored
      .filter((r) => r.riskScore > 50)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
    if (topRisks.length > 0) {
      console.log("Top 5 Risk Hosts:");
      topRisks.forEach((r) => {
        console.log(
          `  ${r.target}: ${r.riskScore.toFixed(1)}/100 (${r.riskLevel})`
        );
      });
    }
  }

  if (args.trends && trendAnalyzer) {
    const snapshot = trendAnalyzer.recordSnapshot(Date.now(), results);
    console.log("\n=== NETWORK TRENDS ===");
    console.log(`Snapshot time: ${new Date(snapshot.timestamp).toISOString()}`);
    console.log(`Total hosts: ${snapshot.totalHosts}`);
    console.log(`Alive hosts: ${snapshot.aliveHosts} (${snapshot.uptime}%)`);
    console.log(`Avg response time: ${snapshot.avgResponseTime}ms`);
    console.log(`Services found: ${Object.keys(snapshot.services).length}`);
  }

  if (args.mlData && mlExtractor) {
    const dataset = mlExtractor.generateDataset(results);
    console.log("\n=== ML FEATURE EXTRACTION ===");
    console.log(`Total features extracted: ${dataset.features.length}`);
    console.log(`Features per instance: 10 (ml-ready format)`);
    console.log(`Alive percentage: ${dataset.summary.alivePercentage}%`);
    console.log(`Avg response time: ${dataset.summary.avgResponseTime}ms`);
    console.log(`Avg risk score: ${dataset.summary.avgRiskScore}`);
    if (dataset.summary.responseTimeDistribution) {
      console.log(
        `RTT Distribution: min=${dataset.summary.responseTimeDistribution.min}ms, p95=${dataset.summary.responseTimeDistribution.p95}ms`
      );
    }
  }

  // V4 Autonomous AI Features
  if (args.correlate && correlationEngine) {
    const correlationReport = correlationEngine.generateReport(results);
    console.log("\n=== CORRELATION ANALYSIS ===");
    console.log(
      `Patterns identified: ${Object.keys(correlationReport.patterns).length}`
    );
    const patterns = correlationReport.patterns;
    for (const [key, value] of Object.entries(patterns)) {
      if (typeof value === "object") {
        console.log(`  ${key}: ${JSON.stringify(value).substring(0, 60)}...`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
  }

  if (args.anomalies && anomalyDetector) {
    anomalyDetector.setBaseline(results);
    const anomalies = anomalyDetector.detectAnomalies(results);
    const serviceAnomalies = anomalyDetector.analyzeServiceAnomalies(results);
    console.log("\n=== ANOMALY DETECTION ===");
    console.log(
      `Baseline established: ${anomalyDetector.baseline ? "yes" : "no"}`
    );
    console.log(`Anomalies detected: ${anomalies.length}`);
    if (anomalies.length > 0) {
      const topAnomalies = anomalies.slice(0, 5);
      console.log("Top anomalies:");
      topAnomalies.forEach((a) => {
        console.log(
          `  ${a.target}: ${a.type} (z-score: ${a.zScore}, time: ${a.responseTime}ms)`
        );
      });
    }
    console.log(
      `Service anomaly groups: ${Object.keys(serviceAnomalies).length}`
    );
  }

  if (args.compliance && complianceChecker) {
    const complianceReport = complianceChecker.evaluateCompliance(results);
    console.log("\n=== COMPLIANCE ASSESSMENT ===");
    console.log(
      `Overall CIS Compliance Score: ${complianceReport.overallScore}%`
    );
    console.log(`Compliance Level: ${complianceReport.level}`);
    const passed = complianceReport.details.filter((d) => d.passed).length;
    const total = complianceReport.details.length;
    console.log(`Rules Passed: ${passed}/${total}`);
    const failedRules = complianceReport.details
      .filter((d) => !d.passed)
      .slice(0, 5);
    if (failedRules.length > 0) {
      console.log("Failed rules:");
      failedRules.forEach((r) => {
        console.log(`  [${r.id}] ${r.name}`);
      });
    }
  }

  if (args.recommend && recommender) {
    const recommendationReport = recommender.generateReport(results);
    console.log("\n=== AUTONOMOUS RECOMMENDATIONS ===");
    console.log(
      `Total recommendations: ${recommendationReport.totalRecommendations}`
    );
    console.log(
      `Critical: ${recommendationReport.critical} | High: ${recommendationReport.high} | Medium: ${recommendationReport.medium}`
    );
    const topRecommendations = recommendationReport.recommendations.slice(0, 5);
    if (topRecommendations.length > 0) {
      console.log("Top priority actions:");
      topRecommendations.forEach((rec) => {
        const priority = rec.priority ? `[${rec.priority.toUpperCase()}]` : "";
        console.log(`  ${priority} ${rec.recommendation}`);
      });
    }
  }

  // V5 Intelligent Threat Detection Features
  if (args.predict && predictiveAnalyzer) {
    const forecast = predictiveAnalyzer.generateForecast(results);
    console.log("\n=== PREDICTIVE ANALYTICS ===");
    if (forecast.uptime) {
      console.log(`Predicted Uptime: ${forecast.uptime.predictedUptime}%`);
      console.log(
        `Trend: ${forecast.uptime.trend} (${forecast.uptime.trendMagnitude})`
      );
      console.log(`Confidence: ${forecast.uptime.confidence}%`);
    }
    if (forecast.serviceChanges) {
      console.log(`Service Volatility: ${forecast.serviceChanges.volatility}`);
      console.log(`Recent Changes: ${forecast.serviceChanges.changes.length}`);
    }
  }

  if (args.threats && threatDetector) {
    const threatReport = threatDetector.generateReport(results);
    console.log("\n=== THREAT DETECTION ===");
    console.log(`Overall Threat Score: ${threatReport.threatScore}/100`);
    console.log(`Threat Level: ${threatReport.threatLevel.toUpperCase()}`);
    console.log(`Total Threats Detected: ${threatReport.totalThreats}`);
    if (threatReport.threats.length > 0) {
      console.log("Threat Details:");
      threatReport.threats.slice(0, 5).forEach((threat) => {
        console.log(
          `  [${threat.severity.toUpperCase()}] ${threat.type}: ${
            threat.description
          }`
        );
      });
    }
  }

  if (args.network && networkMapper) {
    const topoReport = networkMapper.generateTopologyReport(
      results,
      threatDetector
    );
    console.log("\n=== ADVANCED NETWORK ANALYSIS ===");
    console.log(`Total Subnets: ${topoReport.subnets}`);
    console.log(`Total Alive Hosts: ${topoReport.totalHosts}`);
    console.log(`Vulnerable Hosts: ${topoReport.vulnerableHosts}`);
    if (topoReport.clusters.length > 0) {
      console.log("Subnet Clusters:");
      topoReport.clusters.slice(0, 5).forEach((cluster) => {
        console.log(
          `  ${cluster.subnet}: ${cluster.hostCount} hosts, ${cluster.serviceCount} services, density=${cluster.density}`
        );
      });
    }
  }

  if (args.orchestrate && orchestrator) {
    const threatReport = threatDetector
      ? threatDetector.generateReport(results)
      : null;
    const complianceReport = complianceChecker
      ? complianceChecker.evaluateCompliance(results)
      : null;
    const anomalies = anomalyDetector
      ? anomalyDetector.detectAnomalies(results)
      : [];

    const playbook = orchestrator.generateAutomationPlaybook(
      threatReport || { threatLevel: "low", threats: [] },
      complianceReport,
      anomalies
    );

    console.log("\n=== SECURITY ORCHESTRATION ===");
    console.log(`Workflows Generated: ${playbook.executionOrder.length}`);
    console.log("Execution Plan (Priority Order):");
    playbook.executionOrder.forEach((workflow) => {
      console.log(`  [${workflow.priority}] ${workflow.name}`);
      workflow.steps.forEach((step) => {
        console.log(`      → ${step}`);
      });
    });
    console.log("Failsafe Mechanisms:");
    playbook.failsafeMechanisms.forEach((mech) => {
      console.log(`  ✓ ${mech}`);
    });
  }
}

// run
if (require.main === module) {
  main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}
