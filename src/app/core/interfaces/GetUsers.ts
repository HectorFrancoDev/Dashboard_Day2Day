import { User } from "./User";

export interface ResponseGetUsers {
    users: User[];
    total?: number;
}