import environments from './src/config/environments.js'
import app from './src/app.js';

app.listen(environments.port, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en puerto ${environments.port}`);
});