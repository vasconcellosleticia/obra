const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');

// Routes
const obraRoutes = require('./routes/obraRoutes');
const fiscalizacaoRoutes = require('./routes/fiscalizacaoRoutes');
const emailRoutes = require('./routes/emailRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? ['https://your-frontend-domain.com']
        : [
            'http://localhost:3000',
            'http://localhost:19006',
            'exp://192.168.1.100:19000',
            'http://10.0.2.2:3000',
          ],
    credentials: true,
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sistema de Cadastro de Obras API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      obras: '/api/v1/obras',
      fiscalizacoes: '/api/v1/fiscalizacoes',
      email: '/api/v1/email',
    },
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/v1/obras', obraRoutes);
app.use('/api/v1/fiscalizacoes', fiscalizacaoRoutes);
app.use('/api/v1/email', emailRoutes);

// Test route to verify API is working
app.get('/api/v1', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API v1 is working!',
    routes: [
      'GET /api/v1/obras',
      'POST /api/v1/obras',
      'GET /api/v1/obras/:id',
      'PUT /api/v1/obras/:id',
      'DELETE /api/v1/obras/:id',
      'GET /api/v1/fiscalizacoes',
      'POST /api/v1/fiscalizacoes',
      'GET /api/v1/fiscalizacoes/:id',
      'PUT /api/v1/fiscalizacoes/:id',
      'DELETE /api/v1/fiscalizacoes/:id',
    ],
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API base: http://localhost:${PORT}/api/v1`);
  console.log(`🔗 Root: http://localhost:${PORT}`);
});

module.exports = app;
