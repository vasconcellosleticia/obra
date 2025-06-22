const express = require("express")
const { body } = require("express-validator")
const {
  getFiscalizacoes,
  getFiscalizacao,
  createFiscalizacao,
  updateFiscalizacao,
  deleteFiscalizacao,
  getFiscalizacoesStats,
} = require("../controllers/fiscalizacaoController")

const router = express.Router()

// Validation rules
const fiscalizacaoValidation = [
  body("data").optional().isISO8601().withMessage("Data deve ser uma data válida"),
  body("status")
    .isIn(["Em dia", "Atrasada", "Parada", "Concluída"])
    .withMessage("Status deve ser: Em dia, Atrasada, Parada ou Concluída"),
  body("observacoes")
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Observações devem ter entre 10 e 2000 caracteres"),
  body("localizacao.latitude").isFloat({ min: -90, max: 90 }).withMessage("Latitude deve estar entre -90 e 90"),
  body("localizacao.longitude").isFloat({ min: -180, max: 180 }).withMessage("Longitude deve estar entre -180 e 180"),
  body("foto").notEmpty().withMessage("Foto é obrigatória"),
  body("obra").isMongoId().withMessage("ID da obra deve ser válido"),
  body("fiscal.nome")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Nome do fiscal deve ter entre 3 e 100 caracteres"),
  body("fiscal.registro")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Registro não pode exceder 50 caracteres"),
  body("temperatura")
    .optional()
    .isFloat({ min: -50, max: 60 })
    .withMessage("Temperatura deve estar entre -50°C e 60°C"),
  body("condicaoClimatica")
    .optional()
    .isIn(["Ensolarado", "Nublado", "Chuvoso", "Tempestade", "Neblina"])
    .withMessage("Condição climática inválida"),
  body("nivelRisco").optional().isIn(["Baixo", "Médio", "Alto", "Crítico"]).withMessage("Nível de risco inválido"),
]

// Routes
router.route("/stats").get(getFiscalizacoesStats)
router.route("/").get(getFiscalizacoes).post(fiscalizacaoValidation, createFiscalizacao)

router.route("/:id").get(getFiscalizacao).put(fiscalizacaoValidation, updateFiscalizacao).delete(deleteFiscalizacao)

module.exports = router
