import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, RotateCcw, Activity, Shield, ChevronRight, Loader2, Search, Trophy, BarChart3, Target, FastForward, SkipForward, LogOut, Swords, Star, TrendingUp, Users, ArrowLeftRight, LayoutDashboard, Menu, X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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

const pickRandom = (arr) => {
  if (!arr || !Array.isArray(arr) || arr.length === 0) return "";
  return arr[Math.floor(Math.random() * arr.length)];
};

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

const Simulator = () => {
  const navigate = useNavigate();
  const [teamsList, setTeamsList] = useState([]);
  const [myTeam, setMyTeam] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [opponentRoster, setOpponentRoster] = useState(null);
  const [username, setUsername] = useState(null);
  
  const [isLoadingTeams, setIsLoadingTeams] = useState(true);
  const [isLoadingRoster, setIsLoadingRoster] = useState(false);
  const [showPreMatch, setShowPreMatch] = useState(false);
  
  const [min, setMin] = useState(0);
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [logs, setLogs] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [speed, setSpeed] = useState(1);
  const [isSkipping, setIsSkipping] = useState(false);
  
  const [statusJogadores, setStatusJogadores] = useState({});
  const [teamTactics, setTeamTactics] = useState({ home: {}, away: {} }); 
  const [highlight, setHighlight] = useState(null);
  
  const [renderError, setRenderError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logEndRef = useRef(null);

  const [matchStats, setMatchStats] = useState({
    homeShots: 0, awayShots: 0,
    homeShotsOnTarget: 0, awayShotsOnTarget: 0,
    homePossession: 0, awayPossession: 0,
    matchEvents: [] 
  });

  const getPosAbbr = (pos) => {
    if(!pos) return "MC";
    const safePos = String(pos);
    if(safePos.length <= 3) return safePos.toUpperCase();
    const norm = safePos.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    if(norm.includes('guarda')) return 'GR';
    if(norm.includes('central')) return 'DC';
    if(norm.includes('esquerdo') && norm.includes('defesa')) return 'DE';
    if(norm.includes('direito') && norm.includes('defesa')) return 'DD';
    if(norm.includes('defensivo')) return 'MDC';
    if(norm.includes('centro')) return 'MC';
    if(norm.includes('ofensivo')) return 'MOC';
    if(norm.includes('extremo') && norm.includes('esquerdo')) return 'EE';
    if(norm.includes('extremo') && norm.includes('direito')) return 'ED';
    if(norm.includes('lanca')) return 'PL';
    return 'MC';
  };

  const getEquivalentPos = (slotPos) => {
    const map = {
        'GK': 'GR', 'CB': 'DC', 'LB': 'DE', 'RB': 'DD', 'LWB': 'DE', 'RWB': 'DD',
        'CDM': 'MDC', 'LDM': 'MDC', 'RDM': 'MDC',
        'CM': 'MC', 'CAM': 'MOC', 'LAM': 'MOC', 'RAM': 'MOC',
        'LM': 'EE', 'LW': 'EE', 'RM': 'ED', 'RW': 'ED',
        'ST': 'PL', 'CF': 'PL'
    };
    return map[slotPos] || 'MC';
  };

  const mapPlayerData = (p) => {
    if (!p) return null;
    return {
      ...p,
      id: p['COL 1'] || p.id || Math.random().toString(), 
      name: p['COL 2'] || p.name || 'Jogador Desconhecido', 
      position: getPosAbbr(p['COL 4'] || p.position),
      finishing: Number(p['COL 5'] || p.finishing) || 10,
      passing: Number(p['COL 6'] || p.passing) || 10,
      agression: Number(p['COL 7'] || p.agression) || 10,
      decisions: Number(p['COL 8'] || p.decisions) || 10,
      reflexes: Number(p['COL 9'] || p.reflexes) || 10,
      heading: Number(p['COL 10'] || p.heading) || 10,
      crossing: Number(p['COL 11'] || p.crossing) || 10,
      pace: Number(p['COL 14'] || p.pace) || 10
    };
  };

  const calculatePlayerOVR = (p) => {
    if (!p) return 50; 
    const pos = p.position || 'MC';
    const ref = Number(p.reflexes) || 10;
    const dec = Number(p.decisions) || 10;
    const hea = Number(p.heading) || 10;
    const agr = Number(p.agression) || 10;
    const pac = Number(p.pace) || 10;
    const cro = Number(p.crossing) || 10;
    const pas = Number(p.passing) || 10;
    const fin = Number(p.finishing) || 10;

    if (pos === 'GR') return (ref * 3 + dec * 1) / 4;
    if (pos === 'DC') return (hea * 2 + agr * 1 + dec * 1) / 4;
    if (pos === 'DD' || pos === 'DE') return (pac * 2 + cro * 1 + agr * 1) / 4;
    if (pos === 'MDC') return (agr * 2 + pas * 2 + dec * 1) / 5;
    if (pos === 'MC') return (pas * 2 + dec * 2 + pac * 1) / 5;
    if (pos === 'MOC') return (pas * 2 + fin * 2 + dec * 1 + pac * 1) / 6;
    if (pos === 'EE' || pos === 'ED') return (pac * 3 + fin * 2 + cro * 1) / 6;
    if (pos === 'PL') return (fin * 3 + pac * 2 + hea * 1) / 6;
    return (pas + dec + pac) / 3;
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('nextgen_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUsername(parsedUser.username);
      } catch (e) {}
    } else {
      navigate('/register');
    }

    Promise.all([
      fetch('http://localhost:3001/api/senior_teams').then(res => res.json()),
      fetch('http://localhost:3001/api/dream_team').then(res => res.json())
    ])
    .then(([teamsData, dreamTeamData]) => {
      const validTeams = Array.isArray(teamsData) ? teamsData : [];
      const validDreamTeam = Array.isArray(dreamTeamData) ? dreamTeamData : [];
      
      setTeamsList(validTeams);
      setMyTeam(validDreamTeam.map(mapPlayerData).filter(Boolean));
      setIsLoadingTeams(false);
    })
    .catch(err => {
      console.error("Erro ao carregar dados iniciais:", err);
      setIsLoadingTeams(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('nextgen_user');
    navigate('/register');
  };

  const handleSelectTeam = (team) => {
    setSelectedOpponent(team);
    setIsLoadingRoster(true);
    fetch(`http://localhost:3001/api/senior_players/${team.id}`)
      .then(res => res.json())
      .then(data => {
        const validRoster = Array.isArray(data) ? data : [];
        setOpponentRoster(validRoster.map(mapPlayerData).filter(Boolean));
        setIsLoadingRoster(false);
        setShowPreMatch(true); 
      })
      .catch(err => {
        console.error("Erro ao carregar adversário:", err);
        setIsLoadingRoster(false);
      });
  };

  useEffect(() => {
    if (!selectedOpponent || !opponentRoster || !myTeam) return;

    setScore({ home: 0, away: 0 });
    setLogs([]);
    setMin(0);
    setSpeed(1);
    setIsSkipping(false);
    setMatchStats({ homeShots: 0, awayShots: 0, homeShotsOnTarget: 0, awayShotsOnTarget: 0, homePossession: 0, awayPossession: 0, matchEvents: [] });

    let savedLocal = {};
    try {
      savedLocal = JSON.parse(localStorage.getItem('nextgen_dreamteam') || '{}');
    } catch (e) {}

    const homeFormString = savedLocal.formation || '4-3-3';
    const awayFormString = '4-3-3'; 

    const assignTactics = (playersPool, formationStr, prefix) => {
      const slots = JSON.parse(JSON.stringify(formations[formationStr] || formations['4-3-3']));
      const mapping = {};
      const selectedPlayers = [];
      const usedIds = new Set();

      slots.forEach(slot => {
        const reqPos = getEquivalentPos(slot.pos);
        const match = playersPool.find(p => !usedIds.has(p?.id) && p?.position === reqPos);
        if (match) { 
          const uniqueId = `${prefix}_${match.id}`;
          mapping[uniqueId] = slot; 
          selectedPlayers.push({ ...match, originalId: match.id, id: uniqueId }); 
          usedIds.add(match.id); 
          slot._filled = true; 
        }
      });

      const emptySlots = slots.filter(s => !s._filled);
      const remainingPlayers = playersPool.filter(p => !usedIds.has(p?.id));

      emptySlots.forEach((slot, idx) => {
        if (remainingPlayers[idx]) {
          const fallbackPlayer = remainingPlayers[idx];
          const uniqueId = `${prefix}_${fallbackPlayer.id}`;
          mapping[uniqueId] = slot;
          selectedPlayers.push({ ...fallbackPlayer, originalId: fallbackPlayer.id, id: uniqueId });
          usedIds.add(fallbackPlayer.id);
        }
      });

      return { mapping, selectedPlayers: selectedPlayers.slice(0, 11) }; 
    };

    try {
      const homeData = assignTactics(myTeam, homeFormString, 'home');
      const awayData = assignTactics(opponentRoster, awayFormString, 'away');

      setTeamTactics({ home: homeData.mapping, away: awayData.mapping });

      const initialStatus = {};
      homeData.selectedPlayers.forEach(j => { if(j) initialStatus[j.id] = { ...j, rating: 6.0, isExpelled: false, yellowCards: 0, equipa: 'home' }; });
      awayData.selectedPlayers.forEach(j => { if(j) initialStatus[j.id] = { ...j, rating: 6.0, isExpelled: false, yellowCards: 0, equipa: 'away' }; });
      setStatusJogadores(initialStatus);
    } catch (err) {
      console.error("Erro táticas:", err);
    }

  }, [selectedOpponent, opponentRoster, myTeam]);

  useEffect(() => { 
    if (logEndRef.current && window.innerWidth < 1024) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" }); 
    }
  }, [logs]);

  const saveMatchData = () => {
    let existingData = {};
    try {
      existingData = JSON.parse(localStorage.getItem('nextgen_performance') || '{}');
    } catch (e) {
      existingData = {}; 
    }
    
    Object.values(statusJogadores).filter(p => p.equipa === 'home').forEach(player => {
      const realId = player.originalId || player.id;
      const current = existingData[realId] || {
        id: realId,
        name: player.name,
        position: player.position,
        matches: 0,
        totalRating: 0,
        goals: 0,
        assists: 0
      };

      const playerGoals = matchStats.matchEvents.filter(e => e.team === 'home' && e.type === 'Golo' && e.player === player.name).length;
      const playerAssists = matchStats.matchEvents.filter(e => e.team === 'home' && e.type === 'Golo' && e.assist === player.name).length;

      existingData[realId] = {
        ...current,
        name: player.name, 
        position: player.position,
        matches: current.matches + 1,
        totalRating: current.totalRating + player.rating,
        goals: current.goals + playerGoals,
        assists: current.assists + playerAssists
      };
    });

    localStorage.setItem('nextgen_performance', JSON.stringify(existingData));
  };

  useEffect(() => {
    let interval;
    if (isPlaying && min < 90) {
      const delay = isSkipping ? 5 : 300 / speed; 
      interval = setInterval(() => {
        if (highlight && !isSkipping) return; 
        setMin(prev => prev + 1);
        processMinute(min + 1);
      }, delay); 
    } else if (min >= 90 && !isGameOver) { 
      setIsGameOver(true);
      setIsPlaying(false);
      setIsSkipping(false);
      saveMatchData(); 
    }
    return () => clearInterval(interval);
  }, [isPlaying, min, highlight, speed, isSkipping, isGameOver]); 

  const processMinute = (currentMin) => {
    try {
      const roll = Math.random() * 100;
      const opponentOvr = Number(selectedOpponent?.overall) || 75;
      const youthOvr = 72; 
      const ovrDiff = opponentOvr - youthOvr;
      
      const possessionThreshold = 50 + (ovrDiff * 0.4);
      const possessionWinner = roll > possessionThreshold ? 'homePossession' : 'awayPossession';
      setMatchStats(prev => ({ ...prev, [possessionWinner]: prev[possessionWinner] + 1 }));

      const awayAttackChance = 3.5 + (ovrDiff * 0.08); 
      const homeAttackChance = 96.5 + (ovrDiff * 0.08); 

      if (roll < awayAttackChance || roll > homeAttackChance) {
        const isHomeAttacking = roll > homeAttackChance;
        const teamKey = isHomeAttacking ? 'home' : 'away';
        const oppTeamKey = isHomeAttacking ? 'away' : 'home';
        const teamName = teamKey === 'home' ? 'Dream Team' : (selectedOpponent?.club_name || 'Adversário');
        
        const activeAttackers = Object.values(statusJogadores).filter(p => p.equipa === teamKey && !p.isExpelled && p.position !== 'GR');
        const activeDefenders = Object.values(statusJogadores).filter(p => p.equipa === oppTeamKey && !p.isExpelled);
        const oppGoalkeeper = activeDefenders.find(p => p.position === 'GR');

        if (activeAttackers.length > 0) {
          const shooter = activeAttackers[Math.floor(Math.random() * activeAttackers.length)];
          const finishingValue = Number(shooter.finishing) || 10;
          
          setMatchStats(prev => ({ ...prev, [teamKey === 'home' ? 'homeShots' : 'awayShots']: prev[teamKey === 'home' ? 'homeShots' : 'awayShots'] + 1 }));

          const isPenalty = Math.random() < 0.015; 

          if (isPenalty) {
            const penMsgs = [
              `⚠️ PENALTY! The referee points to the spot for ${teamName}!`,
              `⚠️ DRAMA! A clumsy challenge in the box. Penalty awarded to ${teamName}!`,
              `⚠️ FOUL IN THE AREA! Huge chance for ${teamName} from the spot!`
            ];
            addLog(currentMin, pickRandom(penMsgs), 'text-orange-400 font-bold');
            
            if (activeDefenders.length > 0) {
              const offender = activeDefenders[Math.floor(Math.random() * activeDefenders.length)];
              const cardRoll = Math.random();
              
              if (cardRoll > 0.40) {
                const isDirectRed = cardRoll > 0.95;
                const isSecondYellow = !isDirectRed && offender.yellowCards === 1;

                if (isDirectRed || isSecondYellow) {
                  setStatusJogadores(prev => ({
                      ...prev, [offender.id]: { ...prev[offender.id], isExpelled: true, yellowCards: isSecondYellow ? 2 : prev[offender.id].yellowCards }
                  }));
                  addLog(currentMin, `🟥 RED CARD! ${offender.name} is sent off for a last-man challenge!`, 'text-red-500 font-bold');
                  updateRating(offender.id, -2.0);
                  setMatchStats(prev => ({ ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: oppTeamKey, type: 'Vermelho', player: offender.name }] }));
                } else {
                  setStatusJogadores(prev => ({ ...prev, [offender.id]: { ...prev[offender.id], yellowCards: 1 } }));
                  addLog(currentMin, `🟨 ${offender.name} goes into the book for that foul.`, 'text-yellow-400');
                  updateRating(offender.id, -0.5);
                  setMatchStats(prev => ({ ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: oppTeamKey, type: 'Amarelo', player: offender.name }] }));
                }
              }
            }

            const penaltyChance = 68 + (finishingValue * 0.5);
            if ((Math.random() * 100) < penaltyChance) {
              setScore(prev => ({ ...prev, [teamKey]: prev[teamKey] + 1 }));
              setMatchStats(prev => ({ ...prev, [teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget']: prev[teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget'] + 1 }));
              setMatchStats(prev => ({ ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: teamKey, type: 'Golo', player: shooter.name, assist: 'Penálti' }] }));
              
              if (!isSkipping) triggerHighlight('GOAL', shooter.name, teamKey);
              const penGoalMsgs = ["slots it home!", "makes no mistake!", "sends the keeper the wrong way!", "converts with ease!"];
              addLog(currentMin, `⚽ GOAL! ${shooter.name} ${pickRandom(penGoalMsgs)}`, 'text-sky-400 font-bold');
              updateRating(shooter.id, 1.5);
              if(oppGoalkeeper) updateRating(oppGoalkeeper.id, -0.5); 
            } else {
              if (Math.random() > 0.5) {
                const saveMsgs = ["WHAT A SAVE! The keeper denies", "Incredible reactions! The goalkeeper stops", "Saved! Brilliant dive to deny"];
                addLog(currentMin, `🧤 ${pickRandom(saveMsgs)} ${shooter.name} from 12 yards!`);
                setMatchStats(prev => ({ ...prev, [teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget']: prev[teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget'] + 1 }));
                if(oppGoalkeeper) updateRating(oppGoalkeeper.id, 1.0);
              } else {
                const missMsgs = ["hits the woodwork!", "blasts it over the bar!", "puts it wide! Unbelievable!"];
                addLog(currentMin, `❌ MISSED! ${shooter.name} ${pickRandom(missMsgs)}`, 'text-red-400 font-bold');
              }
              updateRating(shooter.id, -1.0);
            }

          } else {
            const diffPositive = Math.max(0, ovrDiff);
            const goalThreshold = isHomeAttacking 
              ? (82 + (diffPositive * 0.4)) 
              : (82 - (diffPositive * 0.4)); 
            
            const shotPower = (finishingValue * 4) + (Math.random() * 30);
            
            if (shotPower > goalThreshold) {
              setScore(prev => ({ ...prev, [teamKey]: prev[teamKey] + 1 }));
              setMatchStats(prev => ({ ...prev, [teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget']: prev[teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget'] + 1 }));
              
              const potentialAssisters = activeAttackers.filter(p => p.id !== shooter.id);
              let assisterName = null;
              let assistText = "";
              if (potentialAssisters.length > 0 && Math.random() > 0.4) {
                const assister = potentialAssisters[Math.floor(Math.random() * potentialAssisters.length)];
                assisterName = assister.name;
                assistText = ` (Assist: ${assisterName})`;
                updateRating(assister.id, 0.8); 
              }

              setMatchStats(prev => ({
                ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: teamKey, type: 'Golo', player: shooter.name, assist: assisterName }]
              }));

              if (!isSkipping) triggerHighlight('GOAL', shooter.name, teamKey);
              const goalMsgs = ["finds the back of the net!", "scores a stunner!", "finishes beautifully!", "tucks it away!", "places it in the bottom corner!"];
              addLog(currentMin, `⚽ GOAL! ${shooter.name} ${pickRandom(goalMsgs)}${assistText}`, 'text-sky-400 font-bold');
              
              updateRating(shooter.id, 1.5);
              if(oppGoalkeeper) updateRating(oppGoalkeeper.id, -0.3); 
            } else {
              if(Math.random() > 0.5) {
                setMatchStats(prev => ({ ...prev, [teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget']: prev[teamKey === 'home' ? 'homeShotsOnTarget' : 'awayShotsOnTarget'] + 1 }));
                const gkSaveMsgs = ["Great save! The keeper denies", "Solid stop by the goalkeeper against", "Fantastic reflex save to keep out a shot from"];
                addLog(currentMin, `🧤 ${pickRandom(gkSaveMsgs)} ${shooter.name}.`);
                if(oppGoalkeeper) updateRating(oppGoalkeeper.id, 0.4);
              } else {
                const missMsgs = ["shoots just wide of the post.", "misses the target.", "drags the shot wide.", "wastes a good opportunity."];
                addLog(currentMin, `🔥 ${shooter.name} ${pickRandom(missMsgs)}`);
              }
              updateRating(shooter.id, 0.1);
            }
          }
        }
      } 
      else if (roll > 45 && roll < 48) {
          const allActivePlayers = Object.values(statusJogadores).filter(p => !p.isExpelled);
          if (allActivePlayers.length > 0) {
            const playerStatus = allActivePlayers[Math.floor(Math.random() * allActivePlayers.length)];
            const agressionValue = Number(playerStatus.agression) || 10;
            
            if ((agressionValue * 5) + (Math.random() * 30) > 85) {
                const isSecondYellow = playerStatus.yellowCards === 1;
                const isDirectRed = Math.random() > 0.95;

                if (isDirectRed || isSecondYellow) {
                    setStatusJogadores(prev => ({
                        ...prev, [playerStatus.id]: { ...prev[playerStatus.id], isExpelled: true, yellowCards: isSecondYellow ? 2 : prev[playerStatus.id].yellowCards }
                    }));
                    const redMsgs = ["SHOCKING TACKLE!", "DANGEROUS PLAY!", "EARLY SHOWER!"];
                    addLog(currentMin, `🟥 ${pickRandom(redMsgs)} ${playerStatus.name} is sent off!`, 'text-red-500 font-bold');
                    updateRating(playerStatus.id, -2.0);
                    setMatchStats(prev => ({ ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: playerStatus.equipa, type: 'Vermelho', player: playerStatus.name }] }));
                } else {
                    setStatusJogadores(prev => ({ ...prev, [playerStatus.id]: { ...prev[playerStatus.id], yellowCards: 1 } }));
                    const yellowMsgs = ["gets a yellow card for a late challenge.", "goes into the referee's book.", "is cautioned for a cynical foul."];
                    addLog(currentMin, `🟨 ${playerStatus.name} ${pickRandom(yellowMsgs)}`, 'text-yellow-400');
                    updateRating(playerStatus.id, -0.5);
                    setMatchStats(prev => ({ ...prev, matchEvents: [...prev.matchEvents, { min: currentMin, team: playerStatus.equipa, type: 'Amarelo', player: playerStatus.name }] }));
                }
            }
          }
      } 
      else if (roll > 50 && roll < 52) {
        const teamName = possessionWinner === 'homePossession' ? 'Dream Team' : (selectedOpponent?.club_name || 'Adversário');
        const neutralMsgs = [
          `Patient build-up play by ${teamName}.`,
          `${teamName} circulating the ball, looking for an opening.`,
          `The midfield battle is intensifying.`,
          `Good passing sequence by ${teamName}.`,
          `${teamName} is dictating the tempo right now.`
        ];
        addLog(currentMin, pickRandom(neutralMsgs), 'text-gray-500 italic text-[10px]');
      }

      setStatusJogadores(prev => {
        const nextStatus = { ...prev };
        Object.keys(nextStatus).forEach(id => {
          if (Math.random() > 0.65) {
            const change = (Math.random() - 0.48) * 0.1; 
            nextStatus[id].rating = Math.min(10, Math.max(0, nextStatus[id].rating + change));
          }
        });
        return nextStatus;
      });
    } catch (error) {
      console.error("Erro no processMinute:", error);
    }
  };

  const addLog = (minute, message, className = "text-gray-400") => setLogs(prev => [...prev, { minute, message, className }]);
  const triggerHighlight = (type, player, team) => { setHighlight({ type, player, team }); setTimeout(() => setHighlight(null), 2500); };
  const updateRating = (id, change) => {
    setStatusJogadores(prev => {
      if (!prev[id]) return prev;
      return { ...prev, [id]: { ...prev[id], rating: Math.min(10, Math.max(0, prev[id].rating + change)) } };
    });
  };

  const renderFieldPlayers = () => {
    try {
      return Object.values(statusJogadores).map(p => {
        if (!p) return null;
        const isHome = p.equipa === 'home';
        const slot = teamTactics[p.equipa]?.[p.id];
        if (!slot) return null;

        const leftPos = isHome ? ((100 - slot.y) / 2) : (50 + (slot.y / 2));
        const topPos = isHome ? slot.x : 100 - slot.x;

        const nameColor = p.isExpelled ? 'text-red-400' : p.yellowCards > 0 ? 'text-yellow-400' : 'text-white';
        const containerOpacity = p.isExpelled ? 'opacity-30 grayscale' : 'opacity-100';

        return (
          <div 
            key={p.id} 
            className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-300 z-10 ${containerOpacity}`}
            style={{ left: `${leftPos}%`, top: `${topPos}%` }}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg ${isHome ? 'bg-blue-600 border-white' : 'bg-red-600 border-white'}`}>
              <span className="text-[10px] font-black text-white">{p.position || 'MC'}</span>
            </div>
            <span className={`text-[9px] font-bold bg-[#0b1120]/80 border border-white/10 px-1.5 py-0.5 rounded mt-1 truncate max-w-[70px] shadow-lg backdrop-blur-sm ${nameColor}`}>
              {String(p.name || 'Desconhecido').split(' ').pop()}
            </span>
          </div>
        );
      });
    } catch (e) {
      return null;
    }
  };

  const getStarPlayer = (teamArray) => {
    try {
      if (!teamArray || !Array.isArray(teamArray) || teamArray.length === 0) return null;
      const validPlayers = teamArray.filter(Boolean);
      if (validPlayers.length === 0) return null;
      
      return [...validPlayers].sort((a, b) => {
        let ovrA = calculatePlayerOVR(a) || 0;
        let ovrB = calculatePlayerOVR(b) || 0;
        if (a?.position && ['PL', 'EE', 'ED', 'MOC'].includes(a.position)) ovrA *= 1.05;
        if (b?.position && ['PL', 'EE', 'ED', 'MOC'].includes(b.position)) ovrB *= 1.05;
        return ovrB - ovrA;
      })[0] || null;
    } catch (e) {
      return null;
    }
  };

  if (renderError) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0b1120] text-red-500 flex-col p-10">
        <h1 className="text-4xl font-black mb-4">CRITICAL ERROR</h1>
        <p className="font-mono bg-red-900/20 p-4 rounded-xl border border-red-500/30 text-sm mb-6 max-w-2xl text-center">
          {renderError}
        </p>
        <button onClick={() => window.location.reload()} className="bg-white text-black px-6 py-2 rounded-xl font-bold">
          Recarregar Página
        </button>
      </div>
    );
  }

  const homeOvr = 72; 
  const awayOvr = Number(selectedOpponent?.overall) || 75;
  const ovrDiff = awayOvr - homeOvr;

  let homeProb = 35 - (ovrDiff * 2.5);
  let awayProb = 35 + (ovrDiff * 2.5);
  homeProb = Math.max(10, Math.min(80, homeProb || 50));
  awayProb = Math.max(10, Math.min(80, awayProb || 50));
  const drawProb = 100 - homeProb - awayProb;

  const homeOdd = (100 / homeProb).toFixed(2);
  const drawOdd = (100 / drawProb).toFixed(2);
  const awayOdd = (100 / awayProb).toFixed(2);

  const homeStar = getStarPlayer(myTeam);
  const awayStar = getStarPlayer(opponentRoster);

  const totalPossession = matchStats.homePossession + matchStats.awayPossession;
  const homePossessionPercent = totalPossession === 0 ? 50 : Math.round((matchStats.homePossession / totalPossession) * 100);
  const awayPossessionPercent = 100 - homePossessionPercent;

  const allPlayersFinal = Object.values(statusJogadores).sort((a,b) => b.rating - a.rating);
  const mvp = allPlayersFinal.length > 0 ? allPlayersFinal[0] : null;
  const sortedEvents = [...matchStats.matchEvents].sort((a, b) => a.min - b.min);

  return (
    <div className="h-screen w-screen bg-[#0b1120] overflow-hidden font-sans relative text-white">

      
      <div className="hidden lg:block h-full w-full">
        <div className="flex flex-col h-full w-full">
          {(!selectedOpponent || isLoadingRoster) ? (
            <div className="flex-1 flex flex-col p-10 overflow-hidden text-white bg-[#0b1120]">
              <div className="max-w-7xl mx-auto w-full flex flex-col gap-8 h-full">
                <header className="flex justify-between items-start shrink-0 border-b border-gray-800 pb-6 relative">
                  <div>
                    <button 
                      onClick={() => navigate('/dreamteam')} 
                      className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-4 transition-all w-max shadow-md"
                    >
                      ← Back to Dream Team
                    </button>
                    <h1 className="text-5xl font-black uppercase italic tracking-tighter">Match Simulator</h1>
                    <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Select Your Opponent</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4">
                    {username && (
                      <div className="flex items-center gap-4 mt-1">
                        <div className="bg-[#111827] border border-gray-800 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
                          <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                            Welcome, <span className="text-white font-black">{username}</span>
                          </span>
                        </div>
                        <button 
                          onClick={handleLogout}
                          className="w-12 h-12 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl border border-red-500/20 flex items-center justify-center transition-all group shadow-lg"
                          title="Logout"
                        >
                          <LogOut size={20} />
                        </button>
                      </div>
                    )}
                    
                    <div className="relative w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search team..." 
                        className="w-full bg-[#0f172a] border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 text-sm font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </header>

                <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent pb-10">
                  {isLoadingTeams ? (
                    <div className="h-full flex flex-col items-center justify-center space-y-4">
                      <Loader2 className="animate-spin text-blue-500" size={48} />
                      <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading Database...</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {teamsList.filter(team => (team?.club_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map(team => (
                        <button 
                          key={team?.id || Math.random()} 
                          onClick={() => handleSelectTeam(team)} 
                          className="flex items-center justify-between bg-[#0f172a] p-6 rounded-2xl border border-gray-800 hover:border-blue-500 hover:bg-blue-900/10 transition-all text-left group overflow-hidden relative"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform"></div>
                          <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center group-hover:border-blue-500 transition-colors shadow-inner">
                              <Shield className="text-gray-500 group-hover:text-blue-500 transition-colors" size={24} />
                            </div>
                            <span className="font-black text-white text-lg tracking-tight">{team?.club_name || 'Desconhecido'}</span>
                          </div>
                          <div className="flex items-center gap-3 relative z-10">
                            <div className="flex flex-col items-end">
                               <span className="text-[9px] font-bold uppercase tracking-widest text-gray-500">OVR</span>
                               <span className={`text-xl font-black ${Number(team?.overall) >= 80 ? 'text-emerald-400' : Number(team?.overall) >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
                                 {team?.overall || 75}
                               </span>
                            </div>
                            <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" size={20} />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : showPreMatch ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-gray-200 overflow-hidden bg-[#0b1120]">
              <div className="w-full max-w-5xl h-full max-h-[85vh] flex flex-col justify-between gap-6">
                <div className="text-center shrink-0">
                  <h1 className="text-4xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-4">
                    <Swords className="text-blue-500" size={32} /> Tale of the Tape
                  </h1>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">Pre-Match Analysis & Odds</p>
                </div>

                <div className="flex flex-row items-stretch justify-center gap-6 shrink-0 h-64">
                  
                  <div className="flex-1 w-full bg-gradient-to-br from-blue-900/20 to-[#0f172a] border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={100} /></div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1 relative z-10">Dream Team</h2>
                    <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mb-auto relative z-10">Home Side</p>
                    
                    <div className="flex items-center gap-4 mb-4 relative z-10 mt-auto">
                      <div className="bg-[#0b1120] py-3 px-6 rounded-xl border border-gray-800 shadow-inner flex flex-col items-center justify-center">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">OVR</span>
                        <span className="text-2xl font-black text-white leading-none">{homeOvr}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-3 relative z-10">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5">
                        <Star size={12} className="text-yellow-500" /> Star Player
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-black text-white leading-none">{homeStar?.name || "Desconhecido"}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{homeStar?.position || "MC"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-[#0f172a] border border-gray-800 rounded-full p-4 shadow-2xl z-10 relative">
                      <span className="text-xl font-black text-gray-500 italic leading-none">VS</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full bg-gradient-to-br from-red-900/10 to-[#0f172a] border border-red-500/20 rounded-3xl p-6 relative overflow-hidden flex flex-col">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Shield size={100} /></div>
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-1 relative z-10">{selectedOpponent?.club_name || 'Adversário'}</h2>
                    <p className="text-red-400 font-bold text-[10px] uppercase tracking-widest mb-auto relative z-10">Away Side</p>
                    
                    <div className="flex items-center gap-4 mb-4 relative z-10 mt-auto">
                      <div className="bg-[#0b1120] py-3 px-6 rounded-xl border border-gray-800 shadow-inner flex flex-col items-center justify-center">
                        <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1">OVR</span>
                        <span className="text-2xl font-black text-white leading-none">{awayOvr}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-800 pt-3 relative z-10">
                      <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5">
                        <Star size={10} className="text-yellow-500" /> Star Player
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <p className="text-lg font-black text-white leading-none">{awayStar?.name || "Desconhecido"}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{awayStar?.position || "MC"}</p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="bg-[#0f172a] border border-gray-800 rounded-3xl p-5 shadow-xl shrink-0 w-full max-w-3xl mx-auto">
                  <h3 className="text-center text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
                    <TrendingUp size={14} /> Match Odds
                  </h3>
                  <div className="flex justify-center gap-4">
                    <div className="bg-[#0b1120] border border-blue-500/30 py-4 px-6 rounded-2xl text-center flex-1 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                      <span className="text-blue-500 font-bold uppercase tracking-widest text-[9px]">Home Win</span>
                      <div className="text-3xl font-black text-white mt-1 leading-none">{homeOdd}</div>
                    </div>
                    <div className="bg-[#0b1120] border border-gray-700/50 py-4 px-6 rounded-2xl text-center flex-1">
                      <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">Draw</span>
                      <div className="text-3xl font-black text-white mt-1 leading-none">{drawOdd}</div>
                    </div>
                    <div className="bg-[#0b1120] border border-red-500/30 py-4 px-6 rounded-2xl text-center flex-1 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                      <span className="text-red-500 font-bold uppercase tracking-widest text-[9px]">Away Win</span>
                      <div className="text-3xl font-black text-white mt-1 leading-none">{awayOdd}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-6 shrink-0">
                  <button 
                    onClick={() => { setSelectedOpponent(null); setShowPreMatch(false); }}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg"
                  >
                    Change Opponent
                  </button>
                  <button 
                    onClick={() => setShowPreMatch(false)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3.5 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-3 active:scale-95"
                  >
                    Enter the Pitch <ChevronRight size={16} />
                  </button>
                </div>

              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-4 p-4 text-gray-200 overflow-hidden bg-[#0b1120]">
              <div className="w-full bg-[#0f172a] border border-gray-800 rounded-2xl p-4 flex justify-between items-center h-28 shadow-2xl shrink-0">
                <div className="w-1/3 text-center"><h2 className="text-white font-black text-2xl uppercase italic tracking-tighter">Dream Team</h2></div>
                <div className="w-1/3 flex flex-col items-center">
                  <div className="flex items-center gap-6">
                    <span className="text-5xl font-black text-white">{score.home}</span>
                    <div className="bg-[#0b1120] px-4 py-1 rounded-lg border border-gray-800 shadow-inner">
                       <span className={`font-mono text-xl font-black ${isGameOver ? 'text-red-500' : 'text-blue-500'}`}>
                         {isGameOver ? 'FT' : `${min}'`}
                       </span>
                    </div>
                    <span className="text-5xl font-black text-white">{score.away}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic truncate w-full text-center uppercase tracking-widest font-bold">
                     {isGameOver ? "Match Finished" : (logs.length > 0 ? logs[logs.length - 1].message : "Waiting for kick-off...")}
                  </p>
                </div>
                <div className="w-1/3 text-center"><h2 className="text-white font-black text-2xl uppercase italic tracking-tighter">{selectedOpponent?.club_name || 'Adversário'}</h2></div>
              </div>

              <div className="flex-1 flex flex-row gap-4 min-h-0 relative">
                <div className="w-64 bg-[#0f172a] border border-gray-800 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-lg">
                  <div className="p-3 bg-gray-900/50 font-bold text-[10px] uppercase text-blue-500 tracking-widest border-b border-gray-800 flex justify-between items-center">
                     <span>Dream Team</span>
                     <Activity size={14} className={isPlaying && !isGameOver ? "animate-pulse" : ""} />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
                    {Object.values(statusJogadores).filter(j => j?.equipa === 'home').map(sj => (
                      <div key={sj.id} className="flex justify-between p-2 rounded-xl bg-[#0b1120]/50 border border-gray-800/50 text-[11px] items-center hover:bg-gray-800/30 transition-colors">
                        <span className="text-gray-500 font-black w-6">{sj.position}</span>
                        <span className={`flex-1 truncate mx-2 font-bold ${sj.isExpelled ? 'text-red-500' : sj.yellowCards > 0 ? 'text-yellow-400' : 'text-gray-300'}`}>{String(sj.name).split(' ').pop()}</span>
                        <span className={`font-mono font-black px-1.5 py-0.5 rounded transition-all duration-300 ${sj.rating >= 7 ? 'text-emerald-400 bg-emerald-400/10' : sj.rating < 6 ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                          {Number(sj.rating).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 relative overflow-hidden rounded-2xl">
                    {/* O RELVADO FICA SEMPRE VISÍVEL NO DESKTOP ATÉ AO FIM DO JOGO E DEPOIS DO JOGO */}
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-700 to-emerald-950 border-4 border-white/10 flex overflow-hidden">
                      <div className="absolute inset-y-0 left-1/2 w-[2px] bg-white/20 z-0"></div>
                      <div className="absolute top-1/2 left-1/2 w-32 h-32 border-[2px] border-white/20 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"></div>
                      {renderFieldPlayers()}
                      {highlight && !isSkipping && (
                        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1120]/80 backdrop-blur-md">
                          <h1 className="text-7xl font-black text-white uppercase italic tracking-tighter drop-shadow-2xl">{highlight.type}!</h1>
                          <p className="text-2xl font-black text-blue-400 mt-4 bg-[#0f172a] px-8 py-3 rounded-full border border-blue-500/30 shadow-2xl">{highlight.player}</p>
                        </div>
                      )}
                    </div>

                    {/* OVERLAY DE ESTATÍSTICAS NO FINAL DO JOGO (DESKTOP) */}
                    {isGameOver && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-8">
                        <div className="bg-[#0f172a] border border-gray-800 rounded-3xl shadow-2xl flex flex-col w-full max-w-3xl max-h-full overflow-hidden">
                          <div className="p-6 border-b border-gray-800 text-center shrink-0">
                            <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center justify-center gap-3">
                              <BarChart3 className="text-blue-500" size={28} /> Match Statistics
                            </h1>
                          </div>
                          
                          <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 flex-1 flex flex-col gap-6">
                            {mvp && (
                              <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-white/10 rounded-2xl p-5 flex items-center justify-between shrink-0">
                                <div>
                                  <h3 className="text-[10px] font-black uppercase text-yellow-500 tracking-[0.3em] mb-1.5 flex items-center gap-2"><Trophy size={14}/> Man of the Match</h3>
                                  <p className="text-2xl font-black text-white">{mvp.name}</p>
                                  <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">{mvp.equipa === 'home' ? 'Dream Team' : (selectedOpponent?.club_name || 'Adversário')} • {mvp.position}</p>
                                </div>
                                <div className="bg-[#0b1120] border-2 border-yellow-500/50 rounded-full w-16 h-16 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                                  <span className="text-xl font-black text-yellow-500">{Number(mvp.rating).toFixed(1)}</span>
                                </div>
                              </div>
                            )}

                            <div className="space-y-5 bg-[#0b1120]/50 p-5 rounded-2xl border border-gray-800/50 shrink-0">
                              <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                  <span className={homePossessionPercent > awayPossessionPercent ? 'text-white' : ''}>{homePossessionPercent}%</span>
                                  <span>Possession</span>
                                  <span className={awayPossessionPercent > homePossessionPercent ? 'text-white' : ''}>{awayPossessionPercent}%</span>
                                </div>
                                <div className="w-full bg-red-600 h-2 rounded-full flex overflow-hidden">
                                  <div className="bg-blue-600 h-full" style={{ width: `${homePossessionPercent}%` }}></div>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 text-center items-center">
                                <span className="text-xl font-black text-white">{matchStats.homeShots} <span className="text-xs text-gray-500">({matchStats.homeShotsOnTarget})</span></span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex flex-col items-center"><Target size={14} className="mb-1"/> Shots (Target)</span>
                                <span className="text-xl font-black text-white">{matchStats.awayShots} <span className="text-xs text-gray-500">({matchStats.awayShotsOnTarget})</span></span>
                              </div>
                            </div>

                            {sortedEvents.length > 0 && (
                              <div className="shrink-0">
                                <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4 text-center">Goals & Cards</h3>
                                <div className="grid grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    {sortedEvents.filter(g => g.team === 'home').map((g, idx) => (
                                      <div key={idx} className="bg-[#0b1120] border border-gray-800 p-2.5 rounded-xl flex items-center gap-3">
                                        <span className={`${g.type === 'Golo' ? 'text-blue-500' : g.type === 'Vermelho' ? 'text-red-500' : 'text-yellow-500'} font-mono font-bold text-xs`}>{g.min}'</span>
                                        <div>
                                          <p className={`font-black text-xs ${g.type === 'Golo' ? 'text-white' : g.type === 'Vermelho' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {g.player} {g.type === 'Golo' ? '⚽' : g.type === 'Vermelho' ? '🟥' : '🟨'}
                                          </p>
                                          {g.assist && <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">A: {g.assist}</p>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="space-y-2">
                                    {sortedEvents.filter(g => g.team === 'away').map((g, idx) => (
                                      <div key={idx} className="bg-[#0b1120] border border-gray-800 p-2.5 rounded-xl flex items-center gap-3 justify-end text-right">
                                        <div>
                                          <p className={`font-black text-xs ${g.type === 'Golo' ? 'text-white' : g.type === 'Vermelho' ? 'text-red-400' : 'text-yellow-400'}`}>
                                            {g.type === 'Golo' ? '⚽' : g.type === 'Vermelho' ? '🟥' : '🟨'} {g.player} 
                                          </p>
                                          {g.assist && <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mt-0.5">A: {g.assist}</p>}
                                        </div>
                                        <span className={`${g.type === 'Golo' ? 'text-red-500' : g.type === 'Vermelho' ? 'text-red-500' : 'text-yellow-500'} font-mono font-bold text-xs`}>{g.min}'</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                </div>

                <div className="w-64 bg-[#0f172a] border border-gray-800 rounded-2xl flex flex-col overflow-hidden shrink-0 shadow-lg">
                  <div className="p-3 bg-gray-900/50 font-bold text-[10px] uppercase text-gray-400 tracking-widest border-b border-gray-800 flex justify-between items-center">
                     <span>{selectedOpponent?.club_name || 'Adversário'}</span>
                     <Activity size={14} className={isPlaying && !isGameOver ? "animate-pulse" : ""} />
                  </div>
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-gray-800">
                    {Object.values(statusJogadores).filter(j => j?.equipa === 'away').map(sj => (
                      <div key={sj.id} className="flex justify-between p-2 rounded-xl bg-[#0b1120]/50 border border-gray-800/50 text-[11px] items-center hover:bg-gray-800/30 transition-colors">
                        <span className="text-gray-500 font-black w-6">{sj.position}</span>
                        <span className={`flex-1 truncate mx-2 font-bold ${sj.isExpelled ? 'text-red-500' : sj.yellowCards > 0 ? 'text-yellow-400' : 'text-gray-300'}`}>{String(sj.name).split(' ').pop()}</span>
                        <span className={`font-mono font-black px-1.5 py-0.5 rounded transition-all duration-300 ${sj.rating >= 7 ? 'text-emerald-400 bg-emerald-400/10' : sj.rating < 6 ? 'text-red-400 bg-red-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                          {Number(sj.rating).toFixed(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a] p-4 rounded-2xl border border-gray-800 flex items-center justify-between shrink-0 relative">
                <div className="flex-1 flex items-center gap-4">
                  <button 
                    onClick={() => navigate('/dreamteam')} 
                    className="text-gray-500 hover:text-blue-400 font-black uppercase text-[10px] tracking-widest transition flex items-center gap-2"
                  >
                     ← Dream Team
                  </button>
                  
                  {!isPlaying && min === 0 && (
                    <>
                      <div className="w-px h-4 bg-gray-800"></div>
                      <button 
                        onClick={() => { setShowPreMatch(true); }} 
                        className="text-gray-500 hover:text-blue-400 font-black uppercase text-[10px] tracking-widest transition flex items-center gap-2"
                      >
                         ← Pre-Match
                      </button>
                    </>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4 shrink-0">
                  {!isPlaying && !isGameOver && (
                    <button onClick={() => setIsPlaying(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-12 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center gap-2 active:scale-95">
                       <Play size={16} className="fill-current" /> Kick-Off
                    </button>
                  )}
                  
                  {isPlaying && !isGameOver && (
                    <>
                      <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2">
                         <FastForward size={16} /> {speed}x
                      </button>
                      <button onClick={() => setIsSkipping(true)} disabled={isSkipping} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 disabled:opacity-50">
                         <SkipForward size={16} /> Skip to End
                      </button>
                    </>
                  )}

                  {isGameOver && (
                    <button onClick={() => window.location.reload()} className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-3 rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-xl shadow-emerald-900/40 flex items-center gap-2 active:scale-95">
                       <RotateCcw size={16} /> Play Again
                    </button>
                  )}
                </div>
                <div className="flex-1"></div>
              </div>
            </div>
          )}
        </div>
      </div>



      <div className="block lg:hidden h-full w-full">
        <div className="flex flex-col h-full w-full bg-[#0b1120] text-white">
          
          {(!selectedOpponent || isLoadingRoster) ? (
            <div className="flex-1 flex flex-col p-4 overflow-hidden">
              <header className="flex flex-col shrink-0 border-b border-gray-800 pb-4 relative gap-4">
                <div className="flex justify-between items-start w-full">
                  <button 
                    onClick={() => navigate('/dreamteam')} 
                    className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 shadow-md"
                  >
                    ← Back
                  </button>
                  {username && (
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-3 py-2 rounded-lg border border-red-500/20 flex items-center justify-center transition-all shadow-md text-[10px] font-black uppercase tracking-widest"
                    >
                      LOGOUT
                    </button>
                  )}
                </div>
                
                <div>
                  <h1 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Simulator</h1>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-1">Select Opponent</p>
                </div>
                
                <div className="relative w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search team..." 
                    className="w-full bg-[#0f172a] border border-gray-800 text-white rounded-xl py-3 pl-12 pr-4 text-xs font-bold placeholder-gray-600 focus:outline-none focus:border-blue-600 transition-all"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </header>

              <div className="flex-1 overflow-y-auto mt-4 scrollbar-thin scrollbar-thumb-gray-800 pb-10">
                {isLoadingTeams ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin text-blue-500" size={32} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Loading Database...</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {teamsList.filter(team => (team?.club_name || '').toLowerCase().includes(searchTerm.toLowerCase())).map(team => (
                      <button 
                        key={team?.id || Math.random()} 
                        onClick={() => handleSelectTeam(team)} 
                        className="flex items-center justify-between bg-[#0f172a] p-4 rounded-xl border border-gray-800 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-900 border border-gray-700 flex items-center justify-center shrink-0">
                            <Shield className="text-gray-500 w-5 h-5" />
                          </div>
                          <span className="font-black text-white text-base tracking-tight truncate">{team?.club_name || 'Desconhecido'}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex flex-col items-end">
                             <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500">OVR</span>
                             <span className={`text-lg font-black leading-none ${Number(team?.overall) >= 80 ? 'text-emerald-400' : Number(team?.overall) >= 70 ? 'text-yellow-400' : 'text-orange-400'}`}>
                               {team?.overall || 75}
                             </span>
                          </div>
                          <ChevronRight className="text-gray-600" size={16} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : showPreMatch ? (
            <div className="flex-1 flex flex-col p-4 overflow-y-auto overflow-x-hidden pb-10 text-gray-200">
              <div className="text-center shrink-0 mb-6 mt-4">
                <h1 className="text-3xl font-black uppercase italic tracking-tighter flex items-center justify-center gap-3">
                  <Swords className="text-blue-500 w-6 h-6" /> Tale of the Tape
                </h1>
                <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">Pre-Match Analysis</p>
              </div>

              <div className="flex flex-col gap-4 shrink-0 w-full mb-6">
                <div className="w-full bg-gradient-to-br from-blue-900/20 to-[#0f172a] border border-blue-500/30 rounded-2xl p-5 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Shield className="w-16 h-16" /></div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1 relative z-10">Dream Team</h2>
                  <p className="text-blue-400 font-bold text-[9px] uppercase tracking-widest mb-4 relative z-10">Home Side</p>
                  
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="bg-[#0b1120] py-2 px-4 rounded-xl border border-gray-800 shadow-inner flex flex-col items-center justify-center">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">OVR</span>
                      <span className="text-xl font-black text-white leading-none">{homeOvr}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-3 relative z-10">
                    <h3 className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5">
                      <Star size={10} className="text-yellow-500" /> Star Player
                    </h3>
                    <div className="flex items-baseline gap-2 truncate">
                      <p className="text-base font-black text-white leading-none truncate">{homeStar?.name || "Desconhecido"}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{homeStar?.position || "MC"}</p>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gradient-to-br from-red-900/10 to-[#0f172a] border border-red-500/20 rounded-2xl p-5 relative overflow-hidden flex flex-col">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Shield className="w-16 h-16" /></div>
                  <h2 className="text-xl font-black text-white uppercase italic tracking-tighter mb-1 relative z-10 truncate pr-16">{selectedOpponent?.club_name || 'Adversário'}</h2>
                  <p className="text-red-400 font-bold text-[9px] uppercase tracking-widest mb-4 relative z-10">Away Side</p>
                  
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="bg-[#0b1120] py-2 px-4 rounded-xl border border-gray-800 shadow-inner flex flex-col items-center justify-center">
                      <span className="text-[8px] text-gray-500 font-black uppercase tracking-widest mb-1">OVR</span>
                      <span className="text-xl font-black text-white leading-none">{awayOvr}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-800 pt-3 relative z-10">
                    <h3 className="text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-1.5">
                      <Star size={10} className="text-yellow-500" /> Star Player
                    </h3>
                    <div className="flex items-baseline gap-2 truncate">
                      <p className="text-base font-black text-white leading-none truncate">{awayStar?.name || "Desconhecido"}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{awayStar?.position || "MC"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4 shadow-xl shrink-0 w-full mb-6">
                <h3 className="text-center text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2">
                  <TrendingUp size={12} /> Match Odds
                </h3>
                <div className="flex justify-center gap-2">
                  <div className="bg-[#0b1120] border border-blue-500/30 py-3 px-2 rounded-xl text-center flex-1 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
                    <span className="text-blue-500 font-bold uppercase tracking-tighter text-[8px]">Home</span>
                    <div className="text-xl font-black text-white mt-1 leading-none">{homeOdd}</div>
                  </div>
                  <div className="bg-[#0b1120] border border-gray-700/50 py-3 px-2 rounded-xl text-center flex-1">
                    <span className="text-gray-500 font-bold uppercase tracking-tighter text-[8px]">Draw</span>
                    <div className="text-xl font-black text-white mt-1 leading-none">{drawOdd}</div>
                  </div>
                  <div className="bg-[#0b1120] border border-red-500/30 py-3 px-2 rounded-xl text-center flex-1 shadow-[0_0_20px_rgba(239,68,68,0.05)]">
                    <span className="text-red-500 font-bold uppercase tracking-tighter text-[8px]">Away</span>
                    <div className="text-xl font-black text-white mt-1 leading-none">{awayOdd}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 shrink-0 w-full pb-6">
                <button 
                  onClick={() => setShowPreMatch(false)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 active:scale-95 w-full"
                >
                  Enter the Pitch <ChevronRight size={14} />
                </button>
                <button 
                  onClick={() => { setSelectedOpponent(null); setShowPreMatch(false); }}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg w-full"
                >
                  Change Opponent
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-3 p-3 text-gray-200 overflow-hidden bg-[#0b1120]">
              <div className="w-full bg-[#0f172a] border border-gray-800 rounded-xl p-3 flex justify-between items-center h-20 shadow-2xl shrink-0">
                <div className="w-[30%] text-center truncate pr-1">
                  <h2 className="text-white font-black text-xs uppercase italic tracking-tighter truncate">Dream Team</h2>
                </div>
                <div className="w-[40%] flex flex-col items-center">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-black text-white">{score.home}</span>
                    <div className="bg-[#0b1120] px-3 py-1 rounded-lg border border-gray-800 shadow-inner min-w-[50px] text-center">
                       <span className={`font-mono text-lg font-black ${isGameOver ? 'text-red-500' : 'text-blue-500'}`}>
                         {isGameOver ? 'FT' : `${min}'`}
                       </span>
                    </div>
                    <span className="text-3xl font-black text-white">{score.away}</span>
                  </div>
                </div>
                <div className="w-[30%] text-center truncate pl-1">
                  <h2 className="text-white font-black text-xs uppercase italic tracking-tighter truncate">{selectedOpponent?.club_name || 'Adversário'}</h2>
                </div>
              </div>

              <div className="bg-[#111827] border border-gray-800 rounded-xl p-3 text-center shrink-0">
                <p className="text-[10px] text-gray-400 italic truncate w-full uppercase tracking-widest font-bold">
                   {isGameOver ? "Match Finished" : (logs.length > 0 ? logs[logs.length - 1].message : "Waiting for kick-off...")}
                </p>
              </div>

              <div className="flex-1 relative overflow-hidden rounded-xl bg-[#0f172a] border border-gray-800 flex flex-col">
                {isGameOver ? (
                  <div className="absolute inset-0 flex flex-col p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 z-50">
                     <div className="text-center mb-6">
                       <h1 className="text-xl font-black text-white uppercase italic tracking-tighter flex items-center justify-center gap-2">
                         <BarChart3 className="text-blue-500 w-5 h-5" /> Match Statistics
                       </h1>
                     </div>

                     {mvp && (
                       <div className="bg-gradient-to-r from-blue-900/40 to-emerald-900/40 border border-white/10 rounded-xl p-4 mb-6 flex items-center justify-between">
                          <div>
                            <h3 className="text-[9px] font-black uppercase text-yellow-500 tracking-[0.2em] mb-1 flex items-center gap-1.5"><Trophy className="w-3 h-3"/> Man of the Match</h3>
                            <p className="text-xl font-black text-white">{mvp.name}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase mt-1">{mvp.equipa === 'home' ? 'Dream Team' : (selectedOpponent?.club_name || 'Adversário')} • {mvp.position}</p>
                          </div>
                          <div className="bg-[#0b1120] border-2 border-yellow-500/50 rounded-full w-14 h-14 flex items-center justify-center shadow-[0_0_30px_rgba(234,179,8,0.2)]">
                             <span className="text-lg font-black text-yellow-500">{Number(mvp.rating).toFixed(1)}</span>
                          </div>
                       </div>
                     )}

                     <div className="space-y-4 bg-[#0b1120]/50 p-4 rounded-xl border border-gray-800/50">
                       <div>
                         <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                           <span className={homePossessionPercent > awayPossessionPercent ? 'text-white' : ''}>{homePossessionPercent}%</span>
                           <span>Possession</span>
                           <span className={awayPossessionPercent > homePossessionPercent ? 'text-white' : ''}>{awayPossessionPercent}%</span>
                         </div>
                         <div className="w-full bg-red-600 h-1.5 rounded-full flex overflow-hidden">
                            <div className="bg-blue-600 h-full" style={{ width: `${homePossessionPercent}%` }}></div>
                         </div>
                       </div>

                       <div className="grid grid-cols-3 text-center items-center py-2">
                          <span className="text-lg font-black text-white">{matchStats.homeShots} <span className="text-[10px] text-gray-500">({matchStats.homeShotsOnTarget})</span></span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 flex flex-col items-center">Shots (Target)</span>
                          <span className="text-lg font-black text-white">{matchStats.awayShots} <span className="text-[10px] text-gray-500">({matchStats.awayShotsOnTarget})</span></span>
                       </div>
                     </div>

                     {sortedEvents.length > 0 && (
                       <div className="mt-6">
                         <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] mb-4 text-center">Goals & Cards</h3>
                         <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                               {sortedEvents.filter(g => g.team === 'home').map((g, idx) => (
                                 <div key={idx} className="bg-[#0b1120] border border-gray-800 p-2 rounded-lg flex items-center gap-2">
                                    <span className={`${g.type === 'Golo' ? 'text-blue-500' : g.type === 'Vermelho' ? 'text-red-500' : 'text-yellow-500'} font-mono font-bold text-[10px] w-6 text-right`}>{g.min}'</span>
                                    <div>
                                      <p className={`font-black text-xs ${g.type === 'Golo' ? 'text-white' : g.type === 'Vermelho' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {g.player} {g.type === 'Golo' ? '⚽' : g.type === 'Vermelho' ? '🟥' : '🟨'}
                                      </p>
                                      {g.assist && <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">A: {g.assist}</p>}
                                    </div>
                                 </div>
                               ))}
                            </div>
                            <div className="space-y-2">
                               {sortedEvents.filter(g => g.team === 'away').map((g, idx) => (
                                 <div key={idx} className="bg-[#0b1120] border border-gray-800 p-2 rounded-lg flex items-center gap-2 justify-end text-right">
                                    <div>
                                      <p className={`font-black text-xs ${g.type === 'Golo' ? 'text-white' : g.type === 'Vermelho' ? 'text-red-400' : 'text-yellow-400'}`}>
                                        {g.type === 'Golo' ? '⚽' : g.type === 'Vermelho' ? '🟥' : '🟨'} {g.player} 
                                      </p>
                                      {g.assist && <p className="text-[8px] text-gray-500 uppercase font-bold tracking-wider">A: {g.assist}</p>}
                                    </div>
                                    <span className={`${g.type === 'Golo' ? 'text-red-500' : g.type === 'Vermelho' ? 'text-red-500' : 'text-yellow-500'} font-mono font-bold text-[10px] w-6 text-left`}>{g.min}'</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                       </div>
                     )}
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    {/* HISTÓRICO DE LOGS NO TOPO (Agora cortado nos últimos 20 para evitar breaks) */}
                    <div className="h-32 bg-[#0b1120] border-b border-gray-800 p-3 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800">
                      {logs.length === 0 && (
                        <div className="h-full flex items-center justify-center text-gray-600 text-[10px] uppercase tracking-widest font-bold">
                           Aguardando início da partida...
                        </div>
                      )}
                      {logs.slice(-20).map((log, idx) => (
                        <div key={idx} className="flex gap-2 text-[10px] border-b border-gray-800/50 pb-1.5 mb-1.5">
                           <span className="font-mono text-blue-500 font-bold shrink-0">{log.minute}'</span>
                           <span className={`${log.className || 'text-gray-300'}`}>{log.message}</span>
                        </div>
                      ))}
                      <div ref={logEndRef} />
                    </div>
                    
                    
                    <div className="flex-1 flex overflow-hidden">
                      <div className="w-1/2 border-r border-gray-800 flex flex-col">
                        <div className="p-2 bg-gray-900/50 font-bold text-[8px] uppercase text-blue-500 tracking-widest border-b border-gray-800 text-center">
                           Dream Team
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 space-y-1">
                          {Object.values(statusJogadores).filter(j => j?.equipa === 'home').map(sj => (
                            <div key={sj.id} className="flex justify-between p-1.5 rounded-lg bg-[#0b1120]/50 border border-gray-800/50 text-[9px] items-center">
                              <span className="text-gray-500 font-black w-4">{sj.position}</span>
                              <span className={`flex-1 truncate mx-1 font-bold ${sj.isExpelled ? 'text-red-500' : sj.yellowCards > 0 ? 'text-yellow-400' : 'text-gray-300'}`}>{String(sj.name).split(' ').pop()}</span>
                              <span className={`font-mono font-black px-1 rounded ${sj.rating >= 7 ? 'text-emerald-400' : sj.rating < 6 ? 'text-red-400' : 'text-yellow-400'}`}>
                                {Number(sj.rating).toFixed(1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="w-1/2 flex flex-col">
                        <div className="p-2 bg-gray-900/50 font-bold text-[8px] uppercase text-gray-400 tracking-widest border-b border-gray-800 text-center truncate px-1">
                           {selectedOpponent?.club_name || 'Away'}
                        </div>
                        <div className="flex-1 overflow-y-auto p-1 space-y-1">
                          {Object.values(statusJogadores).filter(j => j?.equipa === 'away').map(sj => (
                            <div key={sj.id} className="flex justify-between p-1.5 rounded-lg bg-[#0b1120]/50 border border-gray-800/50 text-[9px] items-center">
                              <span className={`font-mono font-black px-1 rounded ${sj.rating >= 7 ? 'text-emerald-400' : sj.rating < 6 ? 'text-red-400' : 'text-yellow-400'}`}>
                                {Number(sj.rating).toFixed(1)}
                              </span>
                              <span className={`flex-1 text-right truncate mx-1 font-bold ${sj.isExpelled ? 'text-red-500' : sj.yellowCards > 0 ? 'text-yellow-400' : 'text-gray-300'}`}>{String(sj.name).split(' ').pop()}</span>
                              <span className="text-gray-500 font-black w-4 text-right">{sj.position}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                  
                    {highlight && !isSkipping && (
                      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1120]/95 backdrop-blur-md">
                        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">{highlight.type}!</h1>
                        <p className="text-lg font-black text-blue-400 mt-2 bg-[#0f172a] px-6 py-2 rounded-full border border-blue-500/30">{highlight.player}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              
              <div className="bg-[#0f172a] p-3 rounded-xl border border-gray-800 flex items-center justify-between shrink-0">
                <button 
                  onClick={() => {
                    if(!isPlaying && min === 0) setShowPreMatch(true);
                    else navigate('/dreamteam');
                  }} 
                  className="text-gray-500 hover:text-blue-400 font-black uppercase text-[9px] tracking-widest px-2"
                >
                   ← {!isPlaying && min === 0 ? 'Pre-Match' : 'Exit'}
                </button>
                
                <div className="flex items-center justify-center gap-2">
                  {!isPlaying && !isGameOver && (
                    <button onClick={() => setIsPlaying(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center gap-2">
                       <Play size={12} className="fill-current" /> Kick-Off
                    </button>
                  )}
                  
                  {isPlaying && !isGameOver && (
                    <>
                      <button onClick={() => setSpeed(s => s === 1 ? 2 : s === 2 ? 4 : 1)} className="bg-gray-800 text-white px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest flex items-center gap-1">
                         <FastForward size={12} /> {speed}x
                      </button>
                      <button onClick={() => setIsSkipping(true)} disabled={isSkipping} className="bg-gray-800 text-white px-3 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest flex items-center gap-1 disabled:opacity-50">
                         <SkipForward size={12} /> Skip
                      </button>
                    </>
                  )}

                  {isGameOver && (
                    <button onClick={() => window.location.reload()} className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-lg flex items-center gap-2">
                       <RotateCcw size={12} /> Again
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Simulator;