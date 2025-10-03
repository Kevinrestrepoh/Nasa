import { useState } from 'react';
import { DataProvider } from './context/DataContext';
import CosmicViewer from './components/CosmicViewer';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import './App.css'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <DataProvider>
      <div data-theme="cosmic" className="h-screen bg-base-100 text-base-content flex flex-col overflow-hidden">
        <header className="bg-base-200/80 backdrop-blur-lg border-b border-base-300 px-6 py-2 z-50">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="bg-gray-600 text-white btn btn-ghost btn-sm"
            >
              {sidebarOpen ? '<' : '>'}
            </button>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {sidebarOpen && <Sidebar />}

          {/* Viewer Container */}
          <div className="flex-1 relative">
            <CosmicViewer />
            <Toolbar />
          </div>
        </div>
      </div>
    </DataProvider>
  );
}

export default App;