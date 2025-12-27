import LoginForm from '@/auth/login/LoginForm';
import { Suspense } from 'react';

const page = () => {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
};

export default page;