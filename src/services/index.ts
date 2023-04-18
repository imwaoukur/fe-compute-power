export const computePowerByImage = (image: string, scale: number) => {
  return fetch('http://localhost:8000/pixel-count/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image_data: image,
      resolution: scale,
    }),
  })
}
