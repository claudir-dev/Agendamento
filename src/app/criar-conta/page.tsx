'use client'
import {FaEnvelope, FaPhoneAlt} from 'react-icons/fa'
import Icone from '@/app/components/icone'
import styles from '@/app/criar-conta/conta.module.css'
import {useState} from 'react'
import { json } from 'stream/consumers'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useSetState } from '@mantine/hooks'
import { set } from 'date-fns'
export default function CriarConta() {
    const [nome,setnome] = useState('')
    const [email, setemail] = useState('')
    const [senha,setsenha] = useState('')
    const [cadastro, setcadastro] = useState(false)
    const [texto, settexto] = useState('')
    const [loading, setloading] = useState(false)
    const [trasnpar, settrasnpar] = useState(false)
    const router = useRouter()
    const Login = async ()=> {
        try {
            setloading(true)
            settrasnpar(true)
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
                    settexto(response.error)
                    setcadastro(true)
                    setTimeout(() => {
                        setcadastro(false)
                    }, 6000)
                }
            }   
        } catch (error) {
            console.error('Erro ao fazer chamada para api', error)
        } finally {
            setloading(false)
        }   settrasnpar(false)
    }    
    return (
        <main className="page">
    
             {loading && (
                <div className={styles.carregar}>
                    <span className={styles.span}></span>
                </div>
             )}
            {cadastro && (
                <div className='cadastro'>
                    <p>{texto}</p>
                </div>
            )}
            <div className="container">
                <div className="card">
                <div className="title">
                    <Icone/>
                    <h1>Agendaaki</h1>
                </div>

                <form className="login" autoComplete='on' style={{opacity: trasnpar ? 0.1: ''}} >
                    <input type="text" value={nome} onChange={(e) => setnome(e.target.value)}  placeholder='Nome' />
                    <input type="email" value={email} onChange={(e) => setemail(e.target.value)} placeholder="E-mail" />
                    <input type="password" value={senha} onChange={(e) => setsenha(e.target.value)} placeholder="Senha" />
                </form>

                <div className="btn">
                    <button onClick={Login}>Criar-conta</button>
                </div>

                <a className="forgot" href="/esqueci-senha">
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