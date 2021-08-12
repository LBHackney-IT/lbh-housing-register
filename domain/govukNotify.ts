export interface NotifyRequest {
  emailAddress: string;
  personalisation: object;
  reference: string;
}

export interface NotifyResponse {
  id: string;
  reference: string;
  content: NotifyResponseContent;
}

export interface NotifyResponseContent {
  subject: string;
  body: string;
  from_email: string;
}
