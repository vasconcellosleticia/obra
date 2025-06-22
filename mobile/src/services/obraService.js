import api from "./api"

export const obraService = {
  // Get all obras with filters
  getObras: async (filters = {}) => {
    const params = new URLSearchParams()

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        params.append(key, filters[key])
      }
    })

    const response = await api.get(`/obras?${params.toString()}`)
    return response.data
  },

  // Get obra by ID
  getObraById: async (id) => {
    const response = await api.get(`/obras/${id}`)
    return response.data
  },

  // Create new obra
  createObra: async (obraData) => {
    const response = await api.post("/obras", obraData)
    return response.data
  },

  // Update obra
  updateObra: async (id, obraData) => {
    const response = await api.put(`/obras/${id}`, obraData)
    return response.data
  },

  // Delete obra
  deleteObra: async (id) => {
    const response = await api.delete(`/obras/${id}`)
    return response.data
  },

  // Get fiscalizações by obra
  getFiscalizacoesByObra: async (obraId) => {
    const response = await api.get(`/obras/${obraId}/fiscalizacoes`)
    return response.data
  },

  // Get obras statistics
  getObrasStats: async () => {
    const response = await api.get("/obras/stats")
    return response.data
  },

  // Send obra by email
  sendObraByEmail: async (obraId, email, message) => {
    const response = await api.post(`/email/obra/${obraId}`, {
      email,
      message,
    })
    return response.data
  },
}
