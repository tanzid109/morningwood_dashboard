"use server"
import { cookies } from "next/headers"
import { FieldValues } from "react-hook-form"

interface GetAllCategoryParams {
    page?: number;
    limit?: number;
}

export const getAllCategory = async (params?: GetAllCategoryParams) => {
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
        const url = `${process.env.NEXT_PUBLIC_BASE_API}/api/v1/categories${queryString ? `?${queryString}` : ''}`;

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
        console.error("Error fetching categories:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}

export const createCategory = async (categoryData: FieldValues) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("name", categoryData.name);

        // Handle file uploads
        if (categoryData.image) {
            formData.append("image", categoryData.image);
        }
        if (categoryData.coverPhoto) {
            formData.append("coverPhoto", categoryData.coverPhoto);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/categories/create-category`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                // Don't set Content-Type for FormData, browser will set it with boundary
            },
            body: formData,
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

export const updateCategory = async (categoryData: FieldValues) => {
    try {
        const cookieStore = await cookies()
        const accessToken = cookieStore.get("accessToken")?.value

        if (!accessToken) {
            return {
                success: false,
                message: "No access token found"
            }
        }

        // Create FormData for file upload
        const formData = new FormData();
        formData.append("name", categoryData.name);

        // Handle file uploads - only append if they exist
        if (categoryData.image) {
            formData.append("image", categoryData.image);
        }
        if (categoryData.coverPhoto) {
            formData.append("coverPhoto", categoryData.coverPhoto);
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/categories/update/${categoryData.id}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
            },
            body: formData,
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
        console.error("Error updating category:", error)
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}