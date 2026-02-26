'use client'

import { useState } from 'react'
import {DayPicker} from 'react-day-picker'
import styles from '@/app/escolher-data/calender.module.css'
import { FaCalendar } from 'react-icons/fa';
import {ptBR} from 'date-fns/locale' 
import { useRouter } from "next/navigation";
export default function EscolherData() {
  const [date, setDate] = useState<Date | undefined>()
  const [invalido, setinvalido] = useState(false)
  const [valido, setvalido] = useState(false)
  const [texto, settexto] = useState('')
  const router = useRouter()

  const confirmar = async () => {
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
    }
    else {
      console.log('Erro interno na api',response.error)
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
