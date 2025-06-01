"use client";

import {
  AlertCircleIcon,
  PaperclipIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import { formatBytes, useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";
import { useEffect, useState } from "react";
import { useStrongData } from "@/context/StrongDataContext";

type CsvRow = {
  Date: string;
  "Workout Name": string;
  "Exercise Name": string;
  Weight: string;
  Reps: string;
};

type ParsedRow = {
  date: Date;
  workout: string;
  exercise: string;
  weight: number;
  reps: number;
  volume: number;
};

export default function FileUpload() {
  const { setData } = useStrongData();
  const maxSize = 10 * 1024 * 1024;

  const [parsedData, setParsedData] = useState<ParsedRow[] | null>(null);

  const [
    { files, isDragging, errors },
    {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      removeFile,
      getInputProps,
    },
  ] = useFileUpload({ maxSize, accept: ".csv" }); // ✅ only accept CSV

  const file = files[0];

  useEffect(() => {
    if (!file) return;

    Papa.parse<CsvRow>(file.file as File, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data;

        const parsed: ParsedRow[] = rows.map((row) => ({
          date: new Date(row.Date),
          workout: row["Workout Name"],
          exercise: row["Exercise Name"],
          weight: parseFloat(row.Weight) || 0,
          reps: parseFloat(row.Reps) || 0,
          volume: (parseFloat(row.Weight) || 0) * (parseFloat(row.Reps) || 0),
        }));

        console.log("Parsed CSV rows:", parsed);
        setParsedData(parsed);
      },
    });
  }, [file]);

  return (
    <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
      <div
        role="button"
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        data-dragging={isDragging || undefined}
        className="border-input bg-white hover:cursor-pointer hover:bg-neutral-100/75 group hover:border-neutral-300/75 data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed p-4 transition-colors"
      >
        <input
          {...getInputProps()}
          className="sr-only"
          aria-label="Upload file"
          disabled={Boolean(file)}
        />

        <div className="flex flex-col items-center justify-center text-center">
          <div className="bg-background mb-2 flex size-11 items-center justify-center rounded-full border group-hover:border-neutral-300/75">
            <UploadIcon className="size-4 opacity-60" />
          </div>
          <p className="mb-1.5 text-sm font-medium">Upload strong.csv</p>
          <p className="text-muted-foreground text-xs">
            Drag & drop or click to browse (max. {formatBytes(maxSize)})
          </p>
        </div>
      </div>

      {errors.length > 0 && (
        <div
          className="text-destructive flex items-center gap-1 text-xs"
          role="alert"
        >
          <AlertCircleIcon className="size-3" />
          <span>{errors[0]}</span>
        </div>
      )}

      {file && (
        <div className="space-y-2">
          <div
            key={file.id}
            className="flex items-center justify-between gap-2 rounded-xl border bg-white px-4 py-2"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <PaperclipIcon className="size-4 opacity-60" />
              <p className="truncate text-[13px] font-medium">
                {file.file.name}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="text-muted-foreground/80 hover:cursor-pointer hover:text-foreground -me-2 size-8 hover:bg-transparent"
              onClick={() => removeFile(file.id)}
              aria-label="Remove file"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {parsedData && (
        <Button
          onClick={() => {
            console.log("Submitting parsed data:", parsedData);
            setData(parsedData);
          }}
          className="w-full hover:cursor-pointer"
        >
          Load Data
        </Button>
      )}
    </div>
  );
}
