import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip 
} from 'recharts';

const NavItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div onClick={onClick} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all mb-1 ${active ? 'bg-blue-600 text-white shadow-lg font-bold' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'}`}>
    {Icon && <Icon size={20} />}
    <span className="text-sm uppercase tracking-tight font-bold">{label}</span>
  </div>
);

export default function Comparison() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [player1Id, setPlayer1Id] = useState("");
  const [player2Id, setPlayer2Id] = useState("");

  // Vai buscar todos os jogadores para a lista
  useEffect(() => {
    axios.get('http://localhost:3001/api/players')
      .then(res => setPlayers(res.data))
      .catch(err => console.error(err));
  }, []);

  const player1 = players.find(p => String(p['COL 1']) === String(player1Id));
  const player2 = players.find(p => String(p['COL 1']) === String(player2Id));

  // --- ALGORITMO DE SCOUTING (Reutilizado) ---
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

  // --- DADOS PARA O GRÁFICO RADAR ---
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

  // Componente para selecionar o jogador
  const PlayerSelector = ({ value, onChange, color, label }) => (
    <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-3xl shadow-lg relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-full h-1 ${color}`}></div>
      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl p-3 outline-none font-bold cursor-pointer"
      >
        <option value="">-- Select Player --</option>
        {players.map(p => (
          <option key={p['COL 1']} value={p['COL 1']}>
            {p['COL 2']} ({p['COL 4']})
          </option>
        ))}
      </select>

      {/* Info do Jogador Selecionado */}
      {value && players.find(p => String(p['COL 1']) === String(value)) && (
        <div className="mt-6 flex items-center justify-between">
          <div>
            <div className="text-xl font-black uppercase italic">{players.find(p => String(p['COL 1']) === String(value))['COL 2']}</div>
            <div className="text-xs text-gray-500 font-bold uppercase">{players.find(p => String(p['COL 1']) === String(value))['COL 4']}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-black border-2 ${color.includes('blue') ? 'bg-blue-600/20 text-blue-400 border-blue-500' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500'}`}>
              {calculateOverall(players.find(p => String(p['COL 1']) === String(value)))}
            </div>
            <span className="text-[8px] font-black uppercase text-gray-500 mt-1">Rating</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 uppercase italic">
          <Trophy size={28} /><span>NextGen <span className="text-white">Scout</span></span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" />
          <NavItem icon={ArrowLeftRight} label="Comparison" active />
          <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-8">
          <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">COMPARISON</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Head-to-head analysis</p>
        </header>

        {/* SELETORES DE JOGADOR */}
        <div className="flex gap-8 mb-8">
          <PlayerSelector value={player1Id} onChange={setPlayer1Id} color="bg-blue-500" label="Player A (Blue)" />
          <PlayerSelector value={player2Id} onChange={setPlayer2Id} color="bg-emerald-500" label="Player B (Green)" />
        </div>

        {/* ÁREA DE COMPARAÇÃO */}
        {player1Id && player2Id ? (
          <div className="bg-[#111827]/50 rounded-3xl border border-gray-800 p-8 flex items-center justify-center shadow-2xl relative">
            
            {/* GRÁFICO RADAR */}
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
            <p className="text-sm font-bold uppercase tracking-widest">Select two players to compare</p>
          </div>
        )}
      </main>
    </div>
  );
}