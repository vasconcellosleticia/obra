"use client"

import { createContext, useContext, useReducer, useCallback } from "react"
import { obraService } from "../services/obraService"
import { fiscalizacaoService } from "../services/fiscalizacaoService"

// Initial state
const initialState = {
  obras: [],
  selectedObra: null,
  fiscalizacoes: [],
  selectedFiscalizacao: null,
  stats: null,
  loading: false,
  error: null,
  filters: {
    status: "",
    responsavel: "",
    search: "",
  },
}

// Action types
const ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  SET_OBRAS: "SET_OBRAS",
  SET_SELECTED_OBRA: "SET_SELECTED_OBRA",
  SET_FISCALIZACOES: "SET_FISCALIZACOES",
  SET_SELECTED_FISCALIZACAO: "SET_SELECTED_FISCALIZACAO",
  SET_STATS: "SET_STATS",
  ADD_OBRA: "ADD_OBRA",
  UPDATE_OBRA: "UPDATE_OBRA",
  DELETE_OBRA: "DELETE_OBRA",
  ADD_FISCALIZACAO: "ADD_FISCALIZACAO",
  UPDATE_FISCALIZACAO: "UPDATE_FISCALIZACAO",
  DELETE_FISCALIZACAO: "DELETE_FISCALIZACAO",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_SELECTED: "CLEAR_SELECTED",
  CLEAR_ERROR: "CLEAR_ERROR",
}

// Reducer
const obraReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false }

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }

    case ACTIONS.SET_OBRAS:
      return { ...state, obras: action.payload, loading: false, error: null }

    case ACTIONS.SET_SELECTED_OBRA:
      return { ...state, selectedObra: action.payload, loading: false }

    case ACTIONS.SET_FISCALIZACOES:
      return { ...state, fiscalizacoes: action.payload, loading: false, error: null }

    case ACTIONS.SET_SELECTED_FISCALIZACAO:
      return { ...state, selectedFiscalizacao: action.payload, loading: false }

    case ACTIONS.SET_STATS:
      return { ...state, stats: action.payload, loading: false, error: null }

    case ACTIONS.ADD_OBRA:
      return {
        ...state,
        obras: [action.payload, ...state.obras],
        loading: false,
        error: null,
      }

    case ACTIONS.UPDATE_OBRA:
      return {
        ...state,
        obras: state.obras.map((obra) => (obra._id === action.payload._id ? action.payload : obra)),
        selectedObra: action.payload,
        loading: false,
        error: null,
      }

    case ACTIONS.DELETE_OBRA:
      return {
        ...state,
        obras: state.obras.filter((obra) => obra._id !== action.payload),
        selectedObra: null,
        loading: false,
        error: null,
      }

    case ACTIONS.ADD_FISCALIZACAO:
      return {
        ...state,
        fiscalizacoes: [action.payload, ...state.fiscalizacoes],
        loading: false,
        error: null,
      }

    case ACTIONS.UPDATE_FISCALIZACAO:
      return {
        ...state,
        fiscalizacoes: state.fiscalizacoes.map((fisc) => (fisc._id === action.payload._id ? action.payload : fisc)),
        selectedFiscalizacao: action.payload,
        loading: false,
        error: null,
      }

    case ACTIONS.DELETE_FISCALIZACAO:
      return {
        ...state,
        fiscalizacoes: state.fiscalizacoes.filter((fisc) => fisc._id !== action.payload),
        selectedFiscalizacao: null,
        loading: false,
        error: null,
      }

    case ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } }

    case ACTIONS.CLEAR_SELECTED:
      return {
        ...state,
        selectedObra: null,
        selectedFiscalizacao: null,
        fiscalizacoes: [],
      }

    default:
      return state
  }
}

// Context
const ObraContext = createContext()

// Provider component
export const ObraProvider = ({ children }) => {
  const [state, dispatch] = useReducer(obraReducer, initialState)

  // Helper function to handle errors
  const handleError = useCallback((error) => {
    console.error("Obra Context Error:", error)
    dispatch({
      type: ACTIONS.SET_ERROR,
      payload: error.message || "Erro desconhecido",
    })
  }, [])

  // Fetch all obras
  const fetchObras = useCallback(
    async (filters = {}) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await obraService.getObras(filters)
        dispatch({ type: ACTIONS.SET_OBRAS, payload: response.data })
      } catch (error) {
        handleError(error)
      }
    },
    [handleError],
  )

  // Fetch obra by ID
  const fetchObraById = useCallback(
    async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await obraService.getObraById(id)
        dispatch({ type: ACTIONS.SET_SELECTED_OBRA, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Create obra
  const createObra = useCallback(
    async (obraData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await obraService.createObra(obraData)
        dispatch({ type: ACTIONS.ADD_OBRA, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Update obra
  const updateObra = useCallback(
    async (id, obraData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await obraService.updateObra(id, obraData)
        dispatch({ type: ACTIONS.UPDATE_OBRA, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Delete obra
  const deleteObra = useCallback(
    async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        await obraService.deleteObra(id)
        dispatch({ type: ACTIONS.DELETE_OBRA, payload: id })
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Fetch fiscalizações by obra
  const fetchFiscalizacoesByObra = useCallback(
    async (obraId) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await obraService.getFiscalizacoesByObra(obraId)
        dispatch({ type: ACTIONS.SET_FISCALIZACOES, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
      }
    },
    [handleError],
  )

  // Fetch fiscalização by ID
  const fetchFiscalizacaoById = useCallback(
    async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await fiscalizacaoService.getFiscalizacaoById(id)
        dispatch({ type: ACTIONS.SET_SELECTED_FISCALIZACAO, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Create fiscalização
  const createFiscalizacao = useCallback(
    async (fiscalizacaoData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await fiscalizacaoService.createFiscalizacao(fiscalizacaoData)
        dispatch({ type: ACTIONS.ADD_FISCALIZACAO, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Update fiscalização
  const updateFiscalizacao = useCallback(
    async (id, fiscalizacaoData) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        const response = await fiscalizacaoService.updateFiscalizacao(id, fiscalizacaoData)
        dispatch({ type: ACTIONS.UPDATE_FISCALIZACAO, payload: response.data })
        return response.data
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Delete fiscalização
  const deleteFiscalizacao = useCallback(
    async (id) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        await fiscalizacaoService.deleteFiscalizacao(id)
        dispatch({ type: ACTIONS.DELETE_FISCALIZACAO, payload: id })
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Fetch statistics
  const fetchStats = useCallback(async () => {
    try {
      console.log("🔄 Buscando estatísticas...")
      dispatch({ type: ACTIONS.SET_LOADING, payload: true })

      // Buscar apenas estatísticas de obras por enquanto
      const obrasResponse = await obraService.getObrasStats()
      console.log("📊 Estatísticas de obras:", obrasResponse)

      // Criar dados de fiscalizações vazios por enquanto
      const stats = {
        obras: obrasResponse.data,
        fiscalizacoes: {
          total: 0,
          recentes: 0,
          statusDistribution: [],
          monthlyDistribution: [],
        },
      }

      console.log("✅ Estatísticas processadas:", stats)
      dispatch({ type: ACTIONS.SET_STATS, payload: stats })
      return stats
    } catch (error) {
      console.error("❌ Erro ao buscar estatísticas:", error)
      handleError(error)
      throw error
    }
  }, [handleError])

  // Send obra by email
  const sendObraByEmail = useCallback(
    async (obraId, email, message) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        await obraService.sendObraByEmail(obraId, email, message)
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Send fiscalização by email
  const sendFiscalizacaoByEmail = useCallback(
    async (fiscalizacaoId, email, message) => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true })
        await fiscalizacaoService.sendFiscalizacaoByEmail(fiscalizacaoId, email, message)
        dispatch({ type: ACTIONS.SET_LOADING, payload: false })
      } catch (error) {
        handleError(error)
        throw error
      }
    },
    [handleError],
  )

  // Set filters
  const setFilters = useCallback((filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters })
  }, [])

  // Clear selected items
  const clearSelected = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_SELECTED })
  }, [])

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR })
  }, [])

  // Set selected obra
  const setSelectedObra = useCallback((obra) => {
    dispatch({ type: ACTIONS.SET_SELECTED_OBRA, payload: obra })
  }, [])

  // Set selected fiscalização
  const setSelectedFiscalizacao = useCallback((fiscalizacao) => {
    dispatch({ type: ACTIONS.SET_SELECTED_FISCALIZACAO, payload: fiscalizacao })
  }, [])

  const value = {
    // State
    obras: state.obras,
    selectedObra: state.selectedObra,
    fiscalizacoes: state.fiscalizacoes,
    selectedFiscalizacao: state.selectedFiscalizacao,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    filters: state.filters,

    // Actions
    fetchObras,
    fetchObraById,
    createObra,
    updateObra,
    deleteObra,
    fetchFiscalizacoesByObra,
    fetchFiscalizacaoById,
    createFiscalizacao,
    updateFiscalizacao,
    deleteFiscalizacao,
    fetchStats,
    sendObraByEmail,
    sendFiscalizacaoByEmail,
    setFilters,
    clearSelected,
    clearError,
    setSelectedObra,
    setSelectedFiscalizacao,
  }

  return <ObraContext.Provider value={value}>{children}</ObraContext.Provider>
}

// Hook to use the context
export const useObra = () => {
  const context = useContext(ObraContext)
  if (!context) {
    throw new Error("useObra must be used within an ObraProvider")
  }
  return context
}
