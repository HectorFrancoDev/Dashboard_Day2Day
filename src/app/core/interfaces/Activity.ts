import { Area } from "./Area";
import { Company } from "./Company";

export interface Activity {
    id?: string;
    company: Company
    name: string;
    open_state: boolean;
    initial_date: Date;
    end_date: Date;
    estimated_hours: number;
    worked_hours: number;
    is_general: boolean;
    users?: [SortUser];
    state?: boolean
}


export interface SortUser {
    user: {
        _id: string;
        name: string;
        img: string;
        area: Area
    };

    logs: [
        {
            log: {
                date: Date,
                description: string
            }

        }
    ]

    end_date?: Date;
    worked_hours?: number;
    estimated_hours: number;
    is_active: boolean;
}
