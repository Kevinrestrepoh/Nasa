import React, { useEffect, useRef, useState } from "react";
import OpenSeadragon from "openseadragon";
import { useData } from "../context/DataContext";

const CosmicViewer: React.FC = () => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const osdRef = useRef<any>(null);
  const [osdLoading, setOsdLoading] = useState(true);
  const [osdError, setOsdError] = useState<string | null>(null);

  const { 
    datasets, 
    currentDataset, 
    setCurrentDataset, 
    isLoading: contextLoading, 
    error: contextError,
    refreshDatasets 
  } = useData();

  // Initialize dataset when datasets are loaded
  useEffect(() => {
    if (!currentDataset && datasets.length > 0) {
      setCurrentDataset(datasets[0]);
    }
  }, [currentDataset, setCurrentDataset, datasets]);

  // Initialize OSD viewer
  useEffect(() => {
    if (!viewerRef.current || !currentDataset?.tileSource?.url) return;

    // Destroy previous viewer if switching dataset
    if (osdRef.current) {
      osdRef.current.destroy();
      osdRef.current = null;
    }

    setOsdLoading(true);
    setOsdError(null);

    const tileSourceUrl = currentDataset.tileSource.url;
    console.log('🔄 Loading tile source:', tileSourceUrl);

    try {
      osdRef.current = OpenSeadragon({
        element: viewerRef.current,
        prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/",

        // PASS THE URL DIRECTLY - don't wrap it in an object
        tileSources: tileSourceUrl,

        crossOriginPolicy: "Anonymous",
        loadTilesWithAjax: true,
        ajaxWithCredentials: false,

        showNavigationControl: false,
        showZoomControl: false,
        showHomeControl: false,
        showFullPageControl: false,
        showRotationControl: false,

        minZoomLevel: 0.1,
        maxZoomLevel: 100,
        visibilityRatio: 1.0,

        gestureSettingsMouse: {
          scrollToZoom: true,
          clickToZoom: true,
          dblClickToZoom: true,
        }
      });

      // Success handler
      osdRef.current.addHandler("open", () => {
        console.log("✅ OpenSeadragon: Image opened successfully");
        setOsdLoading(false);
        setOsdError(null);
      });

      // Error handler
      osdRef.current.addHandler("open-failed", (event: any) => {
        console.error("❌ OpenSeadragon: Failed to open image", event);
        const errorMsg = event.message || 'Unknown error';
        console.error('Full error details:', event);
        setOsdLoading(false);
        setOsdError(`Failed to load image: ${errorMsg}`);
      });

      // Tile loading events
      osdRef.current.addHandler("tile-loaded", (event: any) => {
        console.log("📦 Tile loaded:", event);
      });

      osdRef.current.addHandler("tile-load-failed", (event: any) => {
        console.warn("⚠️ Tile load failed:", event);
      });

    } catch (err) {
      console.error("💥 Error initializing OpenSeadragon:", err);
      setOsdError(`Failed to initialize viewer: ${err}`);
      setOsdLoading(false);
    }

    return () => {
      if (osdRef.current) {
        osdRef.current.destroy();
        osdRef.current = null;
      }
    };
  }, [currentDataset]);

  const reloadViewer = () => {
    if (osdRef.current && currentDataset) {
      setOsdLoading(true);
      setOsdError(null);
      osdRef.current.open(currentDataset.tileSource.url);
    }
  };

  return (
    <div className="h-full w-full relative bg-black">
      {/* Context loading overlay */}
      {contextLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-lg">Loading datasets from API...</p>
          </div>
        </div>
      )}

      {/* Context error overlay */}
      {contextError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🚨</div>
            <h3 className="text-lg font-bold text-error mb-2">API Error</h3>
            <p className="text-sm opacity-80 mb-4 font-mono">{contextError}</p>
            <div className="space-x-2">
              <button className="btn btn-primary btn-sm" onClick={refreshDatasets}>
                Retry API
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OSD loading overlay */}
      {!contextLoading && !contextError && osdLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg mb-4"></div>
            <p className="text-lg">Loading {currentDataset?.name}...</p>
            <p className="text-sm opacity-70 mt-2">
              URL: {currentDataset?.tileSource?.url}
            </p>
          </div>
        </div>
      )}

      {/* OSD error overlay */}
      {!contextLoading && !contextError && osdError && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/70 text-white">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">🚨</div>
            <h3 className="text-lg font-bold text-error mb-2">Image Load Failed</h3>
            <p className="text-sm opacity-80 mb-4 font-mono">{osdError}</p>
            <div className="space-x-2">
              <button className="btn btn-primary btn-sm" onClick={reloadViewer}>
                Try Again
              </button>
              {datasets.length > 1 && (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setCurrentDataset(datasets[1])}
                >
                  Try Other Dataset
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* OSD container */}
      <div ref={viewerRef} className="h-full w-full" />

      {!contextLoading && !contextError && !osdLoading && !osdError && (
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-50 ">
            <button className="btn btn-sm bg-white/30 backdrop-blur-md border border-white/50
               text-white hover:bg-white/50 transition rounded-lg shadow-lg"
                onClick={() => {
                    osdRef.current.viewport.zoomBy(1.2);
                    osdRef.current.viewport.applyConstraints();
                }}
             >+</button>
            <button className="btn btn-sm bg-white/30 backdrop-blur-md border border-white/50
               text-white hover:bg-white/50 transition rounded-lg shadow-lg"
            onClick={() => {
                osdRef.current.viewport.zoomBy(0.8);
                osdRef.current.viewport.applyConstraints();
            }}
            >−</button>
            <button className="btn btn-sm bg-white/30 backdrop-blur-md border border-white/50
               text-white hover:bg-white/50 transition rounded-lg shadow-lg"
                onClick={() => osdRef.current.viewport.goHome()}
            >🏠</button>
            <button className="btn btn-sm bg-white/30 backdrop-blur-md border border-white/50
               text-white hover:bg-white/50 transition rounded-lg shadow-lg"
                onClick={() => osdRef.current.viewport.setRotation(
                    (osdRef.current.viewport.getRotation() + 90) % 360
                )}
            >↻</button>
        </div>
        )}

      {/* Dataset info */}
      {currentDataset && !contextLoading && !contextError && !osdLoading && !osdError && (
        <div className="bg-white/30 backdrop-blur-md text-white absolute top-4 left-4 p-4 rounded-lg text-sm max-w-sm">
          <h3 className="font-bold text-lg mb-1">{currentDataset.name}</h3>
          <p className="opacity-80 mb-2">{currentDataset.description}</p>
          <div className="flex flex-wrap gap-1 text-xs">
            <div className="badge badge-primary">{currentDataset.type}</div>
            <div className="badge badge-secondary">{currentDataset.resolution}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CosmicViewer;