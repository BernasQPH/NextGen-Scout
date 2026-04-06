import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, User, ChevronDown 
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

export default function PlayerSearch() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [shortlist, setShortlist] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [posFilter, setPosFilter] = useState("All Positions");
  const [ageFilter, setAgeFilter] = useState("All Ages");

  useEffect(() => {
  // 1. Carregar jogadores
  axios.get('http://localhost:3001/api/players')
    .then(res => setPlayers(res.data))
    .catch(err => console.error("Erro ao carregar jogadores:", err));

  // 2. Carregar a shortlist e sincronizar as estrelas
  axios.get('http://localhost:3001/api/shortlist-players')
    .then(res => {
      // Aqui está o truque: extraímos o 'player_id' de cada objeto que vem da BD
      const idsBD = res.data.map(item => item.player_id);
      
      console.log("IDs que o sistema vai pintar de amarelo:", idsBD);
      setShortlist(idsBD);
    })
    .catch(err => console.error("Erro ao sincronizar shortlist:", err));
}, []);

  // FUNÇÃO DE TOGGLE (ADICIONAR/REMOVER)
  const toggleShortlist = async (valorIdReal) => {
    const isAlreadyInShortlist = shortlist.includes(valorIdReal);

    if (isAlreadyInShortlist) {
      // REMOVER
      try {
        await axios.delete(`http://localhost:3001/api/shortlist/${valorIdReal}`);
        setShortlist(shortlist.filter(id => id !== valorIdReal));
      } catch (err) {
        console.error("Erro ao remover:", err);
      }
    } else {
      // ADICIONAR
      try {
        await axios.post('http://localhost:3001/api/shortlist', {
          player_id: valorIdReal, 
          data_adicionado: new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
        setShortlist([...shortlist, valorIdReal]);
      } catch (err) {
        console.error("Erro ao adicionar:", err);
      }
    }
  };

  const filteredPlayers = players.filter(p => {
    const matchesName = p['COL 2']?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p['COL 3']?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = posFilter === "All Positions" || p['COL 4'] === posFilter;
    const matchesAge = ageFilter === "All Ages" || p['COL 6']?.toString() === ageFilter;
    return matchesName && matchesPos && matchesAge;
  });

  const positions = ["All Positions", ...new Set(players.map(p => p['COL 4']).filter(Boolean))];
  const ages = ["All Ages", ...new Set(players.map(p => p['COL 6']).filter(Boolean))].sort();

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter">
          <Trophy size={28} className="fill-blue-500/20" />
          <span>NextGen <span className="text-white">Scout</span></span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" active onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" />
          <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
          <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
        <div className="p-10 h-full flex flex-col">
          <header className="mb-8 shrink-0">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">PLAYER SEARCH</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Explore youth players</p>
            
            <div className="flex gap-4 items-center bg-[#111827]/80 p-4 rounded-2xl border border-gray-800">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or academy..."
                  className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="w-48 relative">
                <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:border-blue-500" onChange={(e) => setPosFilter(e.target.value)}>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
              <div className="w-32 relative">
                <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:border-blue-500" onChange={(e) => setAgeFilter(e.target.value)}>
                  {ages.map(age => <option key={age} value={age}>{age}</option>)}
                </select>
              </div>
            </div>
          </header>

          <div className="flex-1 bg-[#111827]/30 rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl">
            <div className="overflow-x-auto overflow-y-auto h-full">
              <table className="w-full text-left border-separate border-spacing-0">
                <thead className="sticky top-0 bg-[#0f172a] z-10">
                  <tr className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-800">
                    <th className="py-5 px-8 w-[350px]">Player</th>
                    <th className="py-5 px-6 w-[250px]">Academy</th>
                    <th className="py-5 px-6 text-center w-[200px]">Position</th>
                    <th className="py-5 px-8 text-right w-[150px]">‎ </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50">
                  {filteredPlayers.length > 0 ? filteredPlayers.map((player, index) => (
                    <tr key={index} className="hover:bg-blue-600/5 transition-all group">
                      <td className="py-8 px-8">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleShortlist(player['COL 1'])}
                            className="bg-transparent border-none p-0 outline-none cursor-pointer flex items-center justify-center transition-transform active:scale-90"
                          >
                            <Star 
                              size={20} 
                              fill={shortlist.includes(player['COL 1']) ? "#eab308" : "none"} 
                              className={shortlist.includes(player['COL 1']) ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500 opacity-40 group-hover:opacity-100 transition-all"} 
                            />
                          </button>

                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 group-hover:border-blue-500/50 shrink-0 transition-colors">
                            <User size={18} className="text-gray-500 group-hover:text-blue-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-base uppercase italic tracking-tight group-hover:text-blue-400 transition-colors">
                              {player['COL 2']}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-8 px-6">
                        <span className="text-gray-400 font-medium text-sm">{player['COL 3']}</span>
                      </td>
                      <td className="py-8 px-6 text-center">
                        <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-md border border-green-500/20 text-[10px] font-black uppercase">
                          {player['COL 4']}
                        </span>
                      </td>
           <td className="py-8 px-8 text-right">
    <button 
        onClick={() => {
            // Se o ID está na COL 1, acedemos assim:
            const playerID = player["COL 1"] || player.id; 
            console.log("ID detetado:", playerID);
            
            if (playerID) {
                navigate(`/perfil/${playerID}`);
            } else {
                alert("Erro: ID não encontrado. Verifica a consola (F12)");
                console.log("Objeto do jogador completo:", player);
            }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 border-none cursor-pointer"
    >
        Profile
    </button>
</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-20 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold italic">
                        Nenhum jogador encontrado na base de dados.
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