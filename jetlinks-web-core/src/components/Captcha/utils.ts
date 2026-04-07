import type { Track, TrackData } from './captcha'

function throttleRAF(fn: Function) {
  let rafId: number | null = null
  let lastArgs: any[] = []

  return (...args: any[]) => {
    lastArgs = args
    if (rafId) return

    rafId = requestAnimationFrame(() => {
      fn(...lastArgs)
      rafId = null
    })
  }
}

function getPoint(event: MouseEvent | TouchEvent): { x: number; y: number } {
  if ('touches' in event) {
    const touch = event.touches[0] || event.changedTouches[0]
    return { x: Math.round(touch.clientX), y: Math.round(touch.clientY) }
  }
  return { x: Math.round(event.clientX), y: Math.round(event.clientY) }
}

export class TrackRecorder {
  private startTime: number = 0
  private trackList: Track[] = []
  private recordMove: ReturnType<typeof throttleRAF>

  constructor() {
    this.recordMove = throttleRAF(this.addTrack.bind(this, 'move'))
  }

  startTracking(event: MouseEvent | TouchEvent): void {
    this.startTime = Date.now()
    this.trackList = []
    const point = getPoint(event)
    this.addTrack('down', point)
  }

  handleMove(event: MouseEvent | TouchEvent): void {
    if (!this.startTime) return
    const point = getPoint(event)
    this.recordMove(point)
  }

  stopTracking(event: MouseEvent | TouchEvent): TrackData {
    if (!this.startTime) {
      throw new Error('Tracking not started')
    }

    const point = getPoint(event)
    this.addTrack('up', point)

    return {
      startTime: this.startTime,
      stopTime: Date.now(),
      trackList: this.trackList
    }
  }

  private addTrack(type: Track['type'], point: { x: number; y: number }): void {
    this.trackList.push({
      x: point.x,
      y: point.y,
      t: Date.now() - this.startTime,
      type
    })
  }
}
