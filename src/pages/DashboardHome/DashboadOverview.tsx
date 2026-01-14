import React from 'react';
import UsageOverview from './UsageOverview';
import GrowthOverview from './GrowthOverview';
import DashboardTable from './DashboardTable';

const DashboadOverview = () => {
    return (
        <div>
            <h2 className='my-5 text-2xl text-[#FDD3C6] font-bold'>Dashboard Overview</h2>
            <UsageOverview/>
            <GrowthOverview/>
            <DashboardTable/>
        </div>
    );
};

export default DashboadOverview;