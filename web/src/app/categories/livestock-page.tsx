import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import LivestockProvider, {
  useLivestock,
} from "@/providers/livestock-provider.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  ArrowUpDown,
  FileText,
  RefreshCw,
  Loader2,
  PawPrint,
  BookOpen,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Type definitions based on the livestock provider
interface Livestock {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

interface IFS {
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

const LivestockManagement = () => {
  const {
    livestocks,
    ifsList,
    isLoading,
    isUploadingFile,
    createLivestock,
    updateLivestock,
    deleteLivestock,
    bulkDeleteLivestock,
    createIFS,
    updateIFS,
    deleteIFS,
    getTotalLivestockCount,
    getTotalIFSCount,
    refreshAll,
  } = useLivestock();

  // UI State for Livestock
  const [livestockSearchTerm, setLivestockSearchTerm] = useState("");
  const [isLivestockDialogOpen, setIsLivestockDialogOpen] = useState(false);
  const [editingLivestock, setEditingLivestock] = useState<Livestock | null>(
    null
  );
  const [livestockFormData, setLivestockFormData] = useState({
    name: "",
    image: null as File | null,
  });
  const [selectedLivestock, setSelectedLivestock] = useState<string[]>([]);

  // IFS UI state
  const [ifsSearchTerm, setIfsSearchTerm] = useState("");
  const [selectedIfsLivestock, setSelectedIfsLivestock] =
    useState<string>("all_livestock");
  const [isIfsDialogOpen, setIsIfsDialogOpen] = useState(false);
  const [editingIfs, setEditingIfs] = useState<IFS | null>(null);
  const [ifsFormData, setIfsFormData] = useState({
    livestock_id: "none",
    title: "",
    author: "",
    pdfFile: null as File | null,
  });

  // Pagination state for Livestock
  const [livestockCurrentPage, setLivestockCurrentPage] = useState(1);
  const [livestockPageSize, setLivestockPageSize] = useState(10);
  const [livestockSortBy, setLivestockSortBy] = useState<string>("");
  const [livestockSortOrder, setLivestockSortOrder] = useState<"asc" | "desc">(
    "asc"
  );

  // IFS pagination and sorting state
  const [ifsCurrentPage, setIfsCurrentPage] = useState(1);
  const [ifsPageSize, setIfsPageSize] = useState(10);
  const [ifsSortBy, setIfsSortBy] = useState<string>("");
  const [ifsSortOrder, setIfsSortOrder] = useState<"asc" | "desc">("asc");

  // Delete confirmation dialog states
  const [deleteLivestockId, setDeleteLivestockId] = useState<string | null>(
    null
  );
  const [isDeleteLivestockDialogOpen, setIsDeleteLivestockDialogOpen] =
    useState(false);
  const [deleteIfsId, setDeleteIfsId] = useState<string | null>(null);
  const [isDeleteIfsDialogOpen, setIsDeleteIfsDialogOpen] = useState(false);
  const [deleteLivestockLoading, setDeleteLivestockLoading] = useState(false);
  const [deleteIfsLoading, setDeleteIfsLoading] = useState(false);

  // Filter and sort functions for Livestock
  const filteredLivestock = livestocks.filter((livestock) =>
    livestock.name.toLowerCase().includes(livestockSearchTerm.toLowerCase())
  );

  const filteredAndSortedLivestock = filteredLivestock.sort((a, b) => {
    if (!livestockSortBy) return 0;

    let aValue: any = a;
    let bValue: any = b;

    if (livestockSortBy === "name") {
      aValue = a.name;
      bValue = b.name;
    } else if (livestockSortBy === "created_at") {
      aValue = new Date(a.created_at);
      bValue = new Date(b.created_at);
    } else if (livestockSortBy === "updated_at") {
      aValue = new Date(a.updated_at);
      bValue = new Date(b.updated_at);
    }

    if (livestockSortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Livestock pagination logic
  const livestockTotalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedLivestock.length / livestockPageSize)
  );
  const livestockStartIndex = (livestockCurrentPage - 1) * livestockPageSize;
  const livestockEndIndex = livestockStartIndex + livestockPageSize;
  const paginatedLivestock = filteredAndSortedLivestock.slice(
    livestockStartIndex,
    livestockEndIndex
  );

  const ifsListWithLivestock = ifsList.map((ifs) => ({
    ...ifs,
    livestocks:
      ifs.livestocks || livestocks.find((l) => l.id === ifs.livestock_id),
  }));

  // Filter and sort functions for IFS (only show those with livestock_id)
  const filteredIFS = ifsListWithLivestock
    .filter((ifs) => ifs.livestock_id != null)
    .filter((ifs) => {
      const searchTerm = ifsSearchTerm.toLowerCase();
      const matchesSearch =
        ifs.livestocks?.name?.toLowerCase().includes(searchTerm) ||
        ifs.title?.toLowerCase().includes(searchTerm) ||
        ifs.author?.toLowerCase().includes(searchTerm);

      const matchesLivestock =
        selectedIfsLivestock === "" ||
        selectedIfsLivestock === "all_livestock" ||
        ifs.livestock_id === selectedIfsLivestock;

      return matchesSearch && matchesLivestock;
    });

  const filteredAndSortedIFS = filteredIFS.sort((a, b) => {
    if (!ifsSortBy) return 0;

    let aValue: any = a;
    let bValue: any = b;

    if (ifsSortBy === "title") {
      aValue = a.title;
      bValue = b.title;
    } else if (ifsSortBy === "author") {
      aValue = a.author;
      bValue = b.author;
    } else if (ifsSortBy === "livestock") {
      aValue = a.livestocks?.name || "";
      bValue = b.livestocks?.name || "";
    } else if (ifsSortBy === "created_at") {
      aValue = new Date(a.created_at);
      bValue = new Date(b.created_at);
    }

    if (ifsSortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // IFS pagination logic
  const ifsTotalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedIFS.length / ifsPageSize)
  );
  const ifsStartIndex = (ifsCurrentPage - 1) * ifsPageSize;
  const ifsEndIndex = ifsStartIndex + ifsPageSize;
  const paginatedIFS = filteredAndSortedIFS.slice(ifsStartIndex, ifsEndIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setLivestockCurrentPage(1);
  }, [livestockSearchTerm, livestockSortBy, livestockSortOrder]);

  useEffect(() => {
    setIfsCurrentPage(1);
  }, [ifsSearchTerm, selectedIfsLivestock, ifsSortBy, ifsSortOrder]);

  // Auto-adjust page if current page exceeds total pages
  useEffect(() => {
    if (livestockCurrentPage > livestockTotalPages && livestockTotalPages > 0) {
      setLivestockCurrentPage(livestockTotalPages);
    }
  }, [livestockCurrentPage, livestockTotalPages]);

  useEffect(() => {
    if (ifsCurrentPage > ifsTotalPages && ifsTotalPages > 0) {
      setIfsCurrentPage(ifsTotalPages);
    }
  }, [ifsCurrentPage, ifsTotalPages]);

  // Livestock CRUD operations
  const handleLivestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!livestockFormData.name) {
      toast.error("Please enter livestock name");
      return;
    }

    const formData = new FormData();
    formData.append("name", livestockFormData.name);
    if (livestockFormData.image) {
      formData.append("file", livestockFormData.image);
    }

    const success = editingLivestock
      ? await updateLivestock(editingLivestock.id, formData)
      : await createLivestock(formData);

    if (success) {
      setIsLivestockDialogOpen(false);
      resetLivestockForm();
    }
  };

  const handleDeleteLivestock = async () => {
    if (!deleteLivestockId) return;
    setDeleteLivestockLoading(true);
    await deleteLivestock(deleteLivestockId);
    setDeleteLivestockLoading(false);
    setIsDeleteLivestockDialogOpen(false);
    setDeleteLivestockId(null);
  };

  // IFS CRUD operations
  const handleIfsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ifsFormData.title || !ifsFormData.author) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!ifsFormData.pdfFile && !editingIfs) {
      toast.error("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    if (ifsFormData.livestock_id && ifsFormData.livestock_id !== "none") {
      formData.append("livestock_id", ifsFormData.livestock_id);
    }
    formData.append("title", ifsFormData.title);
    formData.append("author", ifsFormData.author);
    if (ifsFormData.pdfFile) {
      formData.append("file", ifsFormData.pdfFile);
    }

    const success = editingIfs
      ? await updateIFS(editingIfs.id, formData)
      : await createIFS(formData);

    if (success) {
      setIsIfsDialogOpen(false);
      resetIfsForm();
    }
  };

  const handleDeleteIfs = async () => {
    if (!deleteIfsId) return;
    setDeleteIfsLoading(true);
    await deleteIFS(deleteIfsId);
    setDeleteIfsLoading(false);
    setIsDeleteIfsDialogOpen(false);
    setDeleteIfsId(null);
  };

  // Form reset functions
  const resetLivestockForm = () => {
    setLivestockFormData({ name: "", image: null });
    setEditingLivestock(null);
  };

  const resetIfsForm = () => {
    setIfsFormData({
      livestock_id: "none",
      title: "",
      author: "",
      pdfFile: null,
    });
    setEditingIfs(null);
  };

  // Edit handlers
  const handleEditLivestock = (livestock: Livestock) => {
    setEditingLivestock(livestock);
    setLivestockFormData({
      name: livestock.name,
      image: null,
    });
    setIsLivestockDialogOpen(true);
  };

  const handleEditIfs = (ifs: IFS) => {
    setEditingIfs(ifs);
    setIfsFormData({
      livestock_id: ifs.livestock_id || "none",
      title: ifs.title,
      author: ifs.author,
      pdfFile: null,
    });
    setIsIfsDialogOpen(true);
  };

  // Dialog close handlers
  const handleLivestockDialogClose = () => {
    setIsLivestockDialogOpen(false);
    resetLivestockForm();
  };

  const handleIfsDialogClose = () => {
    setIsIfsDialogOpen(false);
    resetIfsForm();
  };

  // Selection handlers
  const handleSelectLivestock = (livestockId: string) => {
    setSelectedLivestock((prev) =>
      prev.includes(livestockId)
        ? prev.filter((id) => id !== livestockId)
        : [...prev, livestockId]
    );
  };

  // Bulk delete handlers
  const handleBulkDeleteLivestock = async () => {
    if (selectedLivestock.length === 0) return;
    const success = await bulkDeleteLivestock(selectedLivestock);
    if (success) {
      setSelectedLivestock([]);
    }
  };

  // Sorting handlers
  const handleSortLivestock = (column: string) => {
    if (livestockSortBy === column) {
      setLivestockSortOrder(livestockSortOrder === "asc" ? "desc" : "asc");
    } else {
      setLivestockSortBy(column);
      setLivestockSortOrder("asc");
    }
  };

  const handleSortIfs = (column: string) => {
    if (ifsSortBy === column) {
      setIfsSortOrder(ifsSortOrder === "asc" ? "desc" : "asc");
    } else {
      setIfsSortBy(column);
      setIfsSortOrder("asc");
    }
  };

  // Open delete dialogs
  const openDeleteLivestockDialog = (id: string) => {
    setDeleteLivestockId(id);
    setIsDeleteLivestockDialogOpen(true);
  };

  const openDeleteIfsDialog = (id: string) => {
    setDeleteIfsId(id);
    setIsDeleteIfsDialogOpen(true);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(
    paginatedIFS.map((ifs) => ({
      id: ifs.id,
      livestock: ifs.livestocks,
      title: ifs.title,
      author: ifs.author,
      created_at: ifs.created_at,
    }))
  );

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 md:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Livestock Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage livestock and integrated farming system documents
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshAll}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Livestock Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-amber-500/20 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <PawPrint className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-orange-800 uppercase tracking-wide">
                    Total Livestock
                  </CardTitle>
                  <p className="text-xs text-orange-600/80 mt-0.5">
                    All animals
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-3xl font-bold text-orange-900">
                {getTotalLivestockCount()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-orange-700 font-medium">
                  Active Records
                </span>
                <div className="flex items-center space-x-1 text-orange-600">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* IFS Documents Card */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-bl-full"></div>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-violet-500/10 rounded-lg">
                  <BookOpen className="h-6 w-6 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-sm font-semibold text-violet-800 uppercase tracking-wide">
                    IFS Documents
                  </CardTitle>
                  <p className="text-xs text-violet-600/80 mt-0.5">
                    Knowledge base
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="text-3xl font-bold text-violet-900">
                {getTotalIFSCount()}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-violet-700 font-medium">
                  {
                    [
                      ...new Set(
                        ifsList
                          .map((ifs) => ifs.livestock_id)
                          .filter((id) => id !== null)
                      ),
                    ].length
                  }{" "}
                  Livestock Linked
                </span>
                <div className="flex items-center space-x-1 text-violet-600">
                  <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                  <span>Live</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="livestock" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="livestock">Livestock</TabsTrigger>
          <TabsTrigger value="ifs-documents">IFS Documents</TabsTrigger>
        </TabsList>

        {/* LIVESTOCK TAB */}
        <TabsContent value="livestock" className="space-y-4">
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between w-full">
            <div className="flex flex-wrap gap-2 items-center min-w-0 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search livestock..."
                  value={livestockSearchTerm}
                  onChange={(e) => setLivestockSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[300px]"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
              {selectedLivestock.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleBulkDeleteLivestock}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Selected ({selectedLivestock.length})
                </Button>
              )}
              <Dialog
                open={isLivestockDialogOpen}
                onOpenChange={setIsLivestockDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    onClick={() => setEditingLivestock(null)}
                    className="w-full sm:w-auto"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Livestock
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingLivestock
                        ? "Edit Livestock"
                        : "Add New Livestock"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingLivestock
                        ? "Update livestock information"
                        : "Create a new livestock record"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleLivestockSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="livestockName" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="livestockName"
                          value={livestockFormData.name}
                          onChange={(e) =>
                            setLivestockFormData({
                              ...livestockFormData,
                              name: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="Enter livestock name"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="livestockImage" className="text-right">
                          Image
                        </Label>
                        <Input
                          id="livestockImage"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setLivestockFormData({
                              ...livestockFormData,
                              image: file || null,
                            });
                          }}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleLivestockDialogClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUploadingFile}>
                        {isUploadingFile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingLivestock ? "Updating..." : "Creating..."}
                          </>
                        ) : editingLivestock ? (
                          "Update"
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedLivestock.length ===
                          paginatedLivestock.length &&
                        paginatedLivestock.length > 0
                      }
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedLivestock(
                            paginatedLivestock.map((l) => l.id)
                          );
                        } else {
                          setSelectedLivestock([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortLivestock("name")}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortLivestock("created_at")}
                  >
                    <div className="flex items-center">
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortLivestock("updated_at")}
                  >
                    <div className="flex items-center">
                      Updated
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLivestock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm">
                      No livestock found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLivestock.map((livestock) => (
                    <TableRow key={livestock.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedLivestock.includes(livestock.id)}
                          onCheckedChange={() =>
                            handleSelectLivestock(livestock.id)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <img
                          src={livestock.image_url || "/placeholder-image.png"}
                          alt={livestock.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {livestock.name}
                      </TableCell>
                      <TableCell>{formatDate(livestock.created_at)}</TableCell>
                      <TableCell>{formatDate(livestock.updated_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditLivestock(livestock)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                openDeleteLivestockDialog(livestock.id)
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Livestock Pagination */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between px-2 w-full">
            <div className="flex flex-wrap gap-2 items-center min-w-0 w-full md:w-auto">
              <div className="text-sm text-muted-foreground w-full sm:w-auto">
                Showing {livestockStartIndex + 1}-
                {Math.min(livestockEndIndex, filteredAndSortedLivestock.length)}{" "}
                of {filteredAndSortedLivestock.length} livestock
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={livestockPageSize.toString()}
                  onValueChange={(value) => {
                    setLivestockPageSize(Number(value));
                    setLivestockCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLivestockCurrentPage(Math.max(1, livestockCurrentPage - 1))
                }
                disabled={livestockCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {livestockCurrentPage} of {livestockTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setLivestockCurrentPage(
                    Math.min(livestockTotalPages, livestockCurrentPage + 1)
                  )
                }
                disabled={livestockCurrentPage === livestockTotalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* IFS DOCUMENTS TAB */}
        <TabsContent value="ifs-documents" className="space-y-4">
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between w-full">
            <div className="flex flex-wrap gap-2 items-center min-w-0 w-full md:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search IFS documents..."
                  value={ifsSearchTerm}
                  onChange={(e) => setIfsSearchTerm(e.target.value)}
                  className="pl-8 w-full sm:w-[250px]"
                />
              </div>
              <Select
                value={selectedIfsLivestock}
                onValueChange={setSelectedIfsLivestock}
              >
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Filter by livestock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_livestock">All Livestock</SelectItem>
                  {livestocks.map((livestock) => (
                    <SelectItem key={livestock.id} value={livestock.id}>
                      {livestock.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 items-center">
              <Dialog open={isIfsDialogOpen} onOpenChange={setIsIfsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingIfs(null)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add IFS Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingIfs
                        ? "Edit IFS Document"
                        : "Add New IFS Document"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingIfs
                        ? "Update IFS document information"
                        : "Create a new IFS document"}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleIfsSubmit}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifsLivestock" className="text-right">
                          Livestock
                        </Label>
                        <Select
                          value={ifsFormData.livestock_id}
                          onValueChange={(value) =>
                            setIfsFormData({
                              ...ifsFormData,
                              livestock_id: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select livestock (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {livestocks.map((livestock) => (
                              <SelectItem
                                key={livestock.id}
                                value={livestock.id}
                              >
                                {livestock.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifsTitle" className="text-right">
                          Title
                        </Label>
                        <Input
                          id="ifsTitle"
                          value={ifsFormData.title}
                          onChange={(e) =>
                            setIfsFormData({
                              ...ifsFormData,
                              title: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="Enter document title"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifsAuthor" className="text-right">
                          Author
                        </Label>
                        <Input
                          id="ifsAuthor"
                          value={ifsFormData.author}
                          onChange={(e) =>
                            setIfsFormData({
                              ...ifsFormData,
                              author: e.target.value,
                            })
                          }
                          className="col-span-3"
                          placeholder="Enter author name"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ifsPdf" className="text-right">
                          PDF File
                        </Label>
                        <Input
                          id="ifsPdf"
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            setIfsFormData({
                              ...ifsFormData,
                              pdfFile: file || null,
                            });
                          }}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleIfsDialogClose}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isUploadingFile}>
                        {isUploadingFile ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {editingIfs ? "Updating..." : "Creating..."}
                          </>
                        ) : editingIfs ? (
                          "Update"
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortIfs("title")}
                  >
                    <div className="flex items-center">
                      Title
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortIfs("author")}
                  >
                    <div className="flex items-center">
                      Author
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>PDF File</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortIfs("livestock")}
                  >
                    <div className="flex items-center">
                      Livestock
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSortIfs("created_at")}
                  >
                    <div className="flex items-center">
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedIFS.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-sm">
                      No IFS documents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedIFS.map((ifs) => (
                    <TableRow key={ifs.id}>
                      <TableCell className="font-medium">{ifs.title}</TableCell>
                      <TableCell>{ifs.author}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-red-500 mr-2" />
                          <a
                            href={ifs.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View PDF
                          </a>
                        </div>
                      </TableCell>
                      <TableCell>
                        {ifs.livestocks ? (
                          <Badge
                            variant="secondary"
                            className="bg-green-600/10 text-green-600"
                          >
                            <Tag className="h-4 w-4 mr-1" />
                            {ifs.livestocks?.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDate(ifs.created_at)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditIfs(ifs)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openDeleteIfsDialog(ifs.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* IFS Pagination */}
          <div className="flex flex-wrap gap-2 md:gap-4 items-center justify-between px-2 w-full">
            <div className="flex flex-wrap gap-2 items-center min-w-0 w-full md:w-auto">
              <div className="text-sm text-muted-foreground w-full sm:w-auto">
                Showing {ifsStartIndex + 1}-
                {Math.min(ifsEndIndex, filteredAndSortedIFS.length)} of{" "}
                {filteredAndSortedIFS.length} documents
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-sm text-muted-foreground">Show:</span>
                <Select
                  value={ifsPageSize.toString()}
                  onValueChange={(value) => {
                    setIfsPageSize(Number(value));
                    setIfsCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setIfsCurrentPage(Math.max(1, ifsCurrentPage - 1))
                }
                disabled={ifsCurrentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {ifsCurrentPage} of {ifsTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setIfsCurrentPage(Math.min(ifsTotalPages, ifsCurrentPage + 1))
                }
                disabled={ifsCurrentPage === ifsTotalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialogs */}
      <Dialog
        open={isDeleteLivestockDialogOpen}
        onOpenChange={setIsDeleteLivestockDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this livestock? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteLivestockDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteLivestock}
              disabled={deleteLivestockLoading}
            >
              {deleteLivestockLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteIfsDialogOpen}
        onOpenChange={setIsDeleteIfsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this IFS document? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteIfsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteIfs}
              disabled={deleteIfsLoading}
            >
              {deleteIfsLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminLivestockPage = () => {
  return (
    <LivestockProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <LivestockManagement />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LivestockProvider>
  );
};

export default AdminLivestockPage;
