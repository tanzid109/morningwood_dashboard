"use client";
import { NavUserDesk } from "@/components/Home/nav-userDesk";
import { toast } from "sonner";
import { getAdminProfile, logoutUser } from "@/Server/Auth/Index";
import { useUser } from "@/Context/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { NavUser } from "@/components/Home/nav-user";

const LoggedUser = () => {
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [photo, setPhoto] = useState<string>("");

    const router = useRouter();
    const { user, setUser } = useUser();

    useEffect(() => {
        if (!user) return;

        const fetchChannelDetails = async () => {
            try {
                const result = await getAdminProfile();

                if (result?.success && result?.data) {
                    setPhoto(result.data.image?.url || "");
                }
            } catch (error) {
                // console.error("Failed to load channel details:", error);
                toast.error(error as string || "Something went wrong. Please try again.");
            }
        };

        fetchChannelDetails();
    }, [user]);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            const result = await logoutUser();

            if (result.success) {
                setUser(null);
                toast.success("Logged out successfully");
                router.push("/");
                router.refresh();
            } else {
                toast.error("Failed to logout. Please try again.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast.error("An error occurred during logout");
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div>
            <div className="hidden lg:flex space-x-3">
                {user ? (
                    <div className="flex items-center gap-4">
                        <NavUserDesk
                            user={{
                                fullName: user.fullName || "User",
                                email: user.email || "",
                                image: photo || user.image || "",
                            }}
                            onLogout={handleLogout}
                            isLoggingOut={isLoggingOut}
                        />
                    </div>
                ) : null}
            </div>
            <div className="md:hidden flex space-x-3">
                {user ? (
                    <div className="flex items-center gap-4">
                        <NavUser
                            user={{
                                fullName: user.fullName || "User",
                                email: user.email || "",
                                image: photo || user.image || "",
                            }}
                            onLogout={handleLogout}
                            isLoggingOut={isLoggingOut}
                        />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default LoggedUser;