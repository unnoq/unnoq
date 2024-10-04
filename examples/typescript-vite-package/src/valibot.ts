import {
  type InferOutput,
  array,
  boolean,
  intersect,
  literal,
  nullish,
  number,
  object,
  record,
  string,
  variant,
} from 'valibot'

export type SESBounce = InferOutput<typeof SESBounceSchema>
export type SESComplaint = InferOutput<typeof SESComplaintSchema>
export type SESDelivery = InferOutput<typeof SESDeliverySchema>
export type SESSend = InferOutput<typeof SESSendSchema>
export type SESReject = InferOutput<typeof SESRejectSchema>
export type SESOpen = InferOutput<typeof SESOpenSchema>
export type SESClick = InferOutput<typeof SESClickSchema>
export type SESRenderingFailure = InferOutput<typeof SESRenderingFailureSchema>
export type SESDeliveryDelay = InferOutput<typeof SESDeliveryDelaySchema>
export type SESSubscription = InferOutput<typeof SESSubscriptionSchema>
export type SESEvent = InferOutput<typeof SESEventSchema>

const HeaderSchema = object({
  name: nullish(string()),
  value: nullish(string()),
})

const CommonHeadersSchema = object({
  from: nullish(array(string())),
  to: nullish(array(string())),
  messageId: nullish(string()),
  subject: nullish(string()),
})

const TagSchema = record(string(), array(string()))

const MailSchema = object({
  timestamp: nullish(string()),
  source: string(),
  sourceArn: nullish(string()),
  sendingAccountId: nullish(string()),
  messageId: string(),
  destination: array(string()),
  headersTruncated: nullish(boolean()),
  headers: nullish(array(HeaderSchema)),
  commonHeaders: nullish(CommonHeadersSchema),
  tags: nullish(TagSchema),
})

const BouncedRecipientSchema = object({
  emailAddress: nullish(string()),
  action: nullish(string()),
  status: nullish(string()),
  diagnosticCode: nullish(string()),
})

export const SESBounceSchema = object({
  eventType: literal('Bounce'),

  bounce: object({
    bounceType: nullish(string()),
    bounceSubType: nullish(string()),
    bouncedRecipients: nullish(array(BouncedRecipientSchema)),
    timestamp: nullish(string()),
    feedbackId: nullish(string()),
    reportingMTA: nullish(string()),
  }),
})

const ComplaintRecipientSchema = object({
  emailAddress: nullish(string()),
})

export const SESComplaintSchema = object({
  eventType: literal('Complaint'),

  complaint: object({
    complainedRecipients: nullish(array(ComplaintRecipientSchema)),
    timestamp: nullish(string()),
    feedbackId: nullish(string()),
    complaintSubType: nullish(string()),
    userAgent: nullish(string()),
    complaintFeedbackType: nullish(string()),
    arrivalDate: nullish(string()),
  }),
})

export const SESDeliverySchema = object({
  eventType: literal('Delivery'),
  delivery: object({
    timestamp: nullish(string()),
    processingTimeMillis: nullish(number()),
    recipients: nullish(array(string())),
    smtpResponse: nullish(string()),
    reportingMTA: nullish(string()),
  }),
})

export const SESSendSchema = object({
  eventType: literal('Send'),
  send: object({}),
})

export const SESRejectSchema = object({
  eventType: literal('Reject'),
  reject: object({
    reason: nullish(string()),
  }),
})

export const SESOpenSchema = object({
  eventType: literal('Open'),
  open: object({
    ipAddress: nullish(string()),
    timestamp: nullish(string()),
    userAgent: nullish(string()),
  }),
})

export const SESClickSchema = object({
  eventType: literal('Click'),
  click: object({
    ipAddress: nullish(string()),
    timestamp: nullish(string()),
    userAgent: nullish(string()),
    link: nullish(string()),
    linkTags: TagSchema,
  }),
})

export const SESRenderingFailureSchema = object({
  eventType: literal('Rendering Failure'),
  failure: object({
    templateName: nullish(string()),
    errorMessage: nullish(string()),
  }),
})

const DelayedRecipientSchema = object({
  emailAddress: nullish(string()),
  status: nullish(string()),
  diagnosticCode: nullish(string()),
})

export const SESDeliveryDelaySchema = object({
  eventType: literal('DeliveryDelay'),
  deliveryDelay: object({
    delayType: nullish(string()),
    delayedRecipients: nullish(array(DelayedRecipientSchema)),
    expirationTime: nullish(string()),
    reportingMTA: nullish(string()),
    timestamp: nullish(string()),
  }),
})

const TopicPreferencesSchema = object({
  unsubscribeAll: nullish(boolean()),
  topicSubscriptionStatus: nullish(
    array(
      object({
        topicName: nullish(string()),
        subscriptionStatus: nullish(string()),
      }),
    ),
  ),
  topicDefaultSubscriptionStatus: nullish(
    array(
      object({
        topicName: nullish(string()),
        subscriptionStatus: nullish(string()),
      }),
    ),
  ),
})

export const SESSubscriptionSchema = object({
  eventType: literal('Subscription'),
  subscription: object({
    contactList: nullish(string()),
    timestamp: nullish(string()),
    source: nullish(string()),
    newTopicPreferences: nullish(TopicPreferencesSchema),
    oldTopicPreferences: nullish(TopicPreferencesSchema),
  }),
})

export const SESEventSchema = intersect([
  object({
    mail: MailSchema,
  }),
  variant('eventType', [
    SESBounceSchema,
    SESComplaintSchema,
    SESDeliverySchema,
    SESSendSchema,
    SESRejectSchema,
    SESOpenSchema,
    SESClickSchema,
    SESRenderingFailureSchema,
    SESDeliveryDelaySchema,
    SESSubscriptionSchema,
  ]),
])
