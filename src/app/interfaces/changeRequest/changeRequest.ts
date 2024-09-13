export interface ChangedFields {
    s_no: boolean;
    user_id: boolean;
    Revenue_Division: boolean;
    requester_name: boolean;
    request_type: boolean;
    request_status: boolean;
    comments: boolean;
    attachment: boolean;
    description: boolean;
    created_at: boolean;
    Aadhaar_No: boolean;
    PAN_No: boolean;
    GSITN: boolean;
    Email_Id: boolean;
    cr_no?:number | null;
  }

  export interface Payload {
    crno?: number | null ;
    request_type: string;
    status: string;
    stage: string;
    role: string | null;  // Since `localStorage.getItem` can return null
    action: string;
    remarks?: string;
  }
  