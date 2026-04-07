const getZoom = (distance: number) => {
  const room = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
  ]

  const diffArr = [
    360,
    180,
    90,
    45,
    22,
    11,
    5,
    2.5,
    1.25,
    0.6,
    0.3,
    0.15,
    0.10,
    0.09,
    0.07,
    0.05,
    0.03,
    0
  ]

  for (let i = 0; i < diffArr.length; i++) {
    if (distance - diffArr[i] >= 0) {
      return i || 9;
    }
  }
  return 9
}

export const getCenterPoint = (points: any[]) => {
  let maxLng = points[0][0]
  let minLng = points[0][0]
  let maxLat = points[0][1]
  let minLat = points[0][1]

  for (let i = 0; i <points.length; i++) {
    const item = points[i]
    if (item[0] > maxLng) {
      maxLng = item[0]
    }
    if (item[0] < minLng) {
      minLng = item[0]
    }
    if (item[1] > maxLat) {
      maxLat = item[1]
    }
    if (item[1] < minLat) {
      minLat = item[1]
    }
  }

  return [
    [maxLng, maxLat],
    [minLng, minLat]
  ]
}
