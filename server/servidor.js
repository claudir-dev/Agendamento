import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import banco from 'better-sqlite3'
import { send } from 'process'
import bcrypt from 'bcrypt'
import { error } from 'console'
import validator from "validator";
import nodemailer from 'nodemailer'
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const db = new banco('banco_dados.db') 


db.prepare(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT 
        )
    `).run()   

const columns = db.prepare(`PRAGMA table_info(users)`).all()

const existetoken = columns.some(c => c.name === 'token')
const existeexpira = columns.some(c => c.name == 'token_expira')


if(!existetoken) {
  db.prepare(`ALTER TABLE users ADD COLUMN token TEXT`).run
  
}
if(!existeexpira) {
  db.prepare(`ALTER TABLE users ADD COLUMN token_expira INTEGER`).run()
}


app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});
app.post('/criar-conta', async (req, res) => {
  const { nome, email, senha } = req.body;
  console.log(nome, email, senha)

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  if(!validator.isEmail(email)) {
    console.log('Email inválido')
    return res.status(400).json({error: 'Email inválido'})
  }

  try {
    const existe = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);

    if (existe) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10)
    console.log(hash)

    db.prepare(
      'INSERT INTO users (nome, email, senha) VALUES (?, ?, ?)'
    ).run(nome, email, hash);

    return res.json({ message: 'Usuário cadastrado com sucesso',});

  } catch (error) {
    console.error('Erro ao cadastrar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/login', async (req, res) => {
    const {email, senha} = req.body

    if (!email, !senha) {
      console.log('dados inválidos')
      return res.status(400).json({error: 'Dados inválidos'})
    }

    if(!validator.isEmail(email)) {
      console.log('Email inválido')
      return res.status(400).json({error: 'Email inválido'})
    }

    try {
      
      const busca = db.prepare(`
          SELECT * FROM users WHERE email = ?
        `).get(email)

        if(!busca) {
          console.log('Usuario nao encontrado')
          return res.status(400).json({error: 'Usuario não encontrado'})
        } 

        const senhaBanco = busca.senha

        const senhaValida = await bcrypt.compare(
          senha, senhaBanco
        )

        if(!senhaValida) {
          console.log('Senha incorreta')
          return res.status(401).json({error: 'Senha invalida'})
        }

        console.log('Senha correta')
        return res.json({message: 'Senha correta',userId: busca.id})

    } catch (error) {
      console.log('Erro encontrado', error)
      return res.status(500).json({error: 'Erro interno na rota da API'})
    }
})
app.post('/Esqueci-senha', (req,res) => {
  const {email, userID} = req.body
  console.log(email)

  if(!email) {
    console.log('dados Inegistente')
    return res.status(401).json({error: 'Dados Inegistente'})
  }

  if(!validator.isEmail(email)) {
    console.log('Email inválido')
    return res.status(401).json({error: 'Email inválido'})
  }

  const busca_emal = db.prepare(`
      SELECT * FROM users WHERE email = ?
    `).get(email)

  if(!busca_emal) {
    console.log('Email não encontrado')
    return res.status(400).json({error: 'Email não encontrado'})
  }  else {

    const userID = busca_emal.id
    const codigo = Math.floor(1000 + Math.random() * 9000);
    const expirar = Date.now() + 300000

    try {

      db.prepare(`UPDATE users SET token = ?, token_expira = ? WHERE email = ?`)

    } catch (error) {
      console.log('Erro ao cadastra o token no banco de dados')
    }
    

  }
  
})
const port = 3002
app.listen(port, () => {
    console.log(`Servidor rodando na porta, ${port}`)
})