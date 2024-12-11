const mockCalendar = {
  today: {
    "8:00": { available: true },
    "9:00": { 
      available: false,
      appointment: {
        client: "John Smith",
        service: "Haircut & Beard Trim",
        barber: "Mike"
      }
    },
    "10:00": { available: true },
    "11:00": { 
      available: false,
      appointment: {
        client: "Emma Davis",
        service: "Men's Haircut",
        barber: "Mike"
      }
    },
    "12:00": { available: true }
  },
  tomorrow: {
    "8:00": { available: true },
    "9:00": { available: true },
    "10:00": { 
      available: false,
      appointment: {
        client: "Michael Brown",
        service: "Beard Trim",
        barber: "Steve"
      }
    },
    "11:00": { 
      available: false,
      appointment: {
        client: "Sarah Wilson",
        service: "Haircut & Style",
        barber: "Steve"
      }
    },
    "12:00": { available: true }
  }
}

const mockBarbers = {
  "Mike": {
    email: "mike@barbershop.com",
    specialties: ["Haircut", "Beard Trim"],
    workingHours: ["8:00", "12:00"],
    flexibility: "medium"
  },
  "Steve": {
    email: "steve@barbershop.com",
    specialties: ["Haircut", "Style", "Beard Trim"],
    workingHours: ["8:00", "12:00"],
    flexibility: "high"
  }
} 