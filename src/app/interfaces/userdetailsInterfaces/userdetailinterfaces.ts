export interface userdetails {
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