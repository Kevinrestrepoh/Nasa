import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { spaceDatasets } from '../data/spaceDatasets';
import type { SpaceDataset } from '../types';

const Sidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { currentDataset, setCurrentDataset } = useData();

  const getTypeIcon = (type: SpaceDataset['type']): string => {
    const icons = {
      deep_field: '🔭',
      galaxy: '🌌',
      nebula: '💫',
      planet: '🪐',
      moon: '🌕',
      solar: '☀️'
    };
    return icons[type];
  };

  const getTypeColor = (type: SpaceDataset['type']): string => {
    const colors = {
      deep_field: 'bg-purple-500',
      galaxy: 'bg-indigo-500',
      nebula: 'bg-pink-500',
      planet: 'bg-orange-500',
      moon: 'bg-blue-500',
      solar: 'bg-yellow-500'
    };
    return colors[type];
  };

  const filteredDatasets = spaceDatasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dataset.type.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 bg-base-200/90 backdrop-blur-lg border-r border-base-300 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
            <span className="text-lg">🌌</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">Cosmic Canvas</h2>
            <p className="text-sm opacity-70">Explore the universe</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-base-300">
        <div className="form-control">
          <input
            type="text"
            placeholder="Search datasets..."
            className="input input-bordered input-sm w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 border-b border-base-300">
        <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
          <div className="stat">
            <div className="stat-title">Datasets</div>
            <div className="stat-value text-primary">{spaceDatasets.length}</div>
          </div>
          <div className="stat">
            <div className="stat-title">Max Resolution</div>
            <div className="stat-value text-secondary">2.5GP</div>
          </div>
        </div>
      </div>

      {/* Dataset List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-3">Space Image Collections</h3>
          <div className="space-y-3">
            {filteredDatasets.map((dataset) => (
              <div
                key={dataset.id}
                className={`card card-compact cursor-pointer transition-all duration-200 hover:scale-105 ${
                  currentDataset?.id === dataset.id
                    ? 'ring-2 ring-primary bg-primary/20'
                    : 'bg-base-100 shadow'
                }`}
                onClick={() => setCurrentDataset(dataset)}
              >
                <div className="card-body">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(dataset.type)} flex items-center justify-center text-lg`}>
                      {getTypeIcon(dataset.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="card-title text-sm">{dataset.name}</h4>
                      <p className="text-xs opacity-70 line-clamp-2">{dataset.description}</p>
                    </div>
                  </div>
                  <div className="card-actions justify-between items-center mt-2">
                    <div className="badge badge-outline badge-sm">{dataset.type}</div>
                    <div className="text-xs font-mono opacity-70">{dataset.resolution}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-base-300">
        <div className="text-center text-xs opacity-50">
          Powered by NASA & OpenSeadragon
        </div>
      </div>
    </div>
  );
};

export default Sidebar;