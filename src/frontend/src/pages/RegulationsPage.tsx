import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookOpen, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

interface Clause {
  id: string;
  title: string;
  description: string;
}

interface Regulation {
  id: string;
  name: string;
  shortName: string;
  jurisdiction: string;
  description: string;
  clauseCount: number;
  clauses: Clause[];
}

const REGULATIONS: Regulation[] = [
  {
    id: "cfr11",
    name: "21 CFR Part 11",
    shortName: "CFR Part 11",
    jurisdiction: "USA (FDA)",
    description:
      "FDA regulation governing electronic records and electronic signatures in regulated industries. Sets requirements for ensuring the integrity of digital records.",
    clauseCount: 10,
    clauses: [
      {
        id: "11.10a",
        title: "§11.10(a) — Validation",
        description:
          "Systems must be validated to ensure accuracy, reliability, consistent intended performance, and the ability to discern invalid or altered records.",
      },
      {
        id: "11.10b",
        title: "§11.10(b) — Audit Trails",
        description:
          "Computer-generated audit trails must capture the date and time of operator entries and actions that create, modify, or delete electronic records.",
      },
      {
        id: "11.10d",
        title: "§11.10(d) — Access Control",
        description:
          "Limiting system access to authorised individuals is required through appropriate authority checks.",
      },
      {
        id: "11.10e",
        title: "§11.10(e) — Operational Checks",
        description:
          "Operational system checks must enforce permitted sequencing of steps and events as appropriate.",
      },
      {
        id: "11.50",
        title: "§11.50 — Signature Manifestations",
        description:
          "Signed electronic records must contain printed name, date/time, and meaning of the signature.",
      },
    ],
  },
  {
    id: "gdpr",
    name: "General Data Protection Regulation",
    shortName: "GDPR",
    jurisdiction: "European Union",
    description:
      "EU regulation on data protection and privacy for all individuals within the EU. Governs how organisations collect, process, and store personal data.",
    clauseCount: 99,
    clauses: [
      {
        id: "art5",
        title: "Article 5 — Principles",
        description:
          "Personal data must be processed lawfully, fairly, transparently, and for specified, explicit, legitimate purposes.",
      },
      {
        id: "art17",
        title: "Article 17 — Right to Erasure",
        description:
          "Data subjects have the right to obtain erasure of personal data without undue delay under certain conditions.",
      },
      {
        id: "art25",
        title: "Article 25 — Privacy by Design",
        description:
          "Controllers must implement data protection by design and by default in all processing activities.",
      },
      {
        id: "art32",
        title: "Article 32 — Security of Processing",
        description:
          "Appropriate technical and organisational measures to ensure a level of security appropriate to the risk.",
      },
      {
        id: "art83",
        title: "Article 83 — Penalties",
        description:
          "Fines of up to €20 million or 4% of annual global turnover for serious infringements.",
      },
    ],
  },
  {
    id: "hipaa",
    name: "Health Insurance Portability and Accountability Act",
    shortName: "HIPAA",
    jurisdiction: "USA (HHS)",
    description:
      "US law protecting sensitive patient health information. Requires administrative, physical, and technical safeguards to ensure confidentiality, integrity, and availability of PHI.",
    clauseCount: 18,
    clauses: [
      {
        id: "164.308",
        title: "§164.308 — Administrative Safeguards",
        description:
          "Policies and procedures to manage security measures protecting ePHI, including workforce training and access management.",
      },
      {
        id: "164.310",
        title: "§164.310 — Physical Safeguards",
        description:
          "Physical access controls to protect systems housing ePHI from unauthorised access.",
      },
      {
        id: "164.312",
        title: "§164.312 — Technical Safeguards",
        description:
          "Technology, policies, and procedures for protecting ePHI and controlling access to it.",
      },
      {
        id: "164.316",
        title: "§164.316 — Documentation",
        description:
          "Maintain written policies and procedures and document all required activities, actions, and assessments.",
      },
    ],
  },
  {
    id: "iso13485",
    name: "ISO 13485:2016",
    shortName: "ISO 13485",
    jurisdiction: "International",
    description:
      "International standard specifying requirements for a quality management system for organisations involved in the design, production, and servicing of medical devices.",
    clauseCount: 8,
    clauses: [
      {
        id: "7.3",
        title: "§7.3 — Design and Development",
        description:
          "Requirements for planning, inputs, outputs, review, verification, validation, and transfer of medical device design.",
      },
      {
        id: "7.5",
        title: "§7.5 — Production and Service Provision",
        description:
          "Control of production processes, cleanliness, installation, and servicing activities.",
      },
      {
        id: "8.2",
        title: "§8.2 — Monitoring and Measurement",
        description:
          "Monitoring of customer satisfaction, internal audits, and measurement of processes and products.",
      },
    ],
  },
  {
    id: "soc2",
    name: "SOC 2 — Trust Services Criteria",
    shortName: "SOC 2",
    jurisdiction: "USA (AICPA)",
    description:
      "Auditing standard for service organisations to demonstrate effective controls over security, availability, processing integrity, confidentiality, and privacy.",
    clauseCount: 9,
    clauses: [
      {
        id: "cc6.1",
        title: "CC6.1 — Logical Access Controls",
        description:
          "The entity implements logical access security software, infrastructure, and architectures to protect information assets.",
      },
      {
        id: "cc7.1",
        title: "CC7.1 — System Operations",
        description:
          "Detection and monitoring of new vulnerabilities to meet the entity's objectives related to security.",
      },
      {
        id: "cc8.1",
        title: "CC8.1 — Change Management",
        description:
          "The entity authorises, designs, develops, tests, approves, and implements changes to meet objectives.",
      },
    ],
  },
  {
    id: "iso9001",
    name: "ISO 9001:2015",
    shortName: "ISO 9001",
    jurisdiction: "International",
    description:
      "International standard for quality management systems applicable to any organisation. Focuses on meeting customer requirements, continual improvement, and evidence-based decision making.",
    clauseCount: 10,
    clauses: [
      {
        id: "8.1",
        title: "§8.1 — Operational Planning",
        description:
          "Plan, implement, control, and review processes needed to meet product/service requirements.",
      },
      {
        id: "9.1",
        title: "§9.1 — Performance Evaluation",
        description:
          "Monitor, measure, analyse, and evaluate the quality management system and its performance.",
      },
      {
        id: "10.3",
        title: "§10.3 — Continual Improvement",
        description:
          "Continually improve the suitability, adequacy, and effectiveness of the QMS.",
      },
    ],
  },
];

export default function RegulationsPage() {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = REGULATIONS.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.shortName.toLowerCase().includes(search.toLowerCase()) ||
      r.jurisdiction.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AppLayout
      title="Regulations Base"
      subtitle="Reference library of regulatory frameworks and their key requirements."
    >
      <div className="mb-5 relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          data-ocid="regulations.search_input"
          placeholder="Search regulations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9 text-sm"
        />
      </div>

      {filtered.length === 0 ? (
        <div
          data-ocid="regulations.empty_state"
          className="py-16 text-center text-muted-foreground"
        >
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No regulations found matching "{search}"</p>
        </div>
      ) : (
        <div data-ocid="regulations.list" className="space-y-3">
          {filtered.map((reg, i) => {
            const isExpanded = expandedId === reg.id;
            return (
              <div
                key={reg.id}
                data-ocid={`regulations.item.${i + 1}`}
                className="bg-card border border-border rounded-lg overflow-hidden"
              >
                <button
                  type="button"
                  className="w-full text-left px-5 py-4 flex items-start gap-4 hover:bg-accent/30 transition-colors"
                  onClick={() => setExpandedId(isExpanded ? null : reg.id)}
                  data-ocid={`regulations.toggle.${i + 1}`}
                >
                  <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm font-semibold text-foreground">
                        {reg.name}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                        {reg.jurisdiction}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {reg.clauseCount} key clauses
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {reg.description}
                    </p>
                  </div>
                  <div className="shrink-0 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-5 py-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Key Clauses
                    </h4>
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                            Clause
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                            Description
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reg.clauses.map((clause) => (
                          <TableRow key={clause.id}>
                            <TableCell className="text-sm font-medium whitespace-nowrap align-top w-52">
                              {clause.title}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {clause.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
