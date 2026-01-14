/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getGrowthOverview } from "@/Server/Dashboard/Index";
import { toast } from "sonner";

/* ---------------- constants ---------------- */
const MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

/* ---------------- types ---------------- */
type MonthlyStat = {
    _id: string; // YYYY-MM
    count: number;
};

type GrowthApiResponse = {
    success: boolean;
    data: {
        totalCreators: number;
        totalLiveStreamers: number;
        newCreatorsLastMonth: number;
        liveStreamsLastMonth: number;
        monthlyCreators: MonthlyStat[];
        liveStreams: MonthlyStat[];
    };
};

type ChartItem = {
    month: string;
    newCreator: number;
    liveStreams: number;
};

type Stats = {
    totalCreators: number;
    totalLiveStreamers: number;
    newCreatorsLastMonth: number;
    liveStreamsLastMonth: number;
};

/* ---------------- helpers ---------------- */
const buildMonthlyData = (
    monthlyCreators: MonthlyStat[],
    liveStreams: MonthlyStat[]
): ChartItem[] => {
    const creatorMap: Record<number, number> = {};
    const streamMap: Record<number, number> = {};

    monthlyCreators.forEach((item) => {
        const [, month] = item._id.split("-");
        creatorMap[Number(month) - 1] = item.count;
    });

    liveStreams.forEach((item) => {
        const [, month] = item._id.split("-");
        streamMap[Number(month) - 1] = item.count;
    });

    return MONTHS.map((month, index) => ({
        month,
        newCreator: creatorMap[index] ?? 0,
        liveStreams: streamMap[index] ?? 0,
    }));
};

const formatNumber = (num: number) =>
    num >= 1000 ? `${(num / 1000).toFixed(1)}K` : num.toString();

/* ---------------- component ---------------- */
export default function GrowthOverview() {
    const [chartData, setChartData] = useState<ChartItem[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalCreators: 0,
        totalLiveStreamers: 0,
        newCreatorsLastMonth: 0,
        liveStreamsLastMonth: 0,
    });

    useEffect(() => {
        fetchGrowth();
    }, []);

    const fetchGrowth = async () => {
        try {
            const result = (await getGrowthOverview()) as GrowthApiResponse;

            if (!result.success) return;

            const {
                totalCreators,
                totalLiveStreamers,
                newCreatorsLastMonth,
                liveStreamsLastMonth,
                monthlyCreators,
                liveStreams,
            } = result.data;

            setStats({
                totalCreators,
                totalLiveStreamers,
                newCreatorsLastMonth,
                liveStreamsLastMonth,
            });

            setChartData(buildMonthlyData(monthlyCreators, liveStreams));
        } catch (error) {
            // console.error("Growth overview error:", error);
            toast.error(error as string || "Failed to load growth overview data");
        }
    };

    return (
        <Card className="w-full my-4 bg-[#36190F] p-6 text-white border-none rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-[#FDD3C6] font-semibold">
                    Growth Overview
                </h2>
                <span className="text-xs text-[#FDD3C6]/80 border px-3 py-1 rounded-full">
                    November 2025
                </span>
            </div>

            {/* Chart */}
            <div className="h-64 mb-8">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="creatorGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#d4a574" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#d4a574" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="streamGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#e8d4c4" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="#e8d4c4" stopOpacity={0} />
                            </linearGradient>
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                        <XAxis dataKey="month" tick={{ fill: "#9ca3af" }} />
                        <YAxis tick={{ fill: "#9ca3af" }} />

                        <Area
                            type="monotone"
                            dataKey="newCreator"
                            stroke="#d4a574"
                            strokeWidth={2}
                            fill="url(#creatorGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="liveStreams"
                            stroke="#e8d4c4"
                            strokeWidth={2}
                            fill="url(#streamGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-12">
                <StatBlock
                    label="New Creators"
                    total={stats.totalCreators}
                    delta={stats.newCreatorsLastMonth}
                />
                <StatBlock
                    label="Live Streams"
                    total={stats.totalLiveStreamers}
                    delta={stats.liveStreamsLastMonth}
                />
            </div>
        </Card>
    );
}

/* ---------------- small component ---------------- */
function StatBlock({
    label,
    total,
    delta,
}: {
    label: string;
    total: number;
    delta: number;
}) {
    const isPositive = delta > 0;

    return (
        <div className="text-center">
            <p className="text-sm text-gray-400">{label}</p>
            <p className="text-2xl font-semibold">{formatNumber(total)}</p>
            <div className="flex items-center justify-center gap-1 text-xs mt-1">
                {isPositive ? (
                    <>
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-500">+{delta} last month</span>
                    </>
                ) : (
                    <>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                        <span className="text-red-500">No growth</span>
                    </>
                )}
            </div>
        </div>
    );
}
