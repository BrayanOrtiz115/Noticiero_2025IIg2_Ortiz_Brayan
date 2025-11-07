import React, { useState, useEffect, useRef } from 'react';

const ElementInspector = ({ children, buttonPosition = 'top-right' }) => {
  // ... (todo el contenido que ya tienes)

  return (
    <div className="relative">
      {children}
      
      {/* Toggle Inspector Button */}
      <button
        ref={buttonRef}
        onClick={toggleInspector}
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
        data-inspector-ui
        className={`z-50 px-3 h-10 bg-green-600 text-white rounded-lg shadow-lg hover:bg-green-600/90 transition-colors flex items-center justify-center gap-2 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={getButtonStyle()}
        title={isInspecting ? "Stop Inspecting" : "Start Inspecting"}
      >
        <span className="text-sm font-medium whitespace-nowrap">Editar</span>
        {isInspecting ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20.71 7.04c.39-.39.39-1.04 0-1.41l-2.34-2.34c-.37-.39-1.02-.39-1.41 0l-1.84 1.83l3.75 3.75M3 17.25V21h3.75L17.81 9.93l-3.75-3.75z"/>
          </svg>
        )}
      </button>
      
      {/* AI Input Panel */}
      {showAIInput && selectedElement && (
        <div 
          className="fixed z-50 transition-all duration-200" 
          data-inspector-ui
          data-ai-input-panel
          style={{ 
            width: '320px',
            top: `${ getElementPosition().top }px`, 
            left: `${ getElementPosition().left }px`,
            visibility: 'hidden',
            opacity: '0'
          }}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-xl">
            <div className="flex items-center gap-2 p-3">
              <button
                onClick={closeAIInput}
                className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors rounded-sm hover:bg-gray-100"
                title="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="¿Qué quieres cambiar?"
                className="flex-1 px-3 py-1 text-black text-[16px] border-0 focus:outline-none placeholder-gray-400"
                disabled={isProcessing}
                autoFocus
              />
              <button
                onClick={processAIRequest}
                disabled={!aiPrompt.trim() || isProcessing}
                className="px-2 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {isProcessing ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-spin">
                    <path d="M8 1.5V4.5M8 11.5V14.5M3.75 3.75L5.85 5.85M10.15 10.15L12.25 12.25M1.5 8H4.5M11.5 8H14.5M3.75 12.25L5.85 10.15M10.15 5.85L12.25 3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3L13 8L11.5 9.5L9 7V13H7V7L4.5 9.5L3 8L8 3Z" fill="currentColor"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElementInspector; // ✅ Asegúrate de que tenga esta línea