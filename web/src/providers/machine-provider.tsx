import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export interface MachineType {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  _count: {
    machines: number;
  };
}

export interface Machine {
  id: string;
  name: string;
  model_number: string;
  image_url: string;
  type_id: string;
  created_at: string;
  updated_at: string;
  type: MachineType;
}

export interface IFS {
  id: string;
  crop_type_id?: string;
  crop_id?: string;
  livestock_id?: string;
  fishery_id?: string;
  machine_type_id?: string;
  machine_id?: string;
  machine_model_number?: string;
  title: string;
  author: string;
  file_url: string;
  created_at: string;
  updated_at: string;
  machine_type?: MachineType;
  machines?: Machine;
}

interface MachineContextType {
  // Data
  machineTypes: MachineType[];
  machines: Machine[];
  ifsList: IFS[];

  // Loading state
  isLoading: boolean;
  isUploadingFile: boolean;
  error: string | null;

  // Fetch functions
  fetchMachineTypes: () => Promise<MachineType[]>;
  fetchMachines: () => Promise<Machine[]>;
  fetchIFS: () => Promise<IFS[]>;
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

  // CRUD operations for IFS
  createIFS: (data: FormData) => Promise<boolean>;
  updateIFS: (id: string, data: FormData) => Promise<boolean>;
  deleteIFS: (id: string) => Promise<boolean>;

  // Utility functions
  getMachineTypeById: (id: string) => MachineType | undefined;
  getMachineById: (id: string) => Machine | undefined;
  getIFSById: (id: string) => IFS | undefined;
  getMachinesByType: (typeId: string) => Machine[];
  getTotalMachineTypes: () => number;
  getTotalMachines: () => number;
  getTotalIFS: () => number;
}

const MachineContext = createContext<MachineContextType | undefined>(undefined);

interface MachineProviderProps {
  children: ReactNode;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const MachineProvider: React.FC<MachineProviderProps> = ({
  children,
}) => {
  const [machineTypes, setMachineTypes] = useState<MachineType[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [ifsList, setIfsList] = useState<IFS[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMachineTypes = async (): Promise<MachineType[]> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/machine/machine-types`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const fetchedMachineTypes = data.machineTypes || [];
        setMachineTypes(fetchedMachineTypes);

        if (!data.machineTypes && !data.error) {
          console.warn("Received empty response for machine types");
        }

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
      const response = await fetch(`${API_BASE_URL}/machine/machines`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data && typeof data === "object") {
        const fetchedMachines = data.machines || [];
        setMachines(fetchedMachines);

        if (!data.machines && !data.error) {
          console.warn("Received empty response for machines");
        }

        return fetchedMachines;
      } else {
        throw new Error("Invalid response format for machines");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching crops";
      setError(errorMessage);
      console.error("Error fetching crops:", errorMessage);
      throw error;
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
      const results = await Promise.allSettled([
        fetchMachineTypes(),
        fetchMachines(),
        fetchIFS(),
      ]);

      const failures = results.filter((result) => result.status === "rejected");

      const success = results.filter((result) => result.status === "fulfilled");

      let totalDataCount = 0;
      success.forEach((result) => {
        if (result.value && Array.isArray(result.value)) {
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
      const response = await fetch(`${API_BASE_URL}/machine/machine-types`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
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
      const response = await fetch(
        `${API_BASE_URL}/machine/machine-types/${id}`,
        {
          method: "PUT",
          body: data,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
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
      const response = await fetch(
        `${API_BASE_URL}/machine/machine-types/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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

      const response = await fetch(`${API_BASE_URL}/machine/machine-types`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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
      const response = await fetch(`${API_BASE_URL}/machine/machines`, {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/machine/machines/${id}`, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/machine/machines/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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

      const response = await fetch(`${API_BASE_URL}/machine/machines/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(`${ids.length} machines deleted successfully`);
        await fetchMachines();
        return true;
      } else {
        throw new Error(data.error || "Failed to delete machines");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete machines";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

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

  const getMachineTypeById = (id: string): MachineType | undefined => {
    return machineTypes.find((type) => type.id === id);
  };

  const getMachineById = (id: string): Machine | undefined => {
    return machines.find((machine) => machine.id === id);
  };

  const getIFSById = (id: string): IFS | undefined => {
    return ifsList.find((ifs) => ifs.id === id);
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
  ``;

  const getTotalIFS = (): number => {
    const machineIfs = ifsList.filter((ifs) => ifs.machine_id);
    return machineIfs.length;
  };

  useEffect(() => {
    refreshAll();
  }, []);

  const value: MachineContextType = {
    machineTypes,
    machines,
    ifsList,

    isLoading,
    isUploadingFile,
    error,

    fetchMachineTypes,
    fetchMachines,
    fetchIFS,
    refreshAll,

    createMachineType,
    updateMachineType,
    deleteMachineType,
    bulkDeleteMachineTypes,

    createMachine,
    updateMachine,
    deleteMachine,
    bulkDeleteMachines,

    createIFS,
    updateIFS,
    deleteIFS,

    getMachineTypeById,
    getMachineById,
    getIFSById,
    getMachinesByType,
    getTotalMachineTypes,
    getTotalMachines,
    getTotalIFS,
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
