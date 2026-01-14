"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { changeUserNamePhoto } from "@/Server/Auth/Index"
import { toast } from "sonner"

const profileSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name must be less than 50 characters"),
    photo: z
        .any()
        .refine((file) => !file || file instanceof File, "Invalid file")
        .optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function UpdateProfile() {
    const [preview, setPreview] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setValue("photo", file)
        setPreview(URL.createObjectURL(file))
    }

    const onSubmit = async (data: ProfileFormValues) => {
        setLoading(true)

        try {
            const formData = new FormData()
            formData.append("fullName", data.name)
            if (data.photo) formData.append("img", data.photo)

            const res = await changeUserNamePhoto(formData)
            // console.log(res)

            if (res.success) {
                toast.success(res.message || "Profile updated successfully")
            } else {
                toast.error(res.message || "Failed to update profile")
            }
        } catch (error) {
            // console.error("Error updating profile:", error)
            toast.error(error as string || "An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="">
            <div>
                <p className="text-lg text-[#FDD3C6] font-semibold mb-6">Update Profile</p>
            </div>
            <div className="mt-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="gap-4">
                        <Avatar className="h-40 w-40 bg-[#FDD3C6]">
                            <AvatarImage src={preview || ""} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>

                        <div className="space-y-2 w-1/2 mt-5">
                            <Label className="text-[#FDD3C6]" htmlFor="photo">Profile Photo</Label>
                            <Input
                                id="photo"
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                            {errors.photo?.message && (
                                <p className="text-sm text-red-500">{String(errors.photo.message)}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2 w-1/2">
                        <Label className="text-[#FDD3C6]" htmlFor="name">User Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            {...register("name")}
                        />
                        {errors.name?.message && (
                            <p className="text-sm text-red-500">{String(errors.name.message)}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Profile
                    </Button>
                </form>
            </div>
        </div>
    )
}