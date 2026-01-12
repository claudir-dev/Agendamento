import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import banco from 'better-sqlite3'
import { send } from 'process'
import bcrypt from 'bcrypt'
import { Console, error } from 'console'
import validator from "validator";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
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
  const {email} = req.body

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
    const token = String(Math.floor(Math.random() * 10000))
    const expirar = Date.now() + 300000

    try {

      const token_upadate = db.prepare(`UPDATE users SET token = ?, token_expira = ? WHERE email = ?`).run(String(token), expirar, email)

      console.log('Token cadastrado com sucesso')
      
    } catch (error) {
      console.log('Erro ao cadastra o token no banco de dados')
      return res.status(500).json({error: 'Erro ao cadastra o token no banco de dados'})
    }
    
    try {

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.Email_user,
          pass: process.env.Email_pass
        }
      })

      const link = `http://localhost:3000/nova-senha?token=${token}`

      const config_email = {
        from: process.env.Email_user,
        port: 587,
        secure: false,
        to: email,
        subject: 'redefinição de senha',
        html: `
          <p>Voce solicitou a redefição de senha.</p>
          <P>Clique no link abaixo para redefinir sua senha:</p>
          <a href='${link}'>${link}</a>
          <p>Esse link é válido por 5 minutos.</p>
        `
      }

      const enviar = transporter.sendMail(config_email)
      console.log('Email enviado com sucesso')
      return res.json({ message: 'Email enviado com sucesso'})

    } catch (error) {
      console.log('Error ao enviar email de recuperação para o usúario')
      return res.status(500).json({error: 'Error ao enviar email de recuperação para o usúario', error})
    }

  }
  
})

app.post('/nova-senha', (req, res) => {
    const {novaSenha, token} = req.body 
    console.log(novaSenha,token)

    if(!novaSenha || !token) {
      console.log('Dados inegistente')
      return res.status(401).json({error: 'Dados inegistente'})
    } 

    try {

      const busca_token = db.prepare(`
          SELECT * FROM users WHERE token = ?
        `).get(token)

      if(busca_token) {
        console.log('token encontrado')
      } else {
        console.log('token nao encontrado')
        return res.status(400).json({error: 'Token não encontrado'})
      }

      const tempo_token = busca_token.token_expira 
      console.log(tempo_token)
      const tempo_atual = Date.now()
      console.log(tempo_atual)

      if(tempo_atual > tempo_token) {
        console.log('Token expirado')
        return res.status(401).json({error: 'Token expirado'})
      }

    } catch (error) {
      console.error('erro ao valida token', error)
    }

    try { 


    } catch(error) {
      console.log('Erro ao cadastrar a nova senha')
      return res.status(500).json({error: 'Erro ao cadastrar a nova senha'})
    }
    
})
const port = 3002
app.listen(port, () => {
    console.log(`Servidor rodando na porta, ${port}`)
})