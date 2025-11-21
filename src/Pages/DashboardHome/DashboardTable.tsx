"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/Shared/Table/Table";
import { channelData } from "@/Database/ChannelData";

interface ChannelData {
    id: number;
    channelName: string;
    username: string;
    joinedOn: string;
    followers: string;
}

export default function DashboardTable() {
    const columns: ColumnDef<ChannelData>[] = [
        {
            accessorKey: "id",
            header: () => <div className="text-center">SL</div>,
            cell: ({ row }) => <div className="text-center">{row.original.id}</div>,
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
            accessorKey: "joinedOn",
            header: () => <div className="text-center">Joined On</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.joinedOn}</div>
            ),
        },
        {
            accessorKey: "followers",
            header: () => <div className="text-center">Followers</div>,
            cell: ({ row }) => (
                <div className="text-center">{row.original.followers}</div>
            ),
        },
    ];

    return (
        <div className="bg-[#36190F] p-3 rounded-2xl">
            <h2 className="text-[#FDD3C6] my-4 text-2xl font-semibold">Recently Joined Creators</h2>
            <DataTable columns={columns} data={channelData} />
        </div>
    );
}
