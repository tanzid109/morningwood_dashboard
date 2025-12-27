import { Suspense } from "react";
import ResetPasswordForm from "@/auth/reset_password/ResetPasswordForm";

const Page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
};

export default Page;
