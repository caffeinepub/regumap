import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, Eye, FolderOpen, Plus } from "lucide-react";
import { useState } from "react";
import AppLayout from "../components/AppLayout";

interface Project {
  id: string;
  name: string;
  regulatory: string;
  createdAt: string;
  status: "Completed" | "In Progress";
  rowCount: number;
}

interface MockRow {
  key: string;
  user_story: string;
  regulatory_clause: string;
  requirement_id: string;
  compliance_status: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "Patient Portal Login Flow",
    regulatory: "CFR PART 11",
    createdAt: "2026-03-10",
    status: "Completed",
    rowCount: 14,
  },
  {
    id: "p2",
    name: "Electronic Signature Module",
    regulatory: "CFR PART 11",
    createdAt: "2026-03-15",
    status: "Completed",
    rowCount: 22,
  },
  {
    id: "p3",
    name: "GDPR Data Retention Policy",
    regulatory: "OTHER",
    createdAt: "2026-03-18",
    status: "In Progress",
    rowCount: 9,
  },
  {
    id: "p4",
    name: "Audit Trail Implementation",
    regulatory: "CFR PART 11",
    createdAt: "2026-03-20",
    status: "In Progress",
    rowCount: 11,
  },
  {
    id: "p5",
    name: "HIPAA Access Control Review",
    regulatory: "OTHER",
    createdAt: "2026-03-22",
    status: "Completed",
    rowCount: 18,
  },
  {
    id: "p6",
    name: "ISO 13485 Design Controls",
    regulatory: "OTHER",
    createdAt: "2026-03-24",
    status: "In Progress",
    rowCount: 7,
  },
];

const MOCK_ROWS: Record<string, MockRow[]> = {
  p1: [
    {
      key: "p1-r1",
      user_story: "As a user, I need to log in with unique credentials",
      regulatory_clause: "21 CFR Part 11.10(d)",
      requirement_id: "REQ-004",
      compliance_status: "Mapped",
    },
    {
      key: "p1-r2",
      user_story: "As a user, I need my session to timeout after inactivity",
      regulatory_clause: "21 CFR Part 11.10(g)",
      requirement_id: "REQ-007",
      compliance_status: "Mapped",
    },
    {
      key: "p1-r3",
      user_story: "As an admin, I need to reset user passwords",
      regulatory_clause: "21 CFR Part 11.10(j)",
      requirement_id: "REQ-010",
      compliance_status: "Partial",
    },
  ],
  p2: [
    {
      key: "p2-r1",
      user_story: "As a user, I need to apply my electronic signature",
      regulatory_clause: "21 CFR Part 11.50",
      requirement_id: "REQ-050",
      compliance_status: "Mapped",
    },
    {
      key: "p2-r2",
      user_story: "As a system, I must link signatures to records",
      regulatory_clause: "21 CFR Part 11.70",
      requirement_id: "REQ-070",
      compliance_status: "Mapped",
    },
    {
      key: "p2-r3",
      user_story: "As a user, I need to authenticate before signing",
      regulatory_clause: "21 CFR Part 11.200",
      requirement_id: "REQ-200",
      compliance_status: "Partial",
    },
  ],
  p3: [
    {
      key: "p3-r1",
      user_story: "As a user, I need my data deleted on request",
      regulatory_clause: "GDPR Article 17",
      requirement_id: "GDPR-017",
      compliance_status: "In Progress",
    },
    {
      key: "p3-r2",
      user_story: "As a user, I need to know how my data is used",
      regulatory_clause: "GDPR Article 13",
      requirement_id: "GDPR-013",
      compliance_status: "Mapped",
    },
  ],
  p4: [
    {
      key: "p4-r1",
      user_story: "As an admin, I need all data changes logged",
      regulatory_clause: "21 CFR Part 11.10(e)",
      requirement_id: "REQ-005",
      compliance_status: "Mapped",
    },
    {
      key: "p4-r2",
      user_story: "As an auditor, I need tamper-proof logs",
      regulatory_clause: "21 CFR Part 11.10(b)",
      requirement_id: "REQ-002",
      compliance_status: "Partial",
    },
  ],
  p5: [
    {
      key: "p5-r1",
      user_story: "As an admin, I need role-based access to PHI",
      regulatory_clause: "HIPAA §164.308(a)(4)",
      requirement_id: "HIPAA-004",
      compliance_status: "Mapped",
    },
    {
      key: "p5-r2",
      user_story: "As a user, I need MFA for sensitive data access",
      regulatory_clause: "HIPAA §164.312(d)",
      requirement_id: "HIPAA-012",
      compliance_status: "Mapped",
    },
  ],
  p6: [
    {
      key: "p6-r1",
      user_story: "As a designer, I need design inputs documented",
      regulatory_clause: "ISO 13485:2016 §7.3.3",
      requirement_id: "ISO-003",
      compliance_status: "Partial",
    },
    {
      key: "p6-r2",
      user_story: "As a QA, I need design verification records",
      regulatory_clause: "ISO 13485:2016 §7.3.6",
      requirement_id: "ISO-006",
      compliance_status: "Not Mapped",
    },
  ],
};

function StatusBadge({ status }: { status: string }) {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-50 text-green-700 border border-green-200 hover:bg-green-50">
        {status}
      </Badge>
    );
  }
  return (
    <Badge className="bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-50">
      {status}
    </Badge>
  );
}

function ComplianceBadge({ status }: { status: string }) {
  if (status === "Mapped")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        Mapped
      </span>
    );
  if (status === "Partial")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
        Partial
      </span>
    );
  if (status === "In Progress")
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
        In Progress
      </span>
    );
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      Not Mapped
    </span>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <AppLayout
      title="My Projects"
      subtitle="Manage and review your regulatory mapping projects."
      headerRight={
        <Button
          data-ocid="projects.new_project.primary_button"
          size="sm"
          onClick={() => navigate({ to: "/dashboard" })}
          className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          New Project
        </Button>
      }
    >
      {MOCK_PROJECTS.length === 0 ? (
        <div
          data-ocid="projects.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-1">
            No projects yet
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first regulatory mapping project.
          </p>
          <Button
            onClick={() => navigate({ to: "/dashboard" })}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-1.5" /> New Project
          </Button>
        </div>
      ) : (
        <div
          data-ocid="projects.list"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        >
          {MOCK_PROJECTS.map((project, i) => (
            <div
              key={project.id}
              data-ocid={`projects.item.${i + 1}`}
              className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                  <FolderOpen className="w-4 h-4 text-primary" />
                </div>
                <StatusBadge status={project.status} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {project.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {project.regulatory}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-3.5 h-3.5" />
                  {project.createdAt}
                </span>
                <span>{project.rowCount} rows</span>
              </div>
              <Button
                data-ocid={`projects.view.button.${i + 1}`}
                size="sm"
                variant="outline"
                className="w-full mt-1 text-sm"
                onClick={() => setSelectedProject(project)}
              >
                <Eye className="w-3.5 h-3.5 mr-1.5" />
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => {
          if (!open) setSelectedProject(null);
        }}
      >
        <DialogContent
          data-ocid="projects.dialog"
          className="max-w-3xl max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>{selectedProject?.name}</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div>
              <div className="flex items-center gap-3 mb-4 text-sm text-muted-foreground">
                <span>{selectedProject.regulatory}</span>
                <span>·</span>
                <span>{selectedProject.createdAt}</span>
                <StatusBadge status={selectedProject.status} />
              </div>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                      User Story
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                      Clause
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                      Req. ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(MOCK_ROWS[selectedProject.id] || []).map((row) => (
                    <TableRow key={row.key}>
                      <TableCell
                        className="text-sm max-w-[200px] truncate"
                        title={row.user_story}
                      >
                        {row.user_story}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {row.regulatory_clause}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {row.requirement_id}
                      </TableCell>
                      <TableCell>
                        <ComplianceBadge status={row.compliance_status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
