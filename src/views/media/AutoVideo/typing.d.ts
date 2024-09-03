
export interface ScheduleOthers {
    trigger: string
    durations: Array<{ trigger: 'week'| 'calendar', from: string, to: string  }>
    retention: number
}

export interface Schedule {
    id: string
    name: string
    type: 'video' | 'photo'
    state:  Record<string, any>
    schedules: Array<any>
    saveDays: number,
    others: ScheduleOthers
}
