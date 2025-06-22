const Obra = require('../models/Obra');
const Fiscalizacao = require('../models/Fiscalizacao');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { validationResult } = require('express-validator');

// @desc    Get all obras
// @route   GET /api/v1/obras
// @access  Public
const getObras = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    status,
    responsavel,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = req.query;

  // Build query
  const query = {};

  if (status) {
    query.status = status;
  }

  if (responsavel) {
    query.responsavel = { $regex: responsavel, $options: 'i' };
  }

  if (search) {
    query.$or = [
      { nome: { $regex: search, $options: 'i' } },
      { descricao: { $regex: search, $options: 'i' } },
      { responsavel: { $regex: search, $options: 'i' } },
    ];
  }

  // Execute query with pagination
  const obras = await Obra.find(query)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('fiscalizacoes');

  const total = await Obra.countDocuments(query);

  res.status(200).json({
    success: true,
    count: obras.length,
    total,
    pagination: {
      page: Number.parseInt(page),
      limit: Number.parseInt(limit),
      pages: Math.ceil(total / limit),
    },
    data: obras,
  });
});

// @desc    Get single obra
// @route   GET /api/v1/obras/:id
// @access  Public
const getObra = asyncHandler(async (req, res, next) => {
  const obra = await Obra.findById(req.params.id).populate('fiscalizacoes');

  if (!obra) {
    return next(new AppError('Obra não encontrada', 404));
  }

  res.status(200).json({
    success: true,
    data: obra,
  });
});

// @desc    Create new obra
// @route   POST /api/v1/obras
// @access  Public
const createObra = asyncHandler(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Dados inválidos', 400, errors.array()));
  }

  const obra = await Obra.create(req.body);

  res.status(201).json({
    success: true,
    data: obra,
  });
});

// @desc    Update obra
// @route   PUT /api/v1/obras/:id
// @access  Public
const updateObra = asyncHandler(async (req, res, next) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new AppError('Dados inválidos', 400, errors.array()));
  }

  const obra = await Obra.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!obra) {
    return next(new AppError('Obra não encontrada', 404));
  }

  res.status(200).json({
    success: true,
    data: obra,
  });
});

// @desc    Delete obra
// @route   DELETE /api/v1/obras/:id
// @access  Public
const deleteObra = asyncHandler(async (req, res, next) => {
  const obra = await Obra.findById(req.params.id);

  if (!obra) {
    return next(new AppError('Obra não encontrada', 404));
  }

  // Delete all related fiscalizações
  await Fiscalizacao.deleteMany({ obra: req.params.id });

  // Delete obra
  await obra.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
    message: 'Obra e fiscalizações relacionadas deletadas com sucesso',
  });
});

// @desc    Get fiscalizações by obra
// @route   GET /api/v1/obras/:id/fiscalizacoes
// @access  Public
const getFiscalizacoesByObra = asyncHandler(async (req, res, next) => {
  const obra = await Obra.findById(req.params.id);

  if (!obra) {
    return next(new AppError('Obra não encontrada', 404));
  }

  const fiscalizacoes = await Fiscalizacao.find({ obra: req.params.id }).sort({
    data: -1,
  });

  res.status(200).json({
    success: true,
    count: fiscalizacoes.length,
    data: fiscalizacoes,
  });
});

// @desc    Get obras statistics
// @route   GET /api/v1/obras/stats
// @access  Public
const getObrasStats = asyncHandler(async (req, res) => {
  // Estatísticas de obras
  const obraStats = await Obra.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProgresso: { $avg: '$progresso' },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalObras = await Obra.countDocuments();
  const obrasConcluidas = await Obra.countDocuments({ status: 'Concluída' });
  const obrasAtrasadas = await Obra.countDocuments({
    status: { $in: ['Atrasada', 'Pausada'] },
  });

  // Estatísticas de fiscalizações
  const fiscalizacaoStats = await Fiscalizacao.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  const totalFiscalizacoes = await Fiscalizacao.countDocuments();
  const fiscalizacoesRecentes = await Fiscalizacao.countDocuments({
    data: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Últimos 30 dias
  });

  // Distribuição mensal de fiscalizações
  const monthlyFiscalizacoes = await Fiscalizacao.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$data' },
          month: { $month: '$data' },
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': -1, '_id.month': -1 },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    success: true,
    data: {
      obras: {
        total: totalObras,
        concluidas: obrasConcluidas,
        atrasadas: obrasAtrasadas,
        porcentagemConclusao:
          totalObras > 0
            ? ((obrasConcluidas / totalObras) * 100).toFixed(2)
            : 0,
        statusDistribution: obraStats,
      },
      fiscalizacoes: {
        total: totalFiscalizacoes,
        recentes: fiscalizacoesRecentes,
        statusDistribution: fiscalizacaoStats,
        monthlyDistribution: monthlyFiscalizacoes,
      },
    },
  });
});

module.exports = {
  getObras,
  getObra,
  createObra,
  updateObra,
  deleteObra,
  getFiscalizacoesByObra,
  getObrasStats,
};
