"use server"
import { cookies } from "next/headers"

interface GetAllUsersParams {
    page?: number;
    limit?: number;
}

export const getAllUsers = async (params?: GetAllUsersParams) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        // Build query parameters
        const queryParams = new URLSearchParams();
        if (params?.page) {
            queryParams.append('page', params.page.toString());
        }
        if (params?.limit) {
            queryParams.append('limit', params.limit.toString());
        }

        const queryString = queryParams.toString();
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/creators${queryString ? `?${queryString}` : ''}`;

        const res = await fetch(url, {
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
        console.error("Error fetching users:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/admin/creators/${userId}`;

        const res = await fetch(url, {
            method: "DELETE",
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
        return {
            success: true,
            message: "User deleted successfully",
            data
        }
    } catch (error) {
        console.error("Error deleting user:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}