import { Activity } from "./Activity";

export interface ResponseActivities
{
    activities: Activity[];
    total?: number;
}