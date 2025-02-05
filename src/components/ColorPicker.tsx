import { useState } from 'react'
import '../styles/ColorPicker.css'

interface ColorPickerProps {
  selectedColor: string
  onColorChange: (color: string) => void
}

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  const [showPalette, setShowPalette] = useState(false)

  const predefinedColors = [
    '#FFFFFF', '#F5F5F5', '#E0E0E0', // Whites
    '#87CEEB', '#4682B4', '#1E90FF', // Blues
    '#90EE90', '#32CD32', '#228B22', // Greens
    '#FFB6C1', '#FF69B4', '#FF1493', // Pinks
  ]

  return (
    <div className="color-picker">
      <div 
        className="selected-color"
        style={{ backgroundColor: selectedColor }}
        onClick={() => setShowPalette(!showPalette)}
      />
      {showPalette && (
        <div className="color-palette">
          {predefinedColors.map((color) => (
            <div
              key={color}
              className="color-option"
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorChange(color)
                setShowPalette(false)
              }}
            />
          ))}
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onColorChange(e.target.value)}
            className="custom-color-input"
          />
        </div>
      )}
    </div>
  )
}

export default ColorPicker 