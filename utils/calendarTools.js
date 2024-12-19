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
    }
  ]

  const executeFunction = async (toolCall, calendar) => {
    const { name, arguments: argsString } = toolCall.function
    const args = JSON.parse(argsString)

    switch (name) {
      case 'addAppointment':
        await calendar.addAppointment(args.date, args.time, args.appointmentData)
        return `Appointment added for ${args.appointmentData.name} on ${args.date} at ${args.time}`
      
      case 'removeAppointment':
        await calendar.removeAppointment(args.date, args.time)
        return `Appointment removed for ${args.date} at ${args.time}`
      
      case 'changeAppointment':
        const success = await calendar.changeAppointment(
          args.date, 
          args.time, 
          args.newAppointmentData, 
          args.newDate,   
          args.newTime   
        )
        if (success) {
          return `Appointment successfully updated for ${args.date} at ${args.time}`
        } else {
          return `Could not update appointment - the requested time slot is already booked. Please choose a different time.`
        }
      
      default:
        throw new Error(`Unknown function: ${name}`)
    }
  }

  export { tools, executeFunction }