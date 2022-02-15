import { ReportActivity } from "./ReportActivity";

export interface TimeData {
    state?: boolean
    id?: string;
    date: Date;
    activity: ReportActivity;
    detail: string;
    hours: number;
    current_hours: number;
    edit: Boolean;
  
    titleDialog?: string
    checked?: boolean;
  }
  