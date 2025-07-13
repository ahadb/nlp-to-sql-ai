import { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  FolderIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";
import StepTitle from "./StepTitle";

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
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [databaseName, setDatabaseName] = useState("my_database");
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFileToBackend = async (file: File) => {
    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      const data = await api.uploadSchema(file, databaseName);
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
    const sqlFile = files.find((file) => file.name.endsWith(".sql"));

    if (sqlFile) {
      setSelectedFile(sqlFile);
      // Auto-detect database name from filename
      const detectedName = sqlFile.name.replace(".sql", "").toLowerCase();
      setDatabaseName(detectedName);
      uploadFileToBackend(sqlFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".sql")) {
      setSelectedFile(file);
      // Auto-detect database name from filename
      const detectedName = file.name.replace(".sql", "").toLowerCase();
      setDatabaseName(detectedName);
      uploadFileToBackend(file);
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
      className={`w-full p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="mb-6 pb-3 border-b border-gray-200 -mx-6 px-6 bg-gray-50 -mt-6 pt-4 rounded-t-xl">
        <StepTitle
          title="Add Datasource"
          description="Upload a SQL file to set up your database schema and data"
          icon={DocumentTextIcon}
        />
      </div>

      {/* Database Name Input */}
      <div className="mb-6" onClick={(e) => e.stopPropagation()}>
        <label
          htmlFor="database-name"
          className="block text-sm font-medium text-gray-700 mb-3"
        >
          Database Name
        </label>
        <input
          type="text"
          id="database-name"
          value={databaseName}
          onChange={(e) => setDatabaseName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400 bg-white disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
          placeholder="Enter database name"
          disabled={isUploading || selectedFile !== null}
        />
        <p className="mt-2 text-xs text-gray-500">
          {selectedFile
            ? `Database name automatically detected from your file. You can remove the file to enter a custom name.`
            : "Database name will be automatically detected from your SQL file name, or you can enter a custom name"}
        </p>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        {!selectedFile ? (
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? "border-green-400 bg-green-50 shadow-lg scale-[1.02]"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
          >
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
              <CloudArrowUpIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-900">
                Drop your SQL file here, or click to browse
              </p>
              <p className="text-xs text-gray-500">
                Only .sql files are supported
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
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
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Uploading SQL file to database '{databaseName}'...
              </p>
              <p className="text-xs text-blue-600">
                File: {selectedFile?.name}
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadStatus.type === "success" && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-green-800 font-medium">
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}

      {uploadStatus.type === "error" && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-red-800 font-medium">
              {uploadStatus.message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
