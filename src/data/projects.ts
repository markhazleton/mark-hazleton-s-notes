export interface Project {
  slug: string;
  title: string;
  summary: string;
  problem: string;
  approach: string;
  outcome: string;
  technologies: string[];
  type: 'project' | 'talk';
  links?: {
    label: string;
    url: string;
  }[];
}

export const projects: Project[] = [
  {
    slug: "healthcare-platform-migration",
    title: "Healthcare Platform Cloud Migration",
    summary: "Led the migration of a critical healthcare platform from on-premises infrastructure to Azure, serving 2M+ patients.",
    problem: "Legacy on-premises infrastructure was reaching end-of-life, with scaling limitations and increasing maintenance costs. The platform handled sensitive PHI data requiring strict HIPAA compliance.",
    approach: "Designed a phased migration strategy using Azure Landing Zones. Implemented a strangler fig pattern to gradually migrate services while maintaining uptime. Built comprehensive CI/CD pipelines with security scanning.",
    outcome: "Completed migration with zero data loss and 99.99% uptime during transition. Reduced infrastructure costs by 40% and improved deployment frequency from monthly to daily.",
    technologies: ["Azure", "Kubernetes", "Terraform", ".NET", "PostgreSQL"],
    type: "project",
    links: [
      { label: "Architecture Overview", url: "#" }
    ]
  },
  {
    slug: "event-driven-retail",
    title: "Event-Driven Retail Integration Platform",
    summary: "Designed and built an event-driven integration platform connecting 50+ retail systems across multiple brands.",
    problem: "Disparate retail systems with point-to-point integrations creating a maintenance nightmare. Real-time inventory visibility was impossible, leading to overselling and customer frustration.",
    approach: "Implemented an event-driven architecture using Azure Service Bus and Event Grid. Built a canonical data model and transformation layer. Created self-service onboarding for new integrations.",
    outcome: "Reduced integration development time from weeks to days. Achieved real-time inventory accuracy across all channels. Platform now processes 10M+ events daily.",
    technologies: ["Azure Service Bus", "Event Grid", "Azure Functions", ".NET", "SQL Server"],
    type: "project"
  },
  {
    slug: "api-management-strategy",
    title: "Enterprise API Management Strategy",
    summary: "Developed and implemented an API-first strategy for a financial services company, enabling partner ecosystem growth.",
    problem: "Legacy batch-based partner integrations limiting business agility. No consistent approach to API design, security, or lifecycle management.",
    approach: "Established API design guidelines and governance processes. Implemented Azure API Management as the central gateway. Built developer portal and self-service API key provisioning.",
    outcome: "Launched partner API program with 20+ integrations in first year. Reduced partner onboarding time from months to days. APIs now drive 30% of transaction volume.",
    technologies: ["Azure API Management", "OpenAPI", "OAuth 2.0", ".NET", "React"],
    type: "project"
  },
  {
    slug: "talk-resilience-patterns",
    title: "Building Resilient Distributed Systems",
    summary: "Conference talk on practical resilience patterns for distributed systems, including real-world failure stories and recovery strategies.",
    problem: "Many teams build distributed systems without understanding common failure modes. Production incidents become learning opportunities only after they cause customer impact.",
    approach: "Shared war stories and extracted patterns. Demonstrated circuit breakers, bulkheads, and timeout strategies with live code examples. Discussed organizational aspects of resilience.",
    outcome: "Delivered at 3 regional conferences. Consistently rated in top 3 sessions. Talk materials used in internal training at multiple companies.",
    technologies: ["Polly", ".NET", "Azure", "Kubernetes"],
    type: "talk",
    links: [
      { label: "Slides", url: "#" },
      { label: "Recording", url: "#" }
    ]
  },
  {
    slug: "talk-observability-journey",
    title: "The Observability Journey: From Logs to Understanding",
    summary: "Workshop on building observable systems, covering instrumentation strategies, tooling choices, and organizational practices.",
    problem: "Teams often confuse data collection with observability. They have dashboards and logs but still can't answer basic questions about system behavior.",
    approach: "Hands-on workshop format with real scenarios. Participants instrument a sample application and debug production-like issues. Emphasis on asking good questions.",
    outcome: "Delivered as half-day workshop at 2 conferences. Participant feedback highlighted the practical, non-vendor-specific approach.",
    technologies: ["OpenTelemetry", "Application Insights", "Prometheus", "Grafana"],
    type: "talk",
    links: [
      { label: "Workshop Materials", url: "#" }
    ]
  },
  {
    slug: "devops-transformation",
    title: "DevOps Transformation for Enterprise",
    summary: "Guided a 200-person engineering organization through a DevOps transformation, establishing modern practices and platform.",
    problem: "Siloed teams, manual deployments, and 6-week release cycles. Change failure rate over 30%. Development and operations in constant conflict.",
    approach: "Started with pilot teams to prove value. Built internal developer platform incrementally. Focused on psychological safety and blameless postmortems. Measured and celebrated progress.",
    outcome: "Reduced deployment lead time from weeks to hours. Change failure rate dropped to under 5%. Team satisfaction scores improved significantly.",
    technologies: ["Azure DevOps", "Terraform", "Kubernetes", "ArgoCD", ".NET"],
    type: "project"
  }
];

export const projectsOnly = projects.filter(p => p.type === 'project');
export const talksOnly = projects.filter(p => p.type === 'talk');
