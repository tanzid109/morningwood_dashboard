import ForgetPasswordForm from '@/auth/forget_password/ForgetPassword';
import { Suspense } from 'react';

const page = () => {
    return (
            <Suspense fallback={<div>Loading...</div>}>
                <ForgetPasswordForm />
            </Suspense>
    );
};

export default page;