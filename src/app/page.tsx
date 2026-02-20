'use client'

import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Icone from "@/app/components/icone";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Login() {
  const [email, setemail] = useState('')     
  const [senha, setsenha] = useState('')
  const router = useRouter()
  const Login = async () => {
    try {

      if (!email || !senha) {
        alert('Preencha os campos')
        return
      }
      
      const dados = {
        email: email,
        senha: senha
      }

      const request = await fetch ('http://localhost:3002/login', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(dados),
        credentials: 'include'
      })

      const response = await request.json()
      console.log(response)
      if (request.ok) {
        localStorage.setItem('userID', response.userId)
        router.push('/home')
      } else {
        alert(response.error)
        console.error(response.error)
      }
    } catch(error) { 
      console.error('Erro ao enviar dados para a API', error)
      alert('Erro interno na API')
    }  
  }
  return (
    <main className="page">
      <div className="container">
        <div className="card">
          <div className="title">
            <Icone />
            <h1>Agendaaki</h1>
          </div>

          <div className="login">
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setemail(e.target.value)}/>
            <input type="password" placeholder="Senha" value={senha} onChange={(e) =>setsenha(e.target.value)} />
          </div>

          <div className="btn">
            <button onClick={Login}>Entrar</button>
          </div>

          <a className="forgot" href="/esqueci-senha">
            Esqueci minha senha
          </a>

          <p className="create">
            Não tem conta ainda? <a href="/criar-conta">Criar conta</a>
          </p>
        </div>
      </div>

      <footer className="dados">
        <p>
          2025 <strong>Agendaaki</strong> · Todos os direitos reservados
        </p>

        <div className="contato">
          <span><FaEnvelope /> contato@exemplo.com.br</span>
          <span><FaPhoneAlt /> (11) 99999-9999</span>
        </div>
      </footer>
    </main>
  );
}
