'use client'
import {FaEnvelope, FaPhoneAlt} from 'react-icons/fa'
import Icone from '@/app/components/icone'
import {use, useState} from 'react'
import { json } from 'stream/consumers'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation"
export default function ResertSenha () {
  const [novaSenha, setnovaSenha] = useState('')
  const [animar, setanimar] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const Enviar = async () => {
    if(!novaSenha) {
      alert('Preencha o campo abaixo')
      return
    }
    
    const token = searchParams.get('token')

    const request = await fetch ('http://localhost:3002/nova-senha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({novaSenha, token})
    })

    const response = await request.json()
    console.log(response)

    if(request.ok) {

    } else {
      console.log(response.error)
      alert(response.error)
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

          <div style={{marginBottom: '30px'}}>
            <p style={{color: 'black'}}>Digite a sua nova senha para redefinir-lá</p>
          </div>

          <div className="login">
            <input  type="email" placeholder="Nova senha" value={novaSenha} onChange={(e) => setnovaSenha(e.target.value)} />
          </div>

          <div className="btn">
            <button onClick={Enviar}>Redefinir</button>
          </div>

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
