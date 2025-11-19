"use client"
import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

// Generate sample data for the chart
const generateData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
    return months.map((month) => ({
        month,
        newCreator: Math.floor(Math.random() * 40000) + 20000,
        liveStreams: Math.floor(Math.random() * 30000) + 40000,
    }));
};

const data = generateData();

export default function GrowthOverview() {
    return (
        <Card className="w-full my-4 bg-[#36190F] p-4 text-white border-none">
            <div className="flex items-center justify-between mb-6 ">
                <h2 className="text-xl text-[#FDD3C6] font-semibold">Growth Overview</h2>
                <span className="text-sm text-[#FDD3C6] border p-1 rounded-md">November 2025</span>
            </div>

            <div className="h-64 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorNewCreator" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d4a574" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#d4a574" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorLiveStreams" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e8d4c4" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#e8d4c4" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4a3f35" opacity={0.2} />
                        <XAxis
                            dataKey="month"
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                            axisLine={false}
                            tickFormatter={(value) => `${value / 1000}K`}
                        />
                        <Area
                            type="monotone"
                            dataKey="newCreator"
                            stroke="#d4a574"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorNewCreator)"
                        />
                        <Area
                            type="monotone"
                            dataKey="liveStreams"
                            stroke="#e8d4c4"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorLiveStreams)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">

                {/* New Creator */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    {/* Text Part */}
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                            <span className="text-sm text-gray-300">New Creator</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500">1.3% vs last month</span>
                        </div>
                    </div>

                    {/* Number Circle */}
                    <div className="h-12 w-12 flex justify-center items-center bg-[#4C2C22] rounded-full">
                        <span className="text-lg font-medium">10K</span>
                    </div>
                </div>

                {/* Divider — responsive */}
                <div className="w-full md:w-auto">
                    <div className="border-t md:border-t-0 md:border-l border h-0 md:h-12 w-full md:w-0"></div>
                </div>

                {/* Live Streams */}
                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
                    {/* Number Circle */}
                    <div className="h-12 w-12 flex justify-center items-center bg-[#4C2C22] rounded-full">
                        <span className="text-lg font-medium">63K</span>
                    </div>

                    {/* Text Part */}
                    <div className="flex flex-col items-start gap-1">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-amber-600"></div>
                            <span className="text-sm text-gray-300">Live Streams</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-red-500" />
                            <span className="text-xs text-red-500">1.3% vs last month</span>
                        </div>
                    </div>
                </div>
            </div>

        </Card>
    );
}