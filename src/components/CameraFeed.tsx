import { useEffect, useRef } from 'react'
import { initializeWebXR } from '../utils/webXRUtils'
import '../styles/CameraFeed.css'

interface CameraFeedProps {
  selectedColor: string
}

const CameraFeed = ({ selectedColor }: CameraFeedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      initializeWebXR(canvasRef.current)
    }
  }, [])

  return (
    <div className="camera-feed-container">
      <canvas ref={canvasRef} className="camera-canvas" />
    </div>
  )
}

export default CameraFeed 