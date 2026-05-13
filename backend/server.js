import { createApp } from './app.js';

const app = createApp('./contoso-bikes.db');
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Contoso Bikes API running on http://localhost:${PORT}`);
});
