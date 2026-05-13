import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, LogOut, BarChart3, Activity, Menu, X 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, path, onClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const active = location.pathname === path;
  
  const handleClick = () => {
    if (onClick) onClick();
    navigate(path);
  };
  
  return (
    <div 
      onClick={handleClick}
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
};

export default function PlayerPerformance() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);
  const [performanceData, setPerformanceData] = useState([]);
  
  // Estado para controlar o menu no telemóvel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username);
      } catch (e) {}
    } else {
      navigate('/register');
    }

    // Ler os dados do localStorage
    const savedPerformance = JSON.parse(localStorage.getItem('nextgen_performance') || '{}');
    
    // Converter o Objeto num Array e calcular a média
    const dataArray = Object.values(savedPerformance).map(p => ({
      ...p,
      avgRating: (p.totalRating / p.matches).toFixed(1)
    }));

    // Ordenar da melhor média para a pior
    dataArray.sort((a, b) => b.avgRating - a.avgRating);
    setPerformanceData(dataArray);

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user'); 
    navigate('/register'); 
  };

  const clearHistory = () => {
    if(window.confirm("Tens a certeza que queres limpar o histórico de jogos? Todos os dados serão perdidos!")) {
      localStorage.removeItem('nextgen_performance');
      setPerformanceData([]);
    }
  };

  return (
    // DIV MESTRE: Tranca o ecrã e impede scroll duplo
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">
      
      {/* ========================================================================= */}
      {/* VERSÃO DESKTOP (A TUA ORIGINAL E INTOCÁVEL) - visível só em lg e maior      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0 h-full">
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter">
                      <Trophy size={28} className="fill-blue-500/20" />
                      <span>NextGen <span className="text-white">Scout</span></span>
                    </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" />
            <NavItem icon={Search} label="Player Search" path="/search" />
            <NavItem icon={Star} label="Shortlist" path="/shortlist" />
            <NavItem icon={Users} label="Academies" path="/academies" />
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" />
          </nav>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b1120] to-[#0f172a] scrollbar-thin scrollbar-thumb-gray-800">
          
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Players' Performance</h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Historical Match Stats</p>
            </div>
            
            <div className="flex items-center gap-4 mt-1">
              <button 
                onClick={clearHistory}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg"
              >
                Reset Data
              </button>
              
              {username && (
                <button 
                  onClick={handleLogout}
                  className="w-12 h-12 bg-[#111827] hover:bg-gray-800 text-gray-400 hover:text-white rounded-2xl border border-gray-800 flex items-center justify-center transition-all shadow-lg shrink-0"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </header>

          {/* TABELA DE RENDIMENTO */}
          <div className="bg-[#111827]/80 border border-gray-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

            {performanceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Activity size={48} className="text-gray-700 mb-4" />
                <h3 className="text-xl font-black text-gray-500 uppercase tracking-widest mb-2">No Data Available</h3>
                <p className="text-sm text-gray-600 font-bold">Simulate matches in the Simulator to generate performance statistics.</p>
                <button onClick={() => navigate('/simulator')} className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg">
                  Simulate a Match
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-800 text-[10px] uppercase tracking-widest text-gray-500 font-black">
                      <th className="pb-4 pl-4">Pos</th>
                      <th className="pb-4">Jogador</th>
                      <th className="pb-4 text-center">Jogos</th>
                      <th className="pb-4 text-center">Golos</th>
                      <th className="pb-4 text-center">Assists</th>
                      <th className="pb-4 text-center">Média Geral</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {performanceData.map((player) => (
                      <tr key={player.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="py-4 pl-4">
                          <span className="bg-gray-900 border border-gray-700 text-gray-400 text-[9px] font-black px-2 py-1 rounded-md">
                            {player.position}
                          </span>
                        </td>
                        <td className="py-4 font-bold text-white">{player.name}</td>
                        <td className="py-4 text-center text-gray-400 font-mono font-bold">{player.matches}</td>
                        <td className="py-4 text-center text-sky-400 font-mono font-bold">{player.goals}</td>
                        <td className="py-4 text-center text-emerald-400 font-mono font-bold">{player.assists}</td>
                        <td className="py-4 text-center">
                          <span className={`font-mono font-black px-3 py-1.5 rounded-lg text-lg inline-block w-16
                            ${Number(player.avgRating) >= 7.5 ? 'text-emerald-400 bg-emerald-400/10' : 
                              Number(player.avgRating) >= 6.0 ? 'text-yellow-400 bg-yellow-400/10' : 
                              'text-red-400 bg-red-400/10'}`}
                          >
                            {player.avgRating}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden relative">
        
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 border-r border-gray-800 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter mt-2">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Search} label="Player Search" path="/search" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Star} label="Shortlist" path="/shortlist" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Users} label="Academies" path="/academies" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </aside>

        {/* HEADER MOBILE */}
        <header className="p-4 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors">
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">Performance</h1>
              <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Historical Stats</p>
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

        {/* CONTEÚDO MOBILE */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          
          <button 
            onClick={clearHistory}
            className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all mb-4 shrink-0 shadow-md"
          >
            Reset All Data
          </button>

          <div className="flex-1 overflow-y-auto bg-[#111827]/80 border border-gray-800 rounded-2xl p-4 shadow-lg pb-10 scrollbar-thin scrollbar-thumb-gray-800">
            {performanceData.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-50">
                <Activity size={32} className="text-gray-500 mb-3" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">No Data Available</h3>
                <p className="text-[10px] text-gray-500 font-bold px-4">Simulate matches to generate stats.</p>
                <button onClick={() => navigate('/simulator')} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Simulate Match
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {performanceData.map((player) => (
                  <div key={player.id} className="bg-[#0f172a] border border-gray-800 p-4 rounded-xl shadow-sm flex flex-col gap-3">
                     
                     <div className="flex justify-between items-center border-b border-gray-800/50 pb-3">
                       <div className="flex items-center gap-3">
                         <span className="bg-gray-900 border border-gray-700 text-gray-400 text-[9px] font-black px-2 py-1 rounded-md shrink-0">
                           {player.position}
                         </span>
                         <span className="font-bold text-white text-sm truncate max-w-[150px]">{player.name}</span>
                       </div>
                       <span className={`font-mono font-black px-2 py-1 rounded-lg text-sm inline-block shrink-0
                         ${Number(player.avgRating) >= 7.5 ? 'text-emerald-400 bg-emerald-400/10' : 
                           Number(player.avgRating) >= 6.0 ? 'text-yellow-400 bg-yellow-400/10' : 
                           'text-red-400 bg-red-400/10'}`}
                       >
                         {player.avgRating}
                       </span>
                     </div>
                     
                     <div className="flex justify-around text-[9px] font-black uppercase tracking-widest text-gray-500 mt-1">
                       <div className="flex flex-col items-center gap-1">
                         <span className="text-gray-300 font-mono text-xs">{player.matches}</span>
                         <span>Games</span>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                         <span className="text-sky-400 font-mono text-xs">{player.goals}</span>
                         <span>Goals</span>
                       </div>
                       <div className="flex flex-col items-center gap-1">
                         <span className="text-emerald-400 font-mono text-xs">{player.assists}</span>
                         <span>Assists</span>
                       </div>
                     </div>

                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}