import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Security from './AdminSecurity';
import UpdateProfile from './UpdateAdminProfile';



const AdminSettingsHome = () => {
    return (
        <main>
            <h2 className='text-[#FDD3C6] font-semibold text-2xl my-5'>Account Settings</h2>
            <Tabs defaultValue="security">
                <TabsList>
                    <TabsTrigger value="security">Change Password</TabsTrigger>
                    <TabsTrigger value="change">Change Image and Name</TabsTrigger>
                </TabsList>
                <Separator className='my-0' />
                <TabsContent value="security"><Security /></TabsContent>
                <TabsContent value="change"><UpdateProfile /></TabsContent>
            </Tabs>
        </main>
    );
};

export default AdminSettingsHome;