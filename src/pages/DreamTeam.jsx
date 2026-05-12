import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, BarChart3, Sword, Zap, RefreshCcw, Play, Menu, X, Trash2 
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

const posMapping = {
  'GK': 'guarda-redes', 'CB': 'defesa central', 'LB': 'defesa esquerdo', 'RB': 'defesa direito',
  'CDM': 'medio defensivo', 'CM': 'medio centro', 'CAM': 'medio ofensivo', 'LM': 'extremo esquerdo',
  'RM': 'extremo direito', 'LW': 'extremo esquerdo', 'RW': 'extremo direito', 'ST': 'ponta de lanca',
  'LDM': 'medio defensivo', 'RDM': 'medio defensivo', 'LAM': 'medio ofensivo', 'RAM': 'medio ofensivo',
  'LWB': 'defesa esquerdo', 'RWB': 'defesa direito'
};

const formations = {
  '4-4-2': [
    { id: 1, pos: 'GK', x: 50, y: 92 },
    { id: 2, pos: 'LB', x: 15, y: 75 }, { id: 3, pos: 'CB', x: 38, y: 78 }, { id: 4, pos: 'CB', x: 62, y: 78 }, { id: 5, pos: 'RB', x: 85, y: 75 },
    { id: 6, pos: 'LM', x: 15, y: 45 }, { id: 7, pos: 'CM', x: 38, y: 50 }, { id: 8, pos: 'CM', x: 62, y: 50 }, { id: 9, pos: 'RM', x: 85, y: 45 },
    { id: 10, pos: 'ST', x: 40, y: 20 }, { id: 11, pos: 'ST', x: 60, y: 20 },
  ],
  '4-3-3': [
    { id: 1, pos: 'GK', x: 50, y: 92 },
    { id: 2, pos: 'LB', x: 15, y: 75 }, { id: 3, pos: 'CB', x: 38, y: 78 }, { id: 4, pos: 'CB', x: 62, y: 78 }, { id: 5, pos: 'RB', x: 85, y: 75 },
    { id: 6, pos: 'CM', x: 30, y: 45 }, { id: 7, pos: 'CDM', x: 50, y: 60 }, { id: 8, pos: 'CM', x: 70, y: 45 },
    { id: 9, pos: 'LW', x: 20, y: 20 }, { id: 10, pos: 'ST', x: 50, y: 12 }, { id: 11, pos: 'RW', x: 80, y: 20 },
  ],
  '4-2-3-1': [
    { id: 1, pos: 'GK', x: 50, y: 92 },
    { id: 2, pos: 'LB', x: 15, y: 75 }, { id: 3, pos: 'CB', x: 38, y: 78 }, { id: 4, pos: 'CB', x: 62, y: 78 }, { id: 5, pos: 'RB', x: 85, y: 75 },
    { id: 6, pos: 'LDM', x: 35, y: 60 }, { id: 7, pos: 'RDM', x: 65, y: 60 },
    { id: 8, pos: 'LAM', x: 20, y: 35 }, { id: 9, pos: 'CAM', x: 50, y: 35 }, { id: 10, pos: 'RAM', x: 80, y: 35 },
    { id: 11, pos: 'ST', x: 50, y: 15 },
  ],
  '3-5-2': [
    { id: 1, pos: 'GK', x: 50, y: 92 },
    { id: 2, pos: 'CB', x: 30, y: 78 }, { id: 3, pos: 'CB', x: 50, y: 81 }, { id: 4, pos: 'CB', x: 70, y: 78 },
    { id: 5, pos: 'LWB', x: 12, y: 50 }, { id: 6, pos: 'RWB', x: 88, y: 50 },
    { id: 7, pos: 'CDM', x: 50, y: 63 }, { id: 8, pos: 'CM', x: 35, y: 45 }, { id: 9, pos: 'CM', x: 65, y: 45 },
    { id: 10, pos: 'ST', x: 40, y: 18 }, { id: 11, pos: 'ST', x: 60, y: 18 },
  ]
};

export default function DreamTeam() {
  const navigate = useNavigate();
  const [currentFormation, setCurrentFormation] = useState('4-4-2');
  const [dreamTeam, setDreamTeam] = useState({}); 
  const [bench, setBench] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // ESTADO PARA O MENU MOBILE
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username);
      } catch (e) {
        console.error("Erro ao ler sessão", e);
      }
    }

    const saved = localStorage.getItem('nextgen_dreamteam');
    if (saved) {
      const { formation, starters, bench } = JSON.parse(saved);
      setCurrentFormation(formation);
      setDreamTeam(starters);
      setBench(bench);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(dreamTeam).length > 0) {
      localStorage.setItem('nextgen_dreamteam', JSON.stringify({
        formation: currentFormation,
        starters: dreamTeam,
        bench: bench
      }));
    }
  }, [dreamTeam, bench, currentFormation]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user'); 
    navigate('/register'); 
  };

  const getOverallRating = (player) => {
    const pos = (player["COL 4"] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const f=Number(player['COL 5'])||0, p=Number(player['COL 6'])||0, a=Number(player['COL 7'])||0, 
          d=Number(player['COL 8'])||0, r=Number(player['COL 9'])||0, h=Number(player['COL 10'])||0, 
          c=Number(player['COL 11'])||0, pac=Number(player['COL 14'])||0;

    if (pos === 'guarda-redes') return ((r + d) / 2).toFixed(1);
    if (pos === 'defesa central') return ((h + a + d + p) / 4).toFixed(1);
    if (pos === 'defesa direito' || pos === 'defesa esquerdo') return ((pac + c + a + d) / 4).toFixed(1);
    if (pos === 'medio defensivo') return ((a + p + d) / 3).toFixed(1);
    if (pos === 'medio centro') return ((p + d + pac) / 3).toFixed(1);
    if (pos === 'medio ofensivo') return ((p + d + f + pac) / 4).toFixed(1);
    if (pos === 'extremo esquerdo' || pos === 'extremo direito') return ((pac + c + p + d) / 4).toFixed(1);
    if (pos === 'ponta de lanca') return ((f + h + pac + d) / 4).toFixed(1);
    return ((p + d + pac) / 3).toFixed(1);
  };

  const generateDreamTeam = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.get('http://localhost:3001/api/players');
      const allPlayers = res.data.map(p => ({ ...p, calculatedRating: parseFloat(getOverallRating(p)) }));

      const newSelection = {};
      const usedIds = new Set();

      formations[currentFormation].forEach(slot => {
        const dbPosName = posMapping[slot.pos];
        const best = allPlayers
          .filter(p => (p["COL 4"]||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === dbPosName && !usedIds.has(p['COL 1']))
          .sort((a, b) => b.calculatedRating - a.calculatedRating)[0];
        
        if (best) { 
          newSelection[slot.id] = best; 
          usedIds.add(best['COL 1']); 
        }
      });

      const survivors = allPlayers
        .filter(p => !usedIds.has(p['COL 1']))
        .sort((a, b) => b.calculatedRating - a.calculatedRating)
        .slice(0, 8);
      
      setDreamTeam(newSelection);
      setBench(survivors);

      // --- GRAVAR NA BASE DE DADOS (Tabela dream_team) ---
      const starterIds = Object.values(newSelection)
        .map(p => parseInt(p['COL 1'], 10))
        .filter(id => !isNaN(id));

      if (starterIds.length > 0) {
        try {
          await axios.post('http://localhost:3001/api/save_dream_team', { playerIds: starterIds });
          console.log("Dream Team guardada na tabela dream_team com sucesso!");
        } catch (saveErr) {
          console.error("Erro ao gravar na BD:", saveErr);
        }
      }
      // ---------------------------------------------------

      setSelectedSlot(null);
    } catch (err) { console.error(err); }
    setIsGenerating(false);
  };

  const handleSwap = async (benchIndex) => {
    if (selectedSlot === null || !dreamTeam[selectedSlot]) return;
    const newDreamTeam = { ...dreamTeam };
    const newBench = [...bench];
    const playerOnField = newDreamTeam[selectedSlot];
    const playerOnBench = newBench[benchIndex];
    newDreamTeam[selectedSlot] = playerOnBench;
    newBench[benchIndex] = playerOnField;
    setDreamTeam(newDreamTeam);
    setBench(newBench);
    setSelectedSlot(null);

    // --- GRAVAR A TROCA MANUAL NA BASE DE DADOS ---
    const starterIds = Object.values(newDreamTeam)
      .map(p => parseInt(p['COL 1'], 10))
      .filter(id => !isNaN(id));

    if (starterIds.length > 0) {
      try {
        await axios.post('http://localhost:3001/api/save_dream_team', { playerIds: starterIds });
        console.log("Troca de jogador atualizada na tabela dream_team!");
      } catch (saveErr) {
        console.error("Erro ao gravar troca na BD:", saveErr);
      }
    }
    // ----------------------------------------------
  };

  // --- NOVA FUNÇÃO: LIMPAR EQUIPA ---
  const clearDreamTeam = async () => {
    if (!window.confirm("Are you sure you want to clear the Dream Team?")) return;
    
    // Limpar estado local
    setDreamTeam({});
    setBench([]);
    setSelectedSlot(null);
    
    // Limpar localStorage
    localStorage.removeItem('nextgen_dreamteam');
    
    // Tentar limpar a base de dados enviando um array vazio
    try {
      await axios.post('http://localhost:3001/api/save_dream_team', { playerIds: [] });
    } catch (err) {
      console.error("Erro ao limpar BD:", err);
    }
  };

  return (
    // DIV MESTRE: Tranca o ecrã e impede qualquer scroll fantasma
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
            <NavItem icon={Trophy} label="Dream Team" active path="/dreamteam" />
            <NavItem icon={BarChart3} label="Player Performance" path="/player-performance" />
          </nav>
        </aside>

        {/* CONTEÚDO PRINCIPAL */}
        <main className="flex-1 flex flex-col p-10 overflow-hidden">
          
          <header className="mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter">Dream Team</h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em]">Tactical AI Selector</p>
            </div>
            
            <div className="flex gap-4">
               <select 
                 value={currentFormation} 
                 onChange={(e) => {setCurrentFormation(e.target.value); setDreamTeam({}); setBench([]);}} 
                 className="bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-xs font-bold uppercase outline-none focus:ring-2 focus:ring-blue-600 transition-all"
               >
                  {Object.keys(formations).map(f => <option key={f} value={f}>{f} SYSTEM</option>)}
               </select>
               
               <button 
                 onClick={generateDreamTeam} 
                 disabled={isGenerating} 
                 className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
               >
                 <Zap size={14} className="fill-current" />
                 {isGenerating ? "Analyzing..." : "Generate Dream Team"}
               </button>

               {/* BOTÃO CLEAR SQUAD DESKTOP */}
               <button 
                 onClick={clearDreamTeam} 
                 disabled={Object.keys(dreamTeam).length === 0}
                 className="bg-red-600/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2"
               >
                 <Trash2 size={14} /> Clear Squad
               </button>

               <button 
                 onClick={() => navigate('/simulator')}
                 disabled={Object.keys(dreamTeam).length === 0}
                 className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 transition-all active:scale-95 flex items-center gap-2"
               >
                 <Play size={14} className="fill-current" />
                 Match Simulator
               </button>
            </div>
          </header>

          <div className="flex-1 flex gap-10 overflow-hidden">
            <div className="flex-1 bg-gradient-to-b from-emerald-600 to-emerald-900 rounded-[2.5rem] border-4 border-white/20 relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.3) 40px, rgba(0,0,0,0.3) 80px)' }}></div>
              <div className="absolute top-1/2 w-full h-[2.5px] bg-white/20 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-[2.5px] border-white/20 rounded-full"></div>
              
              {formations[currentFormation].map((slot) => {
                const player = dreamTeam[slot.id];
                const isSelected = selectedSlot === slot.id;
                
                const playerPos = (player?.["COL 4"] || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const requiredPos = posMapping[slot.pos];
                
                let statusColor = "bg-blue-600 border-white";

                if (player && playerPos !== requiredPos) {
                  const defense = ['defesa central', 'defesa direito', 'defesa esquerdo'];
                  const midfield = ['medio centro', 'medio defensivo', 'medio ofensivo'];
                  const attack = ['ponta de lanca', 'extremo esquerdo', 'extremo direito'];

                  const isSimilar = 
                    (defense.includes(playerPos) && defense.includes(requiredPos)) ||
                    (midfield.includes(playerPos) && midfield.includes(requiredPos)) ||
                    (attack.includes(playerPos) && attack.includes(requiredPos));

                  statusColor = isSimilar ? "bg-orange-500 border-orange-300" : "bg-red-600 border-red-400";
                }

                return (
                  <div 
                    key={slot.id} 
                    onClick={() => player && setSelectedSlot(prev => prev === slot.id ? null : slot.id)} 
                    style={{ left: `${slot.x}%`, top: `${slot.y}%` }} 
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer transition-all duration-700 z-20 group"
                  >
                    <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-xl transition-all duration-300 
                      ${isSelected ? 'scale-125 border-yellow-400 bg-yellow-400/30 ring-4 ring-yellow-400/20' : 
                        player ? `${statusColor} group-hover:scale-110` : 
                        'bg-black/40 border-white/10'}`}>
                      <span className="text-[10px] font-black text-white">{player ? player.calculatedRating : slot.pos}</span>
                    </div>
                    {player && <span className="mt-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 text-[8px] font-black uppercase whitespace-nowrap tracking-tighter">{player['COL 2'].split(' ').pop()}</span>}
                  </div>
                );
              })}
            </div>

            <aside className="w-85 bg-[#0f172a]/50 rounded-[2rem] border border-gray-800 p-6 flex flex-col backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] flex items-center gap-2">
                  <RefreshCcw size={14} className={selectedSlot ? "animate-spin-slow text-yellow-500" : ""} /> Tactical Bench
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                {bench.length > 0 ? bench.map((p, idx) => (
                  <div key={p['COL 1']} onClick={() => handleSwap(idx)} className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group ${selectedSlot !== null ? 'border-blue-500/50 bg-blue-500/5 hover:border-yellow-500/50 hover:bg-yellow-500/5' : 'border-gray-800 bg-[#111827] hover:border-gray-600'}`}>
                     <div className="flex flex-col">
                        <span className="text-xs font-black uppercase italic leading-tight group-hover:text-blue-400">{p['COL 2']}</span>
                        <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">{p['COL 4']}</span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-xs font-black text-blue-500">{p.calculatedRating}</span>
                        {selectedSlot !== null && <ArrowLeftRight size={12} className="text-yellow-400 mt-1 animate-bounce" />}
                     </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-[10px] font-black uppercase text-center italic space-y-4"><Zap size={32} /><p>Generate team to<br/>populate bench</p></div>
                )}
              </div>
            </aside>
          </div>

        </main>
      </div>


      {/* ========================================================================= */}
      {/* VERSÃO MOBILE EXCLUSIVA - (Visível apenas em ecrãs pequenos)              */}
      {/* ========================================================================= */}
      <div className="flex lg:hidden h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans flex-col relative">
        
        {/* OVERLAY MOBILE */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* SIDEBAR MOBILE */}
        <aside className={`fixed z-50 h-full w-72 bg-[#0f172a] p-8 border-r border-gray-800 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-8 right-2 text-white-500 bg-[#0f172a] hover:text-white">
            <X size={24} />
          </button>
          <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic tracking-tighter mt-2">
            <Trophy size={28} /> <span>NextGen <span className="text-white">Scout</span></span>
          </div>
          <nav className="flex flex-col gap-1">
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Search} label="Player Search" path="/search" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Star} label="Shortlist" path="/shortlist" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Users} label="Academies" path="/academies" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={ArrowLeftRight} label="Comparison" path="/comparison" onClick={() => setIsMobileMenuOpen(false)} />
            <NavItem icon={Trophy} label="Dream Team" active path="/dreamteam" onClick={() => setIsMobileMenuOpen(false)} />
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
              <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Dream Team</h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Tactical AI Selector</p>
            </div>
          </div>
        </header>

        {/* MAIN MOBILE (Lista + Botões, sem campo) */}
        <main className="flex-1 flex flex-col p-4 overflow-hidden">
          <div className="flex flex-col gap-3 mb-4 shrink-0">
            <div className="flex gap-2">
              <select 
                value={currentFormation} 
                onChange={(e) => {setCurrentFormation(e.target.value); setDreamTeam({}); setBench([]);}} 
                className="bg-[#0f172a] border border-gray-800 p-3 rounded-xl text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-blue-600 transition-all flex-1"
              >
                {Object.keys(formations).map(f => <option key={f} value={f}>{f} SYSTEM</option>)}
              </select>
              <button 
                onClick={generateDreamTeam} 
                disabled={isGenerating} 
                className="bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Zap size={14} /> {isGenerating ? "Wait..." : "Generate"}
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => navigate('/simulator')}
                disabled={Object.keys(dreamTeam).length === 0}
                className="bg-emerald-600 flex-1 hover:bg-emerald-500 disabled:opacity-50 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Play size={14} /> Play
              </button>
              
              {/* BOTÃO CLEAR SQUAD MOBILE */}
              <button 
                onClick={clearDreamTeam} 
                disabled={Object.keys(dreamTeam).length === 0}
                className="bg-red-600/10 border border-red-500/20 text-red-500 disabled:opacity-30 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
                title="Clear Squad"
              >
                <Trash2 size={16} /> 
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#111827] border border-gray-800 rounded-2xl p-4 shadow-lg pb-10 scrollbar-thin scrollbar-thumb-gray-800">
            {Object.keys(dreamTeam).length > 0 ? (
              <div className="flex flex-col gap-2">
                <h3 className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mb-4 mt-2 text-center">Starting XI ({currentFormation})</h3>
                {formations[currentFormation]
                  .sort((a, b) => b.y - a.y) 
                  .map((slot) => {
                    const player = dreamTeam[slot.id];
                    return (
                      <div key={slot.id} className="flex items-center bg-[#0f172a] border border-gray-800 p-3 rounded-xl shadow-sm">
                        <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center shrink-0 mr-3">
                          <span className="text-[10px] font-black text-blue-400">{slot.pos}</span>
                        </div>
                        {player ? (
                          <div className="flex flex-col flex-1 truncate pr-2">
                            <span className="text-sm font-black uppercase italic tracking-tighter text-white truncate">{player['COL 2']}</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase">{player['COL 3'] || player.name || 'Academy'}</span>
                          </div>
                        ) : (
                          <div className="flex-1 text-xs text-gray-600 italic font-bold">Empty Position</div>
                        )}
                        {player && (
                          <div className="text-[10px] font-black text-white bg-blue-600 px-2 py-1 rounded">
                            {player.calculatedRating}
                          </div>
                        )}
                      </div>
                    );
                })}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-30 text-center gap-4 py-10">
                <Trophy size={48} />
                <p className="text-[10px] uppercase tracking-widest font-bold">No team generated yet.<br/>Tap 'Generate' above.</p>
              </div>
            )}
          </div>
        </main>
      </div>

    </div>
  );
}