import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; // Certifica-te de que criaste este ficheiro na pasta pages
import PlayerSearch from './pages/PlayerSearch'; // Certifica-te de que criaste este ficheiro na pasta pages
import Shortlist from './pages/Shortlist'; // Certifica-te de que criaste este ficheiro na pasta pages
import Perfil from './pages/Perfil';
import Comparison from './pages/Comparison';
import DreamTeam from './pages/DreamTeam';
import Academies from './pages/Academies';
import Simulator from './pages/Simulator'; 
import Register from './pages/Register'; 
import PlayerPerformance from './pages/PlayerPerformance'; 

export default function App() {
  return (
    <Routes>
      {/* Esta rota define que quando o caminho for vazio (página inicial), 
          o componente Dashboard será renderizado */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {
      <Route path="/search" element={<PlayerSearch />} />
      
      
      }

      {
      <Route path="/" element={<Register />} />
      
      
      }
 {
      <Route path="/shortlist" element={<Shortlist />} />
      
      
      }

      
{
      <Route path="/perfil/:id" element={<Perfil />} />
      
      
      }

      {
      <Route path="/comparison" element={<Comparison />} />
      
      
      }

      {
      <Route path="/dreamteam" element={<DreamTeam />} />
      
      
      }

       {
      <Route path="/academies" element={<Academies />} />
      
      
      }

       {
      <Route path="/simulator" element={<Simulator />} />
      
      
      }
      
      {
      <Route path="/register" element={<Register />} />
      
      
      }

      {
      <Route path="/player-performance" element={<PlayerPerformance />} />
      
      
      }
      
    </Routes>
  );
}