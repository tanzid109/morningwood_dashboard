import VerifyForm from '@/auth/verify/VerifyForm';
import { Suspense } from 'react';
const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyForm />
        </Suspense>
    );
};

export default page;