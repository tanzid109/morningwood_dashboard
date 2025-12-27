"use client";

import { Card, CardContent } from '@/components/ui/card';
import { getDashboardStats } from '@/Server/Dashboard/Index';
import { useEffect, useState } from 'react';

interface StatCardProps {
    value: string;
    title: string;
    description: string;
}

const UsageOverview = () => {
    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        totalCreators: 0,
        liveStreams: 0,
        scheduledStreams: 0,
        totalStreams: 0,
        reportedStreams: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const allStats = await getDashboardStats();
                console.log(allStats.data);

                if (allStats?.data) {
                    setStatsData(allStats.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <div className="text-[#FDD3C6] text-center py-8">Loading stats...</div>;
    }

    const stats: StatCardProps[] = [
        {
            value: statsData.totalUsers.toString(),
            title: 'New Sign Up',
            description: 'Users who joined in the last 24 hours'
        },
        {
            value: statsData.liveStreams.toString(),
            title: 'Active Live Streams',
            description: 'Active creators streaming at this moment'
        },
        {
            value: statsData.totalStreams.toString(),
            title: 'Currently Watching',
            description: 'Total viewers watching right now'
        },
        {
            value: statsData.reportedStreams.toString(),
            title: 'Reported Streams',
            description: 'Streams flagged by users for review'
        }
    ];

    return (
        <div className="mx-auto border p-4 rounded-2xl my-3">
            <h1 className="text-xl font-bold text-[#FDD3C6] my-3">Platform Usage Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="bg-[#36190F] border-none">
                        <CardContent>
                            <div className="text-xl font-bold text-[#FDD3C6] mb-2">{stat.value}</div>
                            <div className="text-[#FDD3C6] text-base font-medium mb-1">{stat.title}</div>
                            <div className="text-[#D6AEA2] text-sm">{stat.description}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default UsageOverview;