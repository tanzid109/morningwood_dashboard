"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/Shared/Table/Table";
import { useEffect, useState } from "react";
import { getRecentUsers } from "@/Server/Dashboard/Index";
import { toast } from "sonner";

interface CreatorStats {
    totalFollowers: number;
    totalLikes: number;
    totalStreamViews: number;
    totalStreams: number;
}

interface ChannelData {
    _id: string;
    channelName: string;
    username: string;
    creatorStats: CreatorStats;
    createdAt: string;
    image: string;
}


export default function DashboardTable() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<ChannelData[]>([]);

    useEffect(() => {
        const recentUsers = async () => {
            try {
                setLoading(true);
                const res = await getRecentUsers();

                if (res?.success) {
                    setUsers(res.data);
                } else {
                    toast.error(res?.message || "Failed to load users");
                }
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("An error occurred while fetching users");
            } finally {
                setLoading(false);
            }
        };

        recentUsers();
    }, []);
    console.log(users);
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-[#FDD3C6] text-xl">Loading creators...</div>
            </div>
        );
    }

    const columns: ColumnDef<ChannelData>[] = [
        {
            accessorKey: "_id",
            header: () => <div className="text-center">ID</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original._id}</div>
            ),
        },
        {
            accessorKey: "channelName",
            header: () => <div className="text-center">Channel Name</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.channelName}</div>
            ),
        },
        {
            accessorKey: "username",
            header: () => <div className="text-center">User Name</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.username}</div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: () => <div className="text-center">Joined On</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {new Date(row.original.createdAt).toLocaleDateString()}
                </div>
            ),
        },
        {
            accessorKey: "creatorStats.totalFollowers",
            header: () => <div className="text-center">Followers</div>,
            cell: ({ row }) => (
                <div className="text-center">
                    {row.original.creatorStats?.totalFollowers ?? 0}
                </div>
            ),
        },
    ];


    return (
        <div className="bg-[#36190F] p-3 rounded-2xl">
            <h2 className="text-[#FDD3C6] my-4 text-2xl font-semibold">
                Recently Joined Creators
            </h2>
            <DataTable columns={columns} data={users} />
        </div>
    );
}
