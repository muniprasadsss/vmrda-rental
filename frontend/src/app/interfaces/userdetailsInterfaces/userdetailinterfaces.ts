export interface userdetails {
    PAN: any;
    USER_NAME: any;
    GST_IN: any;
    EMAIL_ID: any;
    NATURE_OF_BUSINESS: any;
    REVENUE_DIVISION: any;
    MOBILE_NUM: any;
    S_No?:number;
    User_ID?:string;
    User_Name?:string;
    Mobile_No?:number;
    Nature_of_Business?:string;
    Aadhaar_No?:number;
    PAN_No?:string;
    Email_Id?:string;
    GSTIN?:string;
    Revenue_Dvision?:string;
}
interface UploadEvent {
    originalEvent: Event;
    files: File[];
}