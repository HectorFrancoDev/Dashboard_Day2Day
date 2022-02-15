import { User } from "app/core/interfaces/User";

export interface LoginResponse {
    user: User;
    token: string;
}