"use client";

import { getCurrentUser } from "@/Server/Auth/Index";
import { createContext, useContext, useEffect, useState } from "react";

export interface IUser {
    email: string;
    fullName?: string;
    channelName?: string;
    image?: string;
    exp?: number;
    iat?: number;
    id: string;
    role: string;
}

interface IUserProviderValues {
    user: IUser | null;
    isLoading: boolean;
    setUser: (user: IUser | null) => void;
    handleUser: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const handleUser = async () => {
        try {
            setIsLoading(true);
            const userData = await getCurrentUser();
            setUser(userData as IUser | null);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleUser();
    }, []);

    useEffect(() => {
        handleUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, handleUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};

export default UserProvider;
