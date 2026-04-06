import React, { useState } from 'react';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword 
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
    { id: 2, pos: 'CB', x: 25, y: 78 }, { id: 3, pos: 'CB', x: 50, y: 80 }, { id: 4, pos: 'CB', x: 75, y: 78 },
    { id: 5, pos: 'LWB', x: 10, y: 50 }, { id: 6, pos: 'CM', x: 35, y: 48 }, { id: 7, pos: 'CDM', x: 50, y: 62 }, { id: 8, pos: 'CM', x: 65, y: 48 }, { id: 9, pos: 'RWB', x: 90, y: 50 },
    { id: 10, pos: 'ST', x: 40, y: 20 }, { id: 11, pos: 'ST', x: 60, y: 20 },
  ]
};

export default function DreamTeam() {
  const navigate = useNavigate();
  const [currentFormation, setCurrentFormation] = useState('4-4-2');

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0 h-full">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter hover:scale-105 transition-transform cursor-pointer">
          <Trophy size={28} className="fill-blue-500/20" />
          <span>NextGen <span className="text-white">Scout</span></span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" />
          <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
          <NavItem icon={Trophy} label="Dream Team" active onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
        <div className="p-10 h-full flex flex-col">
          
          {/* HEADER */}
          <header className="mb-4 shrink-0 flex justify-between items-end">
            <div>
              <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">DREAM TEAM</h1>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Tactical setup & formation</p>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <span className="text-[10px] uppercase font-black text-blue-500 tracking-widest mr-1">Select System</span>
              <select 
                value={currentFormation}
                onChange={(e) => setCurrentFormation(e.target.value)}
                className="bg-[#0f172a] border border-gray-800 text-white text-sm font-bold uppercase tracking-tighter p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-600 transition-all cursor-pointer min-w-[180px]"
              >
                <option value="4-4-2">4-4-2 FLAT</option>
                <option value="4-3-3">4-3-3 OFFENSIVE</option>
                <option value="4-2-3-1">4-2-3-1 WIDE</option>
                <option value="3-5-2">3-5-2 WINGBACKS</option>
              </select>
            </div>
          </header>

          {/* AREA DO CAMPO - Ajustada para não cortar */}
          <div className="flex-1 flex justify-center items-start pt-4 pb-10 overflow-hidden relative">
            
            {/* O TRUQUE: 
              Usamos h-[calc(100vh-280px)] para que o campo se adapte à altura do ecrã, 
              descontando o espaço do header e das margens.
            */}
            <div className="relative h-full max-h-[580px] aspect-[3/4.2] bg-gradient-to-b from-emerald-600 to-emerald-800 rounded-xl border-[3px] border-white/40 shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden shrink-0">
              
              {/* Relva */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" 
                   style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(0,0,0,0.3) 40px, rgba(0,0,0,0.3) 80px)' }}>
              </div>

              {/* Linhas */}
              <div className="absolute top-1/2 w-full h-[2.5px] bg-white/40 -translate-y-1/2"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-[2.5px] border-white/40 rounded-full"></div>
              
              {/* Áreas */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 border-[2.5px] border-t-0 border-white/40 rounded-b-md"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-24 border-[2.5px] border-b-0 border-white/40 rounded-t-md"></div>
              
              {/* JOGADORES */}
              {formations[currentFormation].map((player) => (
                <div
                  key={player.id}
                  style={{ 
                    left: `${player.x}%`, 
                    top: `${player.y}%`,
                    transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full border-[3px] border-white shadow-[0_5px_15px_rgba(0,0,0,0.4)] flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 transition-all cursor-pointer relative overflow-hidden active:scale-95">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent"></div>
                    <span className="text-[9px] font-black tracking-tighter relative z-10 select-none text-white">{player.pos}</span>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-black/40 blur-[4px] rounded-full scale-x-125 opacity-60"></div>
                </div>
              ))}
            </div>

            {/* Marca de Água NextGen */}
            <div className="absolute bottom-4 right-4 opacity-[0.03] select-none pointer-events-none rotate-12">
              <Trophy size={280} />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}