export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  tags: string[];
  featured?: boolean;
  content?: string;
}

export const posts: Post[] = [
  {
    slug: "designing-resilient-cloud-architectures",
    title: "Designing Resilient Cloud Architectures: Lessons from Production",
    excerpt: "After years of building and breaking systems in Azure, here's what I've learned about designing for failure. Spoiler: it's less about preventing failures and more about embracing them.",
    date: "2024-01-15",
    readingTime: "8 min",
    tags: ["Azure", "Architecture", "Resilience"],
    featured: true,
    content: `Building resilient systems isn't about preventing all failures—it's about designing systems that gracefully handle the failures that will inevitably occur.

## The Fallacy of "Highly Available"

When someone tells me their system needs to be "highly available," I always ask: what does that actually mean for your users? 99.9%? 99.99%? The difference between those two is roughly 8 hours of downtime per year versus 52 minutes.

More importantly: which 52 minutes? Can you afford to be down during your busiest hour? What about during a critical sales event?

## Design Principles That Actually Work

After building distributed systems across healthcare, finance, and retail, I've landed on a few principles that consistently work:

### 1. Bulkheads Over Single Points

Isolate failures. When your payment service goes down, your product catalog should keep working. This sounds obvious, but I've seen countless architectures where a single database outage takes down everything.

### 2. Timeouts Everywhere

Every external call needs a timeout. Every. Single. One. I've seen systems hang for hours because someone forgot to add a timeout to an HTTP client.

### 3. Circuit Breakers Are Your Friend

When a downstream service starts failing, stop hammering it. Give it time to recover. The circuit breaker pattern has saved me more times than I can count.

## Real Talk: What Goes Wrong

The most common failure mode I see isn't technical—it's organizational. Teams build "resilient" systems but never test the failure paths. They add retry logic but never verify it works under load.

**Test your failures.** Run chaos engineering experiments. Pull the plug on services during business hours (with appropriate safeguards). The first time you discover a failure mode shouldn't be in production at 2 AM.`
  },
  {
    slug: "integration-patterns-that-scale",
    title: "Integration Patterns That Actually Scale",
    excerpt: "The difference between a system that handles 100 requests/second and 10,000 isn't just bigger servers. It's fundamentally different integration patterns.",
    date: "2024-01-08",
    readingTime: "12 min",
    tags: ["Integration", "APIs", "Performance"],
    featured: true,
    content: `When I started building integrations, I thought scaling was about bigger servers and more instances. I was wrong.

## The Synchronous Trap

Most developers start with synchronous integrations. Service A calls Service B, waits for a response, then continues. It's simple, it's intuitive, and it falls over spectacularly at scale.

## Patterns Worth Knowing

### Event-Driven Architecture

Instead of asking "give me the current state," you say "tell me when things change." This simple shift enables massive scale improvements.

### Command Query Responsibility Segregation (CQRS)

Separate your reads from your writes. Your read patterns are almost never the same as your write patterns, so why force them through the same model?

### The Outbox Pattern

Never lose a message, even when your database and message broker can't participate in a distributed transaction.`
  },
  {
    slug: "observability-beyond-logging",
    title: "Observability Beyond Logging: What I Wish I Knew Earlier",
    excerpt: "Logs are necessary but not sufficient. Here's how I think about building truly observable systems after spending too many late nights debugging production issues.",
    date: "2024-01-02",
    readingTime: "10 min",
    tags: ["Observability", "DevOps", "Monitoring"],
    featured: true,
    content: `Early in my career, I thought good logging was the key to understanding production systems. Add enough log statements, and you can figure out anything, right?

Wrong. Very wrong.

## The Three Pillars (and Why They're Not Enough)

You've probably heard about the three pillars of observability: logs, metrics, and traces. They're a good start, but they're not the whole story.

### Logs Tell You What Happened

Logs are great for recording discrete events. User logged in. Order placed. Error thrown. But they don't tell you why.

### Metrics Tell You How Much

Metrics give you aggregates. How many requests? What's the 95th percentile latency? How much CPU? But they don't tell you which requests are slow.

### Traces Tell You The Journey

Distributed tracing shows you how a request flows through your system. But a trace of a successful request doesn't help you debug failures.

## What Actually Works

The real insight is that observability isn't about tools—it's about questions. Can you answer:

1. Why is this specific request slow?
2. What changed between yesterday and today?
3. Which users are affected by this issue?

If you can't answer these questions quickly, you don't have observability. You have data.`
  },
  {
    slug: "terraform-patterns-azure",
    title: "Terraform Patterns for Azure: Organizing Real-World Infrastructure",
    excerpt: "How I structure Terraform codebases for Azure that don't become unmaintainable messes. Modules, workspaces, and the patterns that actually survive contact with production.",
    date: "2023-12-20",
    readingTime: "15 min",
    tags: ["Terraform", "Azure", "IaC"],
    content: `After managing Terraform codebases from a few hundred lines to tens of thousands, I've developed some strong opinions about organization.

## The Module Hierarchy

Not all modules are created equal. I think about modules in three tiers:

### Foundation Modules
These are your building blocks: a VM, a storage account, a key vault. They're thin wrappers around resources with sensible defaults.

### Pattern Modules  
These combine foundation modules into common patterns: a web application with its database, cache, and CDN.

### Environment Modules
These define complete environments: dev, staging, production. They compose pattern modules with environment-specific configuration.

## State Management

State management is where most Terraform projects go wrong. Here's what works:

- One state file per environment per component
- Remote state in Azure Storage with locking
- Never, ever put secrets in state (use Key Vault references)`
  },
  {
    slug: "api-versioning-strategies",
    title: "API Versioning: The Strategy Nobody Tells You About",
    excerpt: "URL versioning vs header versioning is the wrong debate. Here's how I think about API evolution after maintaining APIs with hundreds of consumers.",
    date: "2023-12-15",
    readingTime: "7 min",
    tags: ["APIs", "Architecture", "Best Practices"],
    content: `Everyone argues about where to put the version number. URL path? Header? Query string? It's the wrong question.

## The Real Question

The real question is: how do you evolve your API without breaking existing clients?

Versioning is just one tool for managing this evolution. And honestly, if you're versioning frequently, you might be doing something wrong.

## Strategies That Work

### Additive Changes
Add new fields, new endpoints, new optional parameters. Never remove or rename. This sounds limiting, but it covers 90% of real-world changes.

### Expand/Contract
When you need to make breaking changes, do it in phases:
1. Expand: Add the new version alongside the old
2. Migrate: Help clients move to the new version
3. Contract: Remove the old version

### Consumer-Driven Contracts
Let your consumers tell you what they need. Test against their expectations, not your assumptions.`
  },
  {
    slug: "kubernetes-not-always-answer",
    title: "Kubernetes Isn't Always the Answer (And That's Okay)",
    excerpt: "I've deployed to Kubernetes, and I've also chosen not to. Here's my framework for deciding when container orchestration complexity is worth it.",
    date: "2023-12-08",
    readingTime: "9 min",
    tags: ["Kubernetes", "Architecture", "Cloud"],
    content: `Kubernetes is an incredible piece of technology. It's also incredibly complex. And that complexity has costs.

## When Kubernetes Makes Sense

- You have multiple teams deploying independently
- You need fine-grained resource allocation
- You're running stateless workloads at significant scale
- You have the expertise to operate it (or can pay for managed services)

## When It Might Not

- You have a small team with limited ops experience
- Your workloads are simple and well-served by PaaS
- You're optimizing for time-to-market over operational control
- Your scale doesn't justify the overhead

## The Middle Ground

Azure Container Apps, AWS App Runner, and Google Cloud Run offer much of Kubernetes' value with far less operational burden. For many workloads, they're the right choice.`
  },
  {
    slug: "security-architecture-basics",
    title: "Security Architecture for the Rest of Us",
    excerpt: "You don't need to be a security expert to build secure systems. Here's the minimum viable security architecture I apply to every project.",
    date: "2023-12-01",
    readingTime: "11 min",
    tags: ["Security", "Architecture", "Best Practices"],
    content: `Security can feel overwhelming. There's always another threat vector, another compliance requirement, another vulnerability to patch.

But most security failures aren't sophisticated attacks. They're basic mistakes: exposed secrets, missing authentication, overly permissive access.

## The Basics That Matter

### Defense in Depth
Never rely on a single security control. If your network security fails, your application security should still protect you.

### Least Privilege
Every component should have the minimum permissions necessary. This includes your CI/CD pipelines, your developers, and especially your production systems.

### Secrets Management
Never, ever put secrets in code or environment variables. Use a secrets manager. Azure Key Vault, AWS Secrets Manager, HashiCorp Vault—pick one and use it consistently.

## The Security Checklist I Use

1. Authentication on every endpoint (yes, internal ones too)
2. Authorization checks at every layer
3. Encryption in transit (TLS everywhere)
4. Encryption at rest for sensitive data
5. Audit logging for security-relevant events
6. Regular dependency updates
7. Penetration testing before major releases`
  },
  {
    slug: "performance-debugging-production",
    title: "Performance Debugging in Production: A Practical Guide",
    excerpt: "Theory is great, but when your system is slow and customers are complaining, you need a systematic approach to finding the problem.",
    date: "2023-11-22",
    readingTime: "13 min",
    tags: ["Performance", "Debugging", "Production"],
    content: `Production performance issues are stressful. The phone is ringing, metrics are red, and everyone wants answers. Here's my systematic approach to finding the problem.

## Step 1: Establish the Baseline

Before you can fix anything, you need to understand what "normal" looks like. What are your typical response times? What's your normal error rate? Without this context, you're debugging blind.

## Step 2: Isolate the Symptom

Is it all requests or specific endpoints? All users or specific regions? All time or specific periods? Narrowing down the symptom is half the battle.

## Step 3: Follow the Request

Use distributed tracing to follow a slow request through your system. Where is the time going? Is it in your code, your database, or an external service?

## Common Culprits

In my experience, production performance issues usually fall into a few categories:

- **Database queries**: Missing indexes, N+1 queries, lock contention
- **External services**: Slow third-party APIs, connection pool exhaustion
- **Memory pressure**: GC pauses, memory leaks, insufficient heap
- **Resource contention**: CPU saturation, disk I/O, network bandwidth

## The Golden Rule

Never guess. Measure. Profile. Trace. The intuition that serves you well in development will mislead you in production.`
  }
];

export const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

export const featuredPosts = posts.filter(post => post.featured);
