import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';

// Páginas y Componentes según la estructura del proyecto
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const { user, login, logout } = useContext(AuthContext);

  // Estados para el formulario de Login de la Dueña
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loadingLogin, setLoadingLogin] = useState(false);

  const handleAdminAccess = () => {
    setCurrentView('admin');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoadingLogin(true);

    const result = await login(email, password);
    setLoadingLogin(false);

    if (!result.success) {
      setLoginError(result.message || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* NAVBAR DE NAVEGACIÓN */}
      <nav className="bg-stone-900 text-stone-300 py-3 px-4 sm:px-8 text-xs font-semibold uppercase tracking-[0.15em] border-b border-stone-800 sticky top-0 z-[100] flex justify-between items-center shadow-md">
        
        {/* LOGO */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="cursor-pointer text-white hover:text-rose-200 transition flex items-center gap-2 text-sm font-bold"
        >
          <span>✨</span>
          <span>Ámbar Cosmetics</span>
        </div>

        {/* NAVEGACIÓN */}
        <div className="flex items-center space-x-3 sm:space-x-6 text-[11px] sm:text-xs">
          <button
            onClick={() => setCurrentView('home')}
            className={`transition pb-0.5 ${
              currentView === 'home'
                ? 'text-white border-b-2 border-white font-bold'
                : 'hover:text-white'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => setCurrentView('catalogo')}
            className={`transition pb-0.5 ${
              currentView === 'catalogo'
                ? 'text-white border-b-2 border-white font-bold'
                : 'hover:text-white'
            }`}
          >
            Catálogo
          </button>

          {/* BOTÓN PANEL DE LOGÍSTICA / DUEÑA */}
          <button
            onClick={handleAdminAccess}
            className={`transition pb-0.5 px-3 py-1 rounded-sm border ${
              currentView === 'admin'
                ? 'bg-rose-200 text-stone-900 border-rose-200 font-bold'
                : 'border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white'
            }`}
          >
            🔐 Panel Logística
          </button>

          {user && (
            <button
              onClick={logout}
              className="text-stone-400 hover:text-rose-400 transition ml-2 text-[10px]"
              title="Cerrar Sesión de Dueña"
            >
              (Salir)
            </button>
          )}
        </div>
      </nav>

      {/* RENDERIZADO DINÁMICO DE PANTALLAS */}
      <main className="flex-1">
        {currentView === 'home' && <Home />}
        {currentView === 'catalogo' && <Catalogo />}
        
        {/* CONTROL DE ACCESO AL PANEL PRIVADO */}
        {currentView === 'admin' && (
          user && user.role === 'admin' ? (
            <AdminPanel />
          ) : (
            <div className="max-w-md mx-auto my-16 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-stone-200">
              <div className="text-center mb-6">
                <span className="text-4xl">🔐</span>
                <h2 className="text-xl font-bold text-stone-800 mt-2">Acceso Exclusivo Dueña</h2>
                <p className="text-xs text-stone-500 mt-1">Ingresá tus credenciales para gestionar stock y precios.</p>
              </div>

              {loginError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg text-center font-medium">
                  {loginError}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Email de Administración</label>
                  <input
                    type="email"
                    required
                    placeholder="cosmeticsbeautyambar@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingLogin}
                  className="w-full py-3 bg-stone-900 text-white font-bold rounded-lg hover:bg-stone-800 transition shadow-sm uppercase tracking-wider text-[11px] disabled:opacity-50"
                >
                  {loadingLogin ? 'Verificando...' : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          )
        )}
      </main>
    </div>
  );
}