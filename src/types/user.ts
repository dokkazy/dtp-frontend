export enum UserRoleEnum {
    Tourist = "Tourist",
    Operator = "Operator",
    Manager = "Manager",
    Admin = "Admin",
}

export interface UserProfile {
    id: string;
    userName: string;
    balance: number;
    name: string;
    email: string;
    phoneNumber: string;
    address: string;
    companyName: string | null;
    roleName: UserRoleEnum;
    isActive: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export type UserProfileResponse = ApiResponse<UserProfile>;