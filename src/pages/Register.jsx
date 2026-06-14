import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trophy, Mail, Lock, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isRecoveringPassword, setIsRecoveringPassword] = useState(false);
  const [recoverStep, setRecoverStep] = useState(1); 
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [recoverData, setRecoverData] = useState({
    email: '',
    newPassword: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const validatePassword = (password) => {
    if (password.length < 8) return "The password must be at least 8 characters long.";
    if (!/[A-Z]/.test(password)) return "The password must contain at least one uppercase letter.";
    if (!/[a-z]/.test(password)) return "The password must contain at least one lowercase letter.";
    if (!/[0-9]/.test(password)) return "The password must contain at least one number.";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "The password must contain at least one special character.";
    return ""; // Returns empty string if all checks pass
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleRecoverChange = (e) => {
    setRecoverData({ ...recoverData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!isLogin) {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        setError(passwordError);
        setIsLoading(false);
        return; 
      }
    }

    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await axios.post(`http://localhost:3001${endpoint}`, payload);
      
      localStorage.setItem('nextgen_user', JSON.stringify(response.data.user));
      
      if (response.data.token) {
        localStorage.setItem('nextgen_token', response.data.token);
      }
      
      navigate('/dashboard');
      
    } catch (err) {
      // NOVA LÓGICA DE VERIFICAÇÃO AQUI
      if (!isLogin && err.response?.status === 409) {
        setError('This email is already registered. Please log in.');
      } else {
        setError(err.response?.data?.message || 'Ocorreu um erro no servidor. Tenta novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (recoverStep === 1) {
      if (!recoverData.email) {
        setError('Por favor, insere o teu email.');
        setIsLoading(false);
        return;
      }
      setRecoverStep(2);
      setIsLoading(false);
    } else {
      const passwordError = validatePassword(recoverData.newPassword);
      if (passwordError) {
        setError(passwordError);
        setIsLoading(false);
        return;
      }

      try {
        await axios.post(`http://localhost:3001/api/recover-password`, {
          email: recoverData.email,
          newPassword: recoverData.newPassword
        });
        
        setSuccessMsg('Password updated successfully!');
        setTimeout(() => {
          setIsRecoveringPassword(false);
          setRecoverStep(1);
          setRecoverData({ email: '', newPassword: '' });
          setSuccessMsg('');
        }, 2000);
        
      } catch (err) {
        // NOVA LÓGICA DE VERIFICAÇÃO AQUI
        if (err.response?.status === 404) {
          setError('This email was not found in our database.');
        } else {
          setError(err.response?.data?.message || 'Erro ao alterar a password. Tenta novamente.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (isRecoveringPassword) {
    return (
      <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0b1120] flex flex-col justify-center items-center p-4 font-sans overflow-hidden">
        
        <div className="absolute top-[-5%] left-[-10%] md:top-[-10%] w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] right-[-10%] md:bottom-[-10%] w-64 h-64 md:w-96 md:h-96 bg-emerald-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10">
          
          <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] mb-4">
              <Trophy className="text-white w-7 h-7 md:w-8 md:h-8" />
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
              NextGen <span className="text-blue-500">Scout</span>
            </h1>
          </div>

          <div className="bg-[#0f172a] border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
            <button 
              onClick={() => {
                setIsRecoveringPassword(false);
                setRecoverStep(1);
                setError('');
                setSuccessMsg('');
              }}
              className="flex items-center gap-1 text-gray-500 hover:text-white text-[10px] uppercase font-bold mb-4 transition-colors"
            >
              <ArrowLeft size={12} /> Back to Login
            </button>

            <h2 className="text-xl md:text-2xl font-black text-white mb-6 text-center">
              Recover Password
            </h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[10px] md:text-xs font-bold p-3 rounded-xl mb-6 text-center">
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-[10px] md:text-xs font-bold p-3 rounded-xl mb-6 text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleRecoverSubmit} className="space-y-4">
              {recoverStep === 1 ? (
                <div>
                  <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your account email"
                      value={recoverData.email}
                      onChange={handleRecoverChange}
                      required
                      className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Enter your new password"
                      value={recoverData.newPassword}
                      onChange={handleRecoverChange}
                      required
                      className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 mt-2 font-black uppercase text-[10px] md:text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <>
                    {recoverStep === 1 ? 'Next' : 'Update Password'} <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] w-screen h-screen bg-[#0b1120] flex flex-col justify-center items-center p-4 font-sans overflow-hidden">
      
      <div className="absolute top-[-5%] left-[-10%] md:top-[-10%] w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-10%] md:bottom-[-10%] w-64 h-64 md:w-96 md:h-96 bg-emerald-600/10 rounded-full blur-[80px] md:blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        
        <div className="flex flex-col items-center justify-center mb-6 md:mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.4)] mb-4">
            <Trophy className="text-white w-7 h-7 md:w-8 md:h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter">
            NextGen <span className="text-blue-500">Scout</span>
          </h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.3em] mt-2 text-center">
            Football Scouting Platform
          </p>
        </div>

        <div className="bg-[#0f172a] border border-gray-800 rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-xl md:text-2xl font-black text-white mb-6 text-center">
            {isLogin ? 'Welcome Back!' : 'Create Your Account'}
          </h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-[10px] md:text-xs font-bold p-3 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <div>
                <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Ex: AlexFergunson"
                    value={formData.username}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="scout@nextgen.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-3 pl-12 pr-4 text-xs md:text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-center mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveringPassword(true);
                    setError('');
                  }}
                  className="bg-[#0f172a] text-blue-500 hover:text-blue-400 text-[10px] font-bold px-3 py-1 rounded transition-colors"
                >
                  Have you forgotten your password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3.5 mt-2 font-black uppercase text-[10px] md:text-xs tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Register'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 md:mt-8 text-center border-t border-gray-800 pt-6">
            <p className="text-[10px] md:text-sm text-gray-500 font-bold">
              {isLogin ? "Are you new?" : "Do you already have an account?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({ username: '', email: '', password: '' });
              }}
              className="text-blue-400 hover:text-blue-300 text-[10px] md:text-xs font-black uppercase tracking-widest mt-2 transition-colors"
            >
              {isLogin ? "Create Account" : "Log in"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;