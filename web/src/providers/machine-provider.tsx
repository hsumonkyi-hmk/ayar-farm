import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";

import type { MachineType, Machine, Document } from "@/lib/interface";

interface MachineContextType {
  // Data
  machineTypes: MachineType[];
  machines: Machine[];
  documents: Document[];

  // Loading state
  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  // Fetch functions
  fetchMachineTypes: () => Promise<MachineType[]>;
  fetchMachines: () => Promise<Machine[]>;
  fetchDocuments: () => Promise<Document[]>;
  refreshAll: () => Promise<void>;

  // CRUD operations for Machine Types
  createMachineType: (data: FormData) => Promise<boolean>;
  updateMachineType: (id: string, data: FormData) => Promise<boolean>;
  deleteMachineType: (id: string) => Promise<boolean>;
  bulkDeleteMachineTypes: (ids: string[]) => Promise<boolean>;

  // CRUD operations for Machines
  createMachine: (data: FormData) => Promise<boolean>;
  updateMachine: (id: string, data: FormData) => Promise<boolean>;
  deleteMachine: (id: string) => Promise<boolean>;
  bulkDeleteMachines: (ids: string[]) => Promise<boolean>;

  // CRUD operations for Documents
  createDocument: (data: FormData) => Promise<boolean>;
  updateDocument: (id: string, data: FormData) => Promise<boolean>;
  deleteDocument: (id: string) => Promise<boolean>;

  // Utility functions
  getMachineTypeById: (id: string) => MachineType | undefined;
  getMachineById: (id: string) => Machine | undefined;
  getDocumentById: (id: string) => Document | undefined;
  getMachinesByType: (typeId: string) => Machine[];
  getTotalMachineTypes: () => number;
  getTotalMachines: () => number;
  getTotalDocumentsCount: () => number;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

interface MachineProviderProps {
  children: ReactNode;
}

export const MachineProvider: React.FC<MachineProviderProps> = ({
  children,
}) => {
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMachineTypes = async (): Promise<MachineType[]> => {
    try {
      setError(null);
      const response = await api.get("/machine/machine-types");
      const data = response.data;

      if (data && typeof data === "object") {
        const fetchedMachineTypes = data.machineTypes || [];
        setMachineTypes(fetchedMachineTypes);
        return fetchedMachineTypes;
      } else {
        throw new Error("Invalid response format for machine types");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching machine types";
      setError(errorMessage);
      console.error("Error fetching machine types:", errorMessage);
      throw error;
    }
  };

  const fetchMachines = async (): Promise<Machine[]> => {
    try {
      setError(null);
      const response = await api.get("/machine/machines");
      const data = response.data;

      if (data && typeof data === "object") {
        const fetchedMachines = data.machines || [];
        setMachines(fetchedMachines);
        return fetchedMachines;
      } else {
        throw new Error("Invalid response format for machines");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching machines";
      setError(errorMessage);
      console.error("Error fetching machines:", errorMessage);
      throw error;
    }
  };

  const fetchDocuments = async (): Promise<Document[]> => {
    try {
      setError(null);
      const response = await api.get("/document/documents");
      const data = response.data;

      if (data && typeof data === "object") {
        const fetchedDocuments = data.documents || [];
        setDocuments(fetchedDocuments);
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
      const results = await Promise.allSettled([
        fetchMachineTypes(),
        fetchMachines(),
        fetchDocuments(),
      ]);

      const failures = results.filter((result) => result.status === "rejected");

      if (failures.length === 0) {
        toast.success("Data Fetched successfully");
      } else if (failures.length === results.length) {
        toast.error("Failed to fetch data - server or database may be offline");
      } else {
        toast.warning(
          `Partially fetched - ${failures.length} of ${results.length} requests failed`
        );
      }
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error("Refresh all error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createMachineType = async (data: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/machine/machine-types",
        data,
        token || undefined
      );

      const result = response.data;
      if (result && result.machineType) {
        setMachineTypes((prev) => [...prev, result.machineType]);
        toast.success("Machine type created successfully");
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to create machine type";
      setError(errorMessage);
      console.error("Create machine type error:", errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateMachineType = async (
    id: string,
    data: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/machine/machine-types/${id}`,
        data,
        token || undefined
      );

      const result = response.data;
      if (result && result.machineType) {
        setMachineTypes((prev) =>
          prev.map((type) => (type.id === id ? result.machineType : type))
        );
        toast.success("Machine type updated successfully");
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update machine type";
      setError(errorMessage);
      console.error("Update machine type error:", errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteMachineType = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/machine/machine-types/${id}`);
      setMachineTypes((prev) => prev.filter((type) => type.id !== id));
      toast.success("Machine type deleted successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete machine type";
      setError(errorMessage);
      console.error("Delete machine type error:", errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const bulkDeleteMachineTypes = async (ids: string[]): Promise<boolean> => {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid request: IDs array is required");
      }

      const token = localStorage.getItem("token");
      await api.delete("/machine/machine-types", token || undefined, { ids });

      setMachineTypes((prev) => prev.filter((type) => !ids.includes(type.id)));
      toast.success(`${ids.length} machine types deleted successfully`);
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to delete machine types";
      setError(errorMessage);
      console.error("Bulk delete machine types error:", errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const createMachine = async (data: FormData): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/machine/machines",
        data,
        token || undefined
      );

      const result = response.data;
      if (result && result.machine) {
        setMachines((prev) => [...prev, result.machine]);
        toast.success("Machine created successfully");
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create machine";
      setError(errorMessage);
      console.error("Create machine error:", errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const updateMachine = async (
    id: string,
    data: FormData
  ): Promise<boolean> => {
    try {
      setIsUploadingFile(true);
      const token = localStorage.getItem("token");
      const response = await api.put(
        `/machine/machines/${id}`,
        data,
        token || undefined
      );

      const result = response.data;
      if (result && result.machine) {
        setMachines((prev) =>
          prev.map((machine) => (machine.id === id ? result.machine : machine))
        );
        toast.success("Machine updated successfully");
        return true;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update machine";
      setError(errorMessage);
      console.error("Update machine error:", errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setIsUploadingFile(false);
    }
  };

  const deleteMachine = async (id: string): Promise<boolean> => {
    try {
      await api.delete(`/machine/machines/${id}`);
      setMachines((prev) => prev.filter((machine) => machine.id !== id));
      toast.success("Machine deleted successfully");
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete machine";
      setError(errorMessage);
      console.error("Delete machine error:", errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const bulkDeleteMachines = async (ids: string[]): Promise<boolean> => {
    try {
      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        throw new Error("Invalid request: IDs array is required");
      }

      const token = localStorage.getItem("token");
      await api.delete("/machine/machines", token || undefined, { ids });

      toast.success(`${ids.length} machines deleted successfully`);
      await fetchMachines();
      return true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete machines";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

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
        throw new Error("Failed to upload document");
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
        throw new Error("Failed to update document");
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
        throw new Error("Failed to delete document");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete document";
      toast.error(errorMessage);
      return false;
    }
  };

  const getMachineTypeById = (id: string): MachineType | undefined => {
    return machineTypes.find((type) => type.id === id);
  };

  const getMachineById = (id: string): Machine | undefined => {
    return machines.find((machine) => machine.id === id);
  };

  const getDocumentById = (id: string): Document | undefined => {
    return documents.find((doc) => doc.id === id);
  };

  const getMachinesByType = (typeId: string): Machine[] => {
    return machines.filter((machine) => machine.type_id === typeId);
  };

  const getTotalMachineTypes = (): number => {
    return machineTypes.length;
  };

  const getTotalMachines = (): number => {
    return machines.length;
  };

  const getTotalDocumentsCount = (): number => {
    const machineDocuments = documents.filter(
      (doc) => doc.machine_id || doc.machine_type_id
    );
    return machineDocuments.length;
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: MachineContextType = {
    machineTypes,
    machines,
    documents,

    isLoading,
    isUploadingFile,
    error,

    fetchMachineTypes,
    fetchMachines,
    fetchDocuments,
    refreshAll,

    createMachineType,
    updateMachineType,
    deleteMachineType,
    bulkDeleteMachineTypes,

    createMachine,
    updateMachine,
    deleteMachine,
    bulkDeleteMachines,

    createDocument,
    updateDocument,
    deleteDocument,

    getMachineTypeById,
    getMachineById,
    getDocumentById,
    getMachinesByType,
    getTotalMachineTypes,
    getTotalMachines,
    getTotalDocumentsCount,
  };

  return (
    <MachineContext.Provider value={value}>{children}</MachineContext.Provider>
  );
};

export const useMachine = (): MachineContextType => {
  const context = useContext(MachineContext);
  if (!context) {
    throw new Error("useMachine must be used within a MachineProvider");
  }
  return context;
};

export default MachineProvider;
