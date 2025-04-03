import { RouterProvider } from 'react-router-dom';
import router from './routes/routes.js';
import { AuthProvider } from './context/AuthContext'; // Nuevo contexto de autenticación
import { getAuth } from 'firebase/auth';
import { app } from './firebase-config.js'; // Asegúrate de exportar 'app' desde tu configuración
import './Layout.css';

function App() {
  const auth = getAuth(app); // Inicializa el auth de Firebase

  return (
    <AuthProvider auth={auth}> {/* Envuelve con el proveedor de autenticación */}
      <RouterProvider router={router} />
    </AuthProvider>
  );
}


export default App;


