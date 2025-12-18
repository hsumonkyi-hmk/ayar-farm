import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export interface Livestock {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface IFS {
  id: string;
  crop_type_id?: string;
  crop_id?: string;
  livestock_id?: string;
  fishery_id?: string;
  machine_type_id?: string;
  machine_id?: string;
  title: string;
  author: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  livestocks?: Livestock;
}

export interface LivestockContextType {
  livestocks: Livestock[];
  ifsList: IFS[];

  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  fetchLivestock: () => Promise<void>;
  fetchIFS: () => Promise<IFS[]>;
  refreshAll: () => Promise<void>;

  createLivestock: (data: FormData) => Promise<boolean>;
  updateLivestock: (id: string, data: FormData) => Promise<boolean>;
  deleteLivestock: (id: string) => Promise<boolean>;
  bulkDeleteLivestock: (ids: string[]) => Promise<boolean>;

  createIFS: (data: FormData) => Promise<boolean>;
  updateIFS: (id: string, data: FormData) => Promise<boolean>;
  deleteIFS: (id: string) => Promise<boolean>;

  getLivestockById: (id: string) => Livestock | undefined;
  getIFSById: (id: string) => IFS | undefined;
  getTotalLivestockCount: () => number;
  getTotalIFSCount: () => number;
}

const LivestockContext = createContext<LivestockContextType | undefined>(
  undefined
);

interface LivestockProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const LivestockProvider: React.FC<LivestockProviderProps> = ({
  children,
}) => {
  const [livestocks, setLivestocks] = useState<Livestock[]>([]);
  const [ifsList, setIFSList] = useState<IFS[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLivestock = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/livestock/livestock/`);
      if (!response.ok) throw new Error("Failed to fetch livestock");
      const data = await response.json();
      setLivestocks(data.livestock);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchIFS = async (): Promise<IFS[]> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/ifs/`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const fetchedIFS = data.ifsList || [];
        setIFSList(fetchedIFS);

        if (!data.ifsList && !data.error) {
          console.warn("Received empty response for IFS");
        }

        return fetchedIFS;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch IFS data";
      setError(errorMessage);
      console.error("Fetch IFS error:", err);
      throw err;
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([fetchLivestock(), fetchIFS()]);

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

  // CRUD operations for Livestock
  const createLivestock = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/livestock/livestock/`, {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        let errorText = await response.text();
        console.error(
          "Failed to create livestock:",
          response.status,
          errorText
        );
        throw new Error(
          `Failed to create livestock: ${response.status} ${errorText}`
        );
      }
      toast.success("Livestock created successfully!");
      await fetchLivestock();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
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
      const response = await fetch(
        `${API_BASE_URL}/livestock/livestock/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );
      if (!response.ok) throw new Error("Failed to update livestock");
      toast.success("Livestock updated successfully!");
      await fetchLivestock();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteLivestock = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/livestock/livestock/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete livestock");
      toast.success("Livestock deleted successfully!");
      await fetchLivestock();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const bulkDeleteLivestock = async (ids: string[]): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/livestock/livestock/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });
      if (!response.ok) throw new Error("Failed to bulk delete livestock");
      toast.success("Livestock deleted successfully!");
      await fetchLivestock();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const getLivestockById = (id: string): Livestock | undefined => {
    return livestocks.find((livestock) => livestock.id === id);
  };

  const getTotalLivestockCount = (): number => {
    return livestocks.length;
  };

  const createIFS = async (data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    console.log("Creating IFS with data:", data);
    console.log("API_BASE_URL:", `${API_BASE_URL}/ifs/`);
    try {
      const response = await fetch(`${API_BASE_URL}/ifs/`, {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        let errorText = await response.text();
        console.error("Failed to create ifs:", response.status, errorText);
        throw new Error(
          `Failed to create ifs: ${response.status} ${errorText}`
        );
      }
      toast.success("IFS created successfully!");
      await fetchIFS();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateIFS = async (id: string, data: FormData): Promise<boolean> => {
    setIsUploadingFile(true);
    try {
      const response = await fetch(`${API_BASE_URL}/ifs/${id}`, {
        method: "PUT",
        body: data,
      });
      if (!response.ok) throw new Error("Failed to update IFS");
      toast.success("IFS updated successfully!");
      await fetchIFS();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteIFS = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/ifs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete IFS");
      toast.success("IFS deleted successfully!");
      await fetchIFS();
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unknown error");
      return false;
    }
  };

  const getIFSById = (id: string): IFS | undefined => {
    return ifsList.find((ifs) => ifs.id === id);
  };

  const getTotalIFSCount = (): number => {
    const livestockIfs = ifsList.filter((ifs) => ifs.livestock_id);
    return livestockIfs.length;
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: LivestockContextType = {
    livestocks,
    ifsList,

    isLoading,
    isUploadingFile,
    error,

    fetchLivestock,
    fetchIFS,
    refreshAll,

    createLivestock,
    updateLivestock,
    deleteLivestock,
    bulkDeleteLivestock,

    createIFS,
    updateIFS,
    deleteIFS,

    getLivestockById,
    getIFSById,
    getTotalLivestockCount,
    getTotalIFSCount,
  };

  return (
    <LivestockContext.Provider value={value}>
      {children}
    </LivestockContext.Provider>
  );
};

export const useLivestock = (): LivestockContextType => {
  const context = useContext(LivestockContext);
  if (!context) {
    throw new Error("useLivestock must be used within a LivestockProvider");
  }
  return context;
};

export default LivestockProvider;
