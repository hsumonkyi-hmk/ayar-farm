import { api } from "@/lib/api";
import type { Crop, CropType, Document } from "@/lib/interface";
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useAuth } from "./auth-provider";

interface CropContextType {
  // Data
  cropTypes: CropType[];
  crops: Crop[];
  documents: Document[];

  // Loading states
  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  // Fetch functions
  fetchCropTypes: () => Promise<CropType[]>;
  fetchCrops: () => Promise<Crop[]>;
  fetchDocuments: () => Promise<Document[]>;
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

  // CRUD operations for Documents
  createDocument: (data: FormData) => Promise<boolean>;
  updateDocument: (id: string, data: FormData) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;

  // Utility functions
  getCropTypeById: (id: string) => CropType | undefined;
  getCropById: (id: string) => Crop | undefined;
  getDocumentById: (id: string) => Document | undefined;
  getCropsByType: (typeId: string) => Crop[];
  getDocumentsByCropType: (typeId: string) => Document[];
  getDocumentsByCrop: (typeId: string) => Document[];
  getTotalCropTypes: () => number;
  getTotalCrops: () => number;
  getTotalDocuments: () => number;
}

const CropContext = createContext<CropContextType | undefined>(undefined);

interface CropProviderProps {
  children: ReactNode;
}

export const CropProvider: React.FC<CropProviderProps> = ({ children }) => {
  const [cropTypes, setCropTypes] = useState<CropType[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch functions
  const fetchCropTypes = async (): Promise<CropType[]> => {
    try {
      setError(null);
      const response = await api.get("/cropsandpulses/croptypes/");

      if (response && response.data) {
        const fetchedCropTypes = response.data || [];
        setCropTypes(fetchedCropTypes);

        if (!response.data && !response.error) {
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
      const response = await api.get("/cropsandpulses/crops");

      if (response && response.data) {
        const fetchedCrops = (response.data || []).map((crop: any) => ({
          ...crop,
          type: crop.CropTypes,
          type_id: crop.crop_type_id,
        }));
        setCrops(fetchedCrops);

        if (!response.data && !response.error) {
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

  const fetchDocuments = async (): Promise<Document[]> => {
    try {
      setError(null);
      const response = await api.get("/document/documents?type=crop");

      console.log(response.documents);

      if (response && response.documents) {
        const fetchedDocuments = response.documents || [];
        setDocuments(fetchedDocuments);

        if (!response.documents && !response.error) {
          console.warn("Received empty response for documents");
        }

        return fetchedDocuments;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch documents";
      setError(errorMessage);
      console.error("Fetch documents error:", err);
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
        fetchDocuments(),
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
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/cropsandpulses/croptypes",
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Crop type created successfully");
        await fetchCropTypes();
        return true;
      } else {
        throw new Error(response.error || "Failed to create crop type");
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
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/cropsandpulses/croptypes/${id}`,
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Crop type updated successfully");
        await fetchCropTypes();
        return true;
      } else {
        throw new Error(response.error || "Failed to update crop type");
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
      const token = localStorage.getItem("token");
      const response = await api.delete(
        `/cropsandpulses/croptypes/${id}`,
        token || undefined
      );
      if (response && !response.error) {
        toast.success("Crop type deleted successfully");
        await Promise.all([fetchCropTypes(), fetchCrops()]);
        return true;
      } else {
        throw new Error(response.error || "Failed to delete crop type");
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
      const token = localStorage.getItem("token");
      const response = await api.delete(
        "/cropsandpulses/croptypes",
        token || undefined,
        { ids }
      );

      if (response && !response.error) {
        toast.success(`${ids.length} crop types deleted successfully`);
        await Promise.all([fetchCropTypes(), fetchCrops()]);
        return true;
      } else {
        throw new Error(response.error || "Failed to delete crop types");
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
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/cropsandpulses/crops",
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Crop created successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(response.error || "Failed to create crop");
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
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/cropsandpulses/crops/${id}`,
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Crop updated successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(response.error || "Failed to update crop");
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
      const token = localStorage.getItem("token");
      const response = await api.delete(
        `/cropsandpulses/crops/${id}`,
        token || undefined
      );
      if (response && !response.error) {
        toast.success("Crop deleted successfully");
        await fetchCrops();
        return true;
      } else {
        throw new Error(response.error || "Failed to delete crop");
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

      const token = localStorage.getItem("token");
      const response = await api.delete(
        "/cropsandpulses/crops",
        token || undefined,
        { ids }
      );

      if (response && !response.error) {
        toast.success(`${ids.length} crops deleted successfully`);
        await fetchCrops();
        return true;
      } else {
        throw new Error(response.error || "Failed to delete crops");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete crops";
      toast.error(errorMessage);
      return false;
    }
  };

  // Document CRUD operations
  const createDocument = async (formData: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/document/documents",
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Document uploaded successfully");
        await fetchDocuments();
        return true;
      } else {
        throw new Error(response.error || "Failed to upload document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload document";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateDocument = async (
    id: string,
    formData: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/document/documents/${id}`,
        formData,
        token || undefined
      );

      if (response && !response.error) {
        toast.success("Document updated successfully");
        await fetchDocuments();
        return true;
      } else {
        throw new Error(response.error || "Failed to update document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update document";
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteDocument = async (id: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.delete(
        `/document/documents/${id}`,
        token || undefined
      );
      if (response && !response.error) {
        toast.success("Document deleted successfully");
        await fetchDocuments();
        return true;
      } else {
        throw new Error(response.error || "Failed to delete document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete document";
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

  const getCropsByType = (typeId: string): Crop[] => {
    return crops.filter((crop) => crop.type_id === typeId);
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find((doc) => doc.id === id);
  };

  const getDocumentsByCropType = (typeId: string): Document[] => {
    return documents.filter((doc) => doc.crop_type_id === typeId);
  };

  const getDocumentsByCrop = (cropId: string): Document[] => {
    return documents.filter((doc) => doc.crop_id === cropId);
  };

  const getTotalCropTypes = (): number => {
    return cropTypes.length;
  };

  const getTotalCrops = (): number => {
    return crops.length;
  };

  const getTotalDocuments = (): number => {
    return documents.length;
  };

  // Auto-fetch data on mount
  useEffect(() => {
    refreshAll();
  }, []);

  const value: CropContextType = {
    // Data
    cropTypes,
    crops,
    documents,

    // Loading states
    isLoading,
    isUploadingFile,
    error,

    // Fetch functions
    fetchCropTypes,
    fetchCrops,
    fetchDocuments,
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

    // CRUD operations for Documents
    createDocument,
    updateDocument,
    deleteDocument,

    // Utility functions
    getCropTypeById,
    getCropById,
    getDocumentById,
    getCropsByType,
    getDocumentsByCrop,
    getDocumentsByCropType,
    getTotalCropTypes,
    getTotalCrops,
    getTotalDocuments,
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
