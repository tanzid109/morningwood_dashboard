"use client";
import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import { Search, ChevronRight, ChevronLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { toast } from "sonner";
import { DataTable } from "@/Shared/Table/Table";
import Image from "next/image";
import { deleteStream, getAllStreams } from "@/Server/Content";

interface Creator {
    _id: string;
    image: string;
    channelName: string;
    username: string;
}

interface Category {
    _id: string;
    name: string;
}

interface Stream {
    _id: string;
    creatorId: Creator | null;
    title: string;
    categoryId: Category | null;
    thumbnail: string;
    status: "LIVE" | "OFFLINE";
    isPublic: boolean;
    startedAt: string;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    endedAt?: string;
}

interface TableStream extends Stream {
    streamedOn: string;
}

export default function ContentTable() {
    const [streams, setStreams] = useState<TableStream[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sortOption, setSortOption] = useState<string>("newold");
    const [rowSelection, setRowSelection] = useState({});
    const [totalStreams, setTotalStreams] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedStream, setSelectedStream] = useState<TableStream | null>(null);
    const [processing, setProcessing] = useState(false);

    // Fetch streams from API with pagination
    useEffect(() => {
        const fetchStreams = async () => {
            try {
                setLoading(true);

                const response = await getAllStreams({
                    page: pageIndex + 1,
                    limit: pageSize
                });

                if (response.success && response.data) {
                    const transformedStreams = response.data.streams.map((stream: Stream) => ({
                        ...stream,
                        streamedOn: new Date(stream.startedAt).toISOString().split('T')[0]
                    }));
                    setStreams(transformedStreams);
                    setTotalStreams(response.data.total || 0);
                } else {
                    toast.error(response.message || "Failed to fetch streams");
                    setStreams([]);
                    setTotalStreams(0);
                }
            } catch (error) {
                // console.error("Error fetching streams:", error);
                toast.error(error as string || "An error occurred while fetching streams");
                setStreams([]);
                setTotalStreams(0);
            } finally {
                setLoading(false);
            }
        };

        fetchStreams();
    }, [pageIndex, pageSize]);

    const formatNumber = (num: number): string => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
        return num.toString();
    };

    const openDeleteDialog = (stream: TableStream) => {
        setSelectedStream(stream);
        setDialogOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedStream) return;

        try {
            setProcessing(true);
            await deleteStream(selectedStream._id);

            setStreams(streams.filter(stream => stream._id !== selectedStream._id));
            setTotalStreams(prev => prev - 1);

            toast.success("Stream deleted successfully");
            setDialogOpen(false);
            setSelectedStream(null);

            // If we deleted the last item on the page, go to previous page
            if (streams.length === 1 && pageIndex > 0) {
                setPageIndex(pageIndex - 1);
            }
        } catch (error) {
            // console.error("Error deleting stream:", error);
            toast.error(error as string || "An error occurred while deleting the stream");
        } finally {
            setProcessing(false);
        }
    };

    const columns: ColumnDef<TableStream>[] = [
        {
            accessorKey: "_id",
            header: () => <div className="text-center">ID</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original._id.substring(0, 8)}</span>
                </div>
            ),
        },
        {
            accessorKey: "title",
            header: () => <div className="text-left">Stream</div>,
            cell: ({ row }) => (
                <div className="flex justify-stretch items-center gap-2">
                    {row.original.thumbnail ? (
                        <Image
                            src={row.original.thumbnail}
                            alt={row.original.title}
                            width={96}
                            height={56}
                            className="h-14 w-24 rounded-2xl object-cover"
                        />
                    ) : (
                        <span className="h-14 w-24 rounded-2xl bg-[#4C2C22]"></span>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.title}</span>
                        {row.original.categoryId && (
                            <span className="text-xs text-gray-500">{row.original.categoryId.name}</span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "creatorId",
            header: () => <div className="text-center">Creator</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original.creatorId?.channelName || row.original.creatorId?.username || "N/A"}</span>
                </div>
            ),
        },
        {
            accessorKey: "status",
            header: () => <div className="text-center">Status</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.original.status === 'LIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {row.original.status}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "isPublic",
            header: () => <div className="text-center">Visibility</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original.isPublic ? "Public" : "Private"}</span>
                </div>
            ),
        },
        {
            accessorKey: "streamedOn",
            header: () => <div className="text-center">Streamed On</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original.streamedOn}</span>
                </div>
            ),
        },
        {
            accessorKey: "totalViews",
            header: () => <div className="text-center">Views</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.totalViews)}</span>
                </div>
            ),
        },
        {
            accessorKey: "totalLikes",
            header: () => <div className="text-center">Likes</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.totalLikes)}</span>
                </div>
            ),
        },
        {
            accessorKey: "actions",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }) => (
                <div className="text-center flex justify-center items-center">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(row.original)}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const filteredData = useMemo(() => {
        let filtered = streams;

        if (globalFilter) {
            const searchValue = globalFilter.toLowerCase();
            filtered = filtered.filter((stream) =>
                [
                    stream.title,
                    stream.creatorId?.channelName,
                    stream.creatorId?.username,
                    stream.categoryId?.name,
                    stream.status,
                    stream.streamedOn,
                ].some((field) => field?.toString().toLowerCase().includes(searchValue))
            );
        }

        const sorted = [...filtered];
        switch (sortOption) {
            case "newold":
                sorted.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
                break;
            case "oldnew":
                sorted.sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime());
                break;
            case "VHL":
                sorted.sort((a, b) => b.totalViews - a.totalViews);
                break;
            case "VLH":
                sorted.sort((a, b) => a.totalViews - b.totalViews);
                break;
            case "LHL":
                sorted.sort((a, b) => b.totalLikes - a.totalLikes);
                break;
            case "LLH":
                sorted.sort((a, b) => a.totalLikes - b.totalLikes);
                break;
            default:
                break;
        }

        return sorted;
    }, [streams, globalFilter, sortOption]);

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(totalStreams / pageSize),
        manualPagination: true,
        state: {
            pagination: { pageIndex, pageSize },
            columnFilters,
            globalFilter,
            rowSelection
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: (updater) => {
            const newPagination =
                typeof updater === "function"
                    ? updater({ pageIndex, pageSize })
                    : updater;
            setPageIndex(newPagination.pageIndex);
            setPageSize(newPagination.pageSize);
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const selectedCount = table.getSelectedRowModel().rows.length;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#FDD3C6] text-xl">Loading streams...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-[#FDD3C6] text-4xl font-semibold my-3 px-2">Content</h2>

            {/* Search & Filters */}
            <div className="py-6 flex flex-col md:flex-row justify-between items-center my-6 gap-4">
                {/* Search Input */}
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDD3C6] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search streams..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="shadow rounded-md border py-2 pl-10 pr-8 text-[#FDD3C6] focus:ring-2 focus:ring-[#FDD3C6] focus:outline-none w-full md:w-80"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 w-full md:w-auto">
                    {/* Sort Select */}
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sorting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort By</SelectLabel>
                                <SelectItem value="newold">Date (New-Old)</SelectItem>
                                <SelectItem value="oldnew">Date (Old-New)</SelectItem>
                                <SelectItem value="VHL">Views (High to Low)</SelectItem>
                                <SelectItem value="VLH">Views (Low to High)</SelectItem>
                                <SelectItem value="LHL">Likes (High to Low)</SelectItem>
                                <SelectItem value="LLH">Likes (Low to High)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Table */}
            <DataTable columns={columns} data={filteredData} />

            {/* Results */}
            <div className="mt-2 text-sm text-center text-[#FDD3C6]">
                Showing {Math.min((pageIndex * pageSize) + 1, totalStreams)} to {Math.min((pageIndex + 1) * pageSize, totalStreams)} of {totalStreams} results
                {selectedCount > 0 && <span className="ml-2 font-semibold">({selectedCount} selected)</span>}
            </div>

            {/* Pagination */}
            <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-4 mt-4">
                {/* Pagination Controls */}
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <Button
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        className="rounded-full px-4 py-2"
                    >
                        <ChevronLeft />
                    </Button>

                    {(() => {
                        const totalPages = table.getPageCount();
                        const currentPage = table.getState().pagination.pageIndex + 1;
                        const pages: (number | string)[] = [];

                        if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                        } else {
                            if (currentPage <= 4) {
                                pages.push(1, 2, 3, 4, 5, "...", totalPages);
                            } else if (currentPage >= totalPages - 3) {
                                pages.push(
                                    1,
                                    "...",
                                    totalPages - 4,
                                    totalPages - 3,
                                    totalPages - 2,
                                    totalPages - 1,
                                    totalPages
                                );
                            } else {
                                pages.push(
                                    1,
                                    "...",
                                    currentPage - 1,
                                    currentPage,
                                    currentPage + 1,
                                    "...",
                                    totalPages
                                );
                            }
                        }

                        return pages.map((page, index) => {
                            if (page === "...") {
                                return (
                                    <span key={index} className="px-3 py-2 text-gray-500">
                                        ...
                                    </span>
                                );
                            }
                            const isActive = currentPage === page;
                            return (
                                <Button
                                    key={index}
                                    onClick={() => table.setPageIndex((page as number) - 1)}
                                    className={`px-4 py-2 border rounded-full ${isActive
                                        ? "bg-[#FDD3C6] text-black"
                                        : "bg-white text-black hover:bg-[#dbaea1]"
                                        }`}
                                >
                                    {page}
                                </Button>
                            );
                        });
                    })()}

                    <Button
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        className="rounded-full px-4 py-2"
                    >
                        <ChevronRight />
                    </Button>
                </div>

                {/* Page Size Selector */}
                <div className="flex flex-wrap justify-center items-center gap-2">
                    <p className="text-[#FDD3C6] text-sm md:text-base">Show per page</p>
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={(e) => {
                            table.setPageSize(Number(e.target.value));
                            setPageIndex(0);
                        }}
                        className="border p-1 rounded-lg bg-[#36190F] text-white font-medium text-sm md:text-base"
                    >
                        {[5, 10, 20].map((size) => (
                            <option className="bg-[#36190F]" key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Stream?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete &quot;{selectedStream?.title}&quot;. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}