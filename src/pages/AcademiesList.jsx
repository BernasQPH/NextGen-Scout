import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, BarChart3, User, LogOut, Menu, X, ArrowLeft, ExternalLink 
} from 'lucide-react';

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

const getAcademyName = (id) => {
  const academies = {
    "1": "Benfica Campus",
    "2": "La Masia",
    "3": "Academia Cristiano Ronaldo",
    "4": "FC Porto Academy",
    "5": "Yung Ajax",
    "6": "SC Braga Academy",
    "7": "La Fabrica",
    "8": "Academia River Plate",
    "9": "Chelsea Academy"
  };
  return academies[String(id)] || "Unknown Academy";
};

export default function AcademiesList() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUsername(parsedUser.username);
    } else {
      navigate('/register');
    }

    axios.get('http://localhost:3001/api/players')
      .then(res => {
        // Filtrar jogadores onde a COL 3 (Academy ID) corresponde ao ID do URL
        const academyPlayers = res.data.filter(p => String(p['COL 3']) === String(id));
        setPlayers(academyPlayers);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar jogadores da academia:", err);
        setLoading(false);
      });
  }, [id, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  return (
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">

      {/* SIDEBAR (DESKTOP) */}
      <div className="hidden lg:flex h-full w-full overflow-hidden">
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

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
          <div className="p-10 h-full flex flex-col">
            
            <header className="mb-8 shrink-0 flex justify-between items-start">
              <div>
                <button 
                  onClick={() => navigate('/academies')}
                  className="flex items-center gap-2 text-blue-500 text-[10px] font-black uppercase tracking-widest mb-4 hover:text-blue-400 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Academies
                </button>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-tight">
                  {getAcademyName(id)}
                </h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em]">Squad Roster & Prospects</p>
              </div>

              {username && (
                <div className="bg-[#111827] border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg mt-8">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-white font-black text-xs uppercase tracking-widest">{username}</span>
                </div>
              )}
            </header>

            {/* TABELA DE JOGADORES */}
            <div className="flex-1 bg-[#111827]/30 rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
              <div className="overflow-x-auto overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-800">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 bg-[#0f172a] z-10">
                    <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-800">
                      <th className="py-6 px-10">Player</th>
                      <th className="py-6 px-6 text-center">Position</th>
                      <th className="py-6 px-6 text-center">Age</th>
                      <th className="py-6 px-10 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {loading ? (
                      <tr><td colSpan="4" className="py-20 text-center animate-pulse text-gray-600 font-bold uppercase tracking-widest text-xs">Loading squad...</td></tr>
                    ) : players.length > 0 ? (
                      players.map((player) => (
                        <tr key={player['COL 1']} className="hover:bg-blue-600/5 transition-all group">
                          <td className="py-6 px-10">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 shrink-0">
                                <User size={18} className="text-gray-500 group-hover:text-blue-500" />
                              </div>
                              <span className="font-bold text-base uppercase italic tracking-tight group-hover:text-blue-400">
                                {player['COL 2']}
                              </span>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-center">
                            <span className="inline-block bg-blue-500/10 text-blue-400 px-3 py-1 rounded-md border border-blue-500/20 text-[10px] font-black uppercase">
                              {player['COL 4']}
                            </span>
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-gray-400 text-sm">
                            {player['COL 15']}
                          </td>
                          <td className="py-6 px-10 text-right">
                            <button 
                              onClick={() => navigate(`/perfil/${player['COL 1']}`)}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 ml-auto"
                            >
                              Profile <ExternalLink size={12} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="4" className="py-20 text-center text-gray-600 uppercase font-black text-xs">No players found for this academy.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* VERSÃO MOBILE (Resumida) */}
      <div className="lg:hidden flex flex-col h-full w-full bg-[#0b1120] p-4 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
           <button onClick={() => navigate('/academies')} className="text-blue-500"><ArrowLeft /></button>
           <h1 className="text-xl font-black uppercase italic truncate max-w-[200px]">{getAcademyName(id)}</h1>
           <div className="w-8"></div>
        </header>
        
        <div className="flex flex-col gap-3">
          {players.map(p => (
            <div key={p['COL 1']} onClick={() => navigate(`/perfil/${p['COL 1']}`)} className="bg-[#111827] p-4 rounded-2xl border border-gray-800 flex justify-between items-center">
              <div>
                <p className="font-black text-sm uppercase italic">{p['COL 2']}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">{p['COL 4']}</p>
              </div>
              <ExternalLink size={16} className="text-blue-500" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}