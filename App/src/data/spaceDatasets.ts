import type { SpaceDataset } from '../types';

export const spaceDatasets: SpaceDataset[] = [
  {
    id: 'andromeda',
    name: 'Andromeda Galaxy',
    description: 'Panoramic view of our nearest galactic neighbor, the Andromeda Galaxy (M31)',
    type: 'galaxy',
    resolution: '1.5 Gigapixels',
    objects: '100 Million Stars',
    credits: 'NASA, JPL-Caltech, UCLA',
    year: '2015',
    tileSource: {
      type: 'image',
      url: 'http://localhost:3000/tiles/andromeda/andromeda.dzi'
    }
  },
];
