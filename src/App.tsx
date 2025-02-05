import { useState, useEffect } from 'react'
import './App.css'
import CameraFeed from './components/CameraFeed'
import ColorPicker from './components/ColorPicker'
import SettingsPanel from './components/SettingsPanel'
import { checkWebXRSupport } from './utils/webXRUtils'

function App() {
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean>(false)
  const [selectedColor, setSelectedColor] = useState<string>('#FFFFFF')
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false)

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await checkWebXRSupport()
      setIsWebXRSupported(supported)
    }
    checkSupport()
  }, [])

  if (!isWebXRSupported) {
    return (
      <div className="error-container">
        <h2>WebXR Not Supported</h2>
        <p>Your browser doesn't support WebXR. Please use a compatible browser.</p>
      </div>
    )
  }

  return (
    <div className="app-container">
      <CameraFeed selectedColor={selectedColor} />
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
