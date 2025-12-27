import OtpForm from '@/auth/otp/OtpForm';
import { Suspense } from 'react';

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtpForm />
        </Suspense>
    );
};

export default page;