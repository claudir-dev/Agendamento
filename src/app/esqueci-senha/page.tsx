'use client'
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import Icone from "@/app/components/icone";
import { useState } from "react";
import { json } from "node:stream/consumers";
import { TbArrowAutofitWidth } from "react-icons/tb";
import { useRouter } from "next/navigation";
export default function EsqueciSenha() {
  const [email, setemail] = useState('')

  const Enviar = async () => {
    if(!email) {
      alert('Preencha o campo abaixo')
      return
    }

    const request = await fetch ('http://localhost:3002/esqueci-senha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email})
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
            <p style={{color: 'black'}}>Digite seu email para que posssamos recuperar a sua senha</p>
          </div>

          <div className="login">
            <input  type="email" placeholder="Email" value={email} onChange={(e) => setemail(e.target.value)} />
          </div>

          <div className="btn">
            <button onClick={Enviar}>Enviar</button>
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
