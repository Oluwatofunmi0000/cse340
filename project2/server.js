require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const swaggerUI = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => res.send('Project 2 - CRUD API running'));

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/authors', authorRoutes);

// Not Found middleware for unknown routes
app.use(notFound);

// Serve API docs
try {
  const openapi = fs.readFileSync(path.join(__dirname, 'docs/openapi.yaml'), 'utf8');
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(null, { swaggerOptions: { url: '/docs/openapi.yaml' } }));
  app.get('/docs/openapi.yaml', (req, res) => {
    res.type('text/yaml').send(openapi);
  });
} catch (err) {
  console.warn('Swagger UI docs not available');
}

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

connectDB(process.env.MONGO_URI)
  .then(() => {
    const server = app.listen(PORT, HOST, () => {
      const addr = server.address();
      console.log(`Server running on http://${addr.address}:${addr.port}`);
    });
  })
  .catch(err => {
    console.error('Failed to connect to DB', err);
    process.exit(1);
  });
