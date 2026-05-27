"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { useInterviewStore } from "../../store/interview-store";

export default function ResumeUpload() {
  const { resumeFile, setResumeFile } = useInterviewStore();
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);

    if (rejectedFiles.length > 0) {
      const rej = rejectedFiles[0];
      if (rej.file.size > 5 * 1024 * 1024) {
        setError("File is too large. Max size is 5MB.");
      } else {
        setError("Unsupported file format. Only PDF and DOCX files are allowed.");
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      setResumeFile(acceptedFiles[0]);
    }
  }, [setResumeFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"]
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  });

  const handleRemove = () => {
    setResumeFile(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Upload className="h-5 w-5 text-cyan-400" /> Upload Professional Resume
        </h3>
        <p className="text-xs text-slate-400">
          Our parser analyzes resume structures to extract technical frameworks, architectural expertise, and engineering credentials.
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-xs font-semibold text-red-400">
          <AlertCircle className="h-4.5 w-4.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {!resumeFile ? (
        <div 
          {...getRootProps()}
          className={`group border-2 border-dashed rounded-2xl py-14 flex flex-col items-center justify-center gap-3.5 cursor-pointer transition-all duration-300 ${
            isDragActive 
              ? "border-cyan-400 bg-cyan-400/5 shadow-[0_0_20px_rgba(34,211,238,0.1)]" 
              : "border-white/10 hover:border-cyan-400/50 bg-white/2 hover:bg-white/4"
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
            <Upload className="h-6 w-6 text-slate-400 group-hover:text-cyan-400" />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-sm font-bold text-slate-200">
              {isDragActive ? "Drop the file here" : "Drag & Drop Resume here"}
            </p>
            <p className="text-xs text-slate-500">Supports PDF or DOCX format (Max 5MB)</p>
          </div>
          <span className="rounded-lg bg-cyan-400/10 px-3.5 py-1 text-[10px] font-bold text-cyan-400 border border-cyan-400/20 uppercase tracking-wide">
            Select File
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/3 p-5 flex items-start justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                <FileText className="h-6 w-6 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-white">{resumeFile.name}</h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {(resumeFile.size / 1024).toFixed(1)} KB • Ready for matching
                </p>
                <button 
                  onClick={handleRemove}
                  className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition-colors uppercase tracking-wide cursor-pointer"
                >
                  Remove File
                </button>
              </div>
            </div>
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
