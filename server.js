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

// Rota para listar as equipas (Usa club_name e overall da tua imagem)
app.get('/api/senior_teams', (req, res) => {
  const sql = "SELECT id, club_name, overall FROM senior_teams";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro na BD (teams):", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Rota para os jogadores (Atenção ao 'agression' com um 'g')
app.get('/api/senior_players/:team_id', (req, res) => {
  const teamId = req.params.team_id;
  const sql = "SELECT id, name, team_id, position, finishing, passing, agression, decisions, reflexes, heading, crossing, pace FROM senior_players WHERE team_id = ?";
  db.query(sql, [teamId], (err, results) => {
    if (err) {
      console.error("Erro na BD (players):", err);
      return res.status(500).json(err);
    }
    res.json(results);
  });
});


// ROTA PARA APAGAR A EQUIPA ANTIGA E GUARDAR A NOVA
// ROTA PARA GRAVAR A DREAM TEAM NO MYSQL
app.post('/api/save_dream_team', (req, res) => {
    const { playerIds } = req.body;

    console.log("1. IDs recebidos do React:", playerIds);

    if (!playerIds || playerIds.length === 0) {
        return res.status(400).json({ error: "Nenhum ID recebido." });
    }

    // Usar TRUNCATE em vez de DELETE (limpa a tabela de forma instantânea e sem problemas de chaves)
    db.query("TRUNCATE TABLE dream_team", (err) => {
        if (err) {
            console.error("❌ ERRO AO LIMPAR TABELA:", err);
            return res.status(500).json({ error: "Falha ao limpar a tabela", details: err });
        }

        console.log("2. Tabela limpa com sucesso.");

        // Garantir que são números puros antes de inserir
        const values = playerIds.map(id => [Number(id)]);

        db.query("INSERT INTO dream_team (player_id) VALUES ?", [values], (err2) => {
            if (err2) {
                console.error("❌ ERRO AO INSERIR JOGADORES:", err2);
                return res.status(500).json({ error: "Falha ao inserir", details: err2 });
            }

            console.log("3. ✅ SUCESSO! Equipa gravada na BD.");
            res.json({ message: "Guardado com sucesso!" });
        });
    });
});


// ROTA PARA CARREGAR A DREAM TEAM NO SIMULADOR
app.get('/api/dream_team', (req, res) => {
    // Fazemos um JOIN para buscar os dados completos à players_rows usando o player_id
    const sql = `
        SELECT p.* FROM dream_team d
        JOIN players_rows p ON d.player_id = p.\`COL 1\`
    `;
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erro ao carregar a Dream Team:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});


// ==========================================
// ROTA DE REGISTO (CRIAR CONTA)
// ==========================================
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    // Verificar se os campos não estão vazios
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Por favor, preenche todos os campos." });
    }

    const sql = "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
    
    db.query(sql, [username, email, password], (err, result) => {
        if (err) {
            console.error("Erro ao registar:", err);
            // O erro 1062 do MySQL significa "Duplicate entry" (Email ou Username já existe)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: "O email ou nome de treinador já está em uso!" });
            }
            return res.status(500).json({ message: "Erro na base de dados." });
        }
        
        // Se correu bem, devolve os dados (sem a password) para o React guardar na sessão
        res.json({ 
            message: "Conta criada com sucesso!", 
            user: { id: result.insertId, username, email } 
        });
    });
});


// ==========================================
// ROTA DE LOGIN (ENTRAR NA CONTA)
// ==========================================
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Preenche o email e a palavra-passe." });
    }

    // Procura na base de dados um utilizador com este email e com esta password exata
    const sql = "SELECT id, username, email FROM user WHERE email = ? AND password = ?";
    
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Erro ao fazer login:", err);
            return res.status(500).json({ message: "Erro no servidor." });
        }

        // Se o array results estiver vazio, significa que não encontrou correspondência
        if (results.length === 0) {
            return res.status(401).json({ message: "Email ou palavra-passe incorretos." });
        }

        // Se encontrou, faz o login com sucesso!
        res.json({ 
            message: "Login efetuado com sucesso!", 
            user: results[0] 
        });
    });
});

app.listen(3001, () => console.log("Servidor API ON: porta 3001"));