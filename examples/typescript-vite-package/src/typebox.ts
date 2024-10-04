import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

const HeaderSchema = Type.Object({
  name: Type.Optional(Type.String()),
  value: Type.Optional(Type.String()),
})

const CommonHeadersSchema = Type.Object({
  from: Type.Optional(Type.Array(Type.String())),
  to: Type.Optional(Type.Array(Type.String())),
  messageId: Type.Optional(Type.String()),
  subject: Type.Optional(Type.String()),
})

const TagSchema = Type.Record(Type.String(), Type.Array(Type.String()))

const MailSchema = Type.Object({
  timestamp: Type.Optional(Type.String()),
  source: Type.String(),
  sourceArn: Type.Optional(Type.String()),
  sendingAccountId: Type.Optional(Type.String()),
  messageId: Type.String(),
  destination: Type.Array(Type.String()),
  headersTruncated: Type.Optional(Type.Boolean()),
  headers: Type.Optional(Type.Array(HeaderSchema)),
  commonHeaders: Type.Optional(CommonHeadersSchema),
  tags: Type.Optional(TagSchema),
})

const BouncedRecipientSchema = Type.Object({
  emailAddress: Type.Optional(Type.String()),
  action: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  diagnosticCode: Type.Optional(Type.String()),
})

export const SESBounceSchema = Type.Object({
  eventType: Type.Literal('Bounce'),
  bounce: Type.Object({
    bounceType: Type.Optional(Type.String()),
    bounceSubType: Type.Optional(Type.String()),
    bouncedRecipients: Type.Optional(Type.Array(BouncedRecipientSchema)),
    timestamp: Type.Optional(Type.String()),
    feedbackId: Type.Optional(Type.String()),
    reportingMTA: Type.Optional(Type.String()),
  }),
})

const ComplaintRecipientSchema = Type.Object({
  emailAddress: Type.Optional(Type.String()),
})

export const SESComplaintSchema = Type.Object({
  eventType: Type.Literal('Complaint'),
  complaint: Type.Object({
    complainedRecipients: Type.Optional(Type.Array(ComplaintRecipientSchema)),
    timestamp: Type.Optional(Type.String()),
    feedbackId: Type.Optional(Type.String()),
    complaintSubType: Type.Optional(Type.String()),
    userAgent: Type.Optional(Type.String()),
    complaintFeedbackType: Type.Optional(Type.String()),
    arrivalDate: Type.Optional(Type.String()),
  }),
})

export const SESDeliverySchema = Type.Object({
  eventType: Type.Literal('Delivery'),
  delivery: Type.Object({
    timestamp: Type.Optional(Type.String()),
    processingTimeMillis: Type.Optional(Type.Number()),
    recipients: Type.Optional(Type.Array(Type.String())),
    smtpResponse: Type.Optional(Type.String()),
    reportingMTA: Type.Optional(Type.String()),
  }),
})

export const SESSendSchema = Type.Object({
  eventType: Type.Literal('Send'),
  send: Type.Object({}),
})

export const SESRejectSchema = Type.Object({
  eventType: Type.Literal('Reject'),
  reject: Type.Object({
    reason: Type.Optional(Type.String()),
  }),
})

export const SESOpenSchema = Type.Object({
  eventType: Type.Literal('Open'),
  open: Type.Object({
    ipAddress: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.String()),
    userAgent: Type.Optional(Type.String()),
  }),
})

export const SESClickSchema = Type.Object({
  eventType: Type.Literal('Click'),
  click: Type.Object({
    ipAddress: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.String()),
    userAgent: Type.Optional(Type.String()),
    link: Type.Optional(Type.String()),
    linkTags: TagSchema,
  }),
})

export const SESRenderingFailureSchema = Type.Object({
  eventType: Type.Literal('Rendering Failure'),
  failure: Type.Object({
    templateName: Type.Optional(Type.String()),
    errorMessage: Type.Optional(Type.String()),
  }),
})

const DelayedRecipientSchema = Type.Object({
  emailAddress: Type.Optional(Type.String()),
  status: Type.Optional(Type.String()),
  diagnosticCode: Type.Optional(Type.String()),
})

export const SESDeliveryDelaySchema = Type.Object({
  eventType: Type.Literal('DeliveryDelay'),
  deliveryDelay: Type.Object({
    delayType: Type.Optional(Type.String()),
    delayedRecipients: Type.Optional(Type.Array(DelayedRecipientSchema)),
    expirationTime: Type.Optional(Type.String()),
    reportingMTA: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.String()),
  }),
})

const TopicPreferencesSchema = Type.Object({
  unsubscribeAll: Type.Optional(Type.Boolean()),
  topicSubscriptionStatus: Type.Optional(
    Type.Array(
      Type.Object({
        topicName: Type.Optional(Type.String()),
        subscriptionStatus: Type.Optional(Type.String()),
      }),
    ),
  ),
  topicDefaultSubscriptionStatus: Type.Optional(
    Type.Array(
      Type.Object({
        topicName: Type.Optional(Type.String()),
        subscriptionStatus: Type.Optional(Type.String()),
      }),
    ),
  ),
})

export const SESSubscriptionSchema = Type.Object({
  eventType: Type.Literal('Subscription'),
  subscription: Type.Object({
    contactList: Type.Optional(Type.String()),
    timestamp: Type.Optional(Type.String()),
    source: Type.Optional(Type.String()),
    newTopicPreferences: Type.Optional(TopicPreferencesSchema),
    oldTopicPreferences: Type.Optional(TopicPreferencesSchema),
  }),
})

export const SESEventSchema = Type.Intersect([
  Type.Object({
    mail: MailSchema,
  }),
  Type.Union([
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

// Type exports
export type SESBounce = Static<typeof SESBounceSchema>
export type SESComplaint = Static<typeof SESComplaintSchema>
export type SESDelivery = Static<typeof SESDeliverySchema>
export type SESSend = Static<typeof SESSendSchema>
export type SESReject = Static<typeof SESRejectSchema>
export type SESOpen = Static<typeof SESOpenSchema>
export type SESClick = Static<typeof SESClickSchema>
export type SESRenderingFailure = Static<typeof SESRenderingFailureSchema>
export type SESDeliveryDelay = Static<typeof SESDeliveryDelaySchema>
export type SESSubscription = Static<typeof SESSubscriptionSchema>
export type SESEvent = Static<typeof SESEventSchema>

// Type guard function
export function isSESEvent(data: unknown): data is SESEvent {
  return Value.Check(SESEventSchema, data)
}
