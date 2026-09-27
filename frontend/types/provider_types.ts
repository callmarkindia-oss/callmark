export type User = {
    id: string;
    fname: string;
    lname: string;
    email: string;
    role_id: string;
    org_name: string;
};

export type Session = {
    expires_at: string;
};

export type AuthContextType = {
    user: User | null;
    session: Session | null;
    authenticated: boolean;
    loading: boolean;
};