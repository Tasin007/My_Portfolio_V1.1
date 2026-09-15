// Professional claims transcribed from public/Alam_Md_Tasin_Resume.pdf.
export const profile = {
  name: "Alam Md Tasin",
  email: "alam.tasin.cse@gmail.com",
  introduction:
    "I’m a DevOps engineer with 1.5+ years of hands-on production experience supporting 6–7 FinTech, banking, telecom and digital-service platforms serving more than one million users. I operated 200+ containerized services, with peak environments exceeding 300. Now a Research Student at Hiroshima University, I’m developing LLM-driven web automation in Python.",
  research:
    "My current prototype brings together Playwright, DOM parsing, structured browser actions, local-LLM planning and memory. The wider research direction explores multimodal webpage understanding and webpage generation. Generation is a research direction—not a claimed completed experiment or published result.",
};
export const platforms = [
  {
    name: "ShebaPay",
    mark: "SP",
    domain: "FinTech",
    color: "#39d8ac",
    summary: "Connecting repeatable delivery with production visibility.",
    scope:
      "Supported application delivery, monitoring, centralized logging and relational-database operations as part of the Rez Corporation team.",
    work: [
      "Automated delivery workflows using GitHub Actions and Docker.",
      "Supported Prometheus and Grafana monitoring, with OpenSearch and Filebeat for centralized logs.",
      "Assisted MySQL and PostgreSQL operations supporting application stability.",
    ],
    tools: [
      "GitHub Actions",
      "Docker",
      "Prometheus",
      "Grafana",
      "OpenSearch",
      "PostgreSQL",
    ],
    lesson:
      "Release information, application signals and searchable logs belong in the same operational picture.",
  },
  {
    name: "Zain",
    mark: "ZN",
    domain: "Platform operations",
    color: "#c1a2ff",
    summary: "Cloud operations, API infrastructure and repeatable automation.",
    scope:
      "Supported AWS-backed service delivery, API management and recurring operational work. The exact public product identity is subject to owner review.",
    work: [
      "Operated AWS EC2, S3, RDS and IAM services.",
      "Supported API management through Kong Gateway.",
      "Built Python and Shell automation for recurring operational tasks.",
    ],
    tools: ["AWS EC2", "S3", "RDS", "IAM", "Kong", "Python"],
    lesson:
      "Consistent configuration and automation reduce the number of manual steps operators must remember.",
  },
  {
    name: "AEON",
    mark: "AE",
    domain: "Digital services",
    color: "#ffba7a",
    summary: "Container-based delivery and application operations.",
    scope:
      "Supported Docker-based services, operational visibility and the infrastructure around application delivery.",
    work: [
      "Supported Docker service deployment.",
      "Maintained centralized logging, monitoring and load-balancing support.",
      "Assisted database maintenance and application-performance operations.",
    ],
    tools: ["Docker", "Linux", "Nginx", "Logging", "SQL"],
    lesson:
      "Application reliability depends on the container, the traffic path and the data layer—not just a successful deployment.",
  },
  {
    name: "Digitel",
    mark: "DG",
    domain: "Telecom / digital",
    color: "#60b9ff",
    summary: "Turning production signals into useful diagnostic evidence.",
    scope:
      "Supported infrastructure monitoring, release workflows and incident diagnosis in a telecom/digital-service environment.",
    work: [
      "Supported Grafana-based infrastructure monitoring and alerts.",
      "Contributed to CI/CD pipeline optimization.",
      "Investigated production symptoms through log analysis and diagnostics.",
    ],
    tools: ["Grafana", "CI/CD", "Linux", "Logs"],
    lesson:
      "An alert is the beginning of an investigation. Logs and recent changes help explain what it means.",
  },
  {
    name: "MLajan",
    mark: "ML",
    domain: "FinTech / data integration",
    color: "#f294c2",
    summary: "Data streaming, object storage and analytics support.",
    scope:
      "Supported application data integration and storage operations—not ownership of the product or its architecture.",
    work: [
      "Supported Kafka-based real-time streaming and integration.",
      "Operated MinIO object storage.",
      "Assisted analytics work on application-user data.",
    ],
    tools: ["Kafka", "MinIO", "Data integration", "Analytics"],
    lesson:
      "Data movement, persistence and downstream consumers need to be understood together.",
  },
  {
    name: "BRAC Bank",
    mark: "BB",
    domain: "Banking / enterprise",
    color: "#ff9c73",
    summary: "Backend operations with a focus on data and visibility.",
    scope:
      "Supported backend services, relational databases and operational monitoring in a banking/enterprise environment.",
    work: [
      "Supported secure backend-service operations.",
      "Assisted MSSQL and PostgreSQL administration.",
      "Supported monitoring and logging for operational standards.",
    ],
    tools: ["MSSQL", "PostgreSQL", "Monitoring", "Logging"],
    lesson:
      "Careful diagnosis, consistent operations and clear evidence matter when services support business-critical workflows.",
  },
];
export const responsibilities = [
  [
    "Delivery & automation",
    "Supported near-daily releases with GitHub Actions, Jenkins and Docker. On active deployment days, handled approximately 5–6 new service deployments and 7–8 service updates.",
    "GitHub Actions · Jenkins · Docker · Python",
  ],
  [
    "Cloud & Linux",
    "Operated AWS EC2, S3, RDS and IAM. Supported Linux services, networking, Nginx and load balancing for application delivery.",
    "AWS · Linux · Nginx · Networking",
  ],
  [
    "Observability & incidents",
    "Implemented Prometheus/Grafana monitoring and OpenSearch/Filebeat centralized logging. Added Telegram monitoring and proactive SSL-expiry alerts 10–15 days in advance.",
    "Prometheus · Grafana · OpenSearch · Filebeat",
  ],
  [
    "Data & API infrastructure",
    "Worked on MySQL, PostgreSQL and MSSQL operations, performance tuning and query optimization. Operated Kafka, MinIO and Kong Gateway.",
    "SQL · Kafka · MinIO · Kong",
  ],
];
export const skills = [
  [
    "AWS",
    "Production",
    "Cloud & infrastructure",
    "EC2 compute, S3 storage, RDS databases and IAM access management.",
    "Zain",
    "systems",
  ],
  [
    "Docker",
    "Production",
    "Delivery & automation",
    "Container-based builds and application deployment.",
    "ShebaPay · AEON",
    "labs",
  ],
  [
    "GitHub Actions / Jenkins",
    "Production",
    "Delivery & automation",
    "Repeatable build and deployment workflows.",
    "Rez Corporation · ShebaPay",
    "labs",
  ],
  [
    "Grafana / Prometheus",
    "Production",
    "Observability",
    "Metrics, dashboards, monitoring and alerting.",
    "ShebaPay · Digitel",
    "labs",
  ],
  [
    "OpenSearch / Filebeat",
    "Production",
    "Observability",
    "Centralized log collection and investigation.",
    "ShebaPay",
    "labs",
  ],
  [
    "PostgreSQL / MySQL / MSSQL",
    "Production",
    "Data & APIs",
    "Database operations, tuning and query optimization.",
    "ShebaPay · BRAC Bank",
    "platforms",
  ],
  [
    "Kafka / MinIO",
    "Production",
    "Data & APIs",
    "Real-time integration and object-storage operations.",
    "MLajan",
    "platforms",
  ],
  [
    "Kong / Nginx",
    "Production",
    "Cloud & infrastructure",
    "API gateway, traffic routing and load balancing.",
    "Zain · Rez Corporation",
    "systems",
  ],
  [
    "Python / Shell",
    "Production",
    "Delivery & automation",
    "Automation for recurring operational and monitoring tasks.",
    "Rez Corporation",
    "experience",
  ],
  [
    "Playwright / local LLMs",
    "Research",
    "AI & development",
    "Browser control, DOM parsing, planning and agent memory.",
    "Hiroshima University",
    "research",
  ],
  [
    "React / Node.js",
    "Listed skills",
    "AI & development",
    "Application-development technologies listed on the résumé; not presented as production DevOps ownership.",
    "Résumé technical skills",
    "resume-center",
  ],
  [
    "Ansible / Chef",
    "Listed skills",
    "Delivery & automation",
    "Configuration-management tools listed in the résumé; specific project evidence still needs confirmation.",
    "Résumé technical skills",
    "resume-center",
  ],
];
export const journey = [
  [
    "2024",
    "Bangladesh",
    "Software foundations",
    "B.Sc. in Computer Science and Engineering, Daffodil International University. A foundation in programming and systems, followed by professional infrastructure work.",
  ],
  [
    "Feb 2024 — Aug 2025",
    "Rez Corporation",
    "Production responsibility",
    "1.5+ years supporting 200+ containerized services, with peak environments exceeding 300, across delivery automation, cloud operations, observability, databases and middleware.",
  ],
  [
    "Oct 2025 — present",
    "Hiroshima, Japan",
    "Research & intelligent automation",
    "Research Student in the Graduate School of Advanced Science and Engineering, Informatics and Data Science. Developing a modular LLM-driven web-automation prototype.",
  ],
  [
    "Next chapter",
    "Open to opportunities",
    "Reliable systems. Intelligent tools.",
    "Interested in DevOps, cloud infrastructure, platform engineering and research-driven work. This is a career direction, not a claim of a future appointment.",
  ],
];
export const evidence = [
  {
    id: "experience",
    title: "Production DevOps experience",
    text:
      profile.introduction + " " + responsibilities.map((x) => x[1]).join(" "),
  },
  ...platforms.map((x) => ({
    id: "platforms",
    platform: x.name,
    title: x.name,
    text: x.scope + " " + x.work.join(" "),
  })),
  {
    id: "research",
    title: "Hiroshima University research",
    text: profile.research,
  },
  {
    id: "resume-center",
    title: "Languages and education",
    text: "TOEIC Listening & Reading: 795/990. Japanese: beginner, studying toward JLPT N4; no passed N4 certificate claimed. B.Sc. CSE, Daffodil International University, 2024. Research Student, not a completed master’s degree.",
  },
  {
    id: "contact",
    title: "Contact and opportunities",
    text:
      "Email " +
      profile.email +
      ". Based in Higashi-Hiroshima, Japan. Interested in DevOps, cloud and platform engineering opportunities. Work authorization and availability details should be discussed directly.",
  },
];
export function searchEvidence(query) {
  const words = query
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter(
      (w) =>
        w.length > 2 &&
        ![
          "the",
          "and",
          "does",
          "what",
          "tasin",
          "his",
          "about",
          "show",
          "with",
          "for",
        ].includes(w),
    );
  return evidence
    .map((e) => ({
      ...e,
      score: words.reduce(
        (n, w) =>
          n +
          (e.title.toLowerCase().includes(w) ? 4 : 0) +
          (e.text.toLowerCase().includes(w) ? 1 : 0),
        0,
      ),
    }))
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
