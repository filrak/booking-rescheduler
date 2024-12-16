import { LocalStoragePreset } from 'lowdb/browser'
import { mockCalendar } from './calendar_mock'

export const useCalendar = () => {
    const createFakeCalendar = async () => {
        await LocalStoragePreset('calendar', mockCalendar)
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

    const changeAppointment = async (date, time, newAppointmentData) => {
        const db = await LocalStoragePreset('calendar', mockCalendar)
        
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

    return {
        createFakeCalendar,
        addAppointment,
        removeAppointment,
        changeAppointment
    }
}