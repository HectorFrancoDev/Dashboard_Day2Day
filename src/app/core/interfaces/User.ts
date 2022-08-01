import { Area } from "./Area";
import { Role } from "./Role";

export interface User {
    id: string;
    name: string;
    email: string;
    img: string;
    role: Role;
    area: Area;
    state?: boolean;
    // Para los que son supervisados
    supervised_by?: ''
}
