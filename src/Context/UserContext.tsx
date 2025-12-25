import { getCurrentUser } from "@/Server/Auth/Index";
import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";

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
    setIsLoading: Dispatch<SetStateAction<boolean>>;
    handleUser: () => Promise<void>;
}

const UserContext = createContext<IUserProviderValues | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    console.log(user);
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

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading, handleUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export default UserProvider;