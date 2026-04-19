const errorHandler = (err, req, res, next) => {
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, error: `Duplicate value for field: ${field}` });
  }
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, error: messages.join('. ') });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
  if (process.env.NODE_ENV === 'development') console.error('[Error]', err.stack);
  res.status(err.statusCode || 500).json({ success: false, error: err.message || 'Internal Server Error' });
};

module.exports = errorHandler;
