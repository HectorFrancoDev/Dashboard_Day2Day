import { Activity } from "./Activity";
import { ReportActivity } from "./ReportActivity";
import { User } from "./User";

export interface TimeData {
    state?: boolean
    id?: string;
    date: Date;
    activity: Activity;
    old_activity?: string;
    position_user_old_activity?: number;
    detail: string;
    hours: number;
    current_hours: number;
    edit: Boolean;
    user: User;
    position_user?: number,
    titleDialog?: string
    checked?: boolean;
  }
  