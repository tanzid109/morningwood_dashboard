import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
    value: string;
    title: string;
    description: string;
}

const UsageOverview = () => {
    const stats : StatCardProps[] = [
        {
            value: '765',
            title: 'New Sign Up',
            description: 'Users who joined in the last 24 hours'
        },
        {
            value: '1.2 K',
            title: 'Active Live Streams',
            description: 'Active creators streaming at this moment'
        },
        {
            value: '35 M',
            title: 'Currently Watching',
            description: 'Total viewers watching right now'
        },
        {
            value: '0',
            title: 'Reported Streams',
            description: 'Streams flagged by users for review'
        }
    ];

    return (
        <main className="mx-auto border p-4 rounded-2xl my-3">
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
        </main>
    );
};

export default UsageOverview;