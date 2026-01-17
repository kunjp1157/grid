
export type KBArticle = {
  slug: string;
  category: 'First Aid' | 'Emergency Preparedness';
};

export const articles: KBArticle[] = [
  { slug: 'basic-first-aid-burns', category: 'First Aid' },
  { slug: 'cpr-basics', category: 'First Aid' },
  { slug: 'bleeding-control', category: 'First Aid' },
  { slug: 'choking-first-aid', category: 'First Aid' },
  { slug: 'stroke-recognition', category: 'First Aid' },
  { slug: 'emergency-kit', category: 'Emergency Preparedness' },
  { slug: 'family-emergency-plan', category: 'Emergency Preparedness' },
  { slug: 'earthquake-preparedness', category: 'Emergency Preparedness' },
  { slug: 'flood-safety', category: 'Emergency Preparedness' },
  { slug: 'power-outage-safety', category: 'Emergency Preparedness' },
];
