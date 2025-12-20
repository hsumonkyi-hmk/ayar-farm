import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

import type { Livestock, Document } from "@/lib/interface";

interface LivestockContextType {
  livestocks: Livestock[];
  documents: Document[];

  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  fetchLivestock: () => Promise<void>;
  fetchDocuments: () => Promise<Document[]>;
  refreshAll: () => Promise<void>;

  createLivestock: (data: FormData) => Promise<boolean>;
  updateLivestock: (id: string, data: FormData) => Promise<boolean>;
  deleteLivestock: (id: string) => Promise<boolean>;
  bulkDeleteLivestock: (ids: string[]) => Promise<boolean>;

  createDocument: (data: FormData) => Promise<boolean>;
  updateDocument: (id: string, data: FormData) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;

  getLivestockById: (id: string) => Livestock | undefined;
  getDocumentById: (id: string) => Document | undefined;
  getTotalLivestockCount: () => number;
  getTotalDocumentsCount: () => number;
}

const LivestockContext = createContext<LivestockContextType | undefined>(
  undefined
);

interface LivestockProviderProps {
  children: ReactNode;
}

export const LivestockProvider: React.FC<LivestockProviderProps> = ({
  children,
}) => {
  const [livestocks, setLivestocks] = useState<Livestock[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLivestock = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/livestockindustry/livestocks");
      setLivestocks(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (): Promise<Document[]> => {
    try {
      setError(null);
      const response = await api.get("/document/documents?type=livestock");
      const fetchedDocuments = response.documents || [];
      setDocuments(fetchedDocuments);
      return fetchedDocuments;
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch documents";
      setError(errorMessage);
      console.error("Fetch documents error:", err);
      throw err;
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchLivestock(),
        fetchDocuments(),
      ]);

      const failures = results.filter((result) => result.status === "rejected");

      let totalDataCount = 0;
      // Count livestock
      if (livestocks.length > 0) totalDataCount += livestocks.length;
      // Count documents
      if (documents.length > 0) totalDataCount += documents.length;

      if (failures.length === 0) {
        if (totalDataCount > 0) {
          toast.success("Data Fetched successfully!");
        } else {
          toast.info("Data Fetched - no records found");
        }
      } else if (failures.length === results.length) {
        toast.error(
          "Failed to fetch all data - server or database may be offline"
        );
      } else {
        toast.warning(
          `Partially fetched - ${failures.length} of ${results.length} requests failed`
        );
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Error refreshing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD operations for Livestock
  const createLivestock = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/livestockindustry/livestocks", data, token || undefined);
      toast.success("Livestock created successfully!");
      await fetchLivestock();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateLivestock = async (
    id: string,
    data: FormData
  ): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/livestockindustry/livestocks/${id}`,
        data,
        token || undefined
      );
      toast.success("Livestock updated successfully!");
      await fetchLivestock();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteLivestock = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(
        `/livestockindustry/livestocks/${id}`,
        token || undefined
      );
      toast.success("Livestock deleted successfully!");
      await fetchLivestock();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    }
  };

  const bulkDeleteLivestock = async (ids: string[]): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/livestockindustry/livestocks/bulk-delete",
        { ids },
        token || undefined
      );
      toast.success("Selected livestock deleted successfully!");
      await fetchLivestock();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    }
  };

  // CRUD operations for Documents
  const createDocument = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/document/documents", data, token || undefined);
      toast.success("Document created successfully!");
      await fetchDocuments();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateDocument = async (
    id: string,
    data: FormData
  ): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const token = localStorage.getItem("token");
      await api.put(`/document/documents/${id}`, data, token || undefined);
      toast.success("Document updated successfully!");
      await fetchDocuments();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/document/documents/${id}`, token || undefined);
      toast.success("Document deleted successfully!");
      await fetchDocuments();
      return true;
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || err.message || "Unknown error"
      );
      return false;
    }
  };

  const getLivestockById = (id: string) => livestocks.find((l) => l.id === id);

  const getDocumentById = (id: string) => documents.find((d) => d.id === id);

  const getTotalLivestockCount = () => livestocks.length;
  const getTotalDocumentsCount = () => documents.length;

  useEffect(() => {
    fetchLivestock();
    fetchDocuments();
  }, []);

  return (
    <LivestockContext.Provider
      value={{
        livestocks,
        documents,
        isLoading,
        isUploadingFile,
        error,
        fetchLivestock,
        fetchDocuments,
        refreshAll,
        createLivestock,
        updateLivestock,
        deleteLivestock,
        bulkDeleteLivestock,
        createDocument,
        updateDocument,
        deleteDocument,
        getLivestockById,
        getDocumentById,
        getTotalLivestockCount,
        getTotalDocumentsCount,
      }}
    >
      {children}
    </LivestockContext.Provider>
  );
};

export const useLivestock = () => {
  const context = useContext(LivestockContext);
  if (context === undefined) {
    throw new Error("useLivestock must be used within a LivestockProvider");
  }
  return context;
};

export default LivestockProvider;
