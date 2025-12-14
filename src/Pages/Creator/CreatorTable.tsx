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
import { Search, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DataTable } from "@/Shared/Table/Table";
import { getAllUsers } from "@/Server/Creators";

interface User {
    _id: string;
    role: string;
    email: string;
    image: string;
    status: string;
    verified: boolean;
    creatorStats: {
        totalFollowers: number;
        totalStreams: number;
        totalStreamViews: number;
        totalLikes: number;
    };
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
    const [actionValue, setActionValue] = useState<string>("");
    const [totalUsers, setTotalUsers] = useState(0);

    // Fetch users from API with pagination
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);

                // Call API with pagination parameters
                const response = await getAllUsers({
                    page: pageIndex + 1, // API pages start from 1
                    limit: pageSize
                });

                if (response.success && response.data?.users) {
                    // Transform the API data to include joinedOn date
                    const transformedUsers = response.data.users.map((user: User) => ({
                        ...user,
                        joinedOn: new Date(parseInt(user._id.substring(0, 8), 16) * 1000).toISOString().split('T')[0]
                    }));
                    setUsers(transformedUsers);
                    setTotalUsers(response.data.total || transformedUsers.length);
                } else {
                    toast.error(response.message || "Failed to fetch users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("An error occurred while fetching users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [pageIndex, pageSize]);

    // Helper function to format numbers
    const formatNumber = (num: number): string => {
        if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)} B`;
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)} M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)} K`;
        return num.toString();
    };

    const columns: ColumnDef<TableUser>[] = [
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
            accessorKey: "channelName",
            header: () => <div className="text-left">Channel Name</div>,
            cell: ({ row }) => (
                <div className="flex justify-stretch items-center gap-2">
                    {row.original.image ? (
                        <img
                            src={row.original.image}
                            alt={row.original.channelName || "Channel"}
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
                    <span>{formatNumber(row.original.creatorStats.totalFollowers)}</span>
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalStreamViews",
            header: () => <div className="text-center">Views</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.creatorStats.totalStreamViews)}</span>
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalLikes",
            header: () => <div className="text-center">Likes</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    <span>{formatNumber(row.original.creatorStats.totalLikes)}</span>
                </div>
            ),
        },
    ];

    // Filtering and Sorting logic (client-side for current page)
    const filteredData = useMemo(() => {
        let filtered = users;

        // Apply search filter
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

        // Apply sorting
        const sorted = [...filtered];
        switch (sortOption) {
            case "newold":
                sorted.sort((a, b) => new Date(b.joinedOn).getTime() - new Date(a.joinedOn).getTime());
                break;
            case "oldnew":
                sorted.sort((a, b) => new Date(a.joinedOn).getTime() - new Date(b.joinedOn).getTime());
                break;
            case "FHL":
                sorted.sort((a, b) => b.creatorStats.totalFollowers - a.creatorStats.totalFollowers);
                break;
            case "FLH":
                sorted.sort((a, b) => a.creatorStats.totalFollowers - b.creatorStats.totalFollowers);
                break;
            case "VHL":
                sorted.sort((a, b) => b.creatorStats.totalStreamViews - a.creatorStats.totalStreamViews);
                break;
            case "VLH":
                sorted.sort((a, b) => a.creatorStats.totalStreamViews - b.creatorStats.totalStreamViews);
                break;
            case "LHL":
                sorted.sort((a, b) => b.creatorStats.totalLikes - a.creatorStats.totalLikes);
                break;
            case "LLH":
                sorted.sort((a, b) => a.creatorStats.totalLikes - b.creatorStats.totalLikes);
                break;
            default:
                break;
        }

        return sorted;
    }, [users, globalFilter, sortOption]);

    const table = useReactTable({
        data: filteredData,
        columns,
        pageCount: Math.ceil(totalUsers / pageSize), // Use total from API
        manualPagination: true, // Tell the table we're handling pagination
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

    // Handle bulk actions
    const handleAction = (action: string) => {
        const selectedRows = table.getSelectedRowModel().rows;

        if (selectedRows.length === 0) {
            toast.error("Please select at least one user");
            setActionValue("");
            return;
        }

        const selectedUsers = selectedRows.map(row => row.original);

        switch (action) {
            case "delete":
                if (confirm(`Are you sure you want to delete ${selectedRows.length} user(s)?`)) {
                    const updatedUsers = users.filter(user =>
                        !selectedUsers.some(selected => selected._id === user._id)
                    );
                    setUsers(updatedUsers);
                    setRowSelection({});
                    toast.success(`${selectedRows.length} user(s) deleted successfully`);
                }
                break;

            case "export":
                const exportData = selectedUsers.map(user => ({
                    channelName: user.channelName,
                    username: user.username,
                    email: user.email,
                    followers: user.creatorStats.totalFollowers,
                    views: user.creatorStats.totalStreamViews,
                    likes: user.creatorStats.totalLikes,
                    joinedOn: user.joinedOn
                }));
                console.log("Exporting:", exportData);
                toast.success(`Exporting ${selectedRows.length} user(s)`);
                setRowSelection({});
                break;
        }
        setActionValue("");
    };

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

            {/* Search & Filters */}
            <div className="py-6 flex flex-col md:flex-row justify-between items-center my-6 gap-4">
                {/* Search Input */}
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FDD3C6] w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search creators..."
                        value={globalFilter}
                        onChange={(e) => {
                            setGlobalFilter(e.target.value);
                            setPageIndex(0);
                        }}
                        className="shadow rounded-md border py-2 pl-10 pr-8 text-[#FDD3C6] focus:ring-2 focus:ring-[#635BFF] focus:outline-none cursor-pointer w-full md:w-80"
                    />
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 w-full md:w-auto">
                    {/* Action Select */}
                    <Select
                        value={actionValue}
                        onValueChange={(value) => {
                            setActionValue(value);
                            handleAction(value);
                        }}
                    >
                        <SelectTrigger className={`w-[180px] ${selectedCount > 0 ? 'border-[#635BFF] border-2' : ''}`}>
                            <SelectValue placeholder={selectedCount > 0 ? `Action (${selectedCount})` : "Action"} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Action</SelectLabel>
                                <SelectItem value="delete">Delete</SelectItem>
                                <SelectItem value="export">Export</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                    {/* Sort Select */}
                    <Select value={sortOption} onValueChange={(value) => {
                        setSortOption(value);
                        setPageIndex(0);
                    }}>
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

            {/* Table */}
            <DataTable columns={columns} data={filteredData} />

            {/* Results */}
            <div className="mt-2 text-sm text-center text-[#FDD3C6]">
                Showing {((pageIndex) * pageSize) + 1} to {Math.min((pageIndex + 1) * pageSize, totalUsers)} of {totalUsers} results
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
                        onChange={(e) => table.setPageSize(Number(e.target.value))}
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
        </div>
    );
}

export default CreatorTable;