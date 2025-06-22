const Fiscalizacao = require("../models/Fiscalizacao")
const Obra = require("../models/Obra")
const asyncHandler = require("../utils/asyncHandler")
const AppError = require("../utils/AppError")
const { validationResult } = require("express-validator")

// @desc    Get all fiscalizações
// @route   GET /api/v1/fiscalizacoes
// @access  Public
const getFiscalizacoes = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, obra, dataInicio, dataFim, sortBy = "data", sortOrder = "desc" } = req.query

  // Build query
  const query = {}

  if (status) {
    query.status = status
  }

  if (obra) {
    query.obra = obra
  }

  if (dataInicio || dataFim) {
    query.data = {}
    if (dataInicio) {
      query.data.$gte = new Date(dataInicio)
    }
    if (dataFim) {
      query.data.$lte = new Date(dataFim)
    }
  }

  // Execute query with pagination
  const fiscalizacoes = await Fiscalizacao.find(query)
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)

  const total = await Fiscalizacao.countDocuments(query)

  res.status(200).json({
    success: true,
    count: fiscalizacoes.length,
    total,
    pagination: {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / limit),
    },
    data: fiscalizacoes,
  })
})

// @desc    Get single fiscalização
// @route   GET /api/v1/fiscalizacoes/:id
// @access  Public
const getFiscalizacao = asyncHandler(async (req, res, next) => {
  const fiscalizacao = await Fiscalizacao.findById(req.params.id)

  if (!fiscalizacao) {
    return next(new AppError("Fiscalização não encontrada", 404))
  }

  res.status(200).json({
    success: true,
    data: fiscalizacao,
  })
})

// @desc    Create new fiscalização
// @route   POST /api/v1/fiscalizacoes
// @access  Public
const createFiscalizacao = asyncHandler(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new AppError("Dados inválidos", 400, errors.array()))
  }

  // Verify if obra exists
  const obra = await Obra.findById(req.body.obra)
  if (!obra) {
    return next(new AppError("Obra não encontrada", 404))
  }

  const fiscalizacao = await Fiscalizacao.create(req.body)

  res.status(201).json({
    success: true,
    data: fiscalizacao,
  })
})

// @desc    Update fiscalização
// @route   PUT /api/v1/fiscalizacoes/:id
// @access  Public
const updateFiscalizacao = asyncHandler(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new AppError("Dados inválidos", 400, errors.array()))
  }

  const fiscalizacao = await Fiscalizacao.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!fiscalizacao) {
    return next(new AppError("Fiscalização não encontrada", 404))
  }

  res.status(200).json({
    success: true,
    data: fiscalizacao,
  })
})

// @desc    Delete fiscalização
// @route   DELETE /api/v1/fiscalizacoes/:id
// @access  Public
const deleteFiscalizacao = asyncHandler(async (req, res, next) => {
  const fiscalizacao = await Fiscalizacao.findById(req.params.id)

  if (!fiscalizacao) {
    return next(new AppError("Fiscalização não encontrada", 404))
  }

  await fiscalizacao.deleteOne()

  res.status(200).json({
    success: true,
    data: {},
    message: "Fiscalização deletada com sucesso",
  })
})

// @desc    Get fiscalizações statistics
// @route   GET /api/v1/fiscalizacoes/stats
// @access  Public
const getFiscalizacoesStats = asyncHandler(async (req, res) => {
  const stats = await Fiscalizacao.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ])

  const totalFiscalizacoes = await Fiscalizacao.countDocuments()
  const fiscalizacoesRecentes = await Fiscalizacao.countDocuments({
    data: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  })

  const fiscalizacoesPorMes = await Fiscalizacao.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$data" },
          month: { $month: "$data" },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.year": -1, "_id.month": -1 },
    },
    {
      $limit: 12,
    },
  ])

  res.status(200).json({
    success: true,
    data: {
      total: totalFiscalizacoes,
      recentes: fiscalizacoesRecentes,
      statusDistribution: stats,
      monthlyDistribution: fiscalizacoesPorMes,
    },
  })
})

module.exports = {
  getFiscalizacoes,
  getFiscalizacao,
  createFiscalizacao,
  updateFiscalizacao,
  deleteFiscalizacao,
  getFiscalizacoesStats,
}
