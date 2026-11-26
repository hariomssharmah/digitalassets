export interface IDigitalAsset {
  id: string;
  title: string;
  category: string;
  format: string;
  owner: string;
  updated: string;
  accent: 'violet' | 'blue' | 'orange' | 'green';
}

export const digitalAssets: IDigitalAsset[] = [
  {
    id: 'brand-guidelines',
    title: 'Brand guidelines',
    category: 'Brand',
    format: 'PDF',
    owner: 'Marketing',
    updated: 'Today',
    accent: 'violet'
  },
  {
    id: 'spring-campaign',
    title: 'Spring campaign imagery',
    category: 'Campaigns',
    format: 'JPG',
    owner: 'Creative studio',
    updated: 'Yesterday',
    accent: 'orange'
  },
  {
    id: 'product-launch',
    title: 'Product launch presentation',
    category: 'Presentations',
    format: 'PPT',
    owner: 'Product team',
    updated: 'Oct 18',
    accent: 'blue'
  },
  {
    id: 'social-templates',
    title: 'Social media templates',
    category: 'Templates',
    format: 'FIG',
    owner: 'Creative studio',
    updated: 'Oct 16',
    accent: 'green'
  },
  {
    id: 'logo-library',
    title: 'Logo library',
    category: 'Brand',
    format: 'SVG',
    owner: 'Marketing',
    updated: 'Oct 14',
    accent: 'violet'
  },
  {
    id: 'event-photos',
    title: 'Customer event photos',
    category: 'Photography',
    format: 'JPG',
    owner: 'Communications',
    updated: 'Oct 12',
    accent: 'blue'
  }
];
