import { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [databaseName, setDatabaseName] = useState("northwind");
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
      uploadFileToBackend(sqlFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".sql")) {
      setSelectedFile(file);
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
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Upload SQL Schema
        </h3>
        <p className="text-sm text-gray-600">
          Upload a SQL file to set up your database schema and data
        </p>
      </div>

      {/* Database Name Input */}
      <div className="mb-6">
        <label
          htmlFor="database-name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Database Name
        </label>
        <input
          type="text"
          id="database-name"
          value={databaseName}
          onChange={(e) => setDatabaseName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter database name"
          disabled={isUploading}
        />
        <p className="mt-1 text-xs text-gray-500">
          This will be the name of the database where your schema will be
          uploaded
        </p>
      </div>

      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
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
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <button
              onClick={handleRemoveFile}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              disabled={isUploading}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Upload Status */}
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <p className="text-sm text-blue-800">
              Uploading SQL file to database '{databaseName}'...
            </p>
          </div>
        </div>
      )}

      {uploadStatus.type === "success" && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">✓ {uploadStatus.message}</p>
        </div>
      )}

      {uploadStatus.type === "error" && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-800">✗ {uploadStatus.message}</p>
        </div>
      )}
    </div>
  );
}
