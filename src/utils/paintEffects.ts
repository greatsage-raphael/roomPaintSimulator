import * as tf from '@tensorflow/tfjs'

interface PaintProperties {
  roughness: number
  metalness: number
  ambient: number
  diffuse: number
}

export const applyPaintEffect = async (
  canvas: HTMLCanvasElement,
  wallMask: tf.Tensor,
  color: string,
  properties: PaintProperties
) => {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // Get original image data
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const maskData = await wallMask.array() as number[][][]

  // Convert hex color to RGB
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  // Apply paint effect with lighting
  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = Math.floor((i / 4) % canvas.width)
    const y = Math.floor((i / 4) / canvas.width)
    
    if (maskData[y][x][0]) {  // If pixel is part of a wall
      // Calculate lighting factor based on original pixel brightness
      const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3
      const lightingFactor = (brightness / 255) * properties.diffuse + properties.ambient
      
      // Apply color with lighting and material properties
      imageData.data[i] = Math.min(255, r * lightingFactor * (1 - properties.metalness))
      imageData.data[i + 1] = Math.min(255, g * lightingFactor * (1 - properties.metalness))
      imageData.data[i + 2] = Math.min(255, b * lightingFactor * (1 - properties.metalness))
      
      // Add roughness effect
      const noise = (Math.random() - 0.5) * properties.roughness * 20
      imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise))
      imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise))
      imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise))
    }
  }

  ctx.putImageData(imageData, 0, 0)
} 