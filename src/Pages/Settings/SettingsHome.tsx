import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PrivacyPolicyEditor from './Privacy';

const SettingsHome = () => {
    return (
        <main>
            <h2 className='text-[#FDD3C6] font-semibold text-2xl my-5'>Page Settings</h2>
            <Tabs defaultValue="privacy">
                <TabsList>
                    <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                    <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
                </TabsList>
                <Separator className='my-0' />
                <TabsContent value="privacy"><PrivacyPolicyEditor/></TabsContent>
                <TabsContent value="terms">cccccccc</TabsContent>
            </Tabs>
        </main>
    );
};

export default SettingsHome;