const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const morgan = require('morgan')

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
// if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
// }


// app.use('/public', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/chefs', require('./routes/api/chefs'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/shop', require('./routes/api/shop'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/cart', require('./routes/api/cart'));
app.use('/api/order', require('./routes/api/order'));
app.use('/api/dish', require('./routes/api/dish'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
