import { useState, useRef } from "react";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  XMarkIcon,
  TableCellsIcon,
  ExclamationTriangleIcon,
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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [fileType, setFileType] = useState<"sql" | "csv" | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [activeTab, setActiveTab] = useState<"upload" | "integrations">("upload");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMultipleFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadStatus({ type: null, message: "" });

    try {
      let successCount = 0;
      let errorCount = 0;

      for (const file of files) {
        try {
          await uploadSingleFile(file);
          successCount++;
        } catch (error) {
          errorCount++;
          console.error(`Failed to upload ${file.name}:`, error);
        }
      }

      if (errorCount === 0) {
        setUploadStatus({
          type: "success",
          message: `Successfully uploaded ${successCount} file${successCount > 1 ? 's' : ''}!`,
        });
      } else if (successCount > 0) {
        setUploadStatus({
          type: "success",
          message: `Uploaded ${successCount} files, ${errorCount} failed`,
        });
      } else {
        setUploadStatus({
          type: "error",
          message: `Failed to upload ${errorCount} file${errorCount > 1 ? 's' : ''}`,
        });
      }

      // Call the parent callback for each successful file
      files.forEach(file => onFileUpload(file));
      
    } catch (error) {
      setUploadStatus({
        type: "error",
        message: "Upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const uploadSingleFile = async (file: File) => {
    const data = await api.uploadSchema(file);
    
    // Extract schema from upload response and set in context
    if (data.schema) {
      const schemaMatch = data.schema.match(/^schema_(.+)$/);
      if (schemaMatch) {
        const extractedSchema = schemaMatch[1];
        setCurrentSchema(extractedSchema);
      }
    }
    
    return data;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    // Disabled in demo - will be enabled in production
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // Disabled in demo - will be enabled in production
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Disabled in demo - will be enabled in production
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const supportedFiles = files.filter(
      (file) => file.name.endsWith(".sql") || file.name.endsWith(".csv")
    );

    if (supportedFiles.length > 0) {
      setSelectedFiles(supportedFiles);
      uploadMultipleFiles(supportedFiles);
      onSelect?.();
    }
  };

  const handleRemoveFile = (index?: number) => {
    if (index !== undefined) {
      // Remove specific file
      setSelectedFiles(files => files.filter((_, i) => i !== index));
    } else {
      // Remove all files
      setSelectedFiles([]);
      setUploadStatus({ type: null, message: "" });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-200">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        <button
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
            activeTab === "upload"
              ? "text-blue-400 border-blue-400 bg-blue-500/10"
              : "text-gray-400 border-gray-600/50 hover:text-gray-300 hover:border-gray-500/50 hover:bg-gray-700/20"
          }`}
        >
          Upload
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
            activeTab === "integrations"
              ? "text-blue-400 border-blue-400 bg-blue-500/10"
              : "text-gray-400 border-gray-600/50 hover:text-gray-300 hover:border-gray-500/50 hover:bg-gray-700/20"
          }`}
        >
          Integrations
        </button>
      </div>

      {/* Tab Content */}
      <div onClick={(e) => e.stopPropagation()}>
        {activeTab === "upload" ? (
          <>
            {selectedFiles.length === 0 ? (
              <div
                className="relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 bg-gray-800/30 border-gray-600/50"
              >
            <div className="space-y-3">
              <div className="mx-auto w-fit">
                <CloudArrowUpIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-400">
                File upload disabled in demo
              </p>
              <p className="text-xs text-gray-500">
                Use "Load Data" button above for sample data
              </p>
              <div className="mt-3 p-3 bg-indigo-500/10 border border-indigo-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-orange-600" />
                  <p className="text-sm text-indigo-300">
                    Drag & drop disabled in demo - will be enabled in production
                  </p>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".sql,.csv"
              multiple
              onChange={handleFileSelect}
              disabled
              className="hidden"
            />
              </div>
            ) : (
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="border border-gray-600 rounded-lg p-3 bg-green-900/20 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          file.name.endsWith('.csv') ? "bg-blue-900" : "bg-green-900"
                        }`}>
                          {file.name.endsWith('.csv') ? (
                            <TableCellsIcon className="h-5 w-5 text-blue-400" />
                          ) : (
                            <DocumentTextIcon className="h-5 w-5 text-green-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{file.name}</p>
                          <p className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

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
                      Uploading {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}...
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
          </>
        ) : (
          /* Integrations Tab */
          <div className="space-y-4">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">🔗</span>
              </div>
              <h3 className="text-white font-medium mb-2">Database Integrations</h3>
              <p className="text-gray-400 text-sm mb-6">
                Connect directly to your databases and data sources
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🐘</div>
                  <p className="text-sm text-gray-300">PostgreSQL</p>
                </div>
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🐬</div>
                  <p className="text-sm text-gray-300">MySQL</p>
                </div>
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🔷</div>
                  <p className="text-sm text-gray-300">MongoDB</p>
                </div>
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-sm text-gray-300">BigQuery</p>
                </div>
              </div>
              
              <div className="mt-6 p-3 bg-indigo-500/10 border border-indigo-400/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-4 w-4 text-orange-600" />
                  <p className="text-xs text-indigo-300">
                    Integrations coming soon - contact us to set up your data connections
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
