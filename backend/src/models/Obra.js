const mongoose = require("mongoose")

const obraSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: [true, "Nome da obra é obrigatório"],
      trim: true,
      maxlength: [200, "Nome não pode exceder 200 caracteres"],
    },
    responsavel: {
      type: String,
      required: [true, "Responsável é obrigatório"],
      trim: true,
      maxlength: [100, "Nome do responsável não pode exceder 100 caracteres"],
    },
    dataInicio: {
      type: Date,
      required: [true, "Data de início é obrigatória"],
    },
    dataFim: {
      type: Date,
      required: [true, "Data de fim é obrigatória"],
      validate: {
        validator: function (value) {
          return value > this.dataInicio
        },
        message: "Data de fim deve ser posterior à data de início",
      },
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
    descricao: {
      type: String,
      required: [true, "Descrição é obrigatória"],
      trim: true,
      maxlength: [1000, "Descrição não pode exceder 1000 caracteres"],
    },
    foto: {
      type: String,
      required: [true, "Foto é obrigatória"],
    },
    status: {
      type: String,
      enum: ["Planejada", "Em Andamento", "Pausada", "Concluída", "Cancelada"],
      default: "Planejada",
    },
    orcamento: {
      type: Number,
      min: [0, "Orçamento deve ser um valor positivo"],
    },
    progresso: {
      type: Number,
      min: [0, "Progresso deve estar entre 0 e 100"],
      max: [100, "Progresso deve estar entre 0 e 100"],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

// Virtual para calcular duração da obra
obraSchema.virtual("duracao").get(function () {
  const diffTime = Math.abs(this.dataFim - this.dataInicio)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// Virtual para popular fiscalizações
obraSchema.virtual("fiscalizacoes", {
  ref: "Fiscalizacao",
  localField: "_id",
  foreignField: "obra",
})

// Middleware para atualizar status baseado na data
obraSchema.pre("save", function (next) {
  const now = new Date()

  if (this.dataInicio > now) {
    this.status = "Planejada"
  } else if (this.dataFim < now && this.status !== "Concluída" && this.status !== "Cancelada") {
    this.status = "Atrasada"
  }

  next()
})

// Índices para melhor performance
obraSchema.index({ nome: "text", descricao: "text" })
obraSchema.index({ status: 1 })
obraSchema.index({ dataInicio: 1, dataFim: 1 })
obraSchema.index({ "localizacao.latitude": 1, "localizacao.longitude": 1 })

module.exports = mongoose.model("Obra", obraSchema)
