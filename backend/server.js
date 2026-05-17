const app = require('./src/app');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

// Allow requests from your frontend (Vite dev server on 5173)
// Note: CORS is already handled in src/app.js, but keeping this as a fallback if needed
// or better yet, removing it to avoid confusion as it's redundant.

// Example route used by FacialExpression.jsx for logging/tracking
app.post('/emotion', (req, res) => {
  res.json({ status: "ok", emotion: req.body.emotion });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});