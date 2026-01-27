import React, { useState, useEffect } from 'react';
import { Brain, Trophy, Zap, Star, Lock, Clock } from 'lucide-react';

const NeuroFit = () => {
  const [screen, setScreen] = useState('loading');
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadUserSession();
  }, []);

  const loadUserSession = async () => {
    try {
      const sessionData = localStorage.getItem('neurofit_session');
      if (sessionData) {
        const userData = JSON.parse(sessionData);
        setUser(userData);
        setIsAuthenticated(true);
        setScreen('home');
        return;
      }
    } catch (error) {
      console.log('No hay sesión activa');
    }
    setScreen('auth');
  };

  const handleLogin = async (username, password) => {
    try {
      const userKey = `neurofit_user_${username}`;
      const userData = localStorage.getItem(userKey);
      
      if (!userData) {
        return { success: false, message: 'Usuario no encontrado' };
      }
      
      const user = JSON.parse(userData);
      
      if (user.password !== password) {
        return { success: false, message: 'Contraseña incorrecta' };
      }
      
      user.lastLogin = new Date().toISOString();
      localStorage.setItem(userKey, JSON.stringify(user));
      localStorage.setItem('neurofit_session', JSON.stringify(user));
      
      setUser(user);
      setIsAuthenticated(true);
      setScreen('home');
      
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al iniciar sesión' };
    }
  };

  const handleRegister = async (username, password, email) => {
    try {
      const userKey = `neurofit_user_${username}`;
      const existingUser = localStorage.getItem(userKey);
      
      if (existingUser) {
        return { success: false, message: 'El usuario ya existe' };
      }
      
      const newUser = {
        username,
        password,
        email,
        isPremium: false,
        createdAt: new Date().toISOString(),
        totalScore: 0,
        streak: 0,
        levelsPlayed: 0
      };
      
      localStorage.setItem(userKey, JSON.stringify(newUser));
      localStorage.setItem('neurofit_session', JSON.stringify(newUser));
      
      setUser(newUser);
      setIsAuthenticated(true);
      setScreen('home');
      
      return { success: true };
    } catch (error) {
      return { success: false, message: 'Error al crear cuenta' };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('neurofit_session');
    setUser(null);
    setIsAuthenticated(false);
    setScreen('auth');
  };

  const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      if (!username || !password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        return;
      }

      if (!isLogin && !email) {
        setError('Por favor ingresa tu email');
        setLoading(false);
        return;
      }

      const result = isLogin 
        ? await handleLogin(username, password)
        : await handleRegister(username, password, email);

      if (!result.success) {
        setError(result.message);
      }
      
      setLoading(false);
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Brain className="w-20 h-20 mx-auto text-purple-600 mb-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              NeuroFit
            </h1>
            <p className="text-gray-600 text-lg">
              {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-bold mb-2 text-lg">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Ingresa tu usuario"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-lg">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
                  placeholder="tu@email.com"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-bold mb-2 text-lg">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-500 focus:outline-none text-lg"
                placeholder="Ingresa tu contraseña"
              />
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center font-bold">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
            >
              {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="w-full text-purple-600 font-bold text-lg hover:text-purple-800"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (screen === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-24 h-24 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-white text-2xl font-bold">Cargando NeuroFit...</p>
        </div>
      </div>
    );
  }

  if (screen === 'auth') {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="w-16 h-16 text-purple-600 mr-4" />
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  NeuroFit
                </h1>
                <p className="text-xl text-gray-600">¡Hola, {user.username}!</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 px-6 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-2xl text-center">
              <Trophy className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold text-blue-600">{user.totalScore}</p>
              <p className="text-sm text-gray-600">Puntos Totales</p>
            </div>
            <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-2xl text-center">
              <Zap className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-3xl font-bold text-green-600">{user.streak}</p>
              <p className="text-sm text-gray-600">Días Seguidos</p>
            </div>
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-2xl text-center">
              <Brain className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-3xl font-bold text-purple-600">{user.levelsPlayed}</p>
              <p className="text-sm text-gray-600">Niveles Jugados</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">¡Bienvenido a NeuroFit!</h2>
          <p className="text-xl text-gray-600 mb-6">
            Tu plataforma de entrenamiento cognitivo con 13 juegos científicamente diseñados
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">🧠</p>
              <p className="font-bold text-gray-800 text-xl">Memoria</p>
              <p className="text-sm text-gray-600 mt-2">2 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
            
            <div className="bg-gradient-to-br from-green-100 to-blue-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">⚡</p>
              <p className="font-bold text-gray-800 text-xl">Velocidad</p>
              <p className="text-sm text-gray-600 mt-2">2 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
            
            <div className="bg-gradient-to-br from-orange-100 to-red-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">👁️</p>
              <p className="font-bold text-gray-800 text-xl">Atención</p>
              <p className="text-sm text-gray-600 mt-2">2 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
            
            <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">📝</p>
              <p className="font-bold text-gray-800 text-xl">Lenguaje</p>
              <p className="text-sm text-gray-600 mt-2">3 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
            
            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">🧩</p>
              <p className="font-bold text-gray-800 text-xl">Razonamiento</p>
              <p className="text-sm text-gray-600 mt-2">2 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
            
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-6 rounded-2xl hover:scale-105 transition-transform cursor-pointer">
              <p className="text-5xl mb-3">🔄</p>
              <p className="font-bold text-gray-800 text-xl">Flexibilidad</p>
              <p className="text-sm text-gray-600 mt-2">2 juegos disponibles</p>
              <Lock className="w-6 h-6 mx-auto mt-3 text-gray-400" />
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl">
            <Star className="w-12 h-12 mx-auto mb-3 text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Hazte Premium!</h3>
            <p className="text-gray-700 mb-4">Desbloquea los 13 juegos por solo $2 USD/mes</p>
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold text-xl hover:from-yellow-500 hover:to-orange-600 transition-all">
              Suscribirme Ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuroFit;
