import { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  TableCellsIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";
import StepTitle from "./StepTitle";
import { useApp } from "../contexts/AppContext";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export default function FileUpload({
  onFileUpload,
  isSelected = false,
  onSelect,
}: FileUploadProps) {
  const { setCurrentSchema } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<"sql" | "csv" | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileToBackend = async (file: File) => {
    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const data = await api.uploadSchema(file);

      // Extract schema from upload response and set in context
      if (data.schema) {
        const schemaMatch = data.schema.match(/^schema_(.+)$/);
        if (schemaMatch) {
          const extractedSchema = schemaMatch[1]; // e.g., "csv" from "schema_csv"
          setCurrentSchema(extractedSchema);
          console.log("Schema extracted and set:", extractedSchema);
        }
      }

      setUploadStatus({
        type: "success",
        message: data.message || "File uploaded successfully!",
      });

      // Call the parent callback
      onFileUpload(file);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const supportedFile = files.find(
      (file) => file.name.endsWith(".sql") || file.name.endsWith(".csv")
    );

    if (supportedFile) {
      setSelectedFile(supportedFile);

      // Set file type
      const isCSV = supportedFile.name.endsWith(".csv");
      setFileType(isCSV ? "csv" : "sql");

      uploadFileToBackend(supportedFile);

      // Select this section when file is dropped
      onSelect?.();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.name.endsWith(".sql") || file.name.endsWith(".csv"))) {
      setSelectedFile(file);

      // Set file type
      const isCSV = file.name.endsWith(".csv");
      setFileType(isCSV ? "csv" : "sql");

      uploadFileToBackend(file);

      // Select this section when file is selected
      onSelect?.();
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadStatus({ type: null, message: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
    // all card
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer relative z-10 bg-gray-800 ${
        isSelected
          ? "border-blue-900 bg-blue-900/20 shadow-lg"
          : "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
      }`}
      onClick={onSelect}
    >
      <div className="mb-4 pb-2 border-b border-gray-700 -mx-4 px-4 bg-gray-800 -mt-4 pt-3 rounded-t-xl">
        <StepTitle
          title="Add Datasource"
          description="Upload SQL schema files or CSV data files to add tables to your database"
          icon={DocumentTextIcon}
        />
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 bg-gray-900 ${
              isDragOver
                ? "border-green-400 bg-green-900/20 shadow-lg scale-[1.02]"
                : "border-gray-600 hover:border-gray-500 hover:bg-gray-800"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-3">
              <CloudArrowUpIcon className="h-6 w-6 text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-100">
                Drop your SQL or CSV file here, or click to browse
              </p>
              <p className="text-xs text-gray-400">
                Supported formats: .sql (schema + data) • .csv (data only)
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-gray-600 rounded-xl p-4 bg-green-900/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-lg ${
                    fileType === "csv" ? "bg-blue-900" : "bg-green-900"
                  }`}
                >
                  {fileType === "csv" ? (
                    <TableCellsIcon className="h-6 w-6 text-blue-400" />
                  ) : (
                    <DocumentTextIcon className="h-6 w-6 text-green-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-100">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {fileType === "csv" ? "CSV Data File" : "SQL Schema File"} •{" "}
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                disabled={isUploading}
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
            <div>
              <p className="text-sm text-blue-300 font-medium">
                {fileType === "csv"
                  ? "Processing CSV data in the cloud..."
                  : "Uploading SQL schema to the cloud..."}
              </p>
              <p className="text-xs text-blue-400">
                File: {selectedFile?.name} ({fileType?.toUpperCase()})
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadStatus.type === "success" && (
        <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-green-300 font-medium">
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}

      {uploadStatus.type === "error" && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-red-300 font-medium">
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
