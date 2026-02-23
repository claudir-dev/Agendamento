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
import { IoMdReturnRight } from 'react-icons/io'
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import next from 'next'
dotenv.config()  
const app = express()
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
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
  } catch(err) {
    console.log('Erro ao se conectar ao servidor PostreSQL',err)
  }
}

testaconexao()

const PostgresStore = pgSession(session)

app.use(session({
  store: new PostgresStore({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
  }
}))

const requerLogin = (req, res, next) => {
  if (req.session.userid) {
    next() 
  } else {
    res.redirect('/login')
  }
}

const jaLogado = (res, req, next) => {
  if
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
    const existe = await pool.query(
      'SELECT * FROM cadastro WHERE email = $1',
      [email]
    )
     

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10)
    console.log(hash)

    const novoUsuario = await pool.query(
      'INSERT INTO cadastro (nome, email, senha) VALUES ($1, $2, $3)',
      [nome, email, hash]
    )

    const userid = novoUsuario.rows[0].id
    req.session.userid = userid

    req.session.save((err) => {
      if(err) { 
        return res.status(500).json({error: 'Erro ao criar sessão'})
      }

      return res.json({ message: 'Usuário cadastrado com sucesso',});
    })

  } catch (error) {
    console.error('Erro ao cadastrar usuário', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/login', async (req, res) => {
    const {email, senha} = req.body
    console.log(email, senha)

    if (!email || !senha) {
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

        if(busca.rows.length === 0) {
          console.log('Usuario nao encontrado')
          return res.status(400).json({error: 'Usuario não encontrado'})
        } 

        const senhaBanco = busca.rows[0].senha
        console.log(senhaBanco)

        const senhaValida = await bcrypt.compare(
          senha, senhaBanco
        )

        if(!senhaValida) {
          console.log('Senha incorreta')
          return res.status(401).json({error: 'Senha invalida'})
        }

        req.session.userid = busca.rows[0].id
        
        req.session.save((err) => {
          if (err) {
            console.log('Erro ao salvar sessão:', err)
            return res.status(500).json({Error: 'Erro ao processar o login'})
          }
          res.json({message: 'login realizado com sucesso'})
        })

        console.log('Senha correta')
        

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

  if(!busca_emal.rows === 0) {
    console.log('Email não encontrado')
    return res.status(400).json({error: 'Email não encontrado'})
  }  else {

    const userID = busca_emal.id
    const token = String(Math.floor(Math.random() * 10000))
    const expirar = new Date(Date.now() + 5 * 60 * 1000)

    try {

      const token_upadate = await pool.query('UPDATE cadastro SET token_codigo = $1, token_expirar = $2  WHERE email = $3',
        [token,expirar, email]
      )

      console.log('Token cadastrado com sucesso')
      
    } catch (error) {
      console.log('Erro ao cadastra o token no banco de dados',error)
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

        console.log(busca_token)

      if(busca_token.rows ) { 
        console.log('token encontrado')
      } else {
        console.log('token nao encontrado')
        return res.status(400).json({error: 'Token não encontrado'})
      }

      const tempo_token = busca_token.rows[0].token_expirar
      const tempo_atual = new Date()
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
          SELECT * FROM cadastro WHERE token_codigo = $1
        `, [token])

      const id_token = busca_token_id.rows[0].id
      console.log(id_token)

      const hash = await bcrypt.hash(novaSenha,10)  
      console.log(hash)

      await pool.query(`UPDATE cadastro SET senha = $1, token_codigo = NULL, token_expirar = NULL WHERE id = $2`, 
        [hash,id_token]
      )
      console.log('senha alterada com sucesso')
      return res.json({message: 'Senha alterada com sucesso'})

    } catch(error) {
      console.log('Erro ao cadastrar a nova senha',error)
      return res.status(500).json({error: 'Erro ao cadastrar a nova senha'})
    }
    
})
app.post('/Escolher-data', async (req,res) => {
  const {dateISO} = req.body
  console.log(dateISO)
  const userid = req.session.userid
  console.log(userid)

  if(!dateISO) {
    res.status(400).json({error: 'dados invalidos'})
    return
  }

  try {

    const search_date = await pool.query('SELECT * FROM agendamento_datas WHERE datas = $1', 
      [dateISO]
    )

    if(search_date.rowCount > 0) {
      res.status(402).json({error: 'Esta data ja possui um agendamento'})
      return
    }

    const register_date = await pool.query('INSERT INTO agandamento_datas (datas, id_usuarios) VALUES ($1, $2)', [dateISO,userid])

    console.log(register_date)

  } catch (error) {
    res.status(500).json({error: 'Error interno', error })
    console.log('Erro interno', error)
  }  
})
const port = 3002
app.listen(port, () => {
    console.log(`Servidor rodando na porta, ${port}`)
})