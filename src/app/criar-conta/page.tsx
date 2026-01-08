'use client'
import {FaEnvelope, FaPhoneAlt} from 'react-icons/fa'
import Icone from '@/app/components/icone'
import {useState} from 'react'
import { json } from 'stream/consumers'
import Link from 'next/link'
import { useRouter } from "next/navigation";
export default function CriarConta() {
    const [nome,setnome] = useState('')
    const [email, setemail] = useState('')
    const [senha,setsenha] = useState('')
    const router = useRouter()
    const Login = async ()=> {

        try {
            if (!nome || !email || !senha) {
                alert("prenncha todos os campos")
            }
            else {
                const dados = {
                    nome: nome,
                    email: email,
                    senha: senha
                }

                const request  = await fetch('http://localhost:3002/criar-conta', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'application/json'
                    },
                    body: JSON.stringify(dados)
                })

                const response = await request.json()
                
                if(request.ok) {
                    router.push('/home')
                } else {
                    console.log('erro na api', response.error)
                    alert(response.error)
                }
            }   
        } catch (error) {
            console.error('Erro ao fazer chamada para api', error)
        }     
    }    
    return (
        <main className="page">
            <div className="container">
                <div className="card">
                <div className="title">
                    <Icone/>
                    <h1>Agendaaki</h1>
                </div>

                <form className="login" autoComplete='on'>
                    <input type="text" value={nome} onChange={(e) => setnome(e.target.value)}  placeholder='Nome' />
                    <input type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder="E-mail" />
                    <input type="password" value={senha} onChange={(e) => setsenha(e.target.value)} placeholder="Senha" />
                </form>

                <div className="btn">
                    <button onClick={Login}>Criar-conta</button>
                </div>

                <a className="forgot" href="#">
                    Esqueci minha senha
                </a>

                <p className="create">
                    Já tem conta? <a href="/">Login</a>
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

    )
}