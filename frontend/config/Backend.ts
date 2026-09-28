const isProduction =
  process.env.NEXT_PUBLIC_NODE_ENV === "production";

const baseUrl = isProduction
  ? ""
  : "http://localhost:8080";

export const APIENDPOINT = {
  Root: `${baseUrl}/`,
  Health: `${baseUrl}/health`,

  GetMe: `${baseUrl}/api/v1/auth/me`,
  SignUp: `${baseUrl}/api/v1/auth/signup`,
  Login: `${baseUrl}/api/v1/auth/login`,

  CreateTag: `${baseUrl}/api/v1/tags`,
  GetAllTags: `${baseUrl}/api/v1/tags`,

  CreateVisitorSMS: (tagToken: string) =>
    `${baseUrl}/api/v1/visitors/sms/${tagToken}`,

  CreateVisitorWhatsapp: (tagToken: string) =>
    `${baseUrl}/api/v1/visitors/whatsapp/${tagToken}`,

  GetVisitorCallToken: (tagToken: string) =>
    `${baseUrl}/api/v1/visitors/call/token/${tagToken}`,

  CreateRenewalOrder: (tagId: string) =>
    `${baseUrl}/api/v1/payments/tags/${tagId}/renew/order`,
  VerifyRenewalPayment: (tagId: string) =>
    `${baseUrl}/api/v1/payments/tags/${tagId}/renew/verify`,

  DisplayInitialNameForVisitors: (tagToken: string) =>
    `${baseUrl}/api/v1/visitors/initial/token/${tagToken}`
};