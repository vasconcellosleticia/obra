import { format, parseISO, isValid } from "date-fns"
import { ptBR } from "date-fns/locale"

export const formatDate = (date) => {
  try {
    if (!date) return ""

    const dateObj = typeof date === "string" ? parseISO(date) : date

    if (!isValid(dateObj)) return ""

    return format(dateObj, "dd/MM/yyyy", { locale: ptBR })
  } catch (error) {
    console.error("Error formatting date:", error)
    return ""
  }
}

export const formatDateTime = (date) => {
  try {
    if (!date) return ""

    const dateObj = typeof date === "string" ? parseISO(date) : date

    if (!isValid(dateObj)) return ""

    return format(dateObj, "dd/MM/yyyy HH:mm", { locale: ptBR })
  } catch (error) {
    console.error("Error formatting datetime:", error)
    return ""
  }
}

export const formatCurrency = (value) => {
  try {
    if (value === null || value === undefined) return "R$ 0,00"

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return "R$ 0,00"
  }
}

export const formatPercentage = (value) => {
  try {
    if (value === null || value === undefined) return "0%"

    return `${value.toFixed(1)}%`
  } catch (error) {
    console.error("Error formatting percentage:", error)
    return "0%"
  }
}

export const getStatusColor = (status) => {
  const statusColors = {
    Planejada: "#6b7280",
    "Em Andamento": "#2563eb",
    Pausada: "#f59e0b",
    Concluída: "#059669",
    Cancelada: "#dc2626",
    Atrasada: "#dc2626",
    "Em dia": "#059669",
    Parada: "#f59e0b",
  }

  return statusColors[status] || "#6b7280"
}

export const getStatusIcon = (status) => {
  const statusIcons = {
    Planejada: "schedule",
    "Em Andamento": "construction",
    Pausada: "pause",
    Concluída: "check-circle",
    Cancelada: "cancel",
    Atrasada: "warning",
    "Em dia": "check-circle",
    Parada: "pause-circle-filled",
  }

  return statusIcons[status] || "help"
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ""

  if (text.length <= maxLength) return text

  return text.substring(0, maxLength) + "..."
}

export const formatCoordinates = (latitude, longitude) => {
  if (!latitude || !longitude) return ""

  return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
}
