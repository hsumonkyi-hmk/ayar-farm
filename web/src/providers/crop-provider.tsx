import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

// Type definitions based on the crop management system
export interface CropType {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  _count?: {
    crops: number;
  };
}

export interface Crop {
  id: string;
  name: string;
  image_url: string;
  type_id: string;
  created_at: string;
  updated_at: string;
  type: CropType;
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
  crop_type?: CropType;
  crops?: Crop;
}

interface CropContextType {
  // Data
  cropTypes: CropType[];
  crops: Crop[];
  ifsList: IFS[];

  // Loading states
  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  // Fetch functions
  fetchCropTypes: () => Promise<CropType[]>;
  fetchCrops: () => Promise<Crop[]>;
  fetchIFS: () => Promise<IFS[]>;
  refreshAll: () => Promise<void>;

  // CRUD operations for Crop Types
  createCropType: (data: FormData) => Promise<boolean>;
  updateCropType: (id: string, data: FormData) => Promise<boolean>;
  deleteCropType: (id: string) => Promise<boolean>;
  bulkDeleteCropTypes: (ids: string[]) => Promise<boolean>;

  // CRUD operations for Crops
  createCrop: (data: FormData) => Promise<boolean>;
  updateCrop: (id: string, data: FormData) => Promise<boolean>;
  deleteCrop: (id: string) => Promise<boolean>;
  bulkDeleteCrops: (ids: string[]) => Promise<boolean>;

  // CRUD operations for IFS
  createIFS: (data: FormData) => Promise<boolean>;
  updateIFS: (id: string, data: FormData) => Promise<boolean>;
  deleteIFS: (id: string) => Promise<boolean>;

  // Utility functions
  getCropTypeById: (id: string) => CropType | undefined;
  getCropById: (id: string) => Crop | undefined;
  getIFSById: (id: string) => IFS | undefined;
  getCropsByType: (typeId: string) => Crop[];
  getIFSByCropType: (typeId: string) => IFS[];
  getIFSByCrop: (typeId: string) => IFS[];
  getTotalCropTypes: () => number;
  getTotalCrops: () => number;
  getTotalIFS: () => number;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

interface CropProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const CropProvider: React.FC<CropProviderProps> = ({ children }) => {
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [ifsList, setIfsList] = useState<IFS[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch functions
  const fetchCropTypes = async (): Promise<CropType[]> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/crop/crop-types`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const fetchedCropTypes = data.cropTypes || [];
        setCropTypes(fetchedCropTypes);

        if (!data.cropTypes && !data.error) {
          console.warn("Received empty response for crop types");
        }

        return fetchedCropTypes;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch crop types";
      setError(errorMessage);
      console.error("Fetch crop types error:", err);
      throw err;
    }
  };

  const fetchCrops = async (): Promise<Crop[]> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/crop/crops`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const fetchedCrops = data.crops || [];
        setCrops(fetchedCrops);

        if (!data.crops && !data.error) {
          console.warn("Received empty response for crops");
        }

        return fetchedCrops;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch crops";
      setError(errorMessage);
      console.error("Fetch crops error:", err);
      throw err;
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
        setIfsList(fetchedIFS);

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
      // Use Promise.allSettled to get results of all promises regardless of success/failure
      const results = await Promise.allSettled([
        fetchCropTypes(),
        fetchCrops(),
        fetchIFS(),
      ]);

      const failures = results.filter((result) => result.status === "rejected");
      const successes = results.filter(
        (result) => result.status === "fulfilled"
      );

      // Check the actual fetched data from successful promises
      let totalDataCount = 0;
      successes.forEach((result) => {
        if (result.status === "fulfilled" && Array.isArray(result.value)) {
          totalDataCount += result.value.length;
        }
      });

      if (failures.length === 0) {
        if (totalDataCount > 0) {
          toast.success("Data Fetched successfully");
        } else {
          toast.info("Data Fetched - no records found");
        }
      } else if (failures.length === results.length) {
        toast.error("Failed to fetch data - server or database may be offline");
      } else {
        toast.warning(
          `Partially fetched - ${failures.length} of ${results.length} requests failed`
        );
      }
    } catch (err) {
      toast.error("Failed to fetch data");
      console.error("Refresh all error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const createCropType = async (formData: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/crop/crop-types`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Crop type created successfully");
        await fetchCropTypes();
        return true;
      } else {
        throw new Error(data.error || "Failed to create crop type");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create crop type";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateCropType = async (
    id: string,
    formData: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/crop/crop-types/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Crop type updated successfully");
        await fetchCropTypes();
        return true;
      } else {
        throw new Error(data.error || "Failed to update crop type");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update crop type";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteCropType = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crop/crop-types/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Crop type deleted successfully");
        await Promise.all([fetchCropTypes(), fetchCrops()]);
        return true;
      } else {
        throw new Error(data.error || "Failed to delete crop type");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete crop type";
      toast.error(errorMessage);
      return false;
    }
  };

  const bulkDeleteCropTypes = async (ids: string[]): Promise<boolean> => {
    try {
      console.log("Selected Crop Types for bulk delete:", ids);
      const response = await fetch(`${API_BASE_URL}/crop/crop-types/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${ids.length} crop types deleted successfully`);
        await Promise.all([fetchCropTypes(), fetchCrops()]);
        return true;
      } else {
        throw new Error(data.error || "Failed to delete crop types");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete crop types";
      toast.error(errorMessage);
      return false;
    }
  };

  const createCrop = async (formData: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/crop/crops`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Crop created successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(data.error || "Failed to create crop");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create crop";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateCrop = async (
    id: string,
    formData: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/crop/crops/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Crop updated successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(data.error || "Failed to update crop");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update crop";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteCrop = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/crop/crops/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Crop deleted successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(data.error || "Failed to delete crop");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete crop";
      toast.error(errorMessage);
      return false;
    }
  };

  const bulkDeleteCrops = async (ids: string[]): Promise<boolean> => {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid request: IDs array is required");
      }

      const response = await fetch(`${API_BASE_URL}/crop/crops/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${ids.length} crops deleted successfully`);
        await fetchCrops();
        return true;
      } else {
        throw new Error(data.error || "Failed to delete crops");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete crops";
      toast.error(errorMessage);
      return false;
    }
  };

  // IFS CRUD operations
  const createIFS = async (formData: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/ifs/`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("IFS document uploaded successfully");
        await fetchIFS();
        return true;
      } else {
        throw new Error(data.error || "Failed to upload IFS document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload IFS document";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateIFS = async (
    id: string,
    formData: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const response = await fetch(`${API_BASE_URL}/ifs/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("IFS document updated successfully");
        await fetchIFS();
        return true;
      } else {
        throw new Error(data.error || "Failed to update IFS document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update IFS document";
      toast.error(errorMessage);
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
      const data = await response.json();
      if (response.ok) {
        toast.success("IFS document deleted successfully");
        await fetchIFS();
        return true;
      } else {
        throw new Error(data.error || "Failed to delete IFS document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete IFS document";
      toast.error(errorMessage);
      return false;
    }
  };

  // Utility functions
  const getCropTypeById = (id: string): CropType | undefined => {
    return cropTypes.find((type) => type.id === id);
  };

  const getCropById = (id: string): Crop | undefined => {
    return crops.find((crop) => crop.id === id);
  };

  const getIFSById = (id: string): IFS | undefined => {
    return ifsList.find((ifs) => ifs.id === id);
  };

  const getCropsByType = (typeId: string): Crop[] => {
    return crops.filter((crop) => crop.type_id === typeId);
  };

  const getIFSByCropType = (typeId: string): IFS[] => {
    return ifsList.filter((ifs) => ifs.id === typeId);
  };

  const getIFSByCrop = (cropId: string): IFS[] => {
    return ifsList.filter((ifs) => ifs.crop_id === cropId);
  };

  const getTotalCropTypes = (): number => {
    return cropTypes.length;
  };

  const getTotalCrops = (): number => {
    return crops.length;
  };

  const getTotalIFS = (): number => {
    const cropIFS = ifsList.filter((ifs) => ifs.crop_id);
    return cropIFS.length;
  };

  // Auto-fetch data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  const value: CropContextType = {
    // Data
    cropTypes,
    crops,
    ifsList,

    // Loading states
    isLoading,
    isUploadingFile,
    error,

    // Fetch functions
    fetchCropTypes,
    fetchCrops,
    fetchIFS,
    refreshAll,

    // CRUD operations for Crop Types
    createCropType,
    updateCropType,
    deleteCropType,
    bulkDeleteCropTypes,

    // CRUD operations for Crops
    createCrop,
    updateCrop,
    deleteCrop,
    bulkDeleteCrops,

    // CRUD operations for IFS
    createIFS,
    updateIFS,
    deleteIFS,

    // Utility functions
    getCropTypeById,
    getCropById,
    getIFSById,
    getCropsByType,
    getIFSByCrop,
    getIFSByCropType,
    getTotalCropTypes,
    getTotalCrops,
    getTotalIFS,
  };

  return <CropContext.Provider value={value}>{children}</CropContext.Provider>;
};

export const useCrop = (): CropContextType => {
  const context = useContext(CropContext);
  if (context === undefined) {
    throw new Error("useCrop must be used within a CropProvider");
  }
  return context;
};

export default CropProvider;
