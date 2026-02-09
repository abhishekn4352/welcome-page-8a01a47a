import React, { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  ConnectionMode,
  MiniMap,
  Panel,
  BackgroundVariant,
} from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Eye, EyeOff } from 'lucide-react';
import ConnectionLine from './components/ConnectionLine';


// Add custom animations via style injection - Admin Theme
const style = document.createElement('style');
style.textContent = `
  /* Admin Theme Colors */
  :root {
    --color-primary: #00d2ff;
    --color-accent: #ff00ff;
    --color-bg-dark: #0a0e27;
    --color-bg-card: #1a202c;
    --color-border: rgba(255, 255, 255, 0.1);
    --color-text-primary: #f5f5f5;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse-glow-cyan {
    0%, 100% { box-shadow: 0 0 20px rgba(0, 210, 255, 0.3); }
    50% { box-shadow: 0 0 40px rgba(0, 210, 255, 0.6); }
  }
  
  @keyframes pulse-glow-magenta {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 0, 255, 0.3); }
    50% { box-shadow: 0 0 40px rgba(255, 0, 255, 0.6); }
  }
  
  .react-flow__node.selected {
    animation: pulse-glow-cyan 2s ease-in-out infinite;
  }
  
  .react-flow__controls-button {
    border: 1px solid rgba(0, 210, 255, 0.3) !important;
    background: rgba(26, 32, 44, 0.8) !important;
    backdrop-filter: blur(12px) !important;
    transition: all 0.2s ease !important;
    color: #00d2ff !important;
  }
  
  .react-flow__controls-button:hover {
    background: rgba(0, 210, 255, 0.1) !important;
    border-color: #00d2ff !important;
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(0, 210, 255, 0.3) !important;
  }
  
  .react-flow__controls-button svg {
    fill: #00d2ff !important;
  }

  .react-flow__background {
    background-color: #0a0e27 !important;
  }

  .react-flow__edge {
    stroke: #00d2ff !important;
  }

  .react-flow__edge.selected {
    stroke: #ff00ff !important;
    filter: drop-shadow(0 0 8px rgba(255, 0, 255, 0.6));
  }
`;
if (!document.head.querySelector('style[data-enhanced-canvas]')) {
  style.setAttribute('data-enhanced-canvas', 'true');
  document.head.appendChild(style);
}

/**
 * EnhancedCanvas - Read-Only Viewer Version
 * 
 * @param {Object} props
 * @param {Array} props.nodes
 * @param {Array} props.edges
 * @param {Function} [props.onNodesChange]
 * @param {Function} [props.onEdgesChange]
 * @param {Function} [props.onConnect]
 * @param {Function} [props.onInit]
 * @param {Function} [props.onNodeClick]
 * @param {Function} [props.onNodeDoubleClick]
 * @param {Object} props.nodeTypes
 * @param {boolean} props.isExecuting
 * @param {Array} [props.selectedNodes]
 * @param {Function} [props.onSelectionChange]
 * @param {boolean} [props.nodesDraggable]
 * @param {Function} [props.onPaneClick]
 */
export const EnhancedCanvas = ({
  nodes = [],
  edges = [],
  onNodesChange,
  onEdgesChange,
  onInit,
  onNodeClick,
  onNodeDoubleClick,
  nodeTypes,
  isExecuting,
  selectedNodes = [],
  onSelectionChange,
  nodesDraggable,
  onPaneClick,
}) => {
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [backgroundVariant, setBackgroundVariant] = useState(BackgroundVariant.Dots);
  const reactFlowInstance = useRef(null);
  const canvasRef = useRef(null);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const [hasError, setHasError] = useState(false);
  const [showZoomIndicator, setShowZoomIndicator] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const zoomTimeoutRef = useRef(null);

  const handleInit = useCallback((instance) => {
    try {
      reactFlowInstance.current = instance;
      if (onInit) onInit(instance);
      instance.fitView({ padding: 0.1, duration: 500 });
      const vp = instance.getViewport();
      setViewport(vp);
      setHasError(false);
    } catch (err) {
      console.error('Canvas initialization error:', err);
      setHasError(false);
    }
  }, [onInit]);

  const fitView = () => {
    reactFlowInstance.current?.fitView({ padding: 0.1 });
  };

  const zoomIn = () => {
    reactFlowInstance.current?.zoomIn();
    setShowZoomIndicator(true);
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(() => setShowZoomIndicator(false), 2000);
  };

  const zoomOut = () => {
    reactFlowInstance.current?.zoomOut();
    setShowZoomIndicator(true);
    if (zoomTimeoutRef.current) clearTimeout(zoomTimeoutRef.current);
    zoomTimeoutRef.current = setTimeout(() => setShowZoomIndicator(false), 2000);
  };

  const cycleBackgroundVariant = () => {
    const variants = [BackgroundVariant.Dots, BackgroundVariant.Lines, BackgroundVariant.Cross];
    const currentIndex = variants.indexOf(backgroundVariant);
    const nextIndex = (currentIndex + 1) % variants.length;
    setBackgroundVariant(variants[nextIndex]);
  };

  // Render Connections manually if needed (legacy visual workflow logic)
  // This logic is preserved from the original file to ensure custom connection types rendering
  const renderBpmnConnections = () => {
    // Build a unique list of connections from nodes[].connections
    const connectionItems = [];
    const seen = new Set();
    nodes.forEach((n) => {
      const arr = Array.isArray(n.connections) ? n.connections : [];
      arr.forEach((c) => {
        // Semantics reversed: toNodeId is visual source, fromNodeId is visual target
        const sourceId = c.toNodeId ? String(c.toNodeId) : String(n.id);
        const targetId = String(c.fromNodeId);
        const key = `${sourceId}-${targetId}-${c.fromHandle || ''}-${c.toHandle || ''}`;
        if (seen.has(key)) return;
        seen.add(key);

        // Find source and target nodes by serverId or client ID
        const sourceNode = nodes.find(sn =>
          String(sn.data?.serverId) === String(sourceId) ||
          String(sn.id) === String(sourceId)
        );
        const targetNode = nodes.find(tn =>
          String(tn.data?.serverId) === String(targetId) ||
          String(tn.id) === String(targetId)
        );

        if (sourceNode && targetNode) {
          connectionItems.push({
            id: key,
            source: sourceNode.id, // Use client ID for source
            target: targetNode.id, // Use client ID for target
            connection_type: c.connection_type || c.type,
            fromHandle: c.toHandle, // swap for visual rendering
            toHandle: c.fromHandle,
            style: c.style, // Include the backend style data
            label: c.label,
            metadata: c.metadata,
            isConditional: c.isConditional,
            fromNodeId: c.fromNodeId,
            toNodeId: c.toNodeId
          });
        }
      });
    });

    if (connectionItems.length === 0) return null;

    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {connectionItems.map((conn) => {
          const findNodeByAnyId = (val) =>
            nodes.find(nn => String(nn.id) === String(val) || String(nn.data?.serverId) === String(val));
          const sourceNode = findNodeByAnyId(conn.source);
          const targetNode = findNodeByAnyId(conn.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <ConnectionLine
              key={conn.id}
              connection={conn}
              sourceNode={sourceNode}
              targetNode={targetNode}
              zoom={viewport.zoom}
              position={{ x: viewport.x, y: viewport.y }}
              isSelected={false}
              readOnly={true}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden" 
      ref={canvasRef}
      style={{
        backgroundColor: '#0a0e27',
        backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(0, 210, 255, 0.08) 0%, transparent 50%)',
      }}
    >
      {/* Animated accent background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute top-0 -right-40 w-96 h-96 bg-gradient-to-br from-magenta-500 to-pink-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-full mix-blend-screen filter blur-3xl animate-pulse" style={{ animationDuration: '9s', animationDelay: '4s' }}></div>
      </div>

      <ReactFlow
        nodes={nodes || []}
        edges={edges || []}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onInit={handleInit}
        onNodeClick={onNodeClick}
        onNodeDoubleClick={onNodeDoubleClick}
        nodeTypes={nodeTypes}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        className="transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(15, 18, 45, 0.95) 50%, rgba(8, 12, 35, 0.95) 100%)'
        }}
        fitView
        attributionPosition="bottom-left"
        connectionMode={ConnectionMode.Loose}
        snapToGrid={true}
        snapGrid={[15, 15]}
        nodesDraggable={nodesDraggable !== undefined ? nodesDraggable : false}
        nodesConnectable={false}
        elementsSelectable={true}
        onSelectionChange={onSelectionChange}
        onMove={(_, v) => setViewport(v)}
        onMoveEnd={(_, v) => setViewport(v)}
        multiSelectionKeyCode={null}
        selectionOnDrag={false}
        panOnDrag={true}
        minZoom={0.5}
        maxZoom={2}
        deleteKeyCode={null}
        onPaneClick={onPaneClick}
      >
        {renderBpmnConnections()}

        <Controls
          className="overflow-hidden"
          position="bottom-left"
          style={{ 
            bottom: '20px', 
            left: '16px',
            backgroundColor: 'rgba(26, 32, 44, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 210, 255, 0.2)',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 210, 255, 0.15), 0 2px 8px rgba(255, 0, 255, 0.1)',
            padding: '4px'
          }}
        />
        {showBackground && (
          <Background
            color={backgroundVariant === BackgroundVariant.Dots ? 'rgba(0, 210, 255, 0.15)' : 'rgba(0, 210, 255, 0.1)'}
            gap={backgroundVariant === BackgroundVariant.Dots ? 16 : 20}
            size={backgroundVariant === BackgroundVariant.Dots ? 1.5 : 1}
            variant={backgroundVariant}
            style={{ 
              opacity: 0.3,
              transition: 'all 0.3s ease-in-out'
            }}
          />
        )}
        {showMiniMap && (
          <MiniMap
            style={{
              backgroundColor: 'rgba(26, 32, 44, 0.8)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 210, 255, 0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              width: 240,
              height: 180,
              boxShadow: '0 8px 32px rgba(0, 210, 255, 0.15), 0 2px 8px rgba(255, 0, 255, 0.1)'
            }}
            nodeColor={(node) => {
              if (selectedNodes.includes(node.id)) return '#ff00ff';
              return '#00d2ff';
            }}
            nodeBorderRadius={8}
            nodeStrokeWidth={2}
            nodeStrokeColor="rgba(255, 255, 255, 0.3)"
            maskColor="rgba(10, 14, 39, 0.8)"
            pannable={true}
            zoomable={true}
            position="bottom-right"
          />
        )}
        <Panel position="top-left" className="space-y-2" style={{ top: '16px', left: '16px', zIndex: 100 }}>
          <div className="rounded-2xl p-2 shadow-lg hover:shadow-xl transition-all duration-300" style={{
            backgroundColor: 'rgba(26, 32, 44, 0.8)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 210, 255, 0.2)'
          }}>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={zoomIn}
                className="h-10 w-10 p-0 text-cyan-400 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-md"
                style={{
                  backgroundColor: 'transparent',
                  ':hover': { backgroundColor: 'rgba(0, 210, 255, 0.2)' }
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Zoom In (Ctrl +)"
                disabled={isExecuting}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={zoomOut}
                className="h-10 w-10 p-0 text-cyan-400 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-md"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Zoom Out (Ctrl -)"
                disabled={isExecuting}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={fitView}
                className="h-10 w-10 p-0 text-cyan-400 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-md"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title="Fit View (Home)"
                disabled={isExecuting}
              >
                <Maximize className="w-5 h-5" />
              </button>
              <div className="w-px h-7 bg-gradient-to-b from-transparent via-cyan-400 to-transparent mx-1" style={{opacity: 0.3}}></div>
              <button
                type="button"
                onClick={() => setShowBackground(!showBackground)}
                className="h-10 w-10 p-0 text-cyan-400 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-md"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={showBackground ? 'Hide Background' : 'Show Background'}
                disabled={isExecuting}
              >
                <Eye className={`w-5 h-5 transition-opacity ${!showBackground ? 'opacity-50' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => setShowMiniMap(!showMiniMap)}
                className="h-10 w-10 p-0 text-cyan-400 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 hover:shadow-md"
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 210, 255, 0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                title={showMiniMap ? 'Hide Minimap' : 'Show Minimap'}
                disabled={isExecuting}
              >
                {showMiniMap ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {isExecuting && (
            <div className="rounded-2xl px-4 py-2.5 shadow-lg" style={{
              backgroundColor: 'rgba(26, 32, 44, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 210, 255, 0.4)',
              boxShadow: '0 4px 16px rgba(0, 210, 255, 0.15)'
            }}>
              <p className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                </span>
                Executing workflow...
              </p>
            </div>
          )}
          
          {showZoomIndicator && (
            <div className="rounded-2xl px-4 py-2 shadow-lg transition-all duration-300" style={{
              backgroundColor: 'rgba(26, 32, 44, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(0, 210, 255, 0.3)',
              animation: 'fadeIn 0.2s ease-in-out'
            }}>
              <p className="text-sm font-semibold text-cyan-400 flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-cyan-400" />
                <span className="font-mono">{Math.round(viewport.zoom * 100)}%</span>
              </p>
            </div>
          )}
        </Panel>
        
        {/* Advanced Info Panel - Bottom Left */}
        <Panel position="bottom-left" style={{ bottom: '20px', left: '200px', zIndex: 100 }}>
          <div className="rounded-2xl px-3 py-2 shadow-lg" style={{
            backgroundColor: 'rgba(26, 32, 44, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 210, 255, 0.3)'
          }}>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                <span className="font-medium text-cyan-300">{nodes.length} nodes</span>
              </div>
              <div className="w-px h-4" style={{backgroundColor: 'rgba(0, 210, 255, 0.2)'}}></div>
              <button
                onClick={cycleBackgroundVariant}
                className="flex items-center gap-1.5 font-medium text-cyan-300 hover:text-cyan-200 transition-colors"
                title="Cycle Grid Pattern"
              >
                <span className="text-xs">Grid: {backgroundVariant === BackgroundVariant.Dots ? 'Dots' : backgroundVariant === BackgroundVariant.Lines ? 'Lines' : 'Cross'}</span>
              </button>
            </div>
          </div>
        </Panel>
        
        {/* Keyboard Shortcuts Panel */}
        <Panel position="top-right" style={{ top: '16px', right: '16px', zIndex: 100 }}>
          <div className="space-y-2">
            <button
              onClick={() => setShowShortcuts(!showShortcuts)}
              className="rounded-2xl px-4 py-2 shadow-lg transition-all duration-300 hover:shadow-xl"
              style={{
                backgroundColor: 'rgba(26, 32, 44, 0.9)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0, 210, 255, 0.3)'
              }}
            >
              <span className="text-sm font-semibold text-cyan-400">⌨️ Shortcuts</span>
            </button>
            
            {showShortcuts && (
              <div className="rounded-2xl p-4 shadow-xl transition-all duration-300" style={{
                backgroundColor: 'rgba(26, 32, 44, 0.95)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(0, 210, 255, 0.3)',
                minWidth: '200px',
                animation: 'slideDown 0.2s ease-out'
              }}>
                <h3 className="text-xs font-bold text-cyan-400 mb-3 flex items-center gap-2">
                  <span>⌨️</span> Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Zoom In</span>
                    <kbd className="px-2 py-1 rounded font-mono text-cyan-300" style={{backgroundColor: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)'}}>Ctrl +</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Zoom Out</span>
                    <kbd className="px-2 py-1 rounded font-mono text-cyan-300" style={{backgroundColor: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)'}}>Ctrl -</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Fit View</span>
                    <kbd className="px-2 py-1 rounded font-mono text-cyan-300" style={{backgroundColor: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)'}}>Home</kbd>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-cyan-300">Pan Canvas</span>
                    <kbd className="px-2 py-1 rounded font-mono text-cyan-300" style={{backgroundColor: 'rgba(0, 210, 255, 0.1)', border: '1px solid rgba(0, 210, 255, 0.3)'}}>Drag</kbd>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};