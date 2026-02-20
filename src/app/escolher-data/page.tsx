'use client'

import { useState } from 'react'
import {DayPicker} from 'react-day-picker'
import styles from '@/app/escolher-data/calender.module.css'
import { FaCalendar } from 'react-icons/fa';
import {ptBR} from 'date-fns/locale' 
export default function EscolherData() {
  const [date, setDate] = useState<Date | undefined>()
  const [invalido, setinvalido] = useState(false)
  const [valido, setvalido] = useState(false)
  const [texto, settexto] = useState('')

  const confirmar = async () => {
    const dateISO = date?.toISOString()
    
    if(!date) {
      settexto('Dados invalidos')
      setinvalido(true)
      return
    }

    const to_send = await fetch ('http://localhost:3002/Escolher-data', {
      method: 'POST', 
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({date})
    })
  }
  

  return (
    <div className={styles.calendar_wrapper}>
      {invalido && (
        <div>
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
