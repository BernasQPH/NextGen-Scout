import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, User, Trash2, ExternalLink 
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

  useEffect(() => { fetchShortlist(); }, []);

  const removeFromShortlist = async (id) => {
    if (!window.confirm("Remove player from shortlist?")) return;
    try {
      await axios.delete(`http://localhost:3001/api/shortlist/${id}`);
      // Lógica dinâmica: mantém todos os que NÃO têm o ID apagado
      setShortlistPlayers(prev => prev.filter(p => p['COL 1'] !== id));
    } catch (err) {
      console.error("Erro ao remover:", err);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter">
          <Trophy size={28} className="fill-blue-500/20" />
          <span>NextGen <span className="text-white">Scout</span></span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" active onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" onClick={() => navigate('/academies')} />
          <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
          <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col bg-[#0b1120] overflow-hidden text-[13px]">
        <div className="p-10 h-full flex flex-col overflow-hidden">
          <header className="mb-8 shrink-0 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">SHORTLIST</h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] italic">Saved Prospect Profiles</p>
            </div>
            <div className="bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-lg">
              <span className="text-blue-400 font-black uppercase text-[10px] tracking-widest">Total: {shortlistPlayers.length}</span>
            </div>
          </header>

          <div className="flex-1 bg-[#111827]/30 rounded-[2rem] border border-gray-800/50 overflow-hidden flex flex-col shadow-2xl backdrop-blur-sm">
            <div className="overflow-y-auto h-full scrollbar-hide">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-[#0f172a] z-10 border-b border-gray-800">
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black">
                    <th className="py-6 px-10">Prospect Info</th>
                    <th className="py-6 px-6">Academy</th>
                    <th className="py-6 px-6 text-center">Pos</th>
                    <th className="py-6 px-10 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/20">
                  {shortlistPlayers.length > 0 ? shortlistPlayers.map((player) => (
                    <tr key={player['COL 1']} className="hover:bg-blue-600/5 transition-all group">
                      <td className="py-6 px-10">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-[#1e293b] rounded-xl flex items-center justify-center border border-gray-700/50 shadow-inner group-hover:border-blue-500/30 transition-all">
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
                          {/* BOTÃO PARA O PERFIL */}
                          <button 
                            onClick={() => navigate(`/perfil/${player['COL 1']}`)}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-blue-900/40"
                          >
                            Profile <ExternalLink size={12} />
                          </button>
                          
                          {/* BOTÃO PARA APAGAR */}
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
  );
}