import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star, StarHalf } from 'lucide-react'; // Adicionadas as estrelas aqui!

const Perfil = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:3001/api/players/${id}`)
            .then(res => {
                const data = Array.isArray(res.data) ? res.data[0] : res.data;
                setPlayer(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar jogador:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a1020] w-full m-0 p-0 text-gray-400">
            <div className="text-sm font-black uppercase tracking-widest animate-pulse">
                Loading Scout Report...
            </div>
        </div>
    );

    if (!player) return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a1020] w-full m-0 p-0 text-white font-sans text-center">
            Player not found.
        </div>
    );

    // --- ALGORITMO DE SCOUTING ---
    const getOverallRating = () => {
        const pos = (player["COL 4"] || "").toLowerCase()
                    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        
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

    const overallScore = getOverallRating();

    // --- ALGORITMO DAS ESTRELAS ---
    const getStarRating = (score) => {
        const numScore = Number(score);
        if (numScore >= 16) return 5;
        if (numScore >= 15.5) return 4.5;
        if (numScore >= 14) return 4;
        if (numScore >= 12.5) return 3.5;
        if (numScore >= 11) return 3;
        if (numScore >= 9.5) return 2.5;
        if (numScore >= 8) return 2;
        if (numScore >= 6) return 1.5;
        return 1;
    };

    const playerStars = getStarRating(overallScore);

    // Componente visual para as estrelas
    const RenderStars = ({ rating }) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                // Estrela Cheia
                stars.push(<Star key={i} size={18} className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" />);
            } else if (rating >= i - 0.5) {
                // Meia Estrela
                stars.push(<StarHalf key={i} size={18} className="text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" fill="currentColor" />);
            } else {
                // Estrela Vazia
                stars.push(<Star key={i} size={18} className="text-gray-700" />);
            }
        }
        return <div className="flex justify-center gap-1 mt-4">{stars}</div>;
    };

    const getStatConfig = (val) => {
        const value = Number(val) || 0;
        const percentage = (value / 20) * 100;
        
        let colorClass = "bg-red-500";
        let textColor = "text-red-400";

        if (value >= 17) {
            colorClass = "bg-blue-600";
            textColor = "text-blue-400";
        } else if (value >= 14) {
            colorClass = "bg-emerald-500";
            textColor = "text-emerald-400";
        } else if (value >= 8) {
            colorClass = "bg-amber-400";
            textColor = "text-amber-400";
        }

        return { percentage, colorClass, textColor };
    };

    const StatBar = ({ label, value }) => {
        const { percentage, colorClass, textColor } = getStatConfig(value);
        return (
            <div className="mb-8">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</span>
                    <span className={`text-sm font-black ${textColor}`}>{value || 0}</span>
                </div>
                <div className="w-full bg-gray-800 h-1 rounded-full overflow-hidden">
                    <div 
                        className={`${colorClass} h-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-[#0a1020] w-screen m-0 p-0 text-white font-sans overflow-x-hidden">
            <header className="w-full border-b border-gray-700/50 px-10 py-6 flex justify-between items-center bg-[#0a1020]/50 backdrop-blur-sm sticky top-0 z-10">
                <button 
                    onClick={() => navigate(-1)}
                    className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:text-blue-400 transition-colors"
                >
                    ← BACK
                </button>
                <div className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase">
                    Observating: {player["COL 2"]}
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="p-10 bg-gray-900 rounded-3xl mb-6 text-center shadow-lg border border-gray-800 relative overflow-hidden">
                    
                    {/* BADGE DA NOTA GLOBAL DINÂMICA */}
                    <div className="absolute top-6 right-6 flex flex-col items-center justify-center">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-lg border-2 
                            ${overallScore >= 16 ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500' : 
                              overallScore >= 12 ? 'bg-amber-500/20 text-amber-400 border-amber-500' : 
                              'bg-red-500/20 text-red-400 border-red-500'}`}>
                            {overallScore}
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 mt-2">Rating</span>
                    </div>

                    <div className="w-32 h-32 bg-gray-800 border-2 border-gray-700 rounded-full flex items-center justify-center text-6xl font-black text-white mx-auto mb-8 shadow-inner">
                        {player["COL 2"]?.charAt(0)}
                    </div>
                    <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">
                        {player["COL 2"]}
                    </h1>
                    <p className="text-blue-500 font-semibold text-xs tracking-widest">
                        {player["COL 4"]}
                    </p>
                    
                    {/* APRESENTAÇÃO DAS ESTRELAS */}
                    <RenderStars rating={playerStars} />
                </div>

                <div className="grid grid-cols-3 gap-6 mb-6">
                    <div className="p-6 bg-blue-900/50 rounded-2xl border border-blue-800 text-center">
                        <span className="block text-[10px] text-blue-300 uppercase tracking-widest mb-1">ACADEMY</span>
                        <span className="text-sm font-semibold text-white">{player["COL 3"]}</span>
                    </div>
                    <div className="p-6 bg-blue-900/50 rounded-2xl border border-blue-800 text-center">
                        <span className="block text-[10px] text-blue-300 uppercase tracking-widest mb-1">POSITION</span>
                        <span className="text-sm font-semibold text-white">{player["COL 4"]}</span>
                    </div>
                    <div className="p-6 bg-blue-900/50 rounded-2xl border border-blue-800 text-center">
                        <span className="block text-[10px] text-blue-300 uppercase tracking-widest mb-1">AGE</span>
                        <span className="text-sm font-semibold text-white">{player["COL 6"]}</span>
                    </div>
                </div>

                <button className="w-full p-4 bg-blue-600 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-lg hover:bg-blue-700 transition-colors mb-6 active:scale-95">
                    Add to Shortlist
                </button>

                <div className="p-6 bg-gray-900 rounded-2xl shadow-lg border border-gray-800">
                    <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                        <div>
                            <StatBar label="Finishing" value={player['COL 5']} /> 
                            <StatBar label="Passing" value={player['COL 6']} /> 
                            <StatBar label="Aggression" value={player['COL 7']} /> 
                            <StatBar label="Decisions" value={player['COL 8']} /> 
                        </div>
                        <div>
                            <StatBar label="Reflexes" value={player['COL 9']} /> 
                            <StatBar label="Heading" value={player['COL 10']} /> 
                            <StatBar label="Crossing" value={player['COL 11']} /> 
                            <StatBar label="Pace" value={player['COL 14']} /> 
                        </div>
                    </div>
                </div>

                <div className="p-6 mt-6 bg-gray-900 rounded-2xl border border-gray-700 shadow-sm text-center">
                    <p className="text-[11px] font-black uppercase text-gray-400 mb-2 tracking-widest">Scout Verdict</p>
                    <p className="text-sm font-bold text-white max-w-xl mx-auto leading-relaxed">
                        Player is highly recommended for tactical review based on strong positional play.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Perfil;