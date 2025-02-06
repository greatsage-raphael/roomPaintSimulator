import { useEffect, useRef, useState } from 'react'
import { checkWebXRSupport, initializeWebXR } from '../utils/webXRUtils'
import '../styles/CameraFeed.css'

interface CameraFeedProps {
  selectedColor: string
}

const CameraFeed = ({ selectedColor: _ }: CameraFeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean>(true)

  useEffect(() => {
    const checkSupport = async () => {
      const supported = await checkWebXRSupport()
      setIsWebXRSupported(supported)
      
      if (supported && canvasRef.current) {
        initializeWebXR(canvasRef.current)
      }
    }
    
    checkSupport()
  }, [])

  if (!isWebXRSupported) {
    return (
      <div className="camera-feed-container">
        <p>WebXR Not Supported. Please use a compatible browser.</p>
      </div>
    )
  }

  return (
    <div className="camera-feed-container">
      <canvas ref={canvasRef} className="camera-canvas" />
    </div>
  )
}

export default CameraFeed 