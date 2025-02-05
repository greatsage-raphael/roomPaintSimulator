export const checkWebXRSupport = async (): Promise<boolean> => {
  if ('xr' in navigator) {
    try {
      const nav = navigator as any
      return await nav.xr.isSessionSupported('immersive-ar')
    } catch (error) {
      console.error('Error checking WebXR support:', error)
      return false
    }
  }
  return false
}

export const initializeWebXR = async (canvas: HTMLCanvasElement) => {
  try {
    const context = canvas.getContext('webgl2')
    if (!context) {
      throw new Error('WebGL 2 not supported')
    }

    const nav = navigator as any
    const xrSession = await nav.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test', 'local'],
      optionalFeatures: ['dom-overlay'],
    })
    
    return xrSession
    
    // Initialize WebXR session and set up render loop
    // This is where we'll add the AR rendering logic
  } catch (error) {
    console.error('Error initializing WebXR:', error)
  }
} 