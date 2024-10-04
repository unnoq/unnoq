import { type } from 'arktype'

// Helper types
const stringNullish = type('string?')
const booleanNullish = type('boolean?')
const numberNullish = type('number?')

// Schema definitions
const Header = type({
  name: 'string?',
  value: 'string?',
})

const CommonHeaders = type({
  from: 'string[]?',
  to: 'string[]?',
  messageId: 'string?',
  subject: 'string?',
})

const Mail = type({
  timestamp: 'string?',
  source: 'string',
  sourceArn: 'string?',
  sendingAccountId: 'string?',
  messageId: 'string',
  destination: 'string[]',
  headersTruncated: 'boolean?',
  headers: Header.array(),
  commonHeaders: CommonHeaders.optional,
  tags: 'string[]?',
})

const BouncedRecipient = type({
  emailAddress: 'string?',
  action: 'string?',
  status: 'string?',
  diagnosticCode: 'string?',
})

export const SESBounce = type({
  eventType: '"Bounce"',
  bounce: {
    bounceType: 'string?',
    bounceSubType: 'string?',
    bouncedRecipients: BouncedRecipient.array(),
    timestamp: 'string?',
    feedbackId: 'string?',
    reportingMTA: 'string?',
  },
})

const ComplaintRecipient = type({
  emailAddress: 'string?',
})

export const SESComplaint = type({
  eventType: '"Complaint"',
  complaint: {
    complainedRecipients: ComplaintRecipient.array(),
    timestamp: 'string?',
    feedbackId: 'string?',
    complaintSubType: 'string?',
    userAgent: 'string?',
    complaintFeedbackType: 'string?',
    arrivalDate: 'string?',
  },
})

export const SESDelivery = type({
  eventType: '"Delivery"',
  delivery: {
    timestamp: 'string?',
    processingTimeMillis: 'number?',
    recipients: 'string[]?',
    smtpResponse: 'string?',
    reportingMTA: 'string?',
  },
})

export const SESSend = type({
  eventType: '"Send"',
  send: {},
})

export const SESReject = type({
  eventType: '"Reject"',
  reject: {
    reason: 'string?',
  },
})

export const SESOpen = type({
  eventType: '"Open"',
  open: {
    ipAddress: 'string?',
    timestamp: 'string?',
    userAgent: 'string?',
  },
})

export const SESClick = type({
  eventType: '"Click"',
  click: {
    ipAddress: 'string?',
    timestamp: 'string?',
    userAgent: 'string?',
    link: 'string?',
    linkTags: 'string[]?',
  },
})

export const SESRenderingFailure = type({
  eventType: '"Rendering Failure"',
  failure: {
    templateName: 'string?',
    errorMessage: 'string?',
  },
})

const DelayedRecipient = type({
  emailAddress: 'string?',
  status: 'string?',
  diagnosticCode: 'string?',
})

export const SESDeliveryDelay = type({
  eventType: '"DeliveryDelay"',
  deliveryDelay: {
    delayType: 'string?',
    delayedRecipients: DelayedRecipient.array(),
    expirationTime: 'string?',
    reportingMTA: 'string?',
    timestamp: 'string?',
  },
})

const TopicStatus = type({
  topicName: 'string?',
  subscriptionStatus: 'string?',
})

const TopicPreferences = type({
  unsubscribeAll: 'boolean?',
  topicSubscriptionStatus: TopicStatus.array(),
  topicDefaultSubscriptionStatus: 'string?',
})

export const SESSubscription = type({
  eventType: '"Subscription"',
  subscription: {
    contactList: 'string?',
    timestamp: 'string?',
    source: 'string?',
    newTopicPreferences: TopicPreferences.optional,
    oldTopicPreferences: TopicPreferences.optional,
  },
})

// Union of all event types
const EventTypes = type([
  SESBounce,
  SESComplaint,
  SESDelivery,
  SESSend,
  SESReject,
  SESOpen,
  SESClick,
  SESRenderingFailure,
  SESDeliveryDelay,
  SESSubscription,
])

export const SESEvent = type({
  mail: Mail,
  '...': EventTypes,
})

// Type exports
export type SESBounceType = typeof SESBounce.infer
export type SESComplaintType = typeof SESComplaint.infer
export type SESDeliveryType = typeof SESDelivery.infer
export type SESSendType = typeof SESSend.infer
export type SESRejectType = typeof SESReject.infer
export type SESOpenType = typeof SESOpen.infer
export type SESClickType = typeof SESClick.infer
export type SESRenderingFailureType = typeof SESRenderingFailure.infer
export type SESDeliveryDelayType = typeof SESDeliveryDelay.infer
export type SESSubscriptionType = typeof SESSubscription.infer
export type SESEventType = typeof SESEvent.infer

// Type guard function
export function isSESEvent(data: unknown): data is SESEventType {
  return true
}
