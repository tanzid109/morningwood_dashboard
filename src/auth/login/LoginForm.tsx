"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "./LoginValidation";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, X } from "lucide-react";

export default function LoginForm() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log("Login Data:", data);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    const handleClose=()=>{
        router.push("/");
    }

    return (
        <div className="flex justify-center items-center min-h-screen max-w-5xl mx-auto p-2">
            <div className="flex flex-col-reverse md:flex-row-reverse border rounded-lg overflow-hidden shadow-lg">
                {/* Left Section - Form */}
                <section className="relative flex flex-col justify-center items-center w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-10">
                    {/* <div className="absolute top-3 left-3">
                        <Button><ChevronLeft/></Button>
                    </div> */}
                    <div className="absolute top-3 right-3">
                        <Button onClick={()=>handleClose()}><X/></Button>
                    </div>
                    <h2 className="text-2xl font-semibold my-6">
                        Sign in with your email or username
                    </h2>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-5 w-full"
                        >
                            {/* Email Field */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email Address</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Password Field */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter your password"
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
                                                {showPassword ? (
                                                    <EyeOff size={18} />
                                                ) : (
                                                    <Eye size={18} />
                                                )}
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Remember Me / Forgot Password */}
                            <div className="flex items-center justify-between text-sm mt-4">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="font-semibold">
                                        Remember me
                                    </Label>
                                </div>
                                <Link
                                    href="/forget"
                                    className="text-[#FDD3C6] font-medium hover:underline"
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2"
                            >
                                {isSubmitting ? <Spinner className="text-xl" /> : "Sign In"}
                            </Button>
                        </form>
                    </Form>
                </section>

                {/* Right Section - Logo / Image */}
                <section className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-10">
                    <Image
                        src="/assets/logobig.png"
                        width={256}
                        height={256}
                        alt="App logo"
                        priority
                    />
                </section>
            </div>
        </div>
    );
}
