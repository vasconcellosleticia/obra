const nodemailer = require('nodemailer');
const Obra = require('../models/Obra');
const Fiscalizacao = require('../models/Fiscalizacao');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Configure nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// @desc    Send obra details by email
// @route   POST /api/v1/email/obra/:id
// @access  Public
const sendObraByEmail = asyncHandler(async (req, res, next) => {
  const { email, message } = req.body;

  if (!email) {
    return next(new AppError('Email é obrigatório', 400));
  }

  // Get obra with fiscalizações
  const obra = await Obra.findById(req.params.id).populate('fiscalizacoes');

  if (!obra) {
    return next(new AppError('Obra não encontrada', 404));
  }

  // Create email content
  const emailContent = generateObraEmailContent(obra, message);

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Tecnosync - Sistema de Fiscalização de Obras',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `Fiscalização de Obras - Detalhes: ${obra.nome}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return next(new AppError('Erro ao enviar email', 500));
  }
});

// @desc    Send fiscalização details by email
// @route   POST /api/v1/email/fiscalizacao/:id
// @access  Public
const sendFiscalizacaoByEmail = asyncHandler(async (req, res, next) => {
  const { email, message } = req.body;

  if (!email) {
    return next(new AppError('Email é obrigatório', 400));
  }

  // Get fiscalização with obra
  const fiscalizacao = await Fiscalizacao.findById(req.params.id);

  if (!fiscalizacao) {
    return next(new AppError('Fiscalização não encontrada', 404));
  }

  // Create email content
  const emailContent = generateFiscalizacaoEmailContent(fiscalizacao, message);

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Tecnosync - Sistema de Fiscalização de Obras',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: `Fiscalização de Obras - Relatório: ${fiscalizacao.obra.nome}`,
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Email enviado com sucesso',
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return next(new AppError('Erro ao enviar email', 500));
  }
});

// @desc    Send multiple obras report by email
// @route   POST /api/v1/email/relatorio-obras
// @access  Public
const sendObrasReportByEmail = asyncHandler(async (req, res, next) => {
  const { email, filtros, message } = req.body;

  if (!email) {
    return next(new AppError('Email é obrigatório', 400));
  }

  // Build query based on filters
  const query = {};
  if (filtros?.status) {
    query.status = filtros.status;
  }
  if (filtros?.responsavel) {
    query.responsavel = { $regex: filtros.responsavel, $options: 'i' };
  }

  const obras = await Obra.find(query).populate('fiscalizacoes');

  // Create email content
  const emailContent = generateObrasReportEmailContent(obras, filtros, message);

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: {
        name: 'Tecnosync - Sistema de Fiscalização de Obras',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: 'Fiscalização de Obras - Relatório Geral',
      html: emailContent,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Relatório enviado com sucesso',
      count: obras.length,
    });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return next(new AppError('Erro ao enviar email', 500));
  }
});

// Helper function to generate obra email content
const generateObraEmailContent = (obra, customMessage) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 8px; }
        .label { font-weight: bold; color: #374151; }
        .status { padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .status.em-andamento { background-color: #dbeafe; color: #1d4ed8; }
        .status.concluida { background-color: #dcfce7; color: #166534; }
        .status.pausada { background-color: #fef3c7; color: #92400e; }
        .status.planejada { background-color: #f3f4f6; color: #374151; }
        .fiscalizacoes { margin-top: 20px; }
        .fiscalizacao-item { border-left: 4px solid #2563eb; padding: 10px; margin: 10px 0; background-color: #f8fafc; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TECNOSYNC</div>
          <h1>Sistema de Fiscalização de Obras</h1>
          <p>Detalhes da Obra</p>
        </div>
        
        <div class="content">
          ${
            customMessage
              ? `<div class="section"><p><strong>Mensagem:</strong> ${customMessage}</p></div>`
              : ''
          }
          
          <div class="section">
            <h2>${obra.nome}</h2>
            <p><span class="label">Responsável:</span> ${obra.responsavel}</p>
            <p><span class="label">Status:</span> <span class="status ${obra.status
              .toLowerCase()
              .replace(' ', '-')}">${obra.status}</span></p>
            <p><span class="label">Data de Início:</span> ${formatDate(
              obra.dataInicio
            )}</p>
            <p><span class="label">Previsão de Término:</span> ${formatDate(
              obra.dataFim
            )}</p>
            <p><span class="label">Progresso:</span> ${obra.progresso}%</p>
            <p><span class="label">Localização:</span> ${
              obra.localizacao.latitude
            }, ${obra.localizacao.longitude}</p>
            <p><span class="label">Descrição:</span> ${obra.descricao}</p>
          </div>
          
          ${
            obra.fiscalizacoes && obra.fiscalizacoes.length > 0
              ? `
            <div class="section">
              <h3>Fiscalizações Realizadas (${obra.fiscalizacoes.length})</h3>
              <div class="fiscalizacoes">
                ${obra.fiscalizacoes
                  .map(
                    (fisc) => `
                  <div class="fiscalizacao-item">
                    <p><strong>Data:</strong> ${formatDate(fisc.data)}</p>
                    <p><strong>Status:</strong> ${fisc.status}</p>
                    <p><strong>Observações:</strong> ${fisc.observacoes}</p>
                  </div>
                `
                  )
                  .join('')}
              </div>
            </div>
          `
              : ''
          }
        </div>
        
        <div class="footer">
          <p><strong>TECNOSYNC</strong> - Sistema de Fiscalização de Obras</p>
          <p>Este email foi gerado automaticamente</p>
          <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to generate fiscalização email content
const generateFiscalizacaoEmailContent = (fiscalizacao, customMessage) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 8px; }
        .label { font-weight: bold; color: #374151; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TECNOSYNC</div>
          <h1>Sistema de Fiscalização de Obras</h1>
          <p>Relatório de Fiscalização</p>
        </div>
        
        <div class="content">
          ${
            customMessage
              ? `<div class="section"><p><strong>Mensagem:</strong> ${customMessage}</p></div>`
              : ''
          }
          
          <div class="section">
            <h2>Obra: ${fiscalizacao.obra.nome}</h2>
            <p><span class="label">Data da Fiscalização:</span> ${formatDate(
              fiscalizacao.data
            )}</p>
            <p><span class="label">Status:</span> ${fiscalizacao.status}</p>
            <p><span class="label">Fiscal:</span> ${
              fiscalizacao.fiscal?.nome || 'Não informado'
            }</p>
            <p><span class="label">Localização:</span> ${
              fiscalizacao.localizacao.latitude
            }, ${fiscalizacao.localizacao.longitude}</p>
            <p><span class="label">Observações:</span> ${
              fiscalizacao.observacoes
            }</p>
            ${
              fiscalizacao.temperatura
                ? `<p><span class="label">Temperatura:</span> ${fiscalizacao.temperatura}°C</p>`
                : ''
            }
            ${
              fiscalizacao.condicaoClimatica
                ? `<p><span class="label">Condição Climática:</span> ${fiscalizacao.condicaoClimatica}</p>`
                : ''
            }
            ${
              fiscalizacao.nivelRisco
                ? `<p><span class="label">Nível de Risco:</span> ${fiscalizacao.nivelRisco}</p>`
                : ''
            }
          </div>
        </div>
        
        <div class="footer">
          <p><strong>TECNOSYNC</strong> - Sistema de Fiscalização de Obras</p>
          <p>Este email foi gerado automaticamente</p>
          <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Helper function to generate obras report email content
const generateObrasReportEmailContent = (obras, filtros, customMessage) => {
  const formatDate = (date) => new Date(date).toLocaleDateString('pt-BR');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #7c3aed; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9fafb; }
        .section { margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 8px; }
        .obra-item { border-left: 4px solid #7c3aed; padding: 15px; margin: 15px 0; background-color: #faf5ff; }
        .label { font-weight: bold; color: #374151; }
        .summary { display: flex; justify-content: space-around; text-align: center; }
        .summary-item { padding: 10px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; }
        .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">TECNOSYNC</div>
          <h1>Sistema de Fiscalização de Obras</h1>
          <p>Relatório Geral de Obras</p>
        </div>
        
        <div class="content">
          ${
            customMessage
              ? `<div class="section"><p><strong>Mensagem:</strong> ${customMessage}</p></div>`
              : ''
          }
          
          <div class="section">
            <h3>Resumo Executivo</h3>
            <div class="summary">
              <div class="summary-item">
                <h4>${obras.length}</h4>
                <p>Total de Obras</p>
              </div>
              <div class="summary-item">
                <h4>${
                  obras.filter((o) => o.status === 'Em Andamento').length
                }</h4>
                <p>Em Andamento</p>
              </div>
              <div class="summary-item">
                <h4>${obras.filter((o) => o.status === 'Concluída').length}</h4>
                <p>Concluídas</p>
              </div>
            </div>
          </div>
          
          <div class="section">
            <h3>Detalhes das Obras</h3>
            ${obras
              .map(
                (obra) => `
              <div class="obra-item">
                <h4>${obra.nome}</h4>
                <p><span class="label">Responsável:</span> ${
                  obra.responsavel
                }</p>
                <p><span class="label">Status:</span> ${obra.status}</p>
                <p><span class="label">Período:</span> ${formatDate(
                  obra.dataInicio
                )} - ${formatDate(obra.dataFim)}</p>
                <p><span class="label">Progresso:</span> ${obra.progresso}%</p>
                <p><span class="label">Fiscalizações:</span> ${
                  obra.fiscalizacoes?.length || 0
                }</p>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        
        <div class="footer">
          <p><strong>TECNOSYNC</strong> - Sistema de Fiscalização de Obras</p>
          <p>Este email foi gerado automaticamente</p>
          <p>Data de envio: ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = {
  sendObraByEmail,
  sendFiscalizacaoByEmail,
  sendObrasReportByEmail,
};
