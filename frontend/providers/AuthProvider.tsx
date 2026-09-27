/* eslint-disable react-hooks/exhaustive-deps */

import { APIENDPOINT } from "@/config/Backend";
import { AuthContext } from "@/context/AuthContext";
import { useApiCall } from "@/hooks/useApiCall";
import {
    User,
    Session,
} from "@/types/provider_types";
import { useEffect, useState } from "react";

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { makeApiCall } = useApiCall();

    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const validate = async () => {
            try {
                const res = await makeApiCall(
                    "GET",
                    APIENDPOINT.GetMe
                );

                if (res.status === 200 && res.data.authenticated) {
                    setUser(res.data.user);
                    setSession(res.data.session);
                    setAuthenticated(true);
                } else {
                    setUser(null);
                    setSession(null);
                    setAuthenticated(false);
                }
            } catch {
                setUser(null);
                setSession(null);
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        validate();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                session,
                authenticated,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}