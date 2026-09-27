import { AuthContextType } from "@/types/provider_types";
import { createContext } from "react";

export const AuthContext = createContext<AuthContextType | null>(null);
