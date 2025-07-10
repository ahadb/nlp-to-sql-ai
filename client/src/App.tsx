import { useState } from "react";
import {
  Sidebar,
  MobileSidebar,
  TopBar,
  Layout,
  FileUpload,
} from "./components";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFileUpload = (file: File) => {
    console.log("File uploaded successfully:", file.name);
    // The actual upload is now handled in the FileUpload component
    // This callback can be used for additional actions after successful upload
  };

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
        <MobileSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <Sidebar />
        <TopBar setSidebarOpen={setSidebarOpen} />
        <Layout
          leftChildren={
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                  SQL Schema Upload
                </h1>
                <p className="mt-2 text-gray-600">
                  Upload your database schema to get started
                </p>
              </div>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          }
          rightChildren={
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900">
                  Query Interface
                </h2>
                <p className="mt-2 text-gray-600">
                  Ask questions about your data
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-600">
                  Query interface will be implemented here...
                </p>
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}
