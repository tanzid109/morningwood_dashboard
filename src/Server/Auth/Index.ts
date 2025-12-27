"use server"

import { cookies } from "next/headers"
import { FieldValues } from "react-hook-form"
import { jwtDecode } from "jwt-decode"

const getSecureCookieOptions = () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
});

export const resendOtp = async (otpResend: FieldValues) => {
    const { signupToken, ...rest } = otpResend;
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/auth/resend-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signup-token": signupToken,
            },
            body: JSON.stringify(rest),
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error resending OTP:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const loginUser = async (LoginData: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(LoginData),
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()

        if (data.success) {
            (await cookies()).set("accessToken", data.data.accessToken, getSecureCookieOptions())
        }

        return data
    } catch (error) {
        console.error("Error during login:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const forgotUser = async (email: FieldValues) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/forgot-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(email),
            cache: "no-store",
        })
        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error sending mail:", error)
        throw error
    }
}

export const verifyOtp = async (otpData: FieldValues) => {
    const { token, ...rest } = otpData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-reset-token": token,
            },
            body: JSON.stringify(rest),
            cache: "no-store",
        })

        const data = await res.json()
        if (data.success) {
            (await cookies()).set("accessToken", data?.data?.accessToken, getSecureCookieOptions())
        }
        return data
    } catch (error) {
        console.error("Error verifying OTP:", error)
        throw error
    }
}

export const resetUserPassword = async (passwordData: FieldValues) => {
    const { token, ...rest } = passwordData;

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/reset-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-reset-token": token,
            },
            body: JSON.stringify(rest),
            cache: "no-store",
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};

export const getCurrentUser = async () => {
    const accessToken = (await cookies()).get("accessToken")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const decodedData = jwtDecode(accessToken);
        return decodedData;
    } catch (error) {
        console.error("Error decoding token:", error);
        // Clear invalid cookie
        (await cookies()).set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });
        return null;
    }
}

export const changeUserPassword = async (passwordData: FieldValues) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            console.error("No access token found");
            return {
                success: false,
                message: "No access token found. Please log in again."
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/change-password`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(passwordData),
            cache: "no-store",
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
    }
};

export const changeUserNamePhoto = async (formData: FormData) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            console.error("No access token found");
            return {
                success: false,
                message: "No access token found. Please log in again."
            }
        }

        // Change this to your actual profile update endpoint
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/update-profile`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: formData,
            cache: "no-store",
        });

        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error updating profile:", error);
        return {
            success: false,
            message: "An error occurred while updating profile"
        }
    }
};

export const getAdminProfile = async () => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            credentials: "include",
            cache: "no-store",
        })

        if (!res.ok) {
            const errorData = await res.json()
            return {
                success: false,
                message: errorData.message || `HTTP error! status: ${res.status}`
            }
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error("Error fetching admin profile:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

// logout function
export const logoutUser = async () => {
    try {
        (await cookies()).set("accessToken", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 0,
            path: "/",
        });
        return { success: true };
    } catch (error) {
        console.error("Error during logout:", error);
        return { success: false };
    }
}