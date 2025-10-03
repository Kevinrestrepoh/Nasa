const Toolbar = () => {
  const tools = [
    { icon: '📚', label: 'Layers', action: 'layers' },
    { icon: '📏', label: 'Measure', action: 'measure' },
    { icon: '⏰', label: 'Time Machine', action: 'time' },
    { icon: '📍', label: 'Add Marker', action: 'marker' },
    { icon: '📷', label: 'Screenshot', action: 'screenshot' },
    { icon: '🔍', label: 'AI Search', action: 'ai-search' },
  ];

  return (
    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
      <div className="btn-group glass rounded-box shadow-lg">
        {tools.map((tool) => (
          <button
            key={tool.action}
            className="btn btn-sm btn-ghost tooltip"
            data-tip={tool.label}
          >
            <span className="text-lg">{tool.icon}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;