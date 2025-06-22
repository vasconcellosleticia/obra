const express = require("express")
const { body } = require("express-validator")
const {
  getObras,
  getObra,
  createObra,
  updateObra,
  deleteObra,
  getFiscalizacoesByObra,
  getObrasStats,
} = require("../controllers/obraController")

const router = express.Router()

// Validation rules
const obraValidation = [
  body("nome").trim().isLength({ min: 3, max: 200 }).withMessage("Nome deve ter entre 3 e 200 caracteres"),
  body("responsavel")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Responsável deve ter entre 3 e 100 caracteres"),
  body("dataInicio").isISO8601().withMessage("Data de início deve ser uma data válida"),
  body("dataFim")
    .isISO8601()
    .withMessage("Data de fim deve ser uma data válida")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.dataInicio)) {
        throw new Error("Data de fim deve ser posterior à data de início")
      }
      return true
    }),
  body("localizacao.latitude").isFloat({ min: -90, max: 90 }).withMessage("Latitude deve estar entre -90 e 90"),
  body("localizacao.longitude").isFloat({ min: -180, max: 180 }).withMessage("Longitude deve estar entre -180 e 180"),
  body("descricao")
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage("Descrição deve ter entre 10 e 1000 caracteres"),
  body("foto").notEmpty().withMessage("Foto é obrigatória"),
  body("status")
    .optional()
    .isIn(["Planejada", "Em Andamento", "Pausada", "Concluída", "Cancelada"])
    .withMessage("Status inválido"),
  body("orcamento").optional().isFloat({ min: 0 }).withMessage("Orçamento deve ser um valor positivo"),
  body("progresso").optional().isFloat({ min: 0, max: 100 }).withMessage("Progresso deve estar entre 0 e 100"),
]

// Routes
router.route("/stats").get(getObrasStats)
router.route("/").get(getObras).post(obraValidation, createObra)

router.route("/:id").get(getObra).put(obraValidation, updateObra).delete(deleteObra)

router.route("/:id/fiscalizacoes").get(getFiscalizacoesByObra)

module.exports = router
