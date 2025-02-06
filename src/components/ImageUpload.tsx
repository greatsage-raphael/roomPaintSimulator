import { useRef, useState, useEffect } from 'react'
import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-webgl'
import { detectWalls } from '../utils/wallDetection'
import { applyPaintEffect } from '../utils/paintEffects'
import '../styles/ImageUpload.css'

interface ImageUploadProps {
  selectedColor: string
}

const ImageUpload = ({ selectedColor }: ImageUploadProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [wallMask, setWallMask] = useState<tf.Tensor | null>(null)

  useEffect(() => {
    const processImage = async () => {
      if (image && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        
        if (ctx) {
          const img = new Image()
          img.onload = async () => {
            // Set canvas dimensions
            canvas.width = img.width
            canvas.height = img.height
            
            // Draw original image
            ctx.drawImage(img, 0, 0)
            
            try {
              // Detect walls if we don't have a mask yet
              if (!wallMask) {
                const mask = await detectWalls(img)
                setWallMask(mask)
              }
              
              // Apply paint effect with the current color
              await applyPaintEffect(canvas, wallMask!, selectedColor, {
                roughness: 0.7,
                metalness: 0.1,
                ambient: 0.2,
                diffuse: 0.8
              })
            } catch (error) {
              console.error('Error processing image:', error)
            }
          }
          img.src = image
        }
      }
    }

    processImage()
  }, [selectedColor, image, wallMask])

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setImage(imageUrl)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="image-upload-container">
      {!image ? (
        <div className="upload-prompt">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            id="image-upload"
            className="hidden"
          />
          <label htmlFor="image-upload" className="upload-button">
            Upload Image
          </label>
          <p>Upload a photo to visualize paint colors</p>
        </div>
      ) : (
        <canvas ref={canvasRef} className="image-canvas" />
      )}
    </div>
  )
}

export default ImageUpload 