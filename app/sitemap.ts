import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-config'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/calculators`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/calculators/write-off`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/calculators/home-office`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/calculators/quarterly-estimates`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/calculators/profile`, changeFrequency: 'monthly', priority: 0.5 },
  ]
}
