"use server"
import { cookies } from "next/headers"
import { FieldValues } from "react-hook-form"

export const createPrivacy = async (privacyData: FieldValues) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/settings/privacy-policy`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(privacyData),
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
        console.error("Error creating category:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}
export const createTerms = async (termsData: FieldValues) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/settings/terms-and-conditions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`,
            },
            body: JSON.stringify(termsData),
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
        console.error("Error creating category:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const getPrivacy = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/settings/privacy-policy`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}
export const getTerms = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/settings/terms-and-conditions`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
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
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}