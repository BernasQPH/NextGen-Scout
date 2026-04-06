import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  LayoutDashboard, Search, Star, Users, ArrowLeftRight, Trophy, Sword, ExternalLink 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Componente de navegação lateral (Sidebar Item)
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

export default function Academies() {
  const navigate = useNavigate();
  const [academies, setAcademies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Procura os dados na API (Node.js/Express)
  const fetchAcademies = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/academies');
      setAcademies(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar as academias:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademies();
  }, []);

  // Função para desenhar as estrelas do rating
  const renderStars = (count) => {
    const num = parseInt(count) || 0;
    return "★".repeat(num) + "☆".repeat(5 - num);
  };

  return (
    <div className="flex h-screen w-screen bg-[#0b1120] text-white overflow-hidden font-sans">
      
      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className="w-72 bg-[#0f172a] p-8 flex flex-col border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-3 text-blue-500 font-black text-2xl mb-12 px-2 uppercase italic tracking-tighter">
          <Trophy size={28} className="fill-blue-500/20" />
          <span>NextGen <span className="text-white">Scout</span></span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          <NavItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/')} />
          <NavItem icon={Search} label="Player Search" onClick={() => navigate('/search')} />
          <NavItem icon={Star} label="Shortlist" onClick={() => navigate('/shortlist')} />
          <NavItem icon={Users} label="Academies" active onClick={() => navigate('/academies')} />
          <NavItem icon={ArrowLeftRight} label="Comparison" onClick={() => navigate('/comparison')} />
          <NavItem icon={Trophy} label="Dream Team" onClick={() => navigate('/dreamteam')} />
          <NavItem icon={Sword} label="Simulator" />
        </nav>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0b1120] overflow-hidden">
        <div className="p-10 h-full flex flex-col overflow-y-auto">
          
          {/* CABEÇALHO */}
          <header className="mb-10 shrink-0">
            <h1 className="text-5xl font-black uppercase italic tracking-tighter mb-2">ACADEMIES</h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Global talent producers network</p>
          </header>

          {/* LISTA DE ACADEMIAS (LINEAR) */}
          <div className="flex flex-col gap-8 max-w-5xl">
            {loading ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 animate-pulse uppercase tracking-[0.2em] text-xs font-black">A carregar base de dados...</p>
              </div>
            ) : academies.length > 0 ? (
              academies.map((academy) => (
                <div 
                  key={academy.id}
                  className="flex items-center gap-6 group cursor-pointer transition-all hover:translate-x-2"
                >
                  {/* ESPAÇO PARA O LOGO DO CLUBE */}
                  <div className="w-20 h-20 bg-[#1e293b]/50 border border-yellow-600/30 rounded-2xl flex items-center justify-center shrink-0 overflow-hidden group-hover:border-yellow-500 transition-all shadow-lg">
                    {/* Placeholder para quando não há logo_url na base de dados */}
                    {academy.logo_url ? (
                      <img 
                        src={academy.logo_url} 
                        alt={academy.nome} 
                        className="w-full h-full object-contain p-2" 
                      />
                    ) : (
                      <div className="text-yellow-600/20 font-black text-[10px] uppercase tracking-tighter">Logo</div>
                    )}
                  </div>

                  {/* INFORMAÇÕES DA ACADEMIA */}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-4 mb-1">
                      <h3 className="text-3xl font-black uppercase italic tracking-tighter group-hover:text-blue-400 transition-colors leading-none">
                        {academy.nome}
                      </h3>
                      {/* Badge das Estrelas */}
                      <div className="flex text-yellow-500 text-lg tracking-[0.2em]">
                        <span className="bg-[#0f172a] px-3 py-0.5 rounded-full border border-gray-800 text-sm shadow-inner">
                          {renderStars(academy.rating)}
                        </span>
                      </div>
                    </div>

                    {/* Detalhes de Localização */}
                    <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]"></span>
                        {academy.pais}
                      </span>
                      <span className="text-gray-700">•</span>
                      <span className="text-gray-400">Verified Elite Academy</span>
                    </div>
                  </div>

                  {/* Ícone de Link Externo */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all pr-4 transform translate-x-4 group-hover:translate-x-0">
                    <ExternalLink size={24} className="text-blue-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 border-2 border-dashed border-gray-800 rounded-3xl text-center">
                <p className="text-gray-600 uppercase text-xs font-black tracking-widest italic">
                  Nenhuma academia encontrada.
                </p>
              </div>
            )}
          </div>

          {/* Marca de Água (Trophy decorativo no fundo) */}
          <div className="mt-auto pt-20 opacity-[0.02] select-none pointer-events-none flex justify-end">
            <Users size={300} />
          </div>

        </div>
      </main>
    </div>
  );
}