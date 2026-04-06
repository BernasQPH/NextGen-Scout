import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// LIGAÇÃO AO PHP-MY-ADMIN
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'nextgen-scout' // Tem de ser igual ao que vês no phpMyAdmin
});

db.connect(err => {
    if (err) console.error('Erro a ligar ao MySQL:', err);
    else console.log('Conectado ao phpMyAdmin com sucesso!');
});

app.get('/api/stats', (req, res) => {
  const qPlayers = "SELECT COUNT(*) as total FROM players_rows";
  const qAcademies = "SELECT COUNT(*) as total FROM academies";
  const qShortlist = "SELECT COUNT(*) as total FROM shortlist";

  db.query(qPlayers, (err, r1) => {
    if (err) return res.status(500).json(err);
    
    db.query(qAcademies, (err, r2) => {
      if (err) return res.status(500).json(err);
      
      db.query(qShortlist, (err, r3) => {
        if (err) return res.status(500).json(err);
        
        // LOG PARA DEBUG: Vê o que aparece no terminal do VS Code quando carregas a página
        console.log("Resultados SQL:", r1[0].total, r2[0].total, r3[0].total);

        res.json({
          totalPlayers: r1[0].total || 0,
          totalAcademies: r2[0].total || 0,
          shortlistCount: r3[0].total || 0
        });
      });
    });
  });
});

app.get('/api/players', (req, res) => {
  // 1. Verifica se a tabela se chama 'players' no teu phpMyAdmin. 
  // Se se chamar 'jogadores', muda aqui:
const sql = "SELECT * FROM players_rows WHERE `COL 1` != 'id'";

  db.query(sql, (err, results) => {
    if (err) {
      // ISTO VAI APARECER NO TEU TERMINAL (Preto) DO VS CODE
      console.error("ERRO CRÍTICO NO MYSQL:", err.message); 
      return res.status(500).json({ error: err.message });
    }
    
    // Envia os resultados para o React
    res.json(results);
  });
});

app.post('/api/shortlist', (req, res) => {
  // 1. Log para ver o que o React enviou
  console.log("Recebi no Body:", req.body);

  const { player_id, data_adicionado } = req.body;

  // 2. Verificação de segurança
  if (!player_id) {
    return res.status(400).json({ error: "O player_id veio vazio ou indefinido!" });
  }

  const query = "INSERT INTO shortlist (player_id, data_adicionado) VALUES (?, ?)";

  db.query(query, [player_id, data_adicionado], (err, result) => {
    if (err) {
      console.log("Erro SQL:", err.sqlMessage);
      return res.status(500).json({ error: err.sqlMessage });
    }
    res.status(201).json({ message: "OK" });
  });
});

// Rota para listar jogadores da Shortlist
app.get('/api/shortlist-players', (req, res) => {
    // Fazemos a ligação entre players_rows e shortlist
    const sql = `
        SELECT 
            p.*, 
            s.data_adicionado 
        FROM players_rows AS p
        INNER JOIN shortlist AS s ON p.\`COL 1\` = s.player_id
        ORDER BY s.data_adicionado DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao puxar de players_rows:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// Rota para remover (mantém-se igual, pois ataca a tabela shortlist)
app.delete('/api/shortlist/:id', (req, res) => {
    const playerId = req.params.id;
    const sql = "DELETE FROM shortlist WHERE player_id = ?";
    
    db.query(sql, [playerId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: "Removido da shortlist" });
    });
});




app.get('/api/players/:id', (req, res) => {
    const { id } = req.params;
    // Usamos crases para proteger nomes com espaços ou caracteres especiais
    const sql = "SELECT * FROM `players_rows` WHERE `COL 1` = ?";
    
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("ERRO SQL:", err);
            return res.status(500).json({ error: "Erro no SQL", details: err });
        }
        
        if (result.length > 0) {
            res.json(result[0]); // Envia o primeiro objeto
        } else {
            res.status(404).json({ message: "Jogador não encontrado" });
        }
    });
});


app.get('/api/academies', (req, res) => {
    // Ordenamos por nome para ficar organizado
    const sql = "SELECT id, nome, pais, rating, logo_url FROM academies ORDER BY nome ASC";
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao procurar academias:", err);
            return res.status(500).json({ error: "Erro na base de dados" });
        }
        res.json(results);
    });
});




app.listen(3001, () => console.log("Servidor API ON: porta 3001"));