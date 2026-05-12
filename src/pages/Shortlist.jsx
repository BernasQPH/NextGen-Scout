import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, BarChart3, Sword, User, Trash2, ExternalLink, LogOut, Menu, X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all mb-1 ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-bold' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
    {Icon && <Icon size={20} />}
    <span className="text-sm uppercase tracking-tight font-bold">{label}</span>
  </div>
);

export default function Shortlist() {
  const navigate = useNavigate();
  const [shortlistPlayers, setShortlistPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);

  // NOVO ESTADO: Controlar a gaveta do menu no telemóvel
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const fetchShortlist = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/shortlist-players');
      setShortlistPlayers(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
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

    fetchShortlist(); 
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  const removeFromShortlist = async (id) => {
    if (!window.confirm("Remove player from shortlist?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/shortlist/${id}`);
      setShortlistPlayers(prev => prev.filter(p => p['COL 1'] !== id));
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  };

  return (
    // DIV MESTRE: Tranca o ecrã e impede scroll duplo
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">

      {/* ========================================================================= */}
      {/* VERSÃO DESKTOP (A TUA ORIGINAL E INTOCÁVEL) - visível só em lg e maior      */}
      {/* ========================================================================= */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
        {/* BARRA LATERAL FIXA NO PC */}
        <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0 h-full">
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter">
                      <Trophy size={28} className="fill-blue-500/20" />
                      <span>NextGen <span className="text-white">Scout</span></span>
                    </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
            <NavItem icon={Star} label="Shortlist" active onClick={() => navigate('/shortlist')} />
            <NavItem icon={Users} label="Academies" onClick={() => navigate('/academies')} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => navigate('/player-performance')} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden text-[13px]">
          <div className="p-10 h-full flex flex-col overflow-hidden">
            
            <header className="mb-8 shrink-0 flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">SHORTLIST</h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] italic mb-4">Saved Prospect Profiles</p>
                
                <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-lg w-max">
                  <span className="text-blue-400 font-black uppercase text-[10px] tracking-widest">Total: {shortlistPlayers.length}</span>
                </div>
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

            <div className="flex-1 bg-[#111827]/30 rounded-[2rem] border border-gray-800/50 overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
              <div className="overflow-y-auto overflow-x-auto h-full scrollbar-hide">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 bg-[#0f172a] z-10 border-b border-gray-800">
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">
                      <th className="py-6 px-10 w-[350px]">Prospect Info</th>
                      <th className="py-6 px-6 w-[250px]">Academy</th>
                      <th className="py-6 px-6 text-center w-[100px]">Pos</th>
                      <th className="py-6 px-10 text-right w-[200px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/20">
                    {shortlistPlayers.length > 0 ? shortlistPlayers.map((player) => (
                      <tr key={player['COL 1']} className="hover:bg-blue-600/5 transition-all group">
                        <td className="py-6 px-10">
                          <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner group-hover:border-blue-500/30 transition-all shrink-0">
                              <User size={20} className="text-gray-500 group-hover:text-blue-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-lg uppercase italic tracking-tighter leading-none mb-1 group-hover:text-blue-400 transition-colors">
                                {player['COL 2']}
                              </span>
                              <span className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">
                                ID: #{player['COL 1']} • {new Date(player.data_adicionado).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-6 px-6">
                          <span className="text-gray-400 font-bold text-xs uppercase italic">{player['COL 3']}</span>
                        </td>
                        <td className="py-6 px-6 text-center">
                          <span className="inline-block bg-blue-500/5 text-blue-400/80 px-3 py-1 rounded-lg border border-blue-500/10 text-[10px] font-black uppercase tracking-tighter">
                            {player['COL 4']}
                          </span>
                        </td>
                        <td className="py-6 px-10 text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <button 
                              onClick={() => navigate(`/perfil/${player['COL 1']}`)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                            >
                              Profile <ExternalLink size={12} />
                            </button>
                            <button 
                              onClick={() => removeFromShortlist(player['COL 1'])}
                              className="text-gray-700 hover:text-red-500 transition-all p-2.5 hover:bg-red-500/5 rounded-xl active:scale-90"
                              title="Remove"
                            >
                              <Trash2 size={20} strokeWidth={1.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="py-32 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Star size={48} className="text-gray-500" />
                            <p className="text-gray-500 uppercase text-[10px] font-black tracking-[0.5em] italic">
                              {loading ? "Syncing Database..." : "No Players Found"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ========================================================================= */}
      {/* VERSÃO MOBILE (EXCLUSIVA) - visível só em ecrãs pequenos                  */}
      {/* ========================================================================= */}
      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden relative">
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
        )}

        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white"
          >
            <X size={24} />
          </button>

          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-8 px-2 uppercase italic tracking-tighter">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} />
            <NavItem icon={Search} label="Player Search" onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} />
            <NavItem icon={Star} label="Shortlist" active onClick={() => { setIsMobileMenuOpen(false); navigate('/shortlist'); }} />
            <NavItem icon={Users} label="Academies" onClick={() => { setIsMobileMenuOpen(false); navigate('/academies'); }} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => { setIsMobileMenuOpen(false); navigate('/comparison'); }} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => { setIsMobileMenuOpen(false); navigate('/dreamteam'); }} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => { setIsMobileMenuOpen(false); navigate('/player-performance'); }} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden text-[13px]">
          <div className="p-4 h-full flex flex-col overflow-hidden">
            
            <header className="mb-6 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">SHORTLIST</h1>
                  <p className="text-gray-500 text-[8px] font-bold uppercase tracking-widest italic mb-2">Saved Prospect Profiles</p>
                  
                  <div className="bg-blue-600/10 border border-blue-500/20 py-1 px-3 rounded-lg w-max">
                    <span className="text-blue-400 font-black uppercase text-[8px] tracking-widest">Total: {shortlistPlayers.length}</span>
                  </div>
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

            <div className="flex-1 bg-[#111827]/30 rounded-2xl border border-gray-800/50 overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
              <div className="overflow-y-auto overflow-x-auto h-full scrollbar-hide">
                <table className="w-full text-left border-separate border-spacing-0 min-w-full">
                  <thead className="sticky top-0 bg-[#0f172a] z-10 border-b border-gray-800">
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">
                      <th className="py-3 px-4 w-auto">Prospect Info</th>
                      <th className="py-3 px-2 text-center w-auto">Pos</th>
                      <th className="py-3 px-4 text-right w-auto">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/20">
                    {shortlistPlayers.length > 0 ? shortlistPlayers.map((player) => (
                      <tr key={player['COL 1']} className="hover:bg-blue-600/5 transition-all group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#1e293b] rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner group-hover:border-blue-500/30 transition-all shrink-0">
                              <User size={20} className="text-gray-500 w-5 h-5" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-black text-sm uppercase italic tracking-tighter leading-none mb-0.5 truncate max-w-[120px]">
                                {player['COL 2']}
                              </span>
                              <span className="text-gray-500 text-[9px] font-bold uppercase tracking-widest truncate max-w-[120px]">
                                {player['COL 3']}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="inline-block bg-blue-500/5 text-blue-400/80 px-2 py-0.5 rounded-lg border border-blue-500/10 text-[8px] font-black uppercase tracking-tighter">
                            {player['COL 4']}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex justify-end gap-1 items-center">
                            <button 
                              onClick={() => navigate(`/perfil/${player['COL 1']}`)}
                              className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                            >
                              Profile
                            </button>
                            <button 
                              onClick={() => removeFromShortlist(player['COL 1'])}
                              className="text-gray-700 hover:text-red-500 transition-all p-1.5 hover:bg-red-500/5 rounded-lg active:scale-90"
                              title="Remove"
                            >
                              <Trash2 size={20} strokeWidth={1.5} className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-32 text-center">
                          <div className="flex flex-col items-center gap-4 opacity-20">
                            <Star size={48} className="text-gray-500" />
                            <p className="text-gray-500 uppercase text-[10px] font-black tracking-[0.5em] italic">
                              {loading ? "Syncing..." : "No Players"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}