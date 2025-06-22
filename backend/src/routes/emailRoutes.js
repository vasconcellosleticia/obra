const express = require("express")
const { body } = require("express-validator")
const { sendObraByEmail, sendFiscalizacaoByEmail, sendObrasReportByEmail } = require("../controllers/emailController")

const router = express.Router()

// Validation rules
const emailValidation = [
  body("email").isEmail().withMessage("Email deve ser válido"),
  body("message").optional().trim().isLength({ max: 500 }).withMessage("Mensagem não pode exceder 500 caracteres"),
]

// Routes
router.post("/obra/:id", emailValidation, sendObraByEmail)
router.post("/fiscalizacao/:id", emailValidation, sendFiscalizacaoByEmail)
router.post("/relatorio-obras", emailValidation, sendObrasReportByEmail)

module.exports = router
