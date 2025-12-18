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
import { getAllUsers, deleteUser } from "@/Server/Creators";
import Image from "next/image";

interface User {
    _id: string;
    role: string;
    email: string;
    image: string;
    status: string;
    verified: boolean;
    followers: number;
    likes: number;
    views: number;
    streams: number;
    createdAt: string;
    channelName?: string;
    username?: string;
}

interface TableUser extends User {
    joinedOn: string;
}

const CreatorTable = () => {
    const [users, setUsers] = useState<TableUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageSize, setPageSize] = useState(5);
    const [pageIndex, setPageIndex] = useState(0);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sortOption, setSortOption] = useState<string>("newold");
    const [rowSelection, setRowSelection] = useState({});
    const [totalUsers, setTotalUsers] = useState(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<TableUser | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch users from API with pagination
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                const response = await getAllUsers({
                    page: pageIndex + 1,
                    limit: pageSize
                });

                if (response.success && response.data) {
                    const transformedUsers = response.data.map((user: User) => ({
                        ...user,
                        joinedOn: new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toISOString().split('T')[0]
                    }));
                    setUsers(transformedUsers);

                    const total = response.total || response.totalCount || response.pagination?.total || response.meta?.total;

                    if (total !== undefined) {
                        setTotalUsers(total);
                    } else {
                        // Fallback: if no total in response, use current data length
                        console.warn('No total count found in API response. Using data length as fallback.');
                        setTotalUsers(transformedUsers.length);
                    }
                } else {
                    toast.error(response.message || "Failed to fetch users");
                    setUsers([]);
                    setTotalUsers(0);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("An error occurred while fetching users");
                setUsers([]);
                setTotalUsers(0);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [pageIndex, pageSize]);

    const formatNumber = (num: number): string => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
        return num.toString();
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setDeleting(true);
            const response = await deleteUser(userToDelete._id);

            if (response.success) {
                toast.success("Creator deleted successfully");
                setUsers(users.filter(user => user._id !== userToDelete._id));
                setTotalUsers(prev => prev - 1);
                setDeleteDialogOpen(false);
                setUserToDelete(null);

                if (users.length === 1 && pageIndex > 0) {
                    setPageIndex(pageIndex - 1);
                }
            } else {
                toast.error(response.message || "Failed to delete creator");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("An error occurred while deleting the creator");
        } finally {
            setDeleting(false);
        }
    };

    const columns: ColumnDef<TableUser>[] = [
        {
            accessorKey: "SL",
            header: () => <div className="text-center">ID</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{(row.original._id).substring(0, 8) || "N/A"}</span>
                </div>
            ),
        },
        {
            accessorKey: "channelName",
            header: () => <div className="text-left">Channel Name</div>,
            cell: ({ row }) => (
                <div className="flex justify-stretch items-center gap-2">
                    {row.original.image ? (
                        <Image
                            src={row.original.image}
                            alt={row.original.channelName || "Channel"}
                            width={96}
                            height={56}
                            className="h-14 w-24 rounded-2xl object-cover"
                        />
                    ) : (
                        <span className="h-14 w-24 rounded-2xl bg-[#4C2C22]"></span>
                    )}
                    <span>{row.original.channelName || "N/A"}</span>
                </div>
            ),
        },
        {
            accessorKey: "username",
            header: () => <div className="text-center">User Name</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original.username || "N/A"}</span>
                </div>
            ),
        },
        {
            accessorKey: "joinedOn",
            header: () => <div className="text-center">Joined On</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{row.original.joinedOn}</span>
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalFollowers",
            header: () => <div className="text-center">Followers</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.followers)}</span>
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalStreamViews",
            header: () => <div className="text-center">Views</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.views)}</span>
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalLikes",
            header: () => <div className="text-center">Likes</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.likes)}</span>
                </div>
            ),
        },
        {
            accessorKey: "_id",
            header: () => <div className="text-center">Action</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                            setUserToDelete(row.original);
                            setDeleteDialogOpen(true);
                        }}
                        className="gap-2"
                    >
                        <Trash2 className="h-4 w-4" />
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    // Apply client-side filtering and sorting ONLY for display
    // This doesn't affect pagination
    const filteredData = useMemo(() => {
        let filtered = users;

        if (globalFilter) {
            const searchValue = globalFilter.toLowerCase();
            filtered = filtered.filter((user) =>
                [
                    user.channelName,
                    user.username,
                    user.email,
                    user.joinedOn,
                ].some((field) => field?.toString().toLowerCase().includes(searchValue))
            );
        }

        const sorted = [...filtered];
        switch (sortOption) {
            case "newold":
                sorted.sort((a, b) => new Date(b.joinedOn).getTime() - new Date(a.joinedOn).getTime());
                break;
            case "oldnew":
                sorted.sort((a, b) => new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime());
                break;
            case "FHL":
                sorted.sort((a, b) => b.followers - a.followers);
                break;
            case "FLH":
                sorted.sort((a, b) => a.followers - b.followers);
                break;
            case "VHL":
                sorted.sort((a, b) => b.views - a.views);
                break;
            case "VLH":
                sorted.sort((a, b) => a.views - b.views);
                break;
            case "LHL":
                sorted.sort((a, b) => b.likes - a.likes);
                break;
            case "LLH":
                sorted.sort((a, b) => a.likes - b.likes);
                break;
            default:
                break;
        }

        return sorted;
    }, [users, globalFilter, sortOption]);

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(totalUsers / pageSize),
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
                <div className="text-[#FDD3C6] text-xl">Loading creators...</div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-[#FDD3C6] text-4xl font-semibold my-3 px-2">Creators</h2>

            <div className="py-6 flex flex-col md:flex-row justify-between items-center my-6 gap-4">
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDD3C6] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={globalFilter}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="shadow rounded-md border py-2 pl-10 pr-8 text-[#FDD3C6] focus:ring-2 focus:ring-[#FDD3C6] focus:outline-none w-full md:w-80"
                    />
                </div>

                <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 w-full md:w-auto">
                    {/* <p className="text-[#FDD3C6] font-semibold text-xl">Filter</p> */}
                    <Select value={sortOption} onValueChange={setSortOption}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sorting" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Sort By</SelectLabel>
                                <SelectItem value="newold">Date (New-Old)</SelectItem>
                                <SelectItem value="oldnew">Date (Old-New)</SelectItem>
                                <SelectItem value="FHL">Followers (High to Low)</SelectItem>
                                <SelectItem value="FLH">Followers (Low to High)</SelectItem>
                                <SelectItem value="VHL">Views (High to Low)</SelectItem>
                                <SelectItem value="VLH">Views (Low to High)</SelectItem>
                                <SelectItem value="LHL">Likes (High to Low)</SelectItem>
                                <SelectItem value="LLH">Likes (Low to High)</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <DataTable columns={columns} data={filteredData} />

            <div className="mt-2 text-sm text-center text-[#FDD3C6]">
                Showing {Math.min((pageIndex * pageSize) + 1, totalUsers)} to {Math.min((pageIndex + 1) * pageSize, totalUsers)} of {totalUsers} results
                {selectedCount > 0 && <span className="ml-2 font-semibold">({selectedCount} selected)</span>}
            </div>

            <div className="flex flex-col md:flex-row-reverse justify-between items-center gap-4 mt-4">
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

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the creator account for{" "}
                            <span className="font-semibold text-foreground">
                                {userToDelete?.channelName || userToDelete?.username || "this user"}
                            </span>
                            . This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteUser}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default CreatorTable;