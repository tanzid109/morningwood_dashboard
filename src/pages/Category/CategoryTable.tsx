"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { Search, ChevronRight, ChevronLeft, Edit3, Upload, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/Shared/Table/Table";
import { getAllCategory, createCategory, updateCategory, deleteCategory } from "@/Server/Category";
import { toast } from "sonner";

interface Category {
    _id: string;
    name: string;
    image: string;
    coverPhoto: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface CategoryTableData extends Category {
    sl: number;
}

export default function CategoryTable() {
    const [categories, setCategories] = useState<CategoryTableData[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [totalCategories, setTotalCategories] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryTableData | null>(null);

    // Delete dialog states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState<CategoryTableData | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Form states
    const [categoryName, setCategoryName] = useState("");
    const [mainPhoto, setMainPhoto] = useState<string>("");
    const [coverPhoto, setCoverPhoto] = useState<string>("");
    const [mainPhotoFile, setMainPhotoFile] = useState<File | null>(null);
    const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);

    // Fetch categories from API with pagination
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getAllCategory({
                page: pageIndex + 1,
                limit: pageSize
            });

            if (response.success && response.data) {
                const transformedCategories = response.data.map((category: Category, index: number) => ({
                    ...category,
                    sl: (pageIndex * pageSize) + index + 1
                }));
                setCategories(transformedCategories);
                setTotalCategories(response.meta?.total || transformedCategories.length);
            } else {
                toast.error(response.message || "Failed to fetch categories");
            }
        } catch (error) {
            toast.error(error as string || "An error occurred while fetching categories");
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Filtered search (client-side for current page)
    const filteredData = useMemo(() => {
        if (!globalFilter) return categories;
        return categories.filter((item) =>
            item.name.toLowerCase().includes(globalFilter.toLowerCase())
        );
    }, [categories, globalFilter]);

    // Handle file upload
    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "main" | "cover"
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (type === "main") {
                    setMainPhoto(reader.result as string);
                    setMainPhotoFile(file);
                } else {
                    setCoverPhoto(reader.result as string);
                    setCoverPhotoFile(file);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    // Open dialog for adding new category
    const handleAddCategory = () => {
        setIsEditMode(false);
        setEditingCategory(null);
        setCategoryName("");
        setMainPhoto("");
        setCoverPhoto("");
        setMainPhotoFile(null);
        setCoverPhotoFile(null);
        setIsDialogOpen(true);
    };

    // Open dialog for editing category
    const handleEditCategory = (category: CategoryTableData) => {
        setIsEditMode(true);
        setEditingCategory(category);
        setCategoryName(category.name);
        setMainPhoto(category.image);
        setCoverPhoto(category.coverPhoto);
        setMainPhotoFile(null);
        setCoverPhotoFile(null);
        setIsDialogOpen(true);
    };

    // Open delete confirmation dialog
    const handleDeleteClick = (category: CategoryTableData) => {
        setDeletingCategory(category);
        setIsDeleteDialogOpen(true);
    };

    // Confirm delete category
    const handleConfirmDelete = async () => {
        if (!deletingCategory) return;

        try {
            setIsDeleting(true);

            const response = await deleteCategory(deletingCategory._id);

            if (response.success) {
                toast.success("Category deleted successfully");
                setIsDeleteDialogOpen(false);
                setDeletingCategory(null);

                // Refresh the categories list
                fetchCategories();
            } else {
                toast.error(response.message || "Failed to delete category");
            }
        } catch (error) {
            toast.error(error as string || "An error occurred while deleting the category");
        } finally {
            setIsDeleting(false);
        }
    };

    // Save category (add or edit)
    const handleSaveCategory = async () => {
        // Validation
        if (!categoryName.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!isEditMode) {
            // For new category, files are required
            if (!mainPhotoFile) {
                toast.error("Main photo is required");
                return;
            }
            if (!coverPhotoFile) {
                toast.error("Cover photo is required");
                return;
            }
        }

        try {
            setIsSubmitting(true);

            if (isEditMode && editingCategory) {
                // Update existing category
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const updateData: any = {
                    id: editingCategory._id,
                    name: categoryName,
                };

                // Only include files if they were changed
                if (mainPhotoFile) {
                    updateData.image = mainPhotoFile;
                }
                if (coverPhotoFile) {
                    updateData.coverPhoto = coverPhotoFile;
                }

                const response = await updateCategory(updateData);

                if (response.success) {
                    toast.success("Category updated successfully");
                    setIsDialogOpen(false);

                    // Reset form
                    setCategoryName("");
                    setMainPhoto("");
                    setCoverPhoto("");
                    setMainPhotoFile(null);
                    setCoverPhotoFile(null);
                    setEditingCategory(null);

                    // Refresh the categories list
                    fetchCategories();
                } else {
                    toast.error(response.message || "Failed to update category");
                }
            } else {
                // Create new category
                const categoryData = {
                    name: categoryName,
                    image: mainPhotoFile!,
                    coverPhoto: coverPhotoFile!,
                };

                const response = await createCategory(categoryData);

                if (response.success) {
                    toast.success("Category created successfully");
                    setIsDialogOpen(false);

                    // Reset form
                    setCategoryName("");
                    setMainPhoto("");
                    setCoverPhoto("");
                    setMainPhotoFile(null);
                    setCoverPhotoFile(null);

                    // Refresh the categories list
                    fetchCategories();
                } else {
                    toast.error(response.message || "Failed to create category");
                }
            }
        } catch (error) {
            toast.error(error as string || "An error occurred while saving the category");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Table columns
    const columns: ColumnDef<CategoryTableData>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "sl",
            header: () => <div className="text-center">SL</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.sl}</div>
            ),
        },
        {
            accessorKey: "name",
            header: () => <div className="text-center">Category Name</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.name}</div>
            ),
        },
        {
            accessorKey: "image",
            header: () => <div className="text-center">Main Photo</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.image ? (
                        <Image
                            src={row.original.image}
                            height={64}
                            width={64}
                            alt="Main"
                            className="rounded-md object-cover w-16 h-16"
                        />
                    ) : (
                        <div className="w-16 h-16 bg-[#4C2C22] rounded-md flex items-center justify-center text-xs text-[#FDD3C6]">
                            No Image
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "coverPhoto",
            header: () => <div className="text-center">Cover Photo</div>,
            cell: ({ row }) => (
                <div className="flex justify-center">
                    {row.original.coverPhoto ? (
                        <Image
                            src={row.original.coverPhoto}
                            height={64}
                            width={224}
                            alt="Cover"
                            className="rounded-md object-cover h-16 w-56"
                        />
                    ) : (
                        <div className="w-56 h-16 bg-[#4C2C22] rounded-md flex items-center justify-center text-xs text-[#FDD3C6]">
                            No Cover
                        </div>
                    )}
                </div>
            ),
        },
        {
            accessorKey: "action",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }) => (
                <div className="flex justify-center items-center gap-4">
                    <Edit3
                        className="cursor-pointer transition-colors hover:text-[#4C2C22]"
                        onClick={() => handleEditCategory(row.original)}
                    />
                    <Trash
                        className="cursor-pointer transition-colors hover:text-red-500"
                        onClick={() => handleDeleteClick(row.original)}
                    />
                </div>
            ),
        },
    ];

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(totalCategories / pageSize),
        manualPagination: true,
        state: {
            pagination: { pageIndex, pageSize },
            globalFilter,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updater) => {
            const next =
                typeof updater === "function"
                    ? updater({ pageIndex, pageSize })
                    : updater;
            setPageIndex(next.pageIndex);
            setPageSize(next.pageSize);
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#FDD3C6] text-xl">Loading categories...</div>
            </div>
        );
    }

    return (
        <main>
            <div className="flex flex-col md:flex-row md:justify-between md:items-center my-5">
                <h2 className="text-[#FDD3C6] md:text-4xl text-xl font-semibold my-3 px-2">
                    Category
                </h2>
                <Button
                    onClick={handleAddCategory}
                    className="md:text-xl md:px-6 md:py-6 w-fit"
                >
                    <Plus className="size-6" />Create New Category
                </Button>
            </div>

            {/* Search */}
            <div className="py-6 flex flex-col md:flex-row-reverse md:justify-between md:items-center my-6 gap-4">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#FDD3C6] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search category..."
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        className="shadow rounded-md border py-2 pl-10 pr-8 text-[#FDD3C6] focus:ring-2 focus:ring-[#635BFF] bg-transparent w-full"
                    />
                </div>

                {/* Page Size */}
                <div className="flex items-center gap-2">
                    <p className="text-[#FDD3C6] text-sm md:text-base">Show per page</p>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="border p-1 rounded-lg bg-[#36190F] text-white text-sm md:text-base"
                    >
                        {[5, 10, 20].map((size) => (
                            <option className="bg-[#36190F]" key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Results Info */}
            <div className="mb-2 text-sm text-center text-[#FDD3C6]">
                Showing {((pageIndex) * pageSize) + 1} to {Math.min((pageIndex + 1) * pageSize, totalCategories)} of {totalCategories} results
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <DataTable columns={columns} data={filteredData} />
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2 mt-6">
                <Button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="rounded-full p-2 w-full sm:w-auto"
                >
                    <ChevronLeft />
                    <span className="sm:hidden ml-2">Previous</span>
                </Button>

                <span className="text-[#FDD3C6] text-sm sm:text-base">
                    Page {pageIndex + 1} of {Math.max(1, table.getPageCount())}
                </span>

                <Button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="rounded-full p-2 w-full sm:w-auto"
                >
                    <span className="sm:hidden mr-2">Next</span>
                    <ChevronRight />
                </Button>
            </div>

            {/* Add/Edit Category Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-[#2A1810] border-[#4A3830] text-[#FDD3C6] max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#FDD3C6] text-lg sm:text-xl">
                            {isEditMode ? "Edit Category" : "Create New Category"}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Category Name */}
                        <div className="space-y-2">
                            <Label htmlFor="categoryName" className="text-[#FDD3C6] text-sm sm:text-base">
                                Category Name
                            </Label>
                            <Input
                                id="categoryName"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                                placeholder="Just Chatting"
                                className="bg-[#36190F] border-[#4A3830] text-[#FDD3C6] focus:ring-[#635BFF] text-sm sm:text-base"
                            />
                        </div>

                        {/* Main Photo */}
                        <div className="space-y-2">
                            <Label className="text-[#FDD3C6] text-sm sm:text-base">
                                Main Photo {isEditMode && <span className="text-xs text-[#B8968A]">(Leave empty to keep current)</span>}
                            </Label>
                            <div className="border-2 border-dashed border-[#4A3830] rounded-lg p-4 sm:p-6 text-center hover:border-[#635BFF] transition-colors">
                                <input
                                    type="file"
                                    id="mainPhoto"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(e) => handleFileUpload(e, "main")}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="mainPhoto"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {mainPhoto ? (
                                        <div className="relative">
                                            <Image
                                                src={mainPhoto}
                                                alt="Main preview"
                                                width={148}
                                                height={220}
                                                className="rounded-md object-cover max-w-full h-auto"
                                            />
                                            {mainPhotoFile && (
                                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                    New
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#FDD3C6]" />
                                            <p className="text-[#FDD3C6] text-sm sm:text-base">Upload a photo</p>
                                            <p className="text-[#B8968A] text-xs sm:text-sm">
                                                Must be JPG, JPEG or PNG
                                            </p>
                                            <p className="text-[#B8968A] text-xs sm:text-sm">
                                                148×220 px, under 2 MB
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Cover Photo */}
                        <div className="space-y-2">
                            <Label className="text-[#FDD3C6] text-sm sm:text-base">
                                Cover Photo {isEditMode && <span className="text-xs text-[#B8968A]">(Leave empty to keep current)</span>}
                            </Label>
                            <div className="border-2 border-dashed border-[#4A3830] rounded-lg p-4 sm:p-6 text-center hover:border-[#635BFF] transition-colors">
                                <input
                                    type="file"
                                    id="coverPhoto"
                                    accept="image/jpeg,image/png,image/jpg"
                                    onChange={(e) => handleFileUpload(e, "cover")}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="coverPhoto"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    {coverPhoto ? (
                                        <div className="relative">
                                            <Image
                                                src={coverPhoto}
                                                alt="Cover preview"
                                                width={1160}
                                                height={320}
                                                className="rounded-md object-cover max-w-full h-auto"
                                            />
                                            {coverPhotoFile && (
                                                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                                                    New
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-[#FDD3C6]" />
                                            <p className="text-[#FDD3C6] text-sm sm:text-base">Upload a photo</p>
                                            <p className="text-[#B8968A] text-xs sm:text-sm">
                                                Must be JPG, JPEG or PNG
                                            </p>
                                            <p className="text-[#B8968A] text-xs sm:text-sm">
                                                1160×320 px, under 6 MB
                                            </p>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex-col md:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                            disabled={isSubmitting}
                            className="bg-transparent border-[#4A3830] text-[#FDD3C6] hover:bg-[#36190F] w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSaveCategory}
                            disabled={isSubmitting}
                            className="bg-[#FDD3C6] text-[#2A1810] hover:bg-[#FCC1AD] w-full sm:w-auto"
                        >
                            {isSubmitting ? "Saving..." : (isEditMode ? "Update" : "Create")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent className="bg-[#2A1810] border-[#4A3830] text-[#FDD3C6]">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-[#FDD3C6]">
                            Delete Category
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-[#B8968A]">
                            Are you sure you want to delete &quot;{deletingCategory?.name}&quot;? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="bg-transparent border-[#4A3830] text-[#FDD3C6] hover:bg-[#36190F]"
                            disabled={isDeleting}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={isDeleting}
                            className="bg-red-600 text-white hover:bg-red-700"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </main>
    );
}