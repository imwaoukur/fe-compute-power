export const computePowerByImage = (image: string, scale: number) => {
  return fetch('http://localhost:4000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      image,
      scale,
    }),
  })
}
