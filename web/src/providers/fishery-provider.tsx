import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

import type { Fishery, Document } from "@/lib/interface";
import { api } from "@/lib/api";

interface FisheryContextType {
  fisheries: Fishery[];
  documents: Document[];

  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  fetchFisheries: () => Promise<void>;
  fetchDocuments: () => Promise<Document[]>;
  refreshAll: () => Promise<void>;

  createFishery: (data: FormData) => Promise<boolean>;
  updateFishery: (id: string, data: FormData) => Promise<boolean>;
  deleteFishery: (id: string) => Promise<boolean>;
  bulkDeleteFisheries: (ids: string[]) => Promise<boolean>;

  createDocument: (data: FormData) => Promise<boolean>;
  updateDocument: (id: string, data: FormData) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;

  getFisheryById: (id: string) => Fishery | undefined;
  getDocumentById: (id: string) => Document | undefined;
  getTotalFisheriesCount: () => number;
  getTotalDocumentsCount: () => number;
}

const FisheryContext = createContext<FisheryContextType | undefined>(undefined);

interface FisheryProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const FisheryProvider: React.FC<FisheryProviderProps> = ({
  children,
}) => {
  const [fisheries, setFisheries] = useState<Fishery[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFisheries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fishery/fisheries`);
      if (!response.ok) throw new Error("Failed to fetch fisheries");
      const data = await response.json();
      setFisheries(data.fisheries);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (): Promise<Document[]> => {
    try {
      setError(null);
      const response = await api.get("/document/documents");

      if (response && response.data) {
        const fetchedDocuments = response.data || [];
        setDocuments(fetchedDocuments);

        if (!response.data && !response.error) {
          console.warn("Received empty response for documents");
        }

        return fetchedDocuments;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching documents:", errorMessage);
      throw error;
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        fetchFisheries(),
        fetchDocuments(),
      ]);

      const failures = results.filter((result) => result.status === "rejected");
      const successes = results.filter(
        (result) => result.status === "fulfilled"
      );

      let totalDataCount = 0;
      successes.forEach((result) => {
        if (result.value && Array.isArray(result.value)) {
          totalDataCount += result.value.length;
        }
      });

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

  // CRUD operations for Fisheries
  const createFishery = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fishery/fisheries`, {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        let errorText = await response.text();
        console.error("Failed to create fishery:", response.status, errorText);
        throw new Error(
          `Failed to create fishery: ${response.status} ${errorText}`
        );
      }
      toast.success("Fishery created successfully");
      await fetchFisheries();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateFishery = async (
    id: string,
    data: FormData
  ): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fishery/fisheries/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!response.ok)
        throw new Error(`Failed to update fishery: ${response.status}`);
      toast.success("Fishery updated successfully");
      await fetchFisheries();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteFishery = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/fishery/fisheries/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete fishery");
      toast.success("Fishery deleted successfully");
      await fetchFisheries();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const bulkDeleteFisheries = async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/fishery/fisheries/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error("Failed to bulk delete fishery");
      toast.success("Fishery deleted successfully!");
      await fetchFisheries();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const getFisheryById = (id: string): Fishery | undefined => {
    return fisheries.find((fishery) => fishery.id === id);
  };

  const getTotalFisheriesCount = (): number => {
    return fisheries.length;
  };

  const createDocument = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const token = localStorage.getItem("token");
      await api.post("/document/documents", data, token || undefined);
      toast.success("Document created successfully!");
      await fetchDocuments();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
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
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find((doc) => doc.id === id);
  };

  const getTotalDocumentsCount = (): number => {
    const fisheryDocuments = documents.filter((doc) => doc.fish_id);
    return fisheryDocuments.length;
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: FisheryContextType = {
    fisheries,
    documents,

    isLoading,
    isUploadingFile,
    error,

    fetchFisheries,
    fetchDocuments,
    refreshAll,

    createFishery,
    updateFishery,
    deleteFishery,
    bulkDeleteFisheries,

    createDocument,
    updateDocument,
    deleteDocument,

    getFisheryById,
    getDocumentById,
    getTotalFisheriesCount,
    getTotalDocumentsCount,
  };

  return (
    <FisheryContext.Provider value={value}>{children}</FisheryContext.Provider>
  );
};

export const useFishery = (): FisheryContextType => {
  const context = useContext(FisheryContext);
  if (!context) {
    throw new Error("useFishery must be used within a FisheryProvider");
  }
  return context;
};

export default FisheryProvider;
