// Barrel export — re-exports all email functions from organized modules
export { sendOrderConfirmation, sendPaymentConfirmed, sendShippedConfirmation, sendOrderCancelled, sendNewOrderAdminNotification, sendPaymentReminder, sendPaymentReceipt, sendReviewRequest } from "./order-emails";
export type { AdminOrderNotificationData, PaymentReminderData, PaymentReceiptData, ReviewRequestData } from "./order-emails";

export { sendPasswordResetEmail, sendEmailVerification } from "./customer-emails";

export { sendNewsletterConfirmation, sendNewsletterCampaign } from "./marketing-emails";

export { sendContactForward, sendContactAutoReply } from "./contact-emails";
