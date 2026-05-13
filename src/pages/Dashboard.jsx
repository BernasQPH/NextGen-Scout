import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, BarChart3, ArrowRight, LogOut, TrendingUp, Activity, Shield, Menu, X 
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const calculateCurrentQuality = (player) => {
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
  
  if (pos === 'guarda-redes') {
    total = (reflexes + decisions) / 2;
  } 
  else if (pos === 'defesa central') {
    total = (heading + aggression + decisions + passing) / 4;
  } 
  else if (pos === 'defesa direito' || pos === 'defesa esquerdo') {
    total = (pace + crossing + aggression + decisions) / 4;
  } 
  else if (pos === 'medio defensivo') {
    total = (aggression + passing + decisions) / 3;
  } 
  else if (pos === 'medio centro') {
    total = (passing + decisions + pace) / 3;
  } 
  else if (pos === 'medio ofensivo') {
    total = (passing + decisions + finishing + pace) / 4;
  } 
  else if (pos === 'extremo esquerdo' || pos === 'extremo direito') {
    total = (pace + crossing + passing + decisions) / 4;
  } 
  else if (pos === 'ponta de lanca') {
    total = (finishing + heading + pace + decisions) / 4;
  } 
  else {
    total = (passing + decisions + pace) / 3;
  }

  return total.toFixed(1);
};

const StatCard = ({ label, value, trend, icon: Icon }) => (
  <div className="bg-[#111827] p-8 rounded-[2rem] border border-gray-800 hover:border-blue-500/50 transition-all shadow-2xl flex flex-col justify-between min-h-[220px] flex-1">
    <div className="flex justify-between items-start">
      <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
        <Icon size={24} className="text-blue-500" />
      </div>
      <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
        {trend}
      </span>
    </div>
    
    <div>
      <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="text-4xl font-black text-white italic tracking-tighter">{value}</div>
    </div>
  </div>
);

const HotTargetCard = ({ name, position, rating, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#111827]/80 border border-gray-800 p-6 rounded-[2rem] hover:border-blue-500/40 cursor-pointer transition-all shadow-xl group relative overflow-hidden flex items-center justify-between"
  >
    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full group-hover:bg-blue-600/20 transition-all duration-500"></div>
    
    <div className="flex items-center gap-5 relative z-10">
      <div className="w-14 h-14 bg-gray-900 border border-gray-700/50 rounded-2xl flex items-center justify-center text-blue-500 font-black text-sm shadow-inner group-hover:scale-110 transition-transform shrink-0">
        {position}
      </div>
      <div className="truncate">
        <h3 className="text-white font-black text-lg italic tracking-tight group-hover:text-blue-400 transition-colors truncate">{name}</h3>
        <p className="text-gray-500 text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 mt-1">
          <Activity size={10} className="text-emerald-500 animate-pulse shrink-0"/> Observing
        </p>
      </div>
    </div>
    
    <div className="relative z-10 text-right pl-4 border-l border-gray-800 shrink-0">
      <div className="text-2xl font-black text-white leading-none">{rating}</div>
      <div className="text-[8px] text-gray-500 uppercase tracking-widest font-black mt-1">Rating</div>
    </div>
  </div>
);

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ totalPlayers: 0, totalAcademies: 0, shortlistCount: 0 });
  const [randomAcademy, setRandomAcademy] = useState(null);
  const [hotTargets, setHotTargets] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username);
      } catch (e) {
        console.error("Erro ao processar dados", e);
      }
    } else {
      navigate('/register');
    }

    axios.get('http://localhost:3001/api/stats')
      .then(res => {
        const stats = res.data;
        setData({
          totalPlayers: stats.totalPlayers || stats.players || 0,
          totalAcademies: stats.totalAcademies || stats.academies || 0,
          shortlistCount: stats.shortlistCount || stats.shortlist || 0
        });
      })
      .catch(err => console.error("Erro stats", err));

    axios.get('http://localhost:3001/api/academies')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const pool = res.data;
          setRandomAcademy(pool[Math.floor(Math.random() * pool.length)]);
        }
      })
      .catch(err => {
        setError("Erro de ligação");
        setRandomAcademy({ nome: "Benfica Campus", pais: "Portugal", rating: 5 });
      });

    axios.get('http://localhost:3001/api/players')
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const shuffled = [...res.data].sort(() => 0.5 - Math.random());
          setHotTargets(shuffled.slice(0, 3));
        }
      })
      .catch(err => console.error("Erro players", err));

  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user'); 
    navigate('/register'); 
  };

  const getShortPos = (pos) => {
    if (!pos) return 'MC';
    const p = String(pos).toLowerCase(); 
    if (p.includes('guarda')) return 'GR';
    if (p.includes('central')) return 'DC';
    if (p.includes('defesa direito')) return 'DD';
    if (p.includes('defesa esquerdo')) return 'DE';
    if (p.includes('defensivo')) return 'MDC';
    if (p.includes('ofensivo')) return 'MOC';
    if (p.includes('lanca')) return 'PL';
    if (p.includes('direito')) return 'ED';
    if (p.includes('esquerdo')) return 'EE';
    return 'MC';
  };

  return (
    <div className="h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans relative">
      
      {/* VERSÃO DESKTOP */}
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
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" />
          </nav>
        </aside>

        <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b1120] to-[#0f172a] scrollbar-thin scrollbar-thumb-gray-800">
          <header className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Dashboard</h1>
              <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Central Data System</p>
            </div>
            {username && (
              <div className="flex items-center gap-4 mt-1">
                <div className="flex bg-[#111827] border border-gray-800 px-6 py-3 rounded-2xl items-center gap-3 shadow-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                  <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                    Welcome Back, <span className="text-white font-black">{username}</span>
                  </span>
                </div>
                <button onClick={handleLogout} className="w-12 h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 flex items-center justify-center transition-all group shadow-lg shrink-0">
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </header>

          <div className="flex flex-row gap-8 mb-12 w-full">
            <StatCard label="Number of Players" value={data.totalPlayers.toLocaleString()} trend="Observable" icon={Users} />
            <StatCard label="Number of Academies" value={data.totalAcademies} trend="Youth" icon={Trophy} />
            <StatCard label="Shortlisted Players" value={data.shortlistCount} trend="Active" icon={Star} />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
                  <TrendingUp size={14} /> Scout Radar
                </h2>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Live Feed</span>
              </div>
              <div className="flex flex-col gap-4">
                {hotTargets.length > 0 ? hotTargets.map((p, idx) => (
                  <HotTargetCard 
                    key={idx}
                    name={p['COL 2'] || p.name || 'Desconhecido'}
                    position={getShortPos(p['COL 4'] || p.position)}
                    rating={calculateCurrentQuality(p)}
                    onClick={() => navigate(`/perfil/${p['COL 1'] || p.id}`)}
                  />
                )) : (
                  <div className="bg-[#111827]/40 border border-gray-800 border-dashed rounded-[2rem] p-8 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Loading radar data...
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-6 flex items-center gap-2">
                <Shield size={14} /> Featured Academy
              </h2>
              <div className="group bg-[#111827]/80 p-10 rounded-[2.5rem] border border-gray-800 flex flex-col justify-between hover:border-blue-500 transition-all shadow-2xl relative overflow-hidden h-full min-h-[300px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/10"></div>
                <div className="relative z-10 flex flex-col items-start gap-6">
                  <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700/50 transition-transform group-hover:scale-110 shadow-inner overflow-hidden p-2">
                    {randomAcademy && randomAcademy.logo_url ? (
                      <img src={randomAcademy.logo_url} alt={randomAcademy.nome} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-600 text-xs font-black uppercase tracking-tighter">Logo</span>
                    )}
                  </div>
                  <div>
                    {randomAcademy ? (
                      <>
                        <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-4">{randomAcademy.nome}</h3>
                        <div className="flex flex-wrap items-center gap-4 mb-2">
                          <div className="flex gap-1 bg-[#0b1120] px-3 py-1.5 rounded-lg border border-gray-800 shadow-inner w-max">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < Number(randomAcademy.rating) ? "#d3b405" : "none"} className={i < Number(randomAcademy.rating) ? "text-amber-500" : "text-gray-700"} />
                            ))}
                          </div>
                          <p className="text-gray-400 uppercase text-[9px] tracking-[0.2em] font-bold flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                            {randomAcademy.pais}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 italic uppercase tracking-widest text-[10px]">Updating...</div>
                    )}
                  </div>
                </div>
                <div className="mt-6 relative z-10 w-full">
                  <button onClick={() => navigate('/academies')} className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                    Explore Network <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* VERSÃO MOBILE */}
      <div className="flex lg:hidden flex-col h-full w-full overflow-hidden relative">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}
        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white"><X size={24} /></button>
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter mt-2">
            <Trophy size={28} className="fill-blue-500/20" />
            <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1 flex-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Search} label="Player Search" path="/search" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Star} label="Shortlist" path="/shortlist" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Users} label="Academies" path="/academies" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Trophy} label="Dream Team" path="/dreamteam" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" onClick={() => setIsMobileMenuOpen(false)} />
          </nav>
        </aside>

        <main className="flex-1 p-4 overflow-y-auto bg-gradient-to-br from-[#0b1120] to-[#0f172a] scrollbar-thin scrollbar-thumb-gray-800">
          <header className="flex justify-between items-center mb-8 shrink-0">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsMobileMenuOpen(true)} className="bg-[#111827] border border-gray-800 p-2.5 rounded-xl text-gray-400 hover:text-white transition-colors"><Menu size={24} /></button>
              <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none mb-1">Dashboard</h1>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Central Data System</p>
              </div>
            </div>
            {username && (
              <button onClick={handleLogout} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-lg border border-red-500/20 flex items-center justify-center transition-all shadow-md shrink-0 text-[10px] font-black uppercase tracking-widest">
                Logout
              </button>
            )}
          </header>

          <div className="flex flex-col gap-4 mb-8 w-full">
            <StatCard label="Number of Players" value={data.totalPlayers.toLocaleString()} trend="Observable" icon={Users} />
            <StatCard label="Number of Academies" value={data.totalAcademies} trend="Youth" icon={Trophy} />
            <StatCard label="Shortlisted Players" value={data.shortlistCount} trend="Active" icon={Star} />
          </div>

          <div className="flex flex-col gap-8 mb-6">
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2"><TrendingUp size={14} /> Scout Radar</h2>
                <span className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Live Feed</span>
              </div>
              <div className="flex flex-col gap-3">
                {hotTargets.length > 0 ? hotTargets.map((p, idx) => (
                  <HotTargetCard 
                    key={idx}
                    name={p['COL 2'] || p.name || 'Desconhecido'}
                    position={getShortPos(p['COL 4'] || p.position)}
                    rating={calculateCurrentQuality(p)}
                    onClick={() => navigate(`/perfil/${p['COL 1'] || p.id}`)}
                  />
                )) : (
                  <div className="bg-[#111827]/40 border border-gray-800 border-dashed rounded-2xl p-6 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Loading radar data...
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-4 flex items-center gap-2"><Shield size={14} /> Featured Academy</h2>
              <div className="group bg-[#111827]/80 p-6 rounded-3xl border border-gray-800 flex flex-col justify-between hover:border-blue-500 transition-all shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-[50px] -mr-16 -mt-16 transition-all group-hover:bg-blue-600/10"></div>
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-700/50 transition-transform shadow-inner overflow-hidden p-1.5">
                    {randomAcademy && randomAcademy.logo_url ? (
                      <img src={randomAcademy.logo_url} alt={randomAcademy.nome} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-gray-600 text-[8px] font-black uppercase tracking-tighter">Logo</span>
                    )}
                  </div>
                  <div>
                    {randomAcademy ? (
                      <>
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-3 leading-none">{randomAcademy.nome}</h3>
                        <div className="flex flex-col gap-2 mb-2">
                          <div className="flex gap-1 bg-[#0b1120] px-3 py-1.5 rounded-lg border border-gray-800 shadow-inner w-max">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={10} fill={i < Number(randomAcademy.rating) ? "#d3b405" : "none"} className={i < Number(randomAcademy.rating) ? "text-amber-500" : "text-gray-700"} />
                            ))}
                          </div>
                          <p className="text-gray-400 uppercase text-[9px] tracking-[0.2em] font-bold flex items-center gap-1.5 mt-1">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                            {randomAcademy.pais}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 italic uppercase tracking-widest text-[10px]">Updating...</div>
                    )}
                  </div>
                </div>
                <div className="mt-6 relative z-10 w-full">
                  <button onClick={() => navigate('/academies')} className="w-full bg-blue-600/10 text-blue-400 border border-blue-500/30 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95">
                    Explore Network <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

    </div>
  );
}