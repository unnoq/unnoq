import * as z from '@badrap/valita'

export type SESBounce = z.Infer<typeof SESBounceSchema>
export type SESComplaint = z.Infer<typeof SESComplaintSchema>
export type SESDelivery = z.Infer<typeof SESDeliverySchema>
export type SESSend = z.Infer<typeof SESSendSchema>
export type SESReject = z.Infer<typeof SESRejectSchema>
export type SESOpen = z.Infer<typeof SESOpenSchema>
export type SESClick = z.Infer<typeof SESClickSchema>
export type SESRenderingFailure = z.Infer<typeof SESRenderingFailureSchema>
export type SESDeliveryDelay = z.Infer<typeof SESDeliveryDelaySchema>
export type SESSubscription = z.Infer<typeof SESSubscriptionSchema>
export type SESEvent = z.Infer<typeof SESEventSchema>

const HeaderSchema = z.object({
  name: z.string().nullable(),
  value: z.string().nullable(),
})

const CommonHeadersSchema = z.object({
  from: z.array(z.string()).nullable(),
  to: z.array(z.string()).nullable(),
  messageId: z.string().nullable(),
  subject: z.string().nullable(),
})

const TagSchema = z.record(z.array(z.string()))

const MailSchema = z.object({
  timestamp: z.string().nullable(),
  source: z.string(),
  sourceArn: z.string().nullable(),
  sendingAccountId: z.string().nullable(),
  messageId: z.string(),
  destination: z.array(z.string()),
  headersTruncated: z.boolean().nullable(),
  headers: z.array(HeaderSchema).nullable(),
  commonHeaders: CommonHeadersSchema.nullable(),
  tags: TagSchema.nullable(),
})

const BouncedRecipientSchema = z.object({
  emailAddress: z.string().nullable(),
  action: z.string().nullable(),
  status: z.string().nullable(),
  diagnosticCode: z.string().nullable(),
})

export const SESBounceSchema = z.object({
  eventType: z.literal('Bounce'),

  bounce: z.object({
    bounceType: z.string().nullable(),
    bounceSubType: z.string().nullable(),
    bouncedRecipients: z.array(BouncedRecipientSchema).nullable(),
    timestamp: z.string().nullable(),
    feedbackId: z.string().nullable(),
    reportingMTA: z.string().nullable(),
  }),
})

const ComplaintRecipientSchema = z.object({
  emailAddress: z.string().nullable(),
})

export const SESComplaintSchema = z.object({
  eventType: z.literal('Complaint'),

  complaint: z.object({
    complainedRecipients: z.array(ComplaintRecipientSchema).nullable(),
    timestamp: z.string().nullable(),
    feedbackId: z.string().nullable(),
    complaintSubType: z.string().nullable(),
    userAgent: z.string().nullable(),
    complaintFeedbackType: z.string().nullable(),
    arrivalDate: z.string().nullable(),
  }),
})

export const SESDeliverySchema = z.object({
  eventType: z.literal('Delivery'),
  delivery: z.object({
    timestamp: z.string().nullable(),
    processingTimeMillis: z.number().nullable(),
    recipients: z.array(z.string()).nullable(),
    smtpResponse: z.string().nullable(),
    reportingMTA: z.string().nullable(),
  }),
})

export const SESSendSchema = z.object({
  eventType: z.literal('Send'),
  send: z.object({}),
})

export const SESRejectSchema = z.object({
  eventType: z.literal('Reject'),
  reject: z.object({
    reason: z.string().nullable(),
  }),
})

export const SESOpenSchema = z.object({
  eventType: z.literal('Open'),
  open: z.object({
    ipAddress: z.string().nullable(),
    timestamp: z.string().nullable(),
    userAgent: z.string().nullable(),
  }),
})

export const SESClickSchema = z.object({
  eventType: z.literal('Click'),
  click: z.object({
    ipAddress: z.string().nullable(),
    timestamp: z.string().nullable(),
    userAgent: z.string().nullable(),
    link: z.string().nullable(),
    linkTags: TagSchema,
  }),
})

export const SESRenderingFailureSchema = z.object({
  eventType: z.literal('Rendering Failure'),
  failure: z.object({
    templateName: z.string().nullable(),
    errorMessage: z.string().nullable(),
  }),
})

const DelayedRecipientSchema = z.object({
  emailAddress: z.string().nullable(),
  status: z.string().nullable(),
  diagnosticCode: z.string().nullable(),
})

export const SESDeliveryDelaySchema = z.object({
  eventType: z.literal('DeliveryDelay'),
  deliveryDelay: z.object({
    delayType: z.string().nullable(),
    delayedRecipients: z.array(DelayedRecipientSchema).nullable(),
    expirationTime: z.string().nullable(),
    reportingMTA: z.string().nullable(),
    timestamp: z.string().nullable(),
  }),
})

const TopicPreferencesSchema = z.object({
  unsubscribeAll: z.boolean().nullable(),
  topicSubscriptionStatus: z
    .array(
      z.object({
        topicName: z.string().nullable(),
        subscriptionStatus: z.string().nullable(),
      }),
    )
    .nullable(),
  topicDefaultSubscriptionStatus: z
    .array(
      z.object({
        topicName: z.string().nullable(),
        subscriptionStatus: z.string().nullable(),
      }),
    )
    .nullable(),
})

export const SESSubscriptionSchema = z.object({
  eventType: z.literal('Subscription'),
  subscription: z.object({
    contactList: z.string().nullable(),
    timestamp: z.string().nullable(),
    source: z.string().nullable(),
    newTopicPreferences: TopicPreferencesSchema.nullable(),
    oldTopicPreferences: TopicPreferencesSchema.nullable(),
  }),
})

export const SESEventSchema = z.object({
  mail: MailSchema,
  data: z.union(
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
  ),
})

export function isSESEvent(
  data: unknown,
): data is z.Infer<typeof SESEventSchema> {
  return Boolean(SESEventSchema.parse(data))
}
