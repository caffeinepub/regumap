import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import AppLayout from "../components/AppLayout";
import { type MappingRow, runMappingService } from "../services/mappingService";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

function StatusBadge({ status }: { status: string }) {
  if (status === "Mapped") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200">
        Mapped
      </span>
    );
  }
  if (status === "Partial") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
        Partial
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
      Not Mapped
    </span>
  );
}

function exportCSV(rows: MappingRow[]) {
  const headers = [
    "User Story",
    "Regulatory Clause",
    "Requirement ID",
    "Compliance Status",
    "Notes",
  ];
  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        `"${r.user_story.replace(/"/g, '""')}"`,
        `"${r.regulatory_clause.replace(/"/g, '""')}"`,
        `"${r.requirement_id}"`,
        `"${r.compliance_status}"`,
        `"${r.notes.replace(/"/g, '""')}"`,
      ].join(","),
    ),
  ];
  const blob = new Blob([csvLines.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mapping_output.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function DashboardPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [textInput, setTextInput] = useState("");
  const [regulatory, setRegulatory] = useState<"CFR PART 11" | "OTHER">(
    "CFR PART 11",
  );
  const [isRunning, setIsRunning] = useState(false);
  const [inputError, setInputError] = useState("");
  const [results, setResults] = useState<MappingRow[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileDrop(e: React.DragEvent<HTMLElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  }

  function handleFileSelect(file: File) {
    setFileError("");
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") {
      setFileError("Only .csv and .xlsx files are accepted");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File size must be under 10MB");
      return;
    }
    setUploadedFile(file);
  }

  async function handleRunMapping() {
    setInputError("");
    if (!uploadedFile && !textInput.trim()) {
      setInputError(
        "Please upload a file or enter a user story before running mapping.",
      );
      return;
    }
    setIsRunning(true);
    setResults(null);
    try {
      let fileData = "";
      if (uploadedFile) {
        fileData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve((reader.result as string).split(",")[1] || "");
          reader.onerror = reject;
          reader.readAsDataURL(uploadedFile);
        });
      }
      const result = await runMappingService(regulatory, textInput, fileData);
      setResults(result.data);
      toast.success(`Mapping complete — ${result.data.length} rows generated`);
    } catch {
      toast.error("Mapping failed. Please try again.");
    } finally {
      setIsRunning(false);
    }
  }

  const displayRows = results ? results.slice(0, 20) : [];

  return (
    <AppLayout
      title="Regulatory Mapping Dashboard"
      subtitle="Upload files or enter user stories to map against regulatory requirements."
    >
      {/* Start Mapping Project Card */}
      <div className="bg-card border border-border rounded-lg shadow-card mb-6">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">
            Start Mapping Project
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete the steps below and click Run Mapping
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  Upload Files
                </h3>
              </div>
              <button
                type="button"
                data-ocid="mapping.dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/40 hover:bg-accent/50 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {uploadedFile ? (
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground font-medium truncate max-w-[120px]">
                      {uploadedFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setUploadedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="text-muted-foreground hover:text-destructive"
                      data-ocid="mapping.delete_button"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      Drop file here or click
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      .csv or .xlsx · max 10MB
                    </p>
                  </>
                )}
              </button>
              {fileError && (
                <div
                  data-ocid="mapping.file_error"
                  className="flex items-center gap-1.5 mt-2 text-xs text-destructive"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {fileError}
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  Paste Content
                </h3>
              </div>
              <Textarea
                data-ocid="mapping.textarea"
                placeholder={
                  "Enter User Story\n\ne.g. As a user, I need to log in with unique credentials..."
                }
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="min-h-[140px] text-sm resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1.5">
                Optional if a file is uploaded.
              </p>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="text-sm font-semibold text-foreground">
                  Select Requirements
                </h3>
              </div>
              <fieldset className="space-y-3">
                <legend className="text-xs text-muted-foreground mb-3">
                  Select Regulatory Requirement
                </legend>
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    regulatory === "CFR PART 11"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <input
                    data-ocid="mapping.cfr_radio"
                    type="radio"
                    name="regulatory"
                    value="CFR PART 11"
                    checked={regulatory === "CFR PART 11"}
                    onChange={() => setRegulatory("CFR PART 11")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      CFR PART 11
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      FDA electronic records & signatures
                    </p>
                  </div>
                </label>
                <label
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    regulatory === "OTHER"
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <input
                    data-ocid="mapping.other_radio"
                    type="radio"
                    name="regulatory"
                    value="OTHER"
                    checked={regulatory === "OTHER"}
                    onChange={() => setRegulatory("OTHER")}
                    className="mt-0.5 accent-primary"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      OTHER
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      ISO, GDPR, HIPAA, SOC 2 and more
                    </p>
                  </div>
                </label>
              </fieldset>
            </div>
          </div>

          {inputError && (
            <div
              data-ocid="mapping.error_state"
              className="flex items-center gap-2 mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {inputError}
            </div>
          )}

          <div className="mt-6">
            <Button
              data-ocid="mapping.submit_button"
              onClick={handleRunMapping}
              disabled={isRunning}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Running Mapping...
                </>
              ) : (
                "Run Mapping"
              )}
            </Button>
          </div>

          <AnimatePresence>
            {isRunning && (
              <motion.div
                data-ocid="mapping.loading_state"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-3 rounded-md bg-primary/5 border border-primary/15 text-sm text-primary font-medium text-center"
              >
                Processing your mapping request — this may take a moment...
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results Card */}
      <AnimatePresence>
        {results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-border rounded-lg shadow-card"
          >
            <div className="px-6 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Mapping Results
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {displayRows.length} of {results.length} rows
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="secondary" className="text-xs">
                  {
                    results.filter((r) => r.compliance_status === "Mapped")
                      .length
                  }{" "}
                  Mapped
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {
                    results.filter((r) => r.compliance_status === "Partial")
                      .length
                  }{" "}
                  Partial
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {
                    results.filter((r) => r.compliance_status === "Not Mapped")
                      .length
                  }{" "}
                  Not Mapped
                </Badge>
                <Button
                  data-ocid="results.export_button"
                  size="sm"
                  variant="outline"
                  onClick={() => exportCSV(results)}
                  className="ml-2 text-sm font-medium"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  Export CSV
                </Button>
              </div>
            </div>
            <ScrollArea className="max-h-[480px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      User Story
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Regulatory Clause
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Requirement ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Notes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayRows.map((row, i) => (
                    <TableRow
                      key={`${row.requirement_id}-${i}`}
                      data-ocid={`results.item.${i + 1}`}
                      className="hover:bg-muted/30"
                    >
                      <TableCell
                        className="text-sm max-w-[180px] truncate"
                        title={row.user_story}
                      >
                        {row.user_story}
                      </TableCell>
                      <TableCell className="text-sm font-medium whitespace-nowrap">
                        {row.regulatory_clause}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {row.requirement_id}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={row.compliance_status} />
                      </TableCell>
                      <TableCell
                        className="text-sm text-muted-foreground max-w-[200px] truncate"
                        title={row.notes}
                      >
                        {row.notes}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
            {results.length > 20 && (
              <div className="px-6 py-3 border-t border-border text-xs text-muted-foreground text-center">
                Showing first 20 rows. Export CSV to download all{" "}
                {results.length} rows.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
