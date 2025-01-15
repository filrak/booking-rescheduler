import { mockCalendar } from './utils/calendarMock'

// Constants
const STORAGE_KEY = 'calendar'

export const useCalendar = () => {
    const getCalendarData = () => {
        console.log('Getting calendar data from storage')
        const data = localStorage.getItem(STORAGE_KEY)
        const parsedData = data ? JSON.parse(data) : {}
        console.log('Retrieved calendar data:', parsedData)
        return parsedData
    }

    const setCalendarData = (data) => {
        console.log('Setting calendar data:', data)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }

    const createFakeCalendar = () => {
        console.log('Creating fake calendar')
        if (!localStorage.getItem(STORAGE_KEY)) {
            console.log('Initializing with mock data:', mockCalendar)
            setCalendarData(mockCalendar)
        }
    }

    const getAppointment = (date, time) => {
        console.log('Getting appointment:', { date, time })
        const data = getCalendarData()
        const appointment = data[date]?.[time] || null
        console.log('Retrieved appointment:', appointment)
        return appointment
    }

    const addAppointment = (date, time, appointmentData) => {
        console.log('Adding appointment:', {
            date,
            time,
            appointmentData
        })
        const data = getCalendarData()
        
        if (!data[date]) {
            console.log('Creating new date entry:', date)
            data[date] = {}
        }
        data[date][time] = {
            available: false,
            appointment: appointmentData
        }
        
        setCalendarData(data)
        console.log('Appointment added successfully')
    }

    const removeAppointment = (date, time) => {
        console.log('Removing appointment:', { date, time })
        const data = getCalendarData()
        
        if (data[date] && data[date][time]) {
            console.log('Found appointment to remove')
            data[date][time] = {
                available: true
            }
            setCalendarData(data)
            console.log('Appointment removed successfully')
        } else {
            console.log('No appointment found to remove')
        }
    }

    const isTimeSlotAvailable = (date, time) => {
        console.log('Checking if time slot is available:', { date, time })
        const data = getCalendarData()
        const available = !data[date]?.[time] || data[date][time].available === true
        console.log('Time slot available:', available)
        return available
    }

    const changeAppointment = (date, time, newAppointmentData, newDate, newTime) => {
        console.log('Changing appointment:', {
            date,
            time,
            newAppointmentData,
            newDate,
            newTime
        })
        const data = getCalendarData()
        
        // If moving to a new time
        if (newTime && (newDate || time !== newTime)) {
            const targetDate = newDate || date
            
            // Check if the target time slot is available
            const isAvailable = isTimeSlotAvailable(targetDate, newTime)
            if (!isAvailable) {
                console.log('Target time slot is not available')
                return false
            }
            
            // Store the appointment data
            const appointmentData = data[date]?.[time]?.appointment
            
            // Remove from old slot
            if (data[date] && data[date][time]) {
                console.log('Removing from old slot')
                data[date][time] = { available: true }
            }
            
            // Add to new slot
            if (!data[targetDate]) {
                console.log('Creating new date entry:', targetDate)
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
                console.log('Updating existing appointment data')
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
        console.log('Appointment changed successfully')
        return true
    }

    return {
        getCalendarData,
        setCalendarData,
        createFakeCalendar,
        getAppointment,
        addAppointment,
        removeAppointment,
        isTimeSlotAvailable,
        changeAppointment
    }
}