// wallDetection.ts
import * as tf from '@tensorflow/tfjs'

/**
 * Detects walls in the given image using brightness and edge detection.
 * @param image An HTMLImageElement to process.
 * @returns A Tensor representing the wall mask.
 */
export const detectWalls = async (image: HTMLImageElement): Promise<tf.Tensor> => {
  // Create a tensor from the image
  const tensor = tf.browser.fromPixels(image)

  // Convert the image to grayscale and normalize it.
  // The operations result in a tensor of shape: [1, height, width, 1]
  const grayscale: tf.Tensor4D = tf.tidy((): tf.Tensor4D => {
    const rgb = tensor.cast('float32').div(255)
    // Convert to grayscale using the luminance formula.
    // Steps:
    //   - Multiply each channel by its corresponding luminance coefficient.
    //   - Sum along the last axis to collapse the channels: [height, width]
    //   - Expand dims to add a channel axis: [height, width, 1]
    //   - Expand dims to add a batch axis: [1, height, width, 1]
    return rgb
      .mul([0.2989, 0.5870, 0.1140])
      .sum(-1)
      .expandDims(-1)
      .expandDims(0)
  })

  // Detect edges using Sobel operators.
  // This produces a tensor with the same shape: [1, height, width, 1]
  const edges: tf.Tensor4D = tf.tidy((): tf.Tensor4D => {
    // Define horizontal and vertical Sobel kernels.
    const sobelX: tf.Tensor2D = tf.tensor2d([[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]])
    const sobelY: tf.Tensor2D = tf.tensor2d([[-1, -2, -1], [0, 0, 0], [1, 2, 1]])

    // Apply convolutions using the Sobel kernels.
    const gx = tf.conv2d(
      grayscale as tf.Tensor4D,
      sobelX.expandDims(-1).expandDims(-1),
      1,
      'same'
    )
    const gy = tf.conv2d(
      grayscale as tf.Tensor4D,
      sobelY.expandDims(-1).expandDims(-1),
      1,
      'same'
    )

    // Compute the gradient magnitude (edge strength).
    return tf.sqrt(tf.add(tf.square(gx), tf.square(gy)))
  })

  // Create a wall mask by combining brightness and edge information.
  // Walls are assumed to be bright areas with smooth (low edge response) regions.
  const wallMask: tf.Tensor4D = tf.tidy((): tf.Tensor4D => {
    const brightnessThreshold = 0.6  // Threshold for bright areas (walls)
    const edgeThreshold = 0.1        // Threshold for low edge response

    // Determine areas that meet brightness and smoothness criteria.
    const brightAreas = grayscale.greater(brightnessThreshold)
    const smoothAreas = edges.less(edgeThreshold)

    // Combine both conditions to produce the wall mask.
    return brightAreas.logicalAnd(smoothAreas)
  })

  // Dispose of intermediate tensors to free memory.
  tensor.dispose()
  grayscale.dispose()
  edges.dispose()

  return wallMask
}
