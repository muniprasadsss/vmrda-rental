export interface TransactionTrackingDetails {
  Sl_NO: number;
  invoice_id: string;
  order_id: string | null;
  method: string | null;
  upi_transaction_id: string | null;
  amount: string | null;
  amount_refunded: string;
  currency: string | null;
  status: string;
  created_at: string;
  }
  
    