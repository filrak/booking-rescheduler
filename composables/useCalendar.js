import { mockCalendar } from './utils/calendarMock'

// Constants
const STORAGE_KEY = 'calendar'

export const useCalendar = () => {
    const getCalendarData = () => {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : {}
    }

    const setCalendarData = (data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    const createFakeCalendar = () => {
        if (!localStorage.getItem(STORAGE_KEY)) {
            setCalendarData(mockCalendar)
        }
    }

    const getAppointment = (date, time) => {
        const data = getCalendarData()
        return data[date]?.[time] || null
    }

    const addAppointment = (date, time, appointmentData) => {
        const data = getCalendarData()
        
        if (!data[date]) {
            data[date] = {}
        }
        data[date][time] = {
            available: false,
            appointment: appointmentData
        }
        
        setCalendarData(data)
    }

    const removeAppointment = (date, time) => {
        const data = getCalendarData()
        
        if (data[date] && data[date][time]) {
            data[date][time] = {
                available: true
            }
            setCalendarData(data)
        }
    }

    const isTimeSlotAvailable = (date, time) => {
        const data = getCalendarData()
        return !data[date]?.[time] || data[date][time].available === true
    }

    const changeAppointment = (date, time, newAppointmentData, newDate, newTime) => {
        const data = getCalendarData()
        
        // If moving to a new time
        if (newTime && (newDate || time !== newTime)) {
            const targetDate = newDate || date
            
            // Check if the target time slot is available
            const isAvailable = isTimeSlotAvailable(targetDate, newTime)
            if (!isAvailable) {
                return false
            }
            
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
        
        setCalendarData(data)
        return true
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