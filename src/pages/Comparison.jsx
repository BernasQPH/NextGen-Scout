import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, BarChart3, LogOut, Menu, X 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

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

// --- ALGORITMO DE SCOUTING ---
const calculateOverall = (player) => {
  if (!player) return 0;
  const pos = (player["COL 4"] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  
  const finishing = Number(player['COL 5']) || 0;
  const passing = Number(player['COL 6']) || 0;
  const aggression = Number(player['COL 7']) || 0;
  const decisions = Number(player['COL 8']) || 0;
  const reflexes = Number(player['COL 9']) || 0;
  const heading = Number(player['COL 10']) || 0;
  const crossing = Number(player['COL 11']) || 0;
  const pace = Number(player['COL 14']) || 0;

  let total = 0;
  if (pos === 'guarda-redes') total = (reflexes + decisions) / 2;
  else if (pos === 'defesa central') total = (heading + aggression + decisions + pace) / 4;
  else if (pos === 'defesa direito' || pos === 'defesa esquerdo') total = (pace + crossing + aggression + decisions) / 4;
  else if (pos === 'medio defensivo') total = (aggression + passing + decisions) / 3;
  else if (pos === 'medio centro') total = (passing + decisions + pace) / 3;
  else if (pos === 'medio ofensivo') total = (passing + decisions + finishing + pace) / 4;
  else if (pos === 'extremo esquerdo' || pos === 'extremo direito') total = (pace + crossing + passing + decisions) / 4;
  else if (pos === 'ponta de lanca') total = (finishing + heading + pace + decisions) / 4;
  else total = (passing + decisions + pace) / 3;

  return total.toFixed(1);
};


const PlayerSelector = ({ value, onChange, color, label, players, maxSuggestions = 10 }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posFilter, setPosFilter] = useState("");
  const [randomPlayers, setRandomPlayers] = useState([]);

  useEffect(() => {
    if (players.length > 0) {
      const shuffled = [...players].sort(() => 0.5 - Math.random());
      setRandomPlayers(shuffled.slice(0, maxSuggestions));
    }
  }, [players, maxSuggestions]);

  const uniquePositions = [...new Set(players.map(p => (p['COL 4'] || "").trim()))].filter(Boolean);
  const isFiltering = searchTerm.trim() !== "" || posFilter !== "";

  const displayPlayers = isFiltering 
    ? players.filter(p => {
        const matchName = (p['COL 2'] || "").toLowerCase().includes(searchTerm.toLowerCase());
        const matchPos = posFilter === "" || (p['COL 4'] || "").trim() === posFilter;
        return matchName && matchPos;
      })
    : randomPlayers;

  const selectedPlayer = players.find(p => String(p['COL 1']) === String(value));
  
  const activeBorder = color.includes('blue') ? 'border-blue-500/50 bg-blue-500/10' : 'border-emerald-500/50 bg-emerald-500/10';

  return (
    <div className="flex-1 w-full bg-[#0f172a] border border-gray-800 p-6 max-md:p-4 rounded-3xl shadow-lg relative flex flex-col h-[420px] max-md:h-[300px] overflow-hidden shrink-0">
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 shrink-0">{label}</label>
      
      
      <div className="flex gap-2 mb-4 shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
          <input 
            type="text" 
            placeholder="Search name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0b1120] text-white border border-gray-800 rounded-xl py-2.5 pl-9 pr-3 outline-none text-xs max-md:text-[10px] font-bold focus:border-gray-600 transition-all placeholder-gray-600"
          />
        </div>
        <select
          value={posFilter}
          onChange={(e) => setPosFilter(e.target.value)}
          className="bg-[#0b1120] text-white border border-gray-800 rounded-xl px-3 py-2.5 outline-none text-[10px] max-md:text-[9px] font-black uppercase tracking-widest focus:border-gray-600 transition-all w-28 max-md:w-20 cursor-pointer"
        >
          <option value="">ALL POS</option>
          {uniquePositions.map(pos => (
            <option key={pos} value={pos}>{pos}</option>
          ))}
        </select>
      </div>

      
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-2 mb-4 space-y-1">
        {displayPlayers.map(p => {
          const isSelected = String(value) === String(p['COL 1']);
          return (
            <div 
              key={p['COL 1']} 
              onClick={() => onChange(p['COL 1'])}
              className={`p-3 rounded-xl border text-xs cursor-pointer flex justify-between items-center transition-all ${isSelected ? activeBorder : 'border-transparent bg-gray-800/30 hover:bg-gray-800'}`}
            >
              <div className="flex flex-col">
                <span className={`font-bold max-md:text-[10px] max-md:truncate max-md:w-24 ${isSelected ? 'text-white' : 'text-gray-300'}`}>{p['COL 2']}</span>
                <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{p['COL 4']}</span>
              </div>
              <div className="text-[10px] font-black text-gray-400 bg-[#0b1120] px-2 py-1 rounded-lg">
                {calculateOverall(p)}
              </div>
            </div>
          );
        })}
        {displayPlayers.length === 0 && (
          <div className="text-center text-gray-500 text-xs font-bold uppercase tracking-widest py-8">
            No players found.
          </div>
        )}
      </div>

      
      <div className="h-16 border-t border-gray-800 pt-4 flex items-center justify-between shrink-0">
        {selectedPlayer ? (
          <>
            <div>
              <div className="text-lg max-md:text-sm font-black uppercase italic truncate max-w-[180px] max-md:max-w-[140px]">{selectedPlayer['COL 2']}</div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{selectedPlayer['COL 4']}</div>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border-2 ${color.includes('blue') ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500'}`}>
                {calculateOverall(selectedPlayer)}
              </div>
            </div>
          </>
        ) : (
          <div className="text-xs max-md:text-[10px] font-bold text-gray-500 uppercase tracking-widest w-full text-center">
            Waiting for selection...
          </div>
        )}
      </div>
    </div>
  );
};

export default function Comparison() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");
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
      .catch(err => console.error(err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  const player1 = players.find(p => String(p['COL 1']) === String(player1Id));
  const player2 = players.find(p => String(p['COL 1']) === String(player2Id));

  const getRadarData = () => {
    const p1 = player1 || {};
    const p2 = player2 || {};
    return [
      { subject: 'Finishing', A: Number(p1['COL 5']) || 0, B: Number(p2['COL 5']) || 0 },
      { subject: 'Passing', A: Number(p1['COL 6']) || 0, B: Number(p2['COL 6']) || 0 },
      { subject: 'Aggression', A: Number(p1['COL 7']) || 0, B: Number(p2['COL 7']) || 0 },
      { subject: 'Decisions', A: Number(p1['COL 8']) || 0, B: Number(p2['COL 8']) || 0 },
      { subject: 'Reflexes', A: Number(p1['COL 9']) || 0, B: Number(p2['COL 9']) || 0 },
      { subject: 'Heading', A: Number(p1['COL 10']) || 0, B: Number(p2['COL 10']) || 0 },
      { subject: 'Crossing', A: Number(p1['COL 11']) || 0, B: Number(p2['COL 11']) || 0 },
      { subject: 'Pace', A: Number(p1['COL 14']) || 0, B: Number(p2['COL 14']) || 0 },
    ];
  };

  const radarData = getRadarData();

  return (
    
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">

      
      <div className="hidden lg:flex h-full w-full overflow-hidden">
        
       
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
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" active />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" />
          </nav>
        </aside>

        
        <main className="flex-1 p-10 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          
          <header className="mb-8 flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2 leading-none">COMPARISON</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Head-to-head analysis</p>
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

          {/* SELETORES DE JOGADOR */}
          <div className="flex flex-row gap-8 mb-8">
            <PlayerSelector 
              value={player1Id} 
              onChange={setPlayer1Id} 
              color="bg-blue-500" 
              label="Player A (Blue)" 
              players={players} 
            />
            <PlayerSelector 
              value={player2Id} 
              onChange={setPlayer2Id} 
              color="bg-emerald-500" 
              label="Player B (Green)" 
              players={players} 
            />
          </div>

          
          {player1Id && player2Id ? (
            <div className="bg-[#111827]/50 rounded-3xl border border-gray-800 p-8 flex items-center justify-center shadow-2xl relative">
              
              <div className="w-full h-[450px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} tick={{ fill: '#4b5563', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Radar name={player1['COL 2']} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Radar name={player2['COL 2']} dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* TABELA RÁPIDA DE VANTAGEM */}
              <div className="absolute top-8 right-8 bg-[#0f172a] border border-gray-800 rounded-xl p-4 w-64 shadow-lg">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">Stat Winners</h3>
                {radarData.map(stat => (
                  <div key={stat.subject} className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500 font-bold uppercase">{stat.subject}</span>
                    {stat.A > stat.B ? (
                      <span className="text-xs text-blue-400 font-black">{player1['COL 2']} (+{stat.A - stat.B})</span>
                    ) : stat.B > stat.A ? (
                      <span className="text-xs text-emerald-400 font-black">{player2['COL 2']} (+{stat.B - stat.A})</span>
                    ) : (
                      <span className="text-xs text-gray-500 font-black">TIE</span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-[#111827]/30 border border-gray-800 border-dashed rounded-3xl h-64 flex flex-col items-center justify-center text-gray-500">
              <ArrowLeftRight size={48} className="mb-4 opacity-50" />
              <p className="text-sm font-bold uppercase tracking-widest text-center">Select two players to compare</p>
            </div>
          )}
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
            <Trophy size={28} /><span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Search} label="Player Search" path="/search" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Star} label="Shortlist" path="/shortlist" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Users} label="Academies" path="/academies" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" active onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </aside>

        <main className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
          
          <header className="mb-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"
              >
                <Menu size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">COMPARISON</h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Head-to-head</p>
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

          
          <div className="flex flex-col gap-4 mb-6">
            <PlayerSelector 
              value={player1Id} 
              onChange={setPlayer1Id} 
              color="bg-blue-500" 
              label="Player A (Blue)" 
              players={players} 
              maxSuggestions={5}
            />
            <PlayerSelector 
              value={player2Id} 
              onChange={setPlayer2Id} 
              color="bg-emerald-500" 
              label="Player B (Green)" 
              players={players} 
              maxSuggestions={5}
            />
          </div>

          
          {player1Id && player2Id ? (
            <div className="bg-[#111827]/50 rounded-3xl border border-gray-800 p-4 flex flex-col items-center justify-center shadow-2xl relative gap-6 mb-10">
              
             
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 20]} tick={{ fill: '#4b5563', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1f2937', borderRadius: '8px' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Radar name={player1['COL 2']} dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                    <Radar name={player2['COL 2']} dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

             
              <div className="w-full bg-[#0f172a] border border-gray-800 rounded-xl p-4 shadow-lg">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">Stat Winners</h3>
                {radarData.map(stat => (
                  <div key={stat.subject} className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 font-bold uppercase">{stat.subject}</span>
                    {stat.A > stat.B ? (
                      <span className="text-[10px] text-blue-400 font-black">{player1['COL 2']} (+{stat.A - stat.B})</span>
                    ) : stat.B > stat.A ? (
                      <span className="text-[10px] text-emerald-400 font-black">{player2['COL 2']} (+{stat.B - stat.A})</span>
                    ) : (
                      <span className="text-[10px] text-gray-500 font-black">TIE</span>
                    )}
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="bg-[#111827]/30 border border-gray-800 border-dashed rounded-3xl h-48 flex flex-col items-center justify-center text-gray-500 mb-10">
              <ArrowLeftRight size={32} className="mb-3 opacity-50" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-center">Select two players<br/>to compare</p>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}