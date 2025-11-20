"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Controller, FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { otpSchema } from "./OtpValidation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ChevronLeft, X } from "lucide-react";

export default function VerifyForm() {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        try {
            console.log("Entered OTP:", data.otp);
            // simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 2000));
            router.push("/reset");
        } catch (error) {
            console.error("OTP verification failed:", error);
        }
    };

    const handleClose = () => router.push("/");
    const handleBack = () => router.back();

    return (
        <main className="flex justify-center items-center min-h-screen bg-[#1A0E0B] p-2">
            <div className="md:h-[60vh] flex flex-col-reverse md:flex-row-reverse w-full max-w-5xl rounded-xl overflow-hidden border border-[#3B2A23] shadow-xl">

                {/* LEFT SECTION - FORM */}
                <section className="relative flex flex-col justify-center items-center w-full md:w-1/2 bg-[#24120C] text-[#FDD3C6] p-6 sm:p-10">

                    {/* Buttons (Top) */}
                    <div className="absolute top-3 left-3">
                        <Button
                            onClick={handleBack}
                            className="text-[#FDD3C6] hover:bg-[#3A211B]"
                            aria-label="Go back"
                        >
                            <ChevronLeft size={20} />
                        </Button>
                    </div>

                    <div className="absolute top-3 right-3">
                        <Button
                            onClick={handleClose}
                            className="text-[#FDD3C6] hover:bg-[#3A211B] "
                            aria-label="Close"
                        >
                            <X size={20} />
                        </Button>
                    </div>

                    {/* Content */}
                    <div className="w-full max-w-sm text-center md:text-left mt-10 md:mt-0">
                        <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
                            Verify your identity
                        </h2>

                        <p className="mb-6 text-sm text-[#FDD3C6]/80 leading-relaxed">
                            We’ve sent a 6-digit verification code to your email. Please enter it below to confirm your identity.
                        </p>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-8 flex flex-col items-center w-full"
                            >
                                {/* OTP FIELD */}
                                <Controller
                                    name="otp"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-start w-full">
                                            <FormLabel className="mb-2 font-semibold text-lg text-[#FDD3C6]">One-Time Password (OTP)</FormLabel>
                                            <InputOTP
                                                maxLength={6}
                                                value={field.value || ""}
                                                onChange={(val) => {
                                                    if (/^\d*$/.test(val)) field.onChange(val);
                                                }}
                                                className="gap-2 sm:gap-3"
                                            >
                                                <InputOTPGroup className="flex gap-2 sm:gap-3 justify-center w-full">
                                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                                        <InputOTPSlot
                                                            key={index}
                                                            index={index}
                                                            className="w-10 h-10 md:w-12 md:h-12 text-lg font-semibold border border-[#5A392F] text-center rounded-md focus:ring-2 focus:ring-[#FDD3C6]/60 transition-all bg-[#2E1A14]"
                                                        />
                                                    ))}
                                                </InputOTPGroup>
                                            </InputOTP>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* RESEND CODE */}
                                <div className="text-sm text-center text-[#A47E72]">
                                    Didn’t receive the code?
                                    <Link
                                        href="#"
                                        className="text-[#FDD3C6] font-semibold ml-1 hover:underline"
                                    >
                                        Resend Code
                                    </Link>
                                    <p className="mt-1 text-xs text-[#A47E72]">Resend available in 00:59</p>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full "
                                >
                                    {isSubmitting ? <Spinner /> : "Continue"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </section>

                {/* RIGHT SECTION - IMAGE */}
                <section className="bg-[#5A392F] flex justify-center items-center w-full md:w-1/2 p-10">
                    <Image
                        src="/assets/logobig.png"
                        width={220}
                        height={220}
                        alt="App logo"
                        priority
                        className="w-40 sm:w-56 md:w-64 h-auto"
                    />
                </section>
            </div>
        </main>
    );
}
