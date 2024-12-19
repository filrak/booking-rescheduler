const tools = [
    {
      type: "function",
      function: {
        name: "addAppointment",
        description: "Add a new appointment to the calendar",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Date in YYYY-MM-DD format"
            },
            time: {
              type: "string",
              description: "Time in HH:MM format"
            },
            appointmentData: {
              type: "object",
              properties: {
                name: { type: "string", description: "Client name" },
                service: { type: "string", description: "Service type (Haircut, Beard Trim, Style)" }
              },
              required: ["name", "service"]
            }
          },
          required: ["date", "time", "appointmentData"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "removeAppointment",
        description: "Remove an existing appointment",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Date in YYYY-MM-DD format"
            },
            time: {
              type: "string",
              description: "Time in HH:MM format"
            }
          },
          required: ["date", "time"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "changeAppointment",
        description: "Modify an existing appointment, optionally moving it to a new time/date. Returns true if successful, false if the target time slot is already booked.",
        parameters: {
          type: "object",
          properties: {
            date: {
              type: "string",
              description: "Current date in DD.MM.YYYY format"
            },
            time: {
              type: "string",
              description: "Current time in HH:MM format"
            },
            newAppointmentData: {
              type: "object",
              properties: {
                name: { type: "string", description: "New client name" },
                service: { type: "string", description: "New service type" }
              }
            },
            newDate: {
              type: "string",
              description: "New date in DD.MM.YYYY format (optional)"
            },
            newTime: {
              type: "string",
              description: "New time in HH:MM format (optional)"
            }
          },
          required: ["date", "time", "newAppointmentData"]
        }
      }
    },
    {
      type: "function",
      function: {
        name: "askClientToReschedule",
        description: "Ask a client if they would be willing to reschedule their appointment",
        parameters: {
          type: "object",
          properties: {
            appointment: {
              type: "object",
              properties: {
                client: { type: "string", description: "Client name" },
                time: { type: "string", description: "Time of the appointment" },
                service: { type: "string", description: "Service type" }
              },
              required: ["client", "time", "service"]
            }
          },
          required: ["appointment"]
        }
      }
    }
  ]

  const executeFunction = async (toolCall, calendar) => {
    const { name, arguments: args } = toolCall.function
    const parsedArgs = typeof args === 'string' ? JSON.parse(args) : args

    switch (name) {
      case 'addAppointment':
        await calendar.addAppointment(parsedArgs.date, parsedArgs.time, parsedArgs.appointmentData)
        return `Appointment added for ${parsedArgs.appointmentData.name} on ${parsedArgs.date} at ${parsedArgs.time}`
      
      case 'removeAppointment':
        await calendar.removeAppointment(parsedArgs.date, parsedArgs.time)
        return `Appointment removed for ${parsedArgs.date} at ${parsedArgs.time}`
      
      case 'changeAppointment':
        const success = await calendar.changeAppointment(
          parsedArgs.date, 
          parsedArgs.time, 
          parsedArgs.newAppointmentData, 
          parsedArgs.newDate,   
          parsedArgs.newTime   
        )
        if (success) {
          const targetDate = parsedArgs.newDate || parsedArgs.date
          const targetTime = parsedArgs.newTime || parsedArgs.time
          return `Appointment successfully updated from ${parsedArgs.date} at ${parsedArgs.time} to ${targetDate} at ${targetTime} for ${parsedArgs.newAppointmentData.name} (${parsedArgs.newAppointmentData.service})`
        } else {
          return `Could not update appointment - the requested time slot is already booked. Please choose a different time.`
        }
      
      case 'askClientToReschedule': {
        const { askToReschedule } = useAskReschedule()
        return await askToReschedule(parsedArgs.appointment)
      }
      
      default:
        throw new Error(`Unknown function: ${name}`)
    }
  }

  export { tools, executeFunction }