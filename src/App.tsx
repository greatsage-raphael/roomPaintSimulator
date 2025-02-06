import { useState } from 'react'
import './App.css'
import ImageUpload from './components/ImageUpload'
import ColorPicker from './components/ColorPicker'
import SettingsPanel from './components/SettingsPanel'

function App() {
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  return (
    <div className="app-container">
      <ImageUpload selectedColor={selectedColor} />
      <div className="controls-container">
        <ColorPicker 
          selectedColor={selectedColor} 
          onColorChange={setSelectedColor} 
        />
        <button 
          className="settings-button"
          onClick={() => setIsSettingsOpen(true)}
        >
          Settings
        </button>
      </div>
      {isSettingsOpen && (
        <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
      )}
    </div>
  )
}

export default App
