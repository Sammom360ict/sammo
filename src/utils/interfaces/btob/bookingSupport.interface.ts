export interface ICreateSupportPayload {
  booking_id: number;
  agency_id: number;
  support_type: string;
  created_by: number;
}
export interface ICreateSupportTicketsPayload {
  support_id: number;
  traveler_id: number;
  ticket_number: string;
}
export interface ICreateSupportMessagePayload {
  support_id: number;
  message?: string;
  attachment?: string;
  sender: "admin" | "agent";
  sender_id: number;
}
export interface IUpdateBookingSupportPayload {
  status?: "pending" | "processing" | "closed";
  closed_by?: number;
  last_message_at?: Date;
  closed_at?: Date;
}
