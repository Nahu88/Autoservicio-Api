import environments from './src/config/environments.js'
import app from './src/app.js';
import createTables from './src/config/initDatabase.js';

// Inicializar base de datos y luego iniciar servidor
createTables().then(() => {
  app.listen(environments.port, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${environments.port}`);
  });
});