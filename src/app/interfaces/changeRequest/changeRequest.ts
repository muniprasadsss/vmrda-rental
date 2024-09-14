export interface ChangedFields {
    action: string; // Example: "Recommend"
    attachment: string | null; // Example: null
    cr_number: string; // Example: "CRHTZ904"
    created_at: string; // Example: "2024-09-13T05:58:49.000Z"
    description: string; // Example: "Test"
    id: number; // Example: 1
    propertycode: string; // Example: "PROP123"
    requesttype: string; // Example: "Test"
    revenuedivision: string; // Example: "Division 1"
    stage: string; // Example: "recommended for ao"
    status: string; // Example: "Pending"
    userId: string; // Example: "9988997"
    username: string; // Example: "username"
  
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
  