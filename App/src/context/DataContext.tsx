import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { SpaceDataset, Annotation, ViewportState } from '../types';

interface DataContextType {
  currentDataset: SpaceDataset | null;
  setCurrentDataset: (dataset: SpaceDataset) => void;
  viewport: ViewportState;
  setViewport: (viewport: ViewportState | ((prev: ViewportState) => ViewportState)) => void;
  annotations: Annotation[];
  addAnnotation: (annotation: Omit<Annotation, 'id'>) => void;
  removeAnnotation: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentDataset, setCurrentDataset] = useState<SpaceDataset | null>(null);
  const [viewport, setViewport] = useState<ViewportState>({
    zoom: 1,
    center: { x: 0, y: 0 },
    rotation: 0
  });
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

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

  return (
    <DataContext.Provider value={{
      currentDataset,
      setCurrentDataset,
      viewport,
      setViewport,
      annotations,
      addAnnotation,
      removeAnnotation
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