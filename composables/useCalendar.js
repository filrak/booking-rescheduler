import { LocalStoragePreset } from 'lowdb/browser'
import { mockCalendar } from './utils/calendarMock'

export const useCalendar = () => {
    const createFakeCalendar = async () => {
        await LocalStoragePreset('calendar', mockCalendar)
    }

    const getAppointment = async (date, time) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        const data = await db.data
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

    // Check if a time slot is available
    const isTimeSlotAvailable = async (date, time) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        const data = await db.data
        return !data[date]?.[time] || data[date][time].available === true
    }

    const changeAppointment = async (date, time, newAppointmentData, newDate, newTime) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        
        // If moving to a new time, check for conflicts
        if (newTime && (newDate || time !== newTime)) {
            const targetDate = newDate || date
            
            // Check if the target time slot is available
            const isAvailable = await isTimeSlotAvailable(targetDate, newTime)
            if (!isAvailable) {
                throw new Error('Selected time slot is already booked')
            }
            
            await db.update((data) => {
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
            })
        } else {
            // Just update existing appointment data
            await db.update((data) => {
                if (data[date] && data[date][time]) {
                    data[date][time] = {
                        available: false,
                        appointment: {
                            ...data[date][time].appointment,
                            ...newAppointmentData
                        }
                    }
                }
            })
        }
    }

    return {
        createFakeCalendar,
        getAppointment,
        addAppointment,
        removeAppointment,
        changeAppointment,
        isTimeSlotAvailable
    }
}