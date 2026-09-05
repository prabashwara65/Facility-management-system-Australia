export const siteConfig = {
  name: 'Shining Property Service',
  shortName: 'Shining Property Service',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://shiningpropertyservice.com.au',
  description:
    'Professional end-of-lease, deep, regular, commercial, and mobile car detailing services across Melbourne.',
  phone: '1800 123 456',
  email: 'shiningpropertyofficial@gmail.com',
  logo: '/img/02.png',
  heroImage: '/img/cleaning_lady.avif',
  locale: 'en_AU',
  areaServed: ['Melbourne CBD', 'South Yarra', 'Fitzroy', 'Richmond', 'Melbourne Metro'],
  services: [
    'End of lease cleaning',
    'Deep cleaning',
    'Regular home cleaning',
    'Commercial cleaning',
    'Mobile car detailing',
  ],
};

export function absoluteUrl(path = '/') {
  return new URL(path, siteConfig.url).toString();
}
