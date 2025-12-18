import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export interface Fishery {
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
  fisheries?: Fishery;
}

export interface FisheryContextType {
  fisheries: Fishery[];
  ifsList: IFS[];

  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  fetchFisheries: () => Promise<void>;
  fetchIFS: () => Promise<IFS[]>;
  refreshAll: () => Promise<void>;

  createFishery: (data: FormData) => Promise<boolean>;
  updateFishery: (id: string, data: FormData) => Promise<boolean>;
  deleteFishery: (id: string) => Promise<boolean>;
  bulkDeleteFisheries: (ids: string[]) => Promise<boolean>;

  createIFS: (data: FormData) => Promise<boolean>;
  updateIFS: (id: string, data: FormData) => Promise<boolean>;
  deleteIFS: (id: string) => Promise<boolean>;

  getFisheryById: (id: string) => Fishery | undefined;
  getIFSById: (id: string) => IFS | undefined;
  getTotalFisheriesCount: () => number;
  getTotalIFSCount: () => number;
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
  const [ifsList, setIFSList] = useState<IFS[]>([]);
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
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching IFS:", errorMessage);
      throw error;
    }
  };

  const refreshAll = async () => {
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([fetchFisheries(), fetchIFS()]);

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
    const fisheryIfs = ifsList.filter((ifs) => ifs.fishery_id);
    return fisheryIfs.length;
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: FisheryContextType = {
    fisheries,
    ifsList,

    isLoading,
    isUploadingFile,
    error,

    fetchFisheries,
    fetchIFS,
    refreshAll,

    createFishery,
    updateFishery,
    deleteFishery,
    bulkDeleteFisheries,

    createIFS,
    updateIFS,
    deleteIFS,

    getFisheryById,
    getIFSById,
    getTotalFisheriesCount,
    getTotalIFSCount,
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
