import fs from 'node:fs/promises'
import { defineConfig, tierPresets } from 'sponsorkit'

/**
 * The list of sponsors to display in the right sidebar.
 *
 * You can host logos in the /public directory and reference them via:
 *   https://cdn.jsdelivr.net/gh/unnoq/unnoq/public/<your-logo>
 *
 * Contributions and PRs are welcome!
 */
const rightSidebarSponsors: RightSidebarSponsor[] = [
  {
    login: 'SanMurakami',
    rideSidebarLink: 'https://misskey.io',
    rightSidebarLogo: 'https://cdn.jsdelivr.net/gh/unnoq/unnoq/public/MisskeyHQ_TextLogo.png',
  },
]

/**
 * Custom override settings for specific sponsors.
 */
interface RightSidebarSponsor {
  /**
   * Sponsor's unique login.
   */
  login: string

  /**
   * Custom URL for the sponsor link displayed in the website's right sidebar.
   * @default websiteUrl || linkUrl
   */
  rideSidebarLink?: string

  /**
   * Custom logo URL for the sponsor in the website's right sidebar.
   * @default avatarUrl
   */
  rightSidebarLogo?: string
}

const BRONZE_TIER_THRESHOLD = 100
const SILVER_TIER_THRESHOLD = 200
const GOLD_TIER_THRESHOLD = 500
const PLATINUM_TIER_THRESHOLD = 1000

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
      preset: tierPresets.base,
    },
    {
      title: 'Generous Sponsors',
      monthlyDollars: 50,
      preset: tierPresets.medium,
    },
    {
      title: '🥉 Bronze Sponsor',
      monthlyDollars: BRONZE_TIER_THRESHOLD,
      preset: tierPresets.large,
    },
    {
      title: '🥈 Silver Sponsor',
      monthlyDollars: SILVER_TIER_THRESHOLD,
      preset: tierPresets.xl,
    },
    {
      title: '🥇 Gold Sponsor',
      monthlyDollars: GOLD_TIER_THRESHOLD,
      preset: {
        avatar: { size: 90 * 1.4 },
        boxWidth: 120 * 1.4,
        boxHeight: 130 * 1.4,
        container: { sidePadding: 20 * 1.4 },
        name: { maxLength: 20 * 1.4 },
      },
    },
    {
      title: '🏆 Platinum Sponsor',
      monthlyDollars: PLATINUM_TIER_THRESHOLD,
      preset: {
        avatar: { size: 90 * 1.6 },
        boxWidth: 120 * 1.6,
        boxHeight: 130 * 1.6,
        container: { sidePadding: 20 * 1.6 },
        name: { maxLength: 20 * 1.6 },
      },
    },
  ],

  async onSponsorsReady(sponsors) {
    const json: JSONSponsor[] = sponsors
      .filter(sponsorEntry => sponsorEntry.privacyLevel !== 'PRIVATE')
      .map((sponsorEntry) => {
        const rideSidebar = rightSidebarSponsors.find(
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
          rideSidebarSize: isExpired || !rideSidebar
            ? 'none'
            : sponsorEntry.monthlyDollars >= BRONZE_TIER_THRESHOLD
              ? 'normal' // TODO: add a tier for gold sponsors
              : 'none',
          rideSidebarLink: rideSidebar?.rideSidebarLink || sponsorEntry.sponsor.websiteUrl || sponsorEntry.sponsor.linkUrl,
          rightSidebarLogo: rideSidebar?.rightSidebarLogo || sponsorEntry.sponsor.avatarUrl,
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
  rideSidebarSize: 'normal' | 'small' | 'none'
  rideSidebarLink?: string
  rightSidebarLogo: string
}
