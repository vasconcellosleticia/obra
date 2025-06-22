import api from "./api"

export const fiscalizacaoService = {
  // Get all fiscalizações with filters
  getFiscalizacoes: async (filters = {}) => {
    const params = new URLSearchParams()

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        params.append(key, filters[key])
      }
    })

    const response = await api.get(`/fiscalizacoes?${params.toString()}`)
    return response.data
  },

  // Get fiscalização by ID
  getFiscalizacaoById: async (id) => {
    const response = await api.get(`/fiscalizacoes/${id}`)
    return response.data
  },

  // Create new fiscalização
  createFiscalizacao: async (fiscalizacaoData) => {
    const response = await api.post("/fiscalizacoes", fiscalizacaoData)
    return response.data
  },

  // Update fiscalização
  updateFiscalizacao: async (id, fiscalizacaoData) => {
    const response = await api.put(`/fiscalizacoes/${id}`, fiscalizacaoData)
    return response.data
  },

  // Delete fiscalização
  deleteFiscalizacao: async (id) => {
    const response = await api.delete(`/fiscalizacoes/${id}`)
    return response.data
  },

  // Get fiscalizações statistics
  getFiscalizacoesStats: async () => {
    const response = await api.get("/fiscalizacoes/stats")
    return response.data
  },

  // Send fiscalização by email
  sendFiscalizacaoByEmail: async (fiscalizacaoId, email, message) => {
    const response = await api.post(`/email/fiscalizacao/${fiscalizacaoId}`, {
      email,
      message,
    })
    return response.data
  },
}
