import { z } from 'zod'

export type SESBounce = z.infer<typeof SESBounceSchema>
export type SESComplaint = z.infer<typeof SESComplaintSchema>
export type SESDelivery = z.infer<typeof SESDeliverySchema>
export type SESSend = z.infer<typeof SESSendSchema>
export type SESReject = z.infer<typeof SESRejectSchema>
export type SESOpen = z.infer<typeof SESOpenSchema>
export type SESClick = z.infer<typeof SESClickSchema>
export type SESRenderingFailure = z.infer<typeof SESRenderingFailureSchema>
export type SESDeliveryDelay = z.infer<typeof SESDeliveryDelaySchema>
export type SESSubscription = z.infer<typeof SESSubscriptionSchema>
export type SESEvent = z.infer<typeof SESEventSchema>

const HeaderSchema = z.object({
  name: z.string().nullish(),
  value: z.string().nullish(),
})

const CommonHeadersSchema = z.object({
  from: z.array(z.string()).nullish(),
  to: z.array(z.string()).nullish(),
  messageId: z.string().nullish(),
  subject: z.string().nullish(),
})

const TagSchema = z.record(z.array(z.string()))

const MailSchema = z.object({
  timestamp: z.string().nullish(),
  source: z.string(),
  sourceArn: z.string().nullish(),
  sendingAccountId: z.string().nullish(),
  messageId: z.string(),
  destination: z.array(z.string()),
  headersTruncated: z.boolean().nullish(),
  headers: z.array(HeaderSchema).nullish(),
  commonHeaders: CommonHeadersSchema.nullish(),
  tags: TagSchema.nullish(),
})

const BouncedRecipientSchema = z.object({
  emailAddress: z.string().nullish(),
  action: z.string().nullish(),
  status: z.string().nullish(),
  diagnosticCode: z.string().nullish(),
})

export const SESBounceSchema = z.object({
  eventType: z.literal('Bounce'),

  bounce: z.object({
    bounceType: z.string().nullish(),
    bounceSubType: z.string().nullish(),
    bouncedRecipients: z.array(BouncedRecipientSchema).nullish(),
    timestamp: z.string().nullish(),
    feedbackId: z.string().nullish(),
    reportingMTA: z.string().nullish(),
  }),
})

const ComplaintRecipientSchema = z.object({
  emailAddress: z.string().nullish(),
})

export const SESComplaintSchema = z.object({
  eventType: z.literal('Complaint'),

  complaint: z.object({
    complainedRecipients: z.array(ComplaintRecipientSchema).nullish(),
    timestamp: z.string().nullish(),
    feedbackId: z.string().nullish(),
    complaintSubType: z.string().nullish(),
    userAgent: z.string().nullish(),
    complaintFeedbackType: z.string().nullish(),
    arrivalDate: z.string().nullish(),
  }),
})

export const SESDeliverySchema = z.object({
  eventType: z.literal('Delivery'),
  delivery: z.object({
    timestamp: z.string().nullish(),
    processingTimeMillis: z.number().nullish(),
    recipients: z.array(z.string()).nullish(),
    smtpResponse: z.string().nullish(),
    reportingMTA: z.string().nullish(),
  }),
})

export const SESSendSchema = z.object({
  eventType: z.literal('Send'),
  send: z.object({}),
})

export const SESRejectSchema = z.object({
  eventType: z.literal('Reject'),
  reject: z.object({
    reason: z.string().nullish(),
  }),
})

export const SESOpenSchema = z.object({
  eventType: z.literal('Open'),
  open: z.object({
    ipAddress: z.string().nullish(),
    timestamp: z.string().nullish(),
    userAgent: z.string().nullish(),
  }),
})

export const SESClickSchema = z.object({
  eventType: z.literal('Click'),
  click: z.object({
    ipAddress: z.string().nullish(),
    timestamp: z.string().nullish(),
    userAgent: z.string().nullish(),
    link: z.string().nullish(),
    linkTags: TagSchema,
  }),
})

export const SESRenderingFailureSchema = z.object({
  eventType: z.literal('Rendering Failure'),
  failure: z.object({
    templateName: z.string().nullish(),
    errorMessage: z.string().nullish(),
  }),
})

const DelayedRecipientSchema = z.object({
  emailAddress: z.string().nullish(),
  status: z.string().nullish(),
  diagnosticCode: z.string().nullish(),
})

export const SESDeliveryDelaySchema = z.object({
  eventType: z.literal('DeliveryDelay'),
  deliveryDelay: z.object({
    delayType: z.string().nullish(),
    delayedRecipients: z.array(DelayedRecipientSchema).nullish(),
    expirationTime: z.string().nullish(),
    reportingMTA: z.string().nullish(),
    timestamp: z.string().nullish(),
  }),
})

const TopicPreferencesSchema = z.object({
  unsubscribeAll: z.boolean().nullish(),
  topicSubscriptionStatus: z
    .array(
      z.object({
        topicName: z.string().nullish(),
        subscriptionStatus: z.string().nullish(),
      }),
    )
    .nullish(),
  topicDefaultSubscriptionStatus: z
    .array(
      z.object({
        topicName: z.string().nullish(),
        subscriptionStatus: z.string().nullish(),
      }),
    )
    .nullish(),
})

export const SESSubscriptionSchema = z.object({
  eventType: z.literal('Subscription'),
  subscription: z.object({
    contactList: z.string().nullish(),
    timestamp: z.string().nullish(),
    source: z.string().nullish(),
    newTopicPreferences: TopicPreferencesSchema.nullish(),
    oldTopicPreferences: TopicPreferencesSchema.nullish(),
  }),
})

export const SESEventSchema = z
  .object({
    mail: MailSchema,
  })
  .and(
    z.discriminatedUnion('eventType', [
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
  )

export function isSESEvent(
  data: unknown,
): data is z.infer<typeof SESEventSchema> {
  return SESEventSchema.safeParse(data).success
}
