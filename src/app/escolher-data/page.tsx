'use client'

import { useState } from 'react'
import {DayPicker} from 'react-day-picker'
import styles from '@/app/escolher-data/calender.module.css'
import { FaCalendar } from 'react-icons/fa';
import {ptBR} from 'date-fns/locale' 
import { useRouter } from "next/navigation";
import { json } from 'stream/consumers';
export default function EscolherData() {
  const [date, setDate] = useState<Date | undefined>()
  const [invalido, setinvalido] = useState(false)
  const [valido, setvalido] = useState(false)
  const [texto, settexto] = useState('')
  const [Observacoes, setObservacoes] = useState('')
  const router = useRouter()

  const confirmar = async () => {
    try {
      const dateISO = date?.toISOString()
      
      if(!dateISO) {
        settexto('Dados invalidos')
        setTimeout(() => {
          setinvalido(false)
        },5000)
        setinvalido(true)
        return
      }

      const to_send = await fetch ('http://localhost:3002/api/auth/me', {
        method: 'GET', 
        credentials: 'include'
      })
      const response = await to_send.json()
      if(to_send.ok) {
        router.push('/escolher-horario')
        return
      }
      else {
        settexto('Voçê ainda não possui cadastro para fazer um agendamento')
        setinvalido(true)
        setTimeout(() => {
          setinvalido(false)
          router.push('/criar-conta')
        }, 7000)
        return
      }
      
      const save_to_session = await fetch('http://localhost:3002/sava/session', {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({date,Observacoes})
      })

      const reponse_save_session = await save_to_session.json()

      if(reponse_save_session.ok) {
        router.push('escolher-horario')
      } else {
        console.log('Erro no servidor',reponse_save_session.error)
        alert('Erro interno! Tente recarregar a pagina')
      }
    }catch (err) {
      console.log('erro interno', err)
    }
  }

  return (
    <div className={styles.calendar_wrapper}>
      {invalido && (
        <div className={styles.invalido}>
          <p>{texto}</p>
        </div>
      )}

      <div className={styles.card_calender}>
        <div className={styles.title}>
          <h2>📅 Escolher data</h2>
        </div> 

        <div className={styles.linha}></div> 

        <div className={styles.card}>
          <DayPicker
            mode='single'
            selected={date}
            onSelect={setDate}
            className={styles.calender}
            locale={ptBR}
          />
          
          <div className={styles.div_date}>
            {date && (
              <>
                <input 
                  className={styles.date_input}
                  value={date ? date.toISOString().slice(0, 10) : ''} 
                  readOnly
                  
                />
                <FaCalendar className={styles.icone_calender}/>

              </>
             
             
            )}
              
          </div>

          <div className={styles.Observacoes}>
            <label className={styles.label}>📝 Observações</label>
            <textarea
              className={styles.textarea}
              placeholder='Ex: Aula de reposição, sala 02, turma B.'
              value={Observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
            />
          </div>

          <div className={styles.div_btn}>
            <button className={styles.btn} onClick={confirmar}>Confirmar</button>
          </div>
        </div>  
    
      </div>  
    </div>  
  )
}
