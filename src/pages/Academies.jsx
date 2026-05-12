import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, BarChart3, ExternalLink, LogOut, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all mb-1 ${
      active 
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' 
        : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
    }`}
  >
    {Icon && <Icon size={20} />}
    <span className="text-sm uppercase tracking-tight font-bold">{label}</span>
  </div>
);

export default function Academies() {
  const navigate = useNavigate();
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  // Estado para a gaveta do menu no telemóvel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchAcademies = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/academies');
      setAcademies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar as academias:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Verificar sessão
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username);
      } catch (e) {
        console.error("Erro ao ler sessão", e);
      }
    } else {
      navigate('/register');
    }

    fetchAcademies();
  }, [navigate]);

  // FUNÇÃO DE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  const renderStars = (count) => {
    const num = parseInt(count) || 0;
    return "★".repeat(num) + "☆".repeat(5 - num);
  };

  return (
    // DIV MESTRE: TRANCA O ECRÃ
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">
      
      {/* ========================================================================= */}
      {/* VERSÃO DESKTOP (A TUA ORIGINAL E INTOCÁVEL) - visível só em lg e maior      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
        {/* BARRA LATERAL FIXA */}
        <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0 h-full">
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
            <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
            <NavItem icon={Users} label="Academies" active onClick={() => navigate('/academies')} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => navigate('/player-performance')} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
          <div className="p-10 h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
            
            <header className="mb-10 shrink-0 flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">ACADEMIES</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global talent producers network</p>
              </div>
              
              {username && (
                <div className="flex items-center gap-4 mt-1">
                  <div className="bg-[#111827] border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                      <span className="text-white font-black">{username}</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-12 h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 flex items-center justify-center transition-all group shadow-lg shrink-0"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </header>

            <div className="flex flex-col gap-8 max-w-5xl">
              {loading ? (
                <div className="py-20 text-center">
                  <p className="text-gray-500 animate-pulse uppercase tracking-[0.2em] text-xs font-black">A carregar base de dados...</p>
                </div>
              ) : academies.length > 0 ? (
                academies.map((academy) => (
                  <div 
                    key={academy.id}
                    className="flex items-center gap-6 group cursor-pointer transition-all hover:translate-x-2"
                  >
                    <div className="w-20 h-20 bg-[#1e293b]/50 border border-yellow-600/30 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden group-hover:border-yellow-500 transition-all shadow-lg">
                      {academy.logo_url ? (
                        <img 
                          src={academy.logo_url} 
                          alt={academy.nome} 
                          className="w-full h-full object-contain p-2" 
                        />
                      ) : (
                        <div className="text-yellow-600/20 font-black text-[10px] uppercase tracking-tighter">Logo</div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-4 mb-1">
                        <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-none truncate">
                          {academy.nome}
                        </h3>
                        <div className="flex text-yellow-500 text-lg tracking-[0.2em]">
                          <span className="bg-[#0f172a] px-3 py-0.5 rounded-full border border-gray-800 text-sm shadow-inner">
                            {renderStars(academy.rating)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
                          {academy.pais}
                        </span>
                        <span className="text-gray-700">•</span>
                        <span className="text-gray-400">Verified Elite Academy</span>
                      </div>
                    </div>

                    <div className="opacity-0 group-hover:opacity-100 transition-all pr-4 transform translate-x-4 group-hover:translate-x-0 shrink-0 self-center">
                      <ExternalLink size={24} className="text-blue-500" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 border-2 border-dashed border-gray-800 rounded-3xl text-center">
                  <p className="text-gray-600 uppercase text-xs font-black tracking-widest italic">
                    Nenhuma academia encontrada.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-auto pt-20 opacity-[0.02] select-none pointer-events-none flex justify-end overflow-hidden">
              <Users size={300} />
            </div>
          </div>
        </main>
      </div>


      
      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden relative">
        
       
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        {/* BARRA LATERAL GAVETA */}
        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter mt-2">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} />
            <NavItem icon={Search} label="Player Search" onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} />
            <NavItem icon={Star} label="Shortlist" onClick={() => { setIsMobileMenuOpen(false); navigate('/shortlist'); }} />
            <NavItem icon={Users} label="Academies" active onClick={() => { setIsMobileMenuOpen(false); navigate('/academies'); }} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => { setIsMobileMenuOpen(false); navigate('/comparison'); }} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => { setIsMobileMenuOpen(false); navigate('/dreamteam'); }} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => { setIsMobileMenuOpen(false); navigate('/player-performance'); }} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
          <div className="p-4 h-full flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
            
            <header className="mb-6 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">ACADEMIES</h1>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Global producers</p>
                </div>
              </div>
              
              {username && (
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-lg border border-red-500/20 flex items-center justify-center transition-all shadow-md shrink-0 text-[10px] font-black uppercase tracking-widest"
                >
                  Logout
                </button>
              )}
            </header>

            <div className="flex flex-col gap-4 max-w-5xl">
              {loading ? (
                <div className="py-20 text-center">
                  <p className="text-gray-500 animate-pulse uppercase tracking-[0.2em] text-[10px] font-black">A carregar base de dados...</p>
                </div>
              ) : academies.length > 0 ? (
                academies.map((academy) => (
                  <div 
                    key={academy.id}
                    className="flex flex-col items-start gap-4 cursor-pointer bg-[#111827]/40 p-4 rounded-2xl border border-gray-800 relative"
                  >
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-16 h-16 bg-[#1e293b]/50 border border-yellow-600/30 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-lg">
                        {academy.logo_url ? (
                          <img 
                            src={academy.logo_url} 
                            alt={academy.nome} 
                            className="w-full h-full object-contain p-1.5" 
                          />
                        ) : (
                          <div className="text-yellow-600/20 font-black text-[8px] uppercase tracking-tighter">Logo</div>
                        )}
                      </div>

                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="flex flex-col items-start gap-1.5 mb-1 w-full">
                          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none truncate w-full pr-6">
                            {academy.nome}
                          </h3>
                          <div className="flex text-yellow-500 tracking-[0.2em]">
                            <span className="bg-[#0f172a] px-2 py-0.5 rounded-md border border-gray-800 text-[10px] shadow-inner">
                              {renderStars(academy.rating)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 text-gray-500 font-bold uppercase tracking-wider text-[9px] bg-[#0b1120] p-3 rounded-xl w-full border border-gray-800/50">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
                        {academy.pais}
                      </span>
                      <span className="text-gray-400">Verified Elite Academy</span>
                    </div>

                    <div className="absolute top-6 right-4 text-gray-600">
                      <ExternalLink size={20} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 border-2 border-dashed border-gray-800 rounded-2xl text-center">
                  <p className="text-gray-600 uppercase text-[10px] font-black tracking-widest italic">
                    Nenhuma academia encontrada.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10 opacity-[0.02] select-none pointer-events-none flex justify-center overflow-hidden pb-10">
              <Users size={150} />
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}