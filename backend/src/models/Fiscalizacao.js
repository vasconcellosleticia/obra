const mongoose = require("mongoose")

const fiscalizacaoSchema = new mongoose.Schema(
  {
    data: {
      type: Date,
      required: [true, "Data da fiscalização é obrigatória"],
      default: Date.now,
    },
    status: {
      type: String,
      required: [true, "Status é obrigatório"],
      enum: {
        values: ["Em dia", "Atrasada", "Parada", "Concluída"],
        message: "Status deve ser: Em dia, Atrasada, Parada ou Concluída",
      },
    },
    observacoes: {
      type: String,
      required: [true, "Observações são obrigatórias"],
      trim: true,
      maxlength: [2000, "Observações não podem exceder 2000 caracteres"],
    },
    localizacao: {
      latitude: {
        type: Number,
        required: [true, "Latitude é obrigatória"],
        min: [-90, "Latitude deve estar entre -90 e 90"],
        max: [90, "Latitude deve estar entre -90 e 90"],
      },
      longitude: {
        type: Number,
        required: [true, "Longitude é obrigatória"],
        min: [-180, "Longitude deve estar entre -180 e 180"],
        max: [180, "Longitude deve estar entre -180 e 180"],
      },
    },
    foto: {
      type: String,
      required: [true, "Foto é obrigatória"],
    },
    obra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Obra",
      required: [true, "Obra relacionada é obrigatória"],
    },
    fiscal: {
      nome: {
        type: String,
        required: [true, "Nome do fiscal é obrigatório"],
        trim: true,
        maxlength: [100, "Nome do fiscal não pode exceder 100 caracteres"],
      },
      registro: {
        type: String,
        trim: true,
        maxlength: [50, "Registro não pode exceder 50 caracteres"],
      },
    },
    temperatura: {
      type: Number,
      min: [-50, "Temperatura deve estar entre -50°C e 60°C"],
      max: [60, "Temperatura deve estar entre -50°C e 60°C"],
    },
    condicaoClimatica: {
      type: String,
      enum: ["Ensolarado", "Nublado", "Chuvoso", "Tempestade", "Neblina"],
      default: "Ensolarado",
    },
    nivelRisco: {
      type: String,
      enum: ["Baixo", "Médio", "Alto", "Crítico"],
      default: "Baixo",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual para calcular dias desde a fiscalização
fiscalizacaoSchema.virtual("diasDesde").get(function () {
  const now = new Date()
  const diffTime = Math.abs(now - this.data)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Middleware para popular obra automaticamente
fiscalizacaoSchema.pre(/^find/, function (next) {
  this.populate({
    path: "obra",
    select: "nome responsavel status",
  })
  next()
})

// Índices para melhor performance
fiscalizacaoSchema.index({ obra: 1, data: -1 })
fiscalizacaoSchema.index({ status: 1 })
fiscalizacaoSchema.index({ data: -1 })
fiscalizacaoSchema.index({ "localizacao.latitude": 1, "localizacao.longitude": 1 })

module.exports = mongoose.model("Fiscalizacao", fiscalizacaoSchema)
