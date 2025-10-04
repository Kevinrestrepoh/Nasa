import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { SpaceDataset, Annotation, ViewportState } from '../types';

interface DataContextType {
  datasets: SpaceDataset[];
  currentDataset: SpaceDataset | null;
  setCurrentDataset: (dataset: SpaceDataset) => void;
  viewport: ViewportState;
  setViewport: (viewport: ViewportState | ((prev: ViewportState) => ViewportState)) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
  isLoading: boolean;
  error: string | null;
  refreshDatasets: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [datasets, setDatasets] = useState<SpaceDataset[]>([]);
  const [currentDataset, setCurrentDataset] = useState<SpaceDataset | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    center: { x: 0, y: 0 },
    rotation: 0
  });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  // Fetch datasets from API
  const fetchDatasets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const API_BASE_URL = 'http://localhost:3000';
      const response = await fetch(`${API_BASE_URL}/datasets`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiDatasets = await response.json();
      
      // Transform API data to match SpaceDataset interface
      const transformedDatasets: SpaceDataset[] = apiDatasets.map((dataset: any) => ({
        id: dataset.id,
        name: dataset.name,
        description: dataset.description,
        type: dataset.type as SpaceDataset['type'],
        resolution: dataset.resolution,
        objects: dataset.objects,
        credits: dataset.credits,
        year: dataset.year,
        tileSource: {
          type: 'image',
          url: `${API_BASE_URL}/${dataset.tile_url}`
        }
      }));
      
      setDatasets(transformedDatasets);
      
      // Set first dataset as current if none is selected
      if (transformedDatasets.length > 0 && !currentDataset) {
        setCurrentDataset(transformedDatasets[0]);
      }
      
    } catch (err) {
      console.error('Error fetching datasets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load datasets');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch datasets on mount and provide refresh function
  useEffect(() => {
    fetchDatasets();
  }, []);

  const addAnnotation = (annotation: Omit<Annotation, 'id'>) => {
    const newAnnotation: Annotation = {
      ...annotation,
      id: Math.random().toString(36).substr(2, 9)
    };
    setAnnotations(prev => [...prev, newAnnotation]);
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(ann => ann.id !== id));
  };

  const refreshDatasets = async () => {
    await fetchDatasets();
  };

  return (
    <DataContext.Provider value={{
      datasets,
      currentDataset,
      setCurrentDataset,
      viewport,
      setViewport,
      annotations,
      addAnnotation,
      removeAnnotation,
      isLoading,
      error,
      refreshDatasets
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};