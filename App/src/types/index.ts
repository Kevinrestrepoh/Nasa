export interface Point {
  x: number;
  y: number;
}

export interface ViewportState {
  zoom: number;
  center: Point;
  rotation: number;
}

export interface SpaceDataset {
  id: string;
  name: string;
  description: string;
  type: 'deep_field' | 'galaxy' | 'nebula' | 'planet' | 'moon' | 'solar';
  resolution: string;
  objects: string;
  tileSource: any;
  credits?: string;
  year?: string;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  text: string;
  type: 'star' | 'galaxy' | 'nebula' | 'feature' | 'question';
  datasetId: string;
}