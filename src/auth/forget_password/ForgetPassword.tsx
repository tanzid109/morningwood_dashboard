"use client";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { forgetSchema } from "./ForgetValidation";

export default function ForgetPasswordForm() {
    const router = useRouter()
    const form = useForm({
        resolver: zodResolver(forgetSchema),
        defaultValues: {
            email: "",
        },
    });

    const {
        formState: { isSubmitting },
    } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            const loginData = {
                email: data.email,
                password: data.password,
            };

            console.log("Login Data:", loginData);


            // // simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 2000));

            // // redirect on success

        } catch (error) {
            console.error(error);
        }
        finally {
            router.push("/verify");
        }
    };
    const handleClose = () => {
        router.push("/");
    }

    return (
        <main className="flex justify-center items-center min-h-screen max-w-5xl mx-auto ">
            <div className="md:h-[60vh] flex flex-col-reverse md:flex-row-reverse border rounded-lg overflow-hidden shadow-lg">

                {/* Left Section - Form */}
                <div className="relative flex flex-col items-start w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-10">
                    <div className="absolute top-3 right-3">
                        <Button onClick={() => handleClose()}><X /></Button>
                    </div>
                    <h2 className="text-[#FDD3C6] text-2xl text-left font-semibold my-6">
                        Enter your registered email to get OTP code
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
                                                {...field}
                                                placeholder="Email Address"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex justify-center items-center gap-2 tracking-wide"
                            >
                                {isSubmitting ? (
                                    <Spinner className="text-xl" />
                                ) : (
                                    "Continue"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>

                {/* Right Section - Logo / Animation */}
                <div className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-10">
                    <Image
                        src="/assets/logobig.png"
                        width={256}
                        height={256}
                        alt="logo"
                        className="w-50 md:w-auto"
                    />
                </div>
            </div>
        </main>
    );
}
