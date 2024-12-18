export const mockCalendar = {
  "12.10.2024": {
    "8:00": { available: true },
    "9:00": { 
      available: false,
      appointment: {
        clientId: "c_001",
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
  "13.10.2024": {
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

export const mockBarbers = {
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

export const mockClients = {
  "c_001": {
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1234567890"
  },
  "c_002": {
    name: "Emma Davis",
    email: "emma.davis@example.com",
    phone: "+1234567891"
  },
  "c_003": {
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1234567892"
  },
  "c_004": {
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1234567893"
  }
}