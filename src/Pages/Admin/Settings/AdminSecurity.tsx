"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff } from "lucide-react";
import { changeUserPassword } from "@/Server/Auth/Index";
import { toast } from "sonner";

interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function Security() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm<PasswordFormData>({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });


    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
        // Client-side validation
        if (data.newPassword.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return;
        }

        if (data.newPassword !== data.confirmPassword) {
            toast.error("New passwords do not match");
            form.setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match"
            });
            return;
        }

        if (data.currentPassword === data.newPassword) {
            toast.error("New password must be different from current password");
            return;
        }

        try {
            const res = await changeUserPassword({
                oldPassword: data.currentPassword,
                newPassword: data.newPassword,
            });

            if (res.success) {
                toast.success(res.message || "Password changed successfully!");
                form.reset();
            } else {
                toast.error(res.message || "Failed to change password");
            }
        } catch (error) {
            // console.error("Password change error:", error);
            toast.error(error as string || "An error occurred. Please try again.");
        }
    };

    const PasswordToggle = ({
        show,
        onToggle
    }: {
        show: boolean;
        onToggle: () => void
    }) => (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-[#2489B0]"
        >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </Button>
    );

    return (
        <main className="">
            <h2 className="text-2xl text-[#FDD3C6] font-semibold mt-6">
                Security
            </h2>
            <p className="text-[#977266] mb-6">Keep your account safe & sound</p>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5 w-full max-w-md"
                >
                    {/* Current Password Field */}
                    <FormField
                        control={form.control}
                        name="currentPassword"
                        rules={{
                            required: "Current password is required"
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Current Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter current password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <PasswordToggle
                                        show={showCurrentPassword}
                                        onToggle={() => setShowCurrentPassword(prev => !prev)}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* New Password Field */}
                    <FormField
                        control={form.control}
                        name="newPassword"
                        rules={{
                            required: "New password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <PasswordToggle
                                        show={showNewPassword}
                                        onToggle={() => setShowNewPassword(prev => !prev)}
                                    />
                                </div>
                                <FormDescription>
                                    Must be at least 8 characters long
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        rules={{
                            required: "Please confirm your new password",
                            validate: (value) =>
                                value === form.getValues("newPassword") ||
                                "Passwords do not match"
                        }}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm New Password</FormLabel>
                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <PasswordToggle
                                        show={showConfirmPassword}
                                        onToggle={() => setShowConfirmPassword(prev => !prev)}
                                    />
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner className="text-xl" />
                                Changing Password...
                            </>
                        ) : (
                            "Change Password"
                        )}
                    </Button>
                </form>
            </Form>
        </main>
    );
}