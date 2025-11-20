"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, X } from "lucide-react";
import { resetSchema } from "./ResetValidation";

export default function ResetPasswordForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(resetSchema),
        defaultValues: {
            password: "",
            Cpassword: "",
        },
    });

    const { watch, formState: { isSubmitting } } = form;
    const password = watch("password");
    const passwordConfirm = watch("Cpassword");

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log("Reset Password Data:", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push("/login");
        } catch (error) {
            console.error("Reset password error:", error);
        }
    };

    const handleClose = () => router.push("/");

    return (
        <main className="flex justify-center items-center min-h-screen max-w-5xl mx-auto px-4 py-6">
            <div className="flex flex-col-reverse md:flex-row-reverse border rounded-lg overflow-hidden shadow-lg w-full">

                {/* LEFT SECTION */}
                <section className="md:h-[60vh] relative flex flex-col justify-center items-start w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-8 sm:p-10">
                    <div className="absolute top-3 right-3">
                        <Button
                            onClick={handleClose}
                            variant="ghost"
                            size="icon"
                            className="text-[#FDD3C6] hover:bg-[#3A211B] rounded-full"
                        >
                            <X />
                        </Button>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2 text-center md:text-left">
                        Reset your password
                    </h2>
                    <p className="text-sm text-[#FDD3C6]/80 mb-6 text-center md:text-left">
                        Create a new password for your account.
                    </p>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6 w-full max-w-md"
                        >
                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter new password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-[#2489B0]"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Confirm Password Field */}
                            <FormField
                                control={form.control}
                                name="Cpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="Confirm new password"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:text-[#2489B0]"
                                            >
                                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {password !== passwordConfirm && (
                                <p className="text-sm text-red-400 text-left">
                                    Passwords do not match
                                </p>
                            )}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={
                                    isSubmitting || password !== passwordConfirm
                                }
                                className="w-full flex justify-center items-center gap-2 bg-[#FDD3C6] text-[#24120C] hover:bg-[#E8B6A9]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Spinner className="text-xl" />
                                        Processing...
                                    </>
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        </form>
                    </Form>
                </section>

                {/* RIGHT SECTION */}
                <section className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-8 sm:p-10">
                    <Image
                        src="/assets/logobig.png"
                        width={256}
                        height={256}
                        alt="App logo"
                        priority
                        className="w-40 sm:w-56 md:w-64 h-auto"
                    />
                </section>
            </div>
        </main>
    );
}
