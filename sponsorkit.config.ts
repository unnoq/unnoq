import fs from 'node:fs/promises'
import { defineConfig, tierPresets } from 'sponsorkit'

/**
 * Custom Sponsor Overrides
 *
 * Customize sponsor links and logos for display in the website's right sidebar.
 * You can host logos in the /public directory and reference them via:
 *   https://cdn.jsdelivr.net/gh/unnoq/unnoq/public/<your-logo-name>.svg
 *
 * Example:
 * { login: 'sponsorLogin', asideLink: 'https://custom-link.com', asideLogo: 'https://custom-logo.com' }
 *
 * Contributions and PRs are welcome!
 */
const customSponsorOverrides: CustomSponsorOverrides[] = [
  // Add your custom sponsor configurations here - PRs are welcome!
]

/**
 * Custom override settings for specific sponsors.
 */
interface CustomSponsorOverrides {
  /**
   * Sponsor's unique login.
   */
  login: string

  /**
   * Custom URL for the sponsor link displayed in the website's right sidebar.
   * Defaults to the sponsor's primary link.
   */
  asideLink?: string

  /**
   * Custom logo URL for the sponsor in the website's right sidebar.
   * Defaults to the sponsor's avatar.
   */
  asideLogo?: string
}

const GOLD_TIER_THRESHOLD = 100
const PLATINUM_TIER_THRESHOLD = 500

export default defineConfig({
  tiers: [
    {
      title: 'Past Sponsors',
      monthlyDollars: -1,
      preset: {
        avatar: { size: 20 },
        boxWidth: 22,
        boxHeight: 22,
        container: { sidePadding: 35 },
      },
    },
    {
      title: 'Backers',
      preset: tierPresets.small,
    },
    {
      title: 'Sponsors',
      monthlyDollars: 10,
      preset: {
        avatar: { size: 42 },
        boxWidth: 52,
        boxHeight: 52,
        container: { sidePadding: 30 },
      },
    },
    {
      title: 'Silver Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.medium,
    },
    {
      title: 'Gold Sponsors',
      monthlyDollars: GOLD_TIER_THRESHOLD,
      preset: tierPresets.large,
    },
    {
      title: 'Platinum Sponsors',
      monthlyDollars: PLATINUM_TIER_THRESHOLD,
      preset: tierPresets.xl,
    },
  ],

  async onSponsorsReady(sponsors) {
    const json: JSONSponsor[] = sponsors
      .filter(sponsorEntry => sponsorEntry.privacyLevel !== 'PRIVATE')
      .map((sponsorEntry) => {
        const override = customSponsorOverrides.find(
          custom => custom.login.toLocaleLowerCase() === sponsorEntry.sponsor.login.toLocaleLowerCase(),
        )

        const expiredAt = sponsorEntry.expireAt
          ? new Date(sponsorEntry.expireAt)
          : sponsorEntry.createdAt
            ? new Date(new Date(sponsorEntry.createdAt).setMonth(new Date().getMonth() + 1))
            : undefined

        const isExpired = expiredAt && expiredAt < new Date()

        return {
          name: sponsorEntry.sponsor.name,
          login: sponsorEntry.sponsor.login,
          avatar: sponsorEntry.sponsor.avatarUrl,
          amount: sponsorEntry.monthlyDollars,
          link: sponsorEntry.sponsor.linkUrl || sponsorEntry.sponsor.websiteUrl,
          org: sponsorEntry.sponsor.type === 'Organization',
          aside: isExpired
            ? 'none'
            : sponsorEntry.monthlyDollars > PLATINUM_TIER_THRESHOLD
              ? 'aside'
              : sponsorEntry.monthlyDollars > GOLD_TIER_THRESHOLD
                ? 'aside-small'
                : 'none',
          asideLink: override?.asideLink || sponsorEntry.sponsor.linkUrl || sponsorEntry.sponsor.websiteUrl,
          asideLogo: override?.asideLogo || sponsorEntry.sponsor.avatarUrl,
        } satisfies JSONSponsor
      })
      .sort((a, b) => b.amount - a.amount)

    await fs.writeFile('sponsors.json', `${JSON.stringify(json, null, 2)}\n`)
  },

  outputDir: '.',
  formats: ['svg', 'png'],
  renderer: 'tiers',
})

/**
 * Defines the structure for a sponsor's data in the JSON output.
 */
interface JSONSponsor {
  name: string
  login: string
  avatar: string
  amount: number
  link?: string
  org: boolean
  aside: 'aside' | 'aside-small' | 'none'
  asideLink?: string
  asideLogo: string
}
