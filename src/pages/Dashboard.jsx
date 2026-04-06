import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente de Card Quadrado Alinhado
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

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({ totalPlayers: 0, totalAcademies: 0, shortlistCount: 0 });
  const [randomAcademy, setRandomAcademy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    axios.get('http://localhost:3001/api/top-academies')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const elite = res.data.filter(a => Number(a.rating) === 5);
          const pool = elite.length > 0 ? elite : res.data;
          setRandomAcademy(pool[Math.floor(Math.random() * pool.length)]);
        }
      })
      .catch(err => {
        setError("Erro de ligação");
        setRandomAcademy({ nome: "Benfica Campus", pais: "Portugal", rating: 5 });
      });
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter">
          <Trophy size={28} className="fill-blue-500/20" />
          <span>NextGen <span className="text-white">Scout</span></span>
        </div>
        
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" active onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" onClick={() => navigate('/academies')} />
          <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
          <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-12 overflow-y-auto bg-gradient-to-br from-[#0b1120] to-[#0f172a]">
        
        <header className="flex justify-between items-center mb-16">
          <div>
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">Dashboard</h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.3em]">Central Data System</p>
          </div>
          
      
        </header>

        {/* STATS GRID - ALINHADOS NA HORIZONTAL */}
        <div className="flex flex-row gap-8 mb-16 w-full">
          <StatCard 
            label="Number of Players" 
            value={data.totalPlayers.toLocaleString()} 
            trend="Observable" 
            icon={Users}
          />
          <StatCard 
            label="Number of Academies" 
            value={data.totalAcademies} 
            trend="Youth" 
            icon={Trophy}
          />
          <StatCard 
            label="Shortlisted Players" 
            value={data.shortlistCount} 
            trend="Active" 
            icon={Star}
          />
        </div>

        {/* ACADEMY SPOTLIGHT SECTION */}
        <div className="mb-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 mb-6 italic">Featured Academy</h2>
          
          <div className="group cursor-pointer bg-[#111827]/80 p-12 rounded-[2.5rem] border border-gray-800 flex items-center justify-between hover:border-blue-500 transition-all shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="flex items-center relative z-10">
              <div className="w-20 h-20 bg-amber-500 bg-opacity-20 rounded-2xl flex items-center justify-center border border-gray-800 mr-8 transition-transform group-hover:scale-110 shadow-inner">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-amber-500">
  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
</svg>

              </div>
              <div>
                {randomAcademy ? (
                  <>
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                        {randomAcademy.nome}
                      </h3>
                      <div className="flex gap-1 bg-black/40 px-3 py-1.5 rounded-full border border-gray-800">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill={i < Number(randomAcademy.rating) ? "#d3b405" : "none"} className={i < Number(randomAcademy.rating) ? "text-amber-500" : "text-gray-700"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-500 uppercase text-xs tracking-[0.3em] font-black flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                      {randomAcademy.pais} • Verified Elite Academy
                    </p>
                  </>
                ) : (
                  <div className="text-gray-500 italic uppercase tracking-widest">{error || "Updating..."}</div>
                )}
              </div>
            </div>

            <button 
              onClick={() => navigate('/academies')}
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-3 shadow-xl shadow-blue-900/20 active:scale-95 z-10 border-none"
            >
              Explore Network <ArrowRight size={18} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}