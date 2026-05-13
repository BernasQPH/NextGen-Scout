import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, BarChart3, Sword, User, LogOut, Menu, X 
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
  return academies[String(id)] || id;
};

export default function PlayerSearch() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [shortlist, setShortlist] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [posFilter, setPosFilter] = useState("All Positions");
  const [ageFilter, setAgeFilter] = useState("All Ages");
  const [username, setUsername] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

    axios.get('http://localhost:3001/api/players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error("Erro ao carregar jogadores:", err));

    axios.get('http://localhost:3001/api/shortlist-players')
      .then(res => {
        const idsBD = res.data.map(item => item.player_id);
        console.log("IDs que o sistema vai pintar de amarelo:", idsBD);
        setShortlist(idsBD);
      })
      .catch(err => console.error("Erro ao sincronizar shortlist:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  const toggleShortlist = async (valorIdReal) => {
    const isAlreadyInShortlist = shortlist.includes(valorIdReal);

    if (isAlreadyInShortlist) {
      try {
        await axios.delete(`http://localhost:3001/api/shortlist/${valorIdReal}`);
        setShortlist(shortlist.filter(id => id !== valorIdReal));
      } catch (err) {
        console.error("Erro ao remover:", err);
      }
    } else {
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
    const academyName = getAcademyName(p['COL 3']);
    const matchesName = p['COL 2']?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        academyName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPos = posFilter === "All Positions" || p['COL 4'] === posFilter;
    const matchesAge = ageFilter === "All Ages" || p['COL 15']?.toString() === ageFilter;
    return matchesName && matchesPos && matchesAge;
  });

  const positions = ["All Positions", ...new Set(players.map(p => p['COL 4']).filter(Boolean))];
  const ages = ["All Ages", ...new Set(players.map(p => p['COL 15']).filter(Boolean))].sort();

  return (
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">

     
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
        <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0 h-full">
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/dashboard')} />
            <NavItem icon={Search} label="Player Search" active onClick={() => navigate('/search')} />
            <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
            <NavItem icon={Users} label="Academies" onClick={() => navigate('/academies')} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => navigate('/player-performance')} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
          <div className="p-10 h-full flex flex-col">
            
            <header className="mb-8 shrink-0 flex justify-between items-start">
              <div>
                <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">PLAYER SEARCH</h1>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-8">Explore youth players</p>
              </div>
              
              {username && (
                <div className="flex items-center gap-4">
                  <div className="bg-[#111827] border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                       <span className="text-white font-black">{username}</span>
                    </span>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-12 h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 flex items-center justify-center transition-all group shrink-0 shadow-lg"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              )}
            </header>

            <div className="flex gap-4 items-center bg-[#111827]/80 p-4 rounded-2xl border border-gray-800 mb-8 shrink-0">
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
                <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:border-blue-500 cursor-pointer" onChange={(e) => setPosFilter(e.target.value)}>
                  {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                </select>
              </div>
              <div className="w-32 relative">
                <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:border-blue-500 cursor-pointer" onChange={(e) => setAgeFilter(e.target.value)}>
                  {ages.map(age => <option key={age} value={age}>{age}</option>)}
                </select>
              </div>
            </div>

            <div className="flex-1 bg-[#111827]/30 rounded-3xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl">
              <div className="overflow-x-auto overflow-y-auto h-full w-full scrollbar-thin scrollbar-thumb-gray-800">
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
                          <span className="text-gray-400 font-medium text-sm">{getAcademyName(player['COL 3'])}</span>
                        </td>
                        <td className="py-8 px-6 text-center">
                          <span className="inline-block bg-green-500/10 text-green-400 px-3 py-1 rounded-md border border-green-500/20 text-[10px] font-black uppercase">
                            {player['COL 4']}
                          </span>
                        </td>
                        <td className="py-8 px-8 text-right">
                          <button 
                              onClick={() => {
                                  const playerID = player["COL 1"] || player.id; 
                                  if (playerID) navigate(`/perfil/${playerID}`);
                              }}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-xl text-[10px] font-black uppercase transition-all active:scale-95 border-none cursor-pointer"
                          >
                              Profile
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="py-20 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold italic">
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


    
      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden relative">
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic mt-2">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }} />
            <NavItem icon={Search} label="Player Search" active onClick={() => { setIsMobileMenuOpen(false); navigate('/search'); }} />
            <NavItem icon={Star} label="Shortlist" onClick={() => { setIsMobileMenuOpen(false); navigate('/shortlist'); }} />
            <NavItem icon={Users} label="Academies" onClick={() => { setIsMobileMenuOpen(false); navigate('/academies'); }} />
            <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => { setIsMobileMenuOpen(false); navigate('/comparison'); }} />
            <NavItem icon={Trophy} label="Dream Team" onClick={() => { setIsMobileMenuOpen(false); navigate('/dreamteam'); }} />
            <NavItem icon={BarChart3} label="Player Performance" onClick={() => { setIsMobileMenuOpen(false); navigate('/player-performance'); }} />
          </nav>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
          <div className="p-4 h-full flex flex-col">
            
            <header className="mb-6 shrink-0 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
                >
                  <Menu size={24} />
                </button>
                <div>
                  <h1 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-1">SEARCH</h1>
                  <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest">Explore youth players</p>
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

           
            <div className="flex flex-col gap-3 items-stretch bg-[#111827]/80 p-4 rounded-2xl border border-gray-800 mb-4 shrink-0">
              <div className="relative w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search by name or academy..."
                  className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-xs focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-2 w-full">
                <div className="relative flex-1">
                  <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-3 text-[10px] appearance-none outline-none focus:border-blue-500 cursor-pointer font-bold uppercase tracking-widest text-gray-300" onChange={(e) => setPosFilter(e.target.value)}>
                    {positions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                  </select>
                </div>
                <div className="relative flex-1">
                  <select className="w-full bg-[#0b1120] border border-gray-700 rounded-xl py-3 px-3 text-[10px] appearance-none outline-none focus:border-blue-500 cursor-pointer font-bold uppercase tracking-widest text-gray-300" onChange={(e) => setAgeFilter(e.target.value)}>
                    {ages.map(age => <option key={age} value={age}>{age}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-[#111827]/30 rounded-2xl border border-gray-800 overflow-hidden flex flex-col shadow-2xl">
              <div className="overflow-x-auto overflow-y-auto h-full w-full scrollbar-thin scrollbar-thumb-gray-800">
                <table className="w-full text-left border-separate border-spacing-0 min-w-full">
                  <thead className="sticky top-0 bg-[#0f172a] z-10">
                    <tr className="text-[9px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-gray-800">
                      <th className="py-3 px-4 w-auto">Player</th>
                      <th className="py-3 px-2 text-center w-auto">Position</th>
                      <th className="py-3 px-4 text-right w-auto">‎ </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/50">
                    {filteredPlayers.length > 0 ? filteredPlayers.map((player, index) => (
                      <tr key={index} className="hover:bg-blue-600/5 transition-all group">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => toggleShortlist(player['COL 1'])}
                              className="bg-transparent border-none p-0 outline-none cursor-pointer flex items-center justify-center transition-transform active:scale-90"
                            >
                              <Star 
                                size={16} 
                                fill={shortlist.includes(player['COL 1']) ? "#eab308" : "none"} 
                                className={shortlist.includes(player['COL 1']) ? "text-yellow-500" : "text-gray-600"} 
                              />
                            </button>

                            <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-700 shrink-0">
                              <User size={14} className="text-gray-500" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-xs uppercase italic tracking-tight truncate max-w-[100px]">
                                {player['COL 2']}
                              </span>
                              <span className="block text-gray-500 text-[9px] mt-0.5 truncate max-w-[100px]">
                                {getAcademyName(player['COL 3'])}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-center">
                          <span className="inline-block bg-green-500/10 text-green-400 px-2 py-0.5 rounded-md border border-green-500/20 text-[8px] font-black uppercase">
                            {player['COL 4']}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button 
                              onClick={() => {
                                  const playerID = player["COL 1"] || player.id; 
                                  if (playerID) navigate(`/perfil/${playerID}`);
                              }}
                              className="bg-blue-600 text-white py-1.5 px-3 rounded-lg text-[9px] font-black uppercase transition-all active:scale-95 border-none cursor-pointer"
                          >
                              Profile
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="3" className="py-20 text-center text-gray-600 uppercase tracking-widest text-[10px] font-bold italic px-4">
                          Nenhum jogador encontrado.
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