export interface MappingRow {
  user_story: string;
  regulatory_clause: string;
  requirement_id: string;
  compliance_status: string;
  notes: string;
}

export interface MappingResult {
  status: string;
  data: MappingRow[];
}

const CFR_CLAUSES = [
  { clause: "21 CFR Part 11.10(a)", req_id: "REQ-001", topic: "Validation" },
  { clause: "21 CFR Part 11.10(b)", req_id: "REQ-002", topic: "Audit Trail" },
  {
    clause: "21 CFR Part 11.10(c)",
    req_id: "REQ-003",
    topic: "Record Protection",
  },
  {
    clause: "21 CFR Part 11.10(d)",
    req_id: "REQ-004",
    topic: "Access Control",
  },
  { clause: "21 CFR Part 11.10(e)", req_id: "REQ-005", topic: "Audit Trails" },
  {
    clause: "21 CFR Part 11.10(f)",
    req_id: "REQ-006",
    topic: "Operational Checks",
  },
  {
    clause: "21 CFR Part 11.10(g)",
    req_id: "REQ-007",
    topic: "Authority Checks",
  },
  { clause: "21 CFR Part 11.10(h)", req_id: "REQ-008", topic: "Device Checks" },
  {
    clause: "21 CFR Part 11.10(i)",
    req_id: "REQ-009",
    topic: "Education & Training",
  },
  {
    clause: "21 CFR Part 11.10(j)",
    req_id: "REQ-010",
    topic: "Account Management",
  },
];

const OTHER_CLAUSES = [
  {
    clause: "ISO 9001:2015 §8.1",
    req_id: "ISO-001",
    topic: "Operations Planning",
  },
  {
    clause: "ISO 13485:2016 §7.3",
    req_id: "ISO-002",
    topic: "Design & Development",
  },
  {
    clause: "GDPR Article 25",
    req_id: "GDPR-001",
    topic: "Data Protection by Design",
  },
  {
    clause: "GDPR Article 32",
    req_id: "GDPR-002",
    topic: "Security of Processing",
  },
  { clause: "HIPAA §164.308", req_id: "HIPAA-001", topic: "Admin Safeguards" },
  {
    clause: "SOC 2 CC6.1",
    req_id: "SOC-001",
    topic: "Logical Access Controls",
  },
];

const STATUSES: ("Mapped" | "Partial" | "Not Mapped")[] = [
  "Mapped",
  "Mapped",
  "Mapped",
  "Partial",
  "Not Mapped",
];

function randomStatus(): string {
  return STATUSES[Math.floor(Math.random() * STATUSES.length)];
}

function parseTextStories(text: string): string[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.length > 0 ? lines : [text.trim()];
}

export async function runMappingService(
  regulatoryRequirement: string,
  textInput: string,
  _fileData: string,
): Promise<MappingResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1800));

  const clauses =
    regulatoryRequirement === "CFR PART 11" ? CFR_CLAUSES : OTHER_CLAUSES;

  let stories: string[] = [];
  if (textInput.trim()) {
    stories = parseTextStories(textInput);
  } else {
    stories = [
      "As a user, I need to log in with unique credentials",
      "As an admin, I need audit trails for all data changes",
      "As a user, I need my data to be encrypted at rest",
      "As a system, I must validate electronic signatures",
      "As an admin, I need role-based access control",
    ];
  }

  const data: MappingRow[] = [];
  for (const story of stories) {
    // Map each story to 1-3 clauses
    const numClauses = Math.min(
      1 + Math.floor(Math.random() * 2),
      clauses.length,
    );
    const shuffled = [...clauses]
      .sort(() => Math.random() - 0.5)
      .slice(0, numClauses);
    for (const c of shuffled) {
      data.push({
        user_story: story,
        regulatory_clause: c.clause,
        requirement_id: c.req_id,
        compliance_status: randomStatus(),
        notes: `Relates to ${c.topic}. Review required for full compliance assessment.`,
      });
    }
  }

  return { status: "success", data };
}
