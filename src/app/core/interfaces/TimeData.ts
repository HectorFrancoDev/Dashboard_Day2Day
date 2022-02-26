import { Activity } from "./Activity";
import { ReportActivity } from "./ReportActivity";
import { User } from "./User";

export interface TimeData {
    state?: boolean
    id?: string;
    date: Date;
    activity: Activity;
    detail: string;
    hours: number;
    current_hours: number;
    edit: Boolean;
    user: User;
  
    titleDialog?: string
    checked?: boolean;
  }
  