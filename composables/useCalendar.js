import { LocalStoragePreset } from 'lowdb/browser'
import { mockCalendar } from './calendar_mock'

export const useCalendar = () => {
    const createFakeCalendar = async () => {
        await LocalStoragePreset('calendar', mockCalendar)
    }

    const getAppointment = async (date, time) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        const data = await db.data
        console.log(data, date, time)
        return data[date]?.[time] || null
    }

    const addAppointment = async (date, time, appointmentData) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        
        await db.update((data) => {
            if (!data[date]) {
                data[date] = {}
            }
            data[date][time] = {
                available: false,
                appointment: appointmentData
            }
        })
    }

    const removeAppointment = async (date, time) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        
        await db.update((data) => {
            if (data[date] && data[date][time]) {
                data[date][time] = {
                    available: true
                }
            }
        })
    }

    const changeAppointment = async (date, time, newAppointmentData, newDate, newTime) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        console.log(newAppointmentData, newDate, newTime)
        await db.update((data) => {
            // If moving to a new time (either with new date or just new time)
            if (newTime && (newDate || time !== newTime)) {
                // Use newDate if provided, otherwise use existing date
                const targetDate = newDate || date
                
                // Store the appointment data
                const appointmentData = data[date]?.[time]?.appointment
                
                // Remove from old slot
                if (data[date] && data[date][time]) {
                    data[date][time] = { available: true }
                }
                
                // Add to new slot
                if (!data[targetDate]) {
                    data[targetDate] = {}
                }
                data[targetDate][newTime] = {
                    available: false,
                    appointment: {
                        ...appointmentData,
                        ...newAppointmentData
                    }
                }
            } else {
                // Just update existing appointment data
                if (data[date] && data[date][time]) {
                    data[date][time] = {
                        available: false,
                        appointment: {
                            ...data[date][time].appointment,
                            ...newAppointmentData
                        }
                    }
                }
            }
        })
        console.log(db.data)
    }

    return {
        createFakeCalendar,
        getAppointment,
        addAppointment,
        removeAppointment,
        changeAppointment
    }
}