export type RegisterRequestDTO = {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    companyName: string;
    companyEmail?: string;
    companyPhone?: string;
};

export type LoginRequestDTO = {
    email: string;
    password: string;
};

export type AuthTokens = {
    accessToken: string;
    refreshToken: string;
};

export type AuthUser = {
    id: string;
    email: string;
    role: "client" | "manager" | "admin";
    firstName?: string | null;
    lastName?: string | null;
    companyId?: string | null;
};
