'use client'

import { useState } from 'react'

interface FitScaleSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  description?: string
  showLabels?: boolean
}

const FIT_SCALE_LABELS: Record<string, string> = {
  '-2': 'Runs Small (-2)',
  '-1': 'Slightly Small (-1)',
  '0': 'True to Size',
  '1': 'Slightly Large (+1)',
  '2': 'Runs Large (+2)',
}

const FIT_SCALE_EMOJIS: Record<string, string> = {
  '-2': '📏',
  '-1': '📐',
  '0': '✅',
  '1': '🤏',
  '2': '👕',
}

export function FitScaleSlider({ 
  value, 
  onChange, 
  label = 'Fit Scale',
  description = 'How does this item fit compared to the size label?',
  showLabels = true,
}: FitScaleSliderProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      
      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
        {/* Visual indicator */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">
            {FIT_SCALE_EMOJIS[value.toString()]}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {FIT_SCALE_LABELS[value.toString()]}
          </p>
        </div>

        {/* Slider */}
        <input
          type="range"
          min="-2"
          max="2"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f97316 25%, #10b981 50%, #3b82f6 75%, #6366f1 100%)`,
          }}
        />

        {/* Scale labels */}
        {showLabels && (
          <div className="flex justify-between text-xs text-gray-600 mt-3 px-1">
            <span>Runs Small</span>
            <span>True Size</span>
            <span>Runs Large</span>
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-5 gap-2 mt-6 text-xs">
          {['-2', '-1', '0', '1', '2'].map((scale) => (
            <button
              key={scale}
              onClick={() => onChange(parseInt(scale))}
              className={`py-2 px-1 rounded text-center transition-all ${
                value === parseInt(scale)
                  ? 'bg-[#5f6651] text-white font-semibold'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="text-base mb-1">
                {FIT_SCALE_EMOJIS[scale]}
              </div>
              <div className="font-medium">{scale}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Add CSS for range slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #5f6651;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: 3px solid #5f6651;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .slider::-webkit-slider-runnable-track {
          height: 8px;
          background: linear-gradient(
            to right,
            #ef4444 0%,
            #f97316 25%,
            #10b981 50%,
            #3b82f6 75%,
            #6366f1 100%
          );
          border-radius: 4px;
        }

        .slider::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  )
}

export default FitScaleSlider
