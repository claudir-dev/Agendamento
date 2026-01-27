import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import postresql from 'pg'
import { send } from 'process'
import bcrypt from 'bcrypt'
import { Console, error } from 'console'
import validator from "validator";
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { TbPoolOff } from 'react-icons/tb'
dotenv.config()
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

  const {Pool} = postresql

  const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })
 
async function testaconexao() {
  try{
    await pool.connect()
    console.log('Conectado ao servidor PostreSql')

    const res = await pool.query('SELECT version()')
    console.log(res.rows)
  } catch(err) {
    console.log('Erro ao se conectar ao servidor PostreSQL',err)
  }
}

testaconexao()

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
    const existe = await pool.query(
      'SELECT * FROM cadastro WHERE email = $1',
      [email]
    )

    if (existe) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10)
    console.log(hash)

    await pool.query(
      'INSERT INTO cadastro (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, hash]
    )

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
      
      const busca = await pool.query(
          'SELECT * FROM cadastro WHERE email = $1',
          [email]
        )

        if(!busca) {
          console.log('Usuario nao encontrado')
          return res.status(400).json({error: 'Usuario não encontrado'})
        } 

        console.log(busca)

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
app.post('/Esqueci-senha', async (req,res) => {
  const {email} = req.body

  if(!email) {
    console.log('dados Inegistente')
    return res.status(401).json({error: 'Dados Inegistente'})
  }

  if(!validator.isEmail(email)) {
    console.log('Email inválido')
    return res.status(401).json({error: 'Email inválido'})
  }

  const busca_emal = await pool.query(
      'SELECT * FROM cadastro WHERE email = $1',
      [email]
    )

  if(!busca_emal) {
    console.log('Email não encontrado')
    return res.status(400).json({error: 'Email não encontrado'})
  }  else {

    const userID = busca_emal.id
    const token = String(Math.floor(Math.random() * 10000))
    const expirar = Date.now() + 300000

    try {

      const token_upadate = await pool.query('INSET INTO cadastro WHERE email = $1 token_codigo = $1 codigo_expirar = $3 ',
        [email,token,expirar]
      )

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

app.post('/nova-senha', async (req, res) => {
    const {novaSenha, token} = req.body 
    console.log(novaSenha,token)

    if(!novaSenha || !token) {
      console.log('Dados inegistente')
      return res.status(401).json({error: 'Dados inegistente'})
    } 

    try {

      const busca_token = await pool.query(`
          SELECT * FROM cadastro WHERE token_codigo = $1
        `, [token])

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

      const busca_token_id = await pool.query(`
          SELECT * FROM users WHERE token_codigo = $1
        `, [token])

      const id_token = busca_token_id.id
      console.log(id_token)

      const hash = await bcrypt.hash(novaSenha,10)
      console.log(hash)

      db.prepare(`UPDATE cadastro SET senha = $1,  token_codigo = NULL, token_expirar = NULL WHERE id = ?`).run(hash, id_token)
      console.log('senha alterada com sucesso')
      return res.json({message: 'Senha alterada com sucesso'})

    } catch(error) {
      console.log('Erro ao cadastrar a nova senha',error)
      return res.status(500).json({error: 'Erro ao cadastrar a nova senha'})
    }
    
})
const port = 3002
app.listen(port, () => {
    console.log(`Servidor rodando na porta, ${port}`)
})