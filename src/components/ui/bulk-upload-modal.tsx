import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { icons } from "@/Constants/icons";
import { useBulkUploadProducts } from "@/Api/queriesAndMutations";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BulkUploadModal = ({ isOpen, onClose }: BulkUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkUploadMutation = useBulkUploadProducts();

  const handleFileSelect = (file: File) => {
    // Check if file is Excel format
    const validExtensions = ['.xlsx', '.xls'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error("Please select a valid Excel file (.xlsx or .xls)");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    try {
      const result = await bulkUploadMutation.mutateAsync(selectedFile);
      
      toast.success(
        `Upload successful! Created: ${result.data?.created_count || 0}, Updated: ${result.data?.updated_count || 0}`
      );
      
      // Reset form and close modal
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Upload failed. Please try again.");
    }
  };

  const handleClose = () => {
    if (!bulkUploadMutation.isPending) {
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-card rounded-lg shadow-lg p-6 max-w-md w-full mx-4 border border-border"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                Upload Products
              </h2>
              <button
                onClick={handleClose}
                disabled={bulkUploadMutation.isPending}
                className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                <i className={`${icons.close} text-xl`} />
              </button>
            </div>

            {/* File Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <i className={`${icons.file} text-4xl text-primary`} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    disabled={bulkUploadMutation.isPending}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <i className={`${icons.upload} text-4xl text-muted-foreground`} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Drag and drop your Excel file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={bulkUploadMutation.isPending}
                  >
                    Select File
                  </Button>
                </div>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileInputChange}
              className="hidden"
            />


            {/* Progress Indicator */}
            {bulkUploadMutation.isPending && (
              <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className={`${icons.spinner} text-primary animate-spin`} />
                  <span className="text-primary font-medium">Uploading products...</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={bulkUploadMutation.isPending}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || bulkUploadMutation.isPending}
                className="flex-1"
              >
                {bulkUploadMutation.isPending ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BulkUploadModal;
