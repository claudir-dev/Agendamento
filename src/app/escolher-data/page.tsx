'use client'

import { useState } from 'react'
import {DayPicker} from 'react-day-picker'
import 'react-day-picker/dist/style.css'

export default function EscolherData() {
  const [date, setDate] = useState<Date | undefined>()
  

  return (
    <div className="calendar-wrapper">
      <h2>📅 Escolher data</h2>

      <DayPicker
        mode='single'
        selected={date}
        onSelect={setDate}
        
      />

      {date && (
        <p>
          Data selecionada:{' '}
          <strong>{date.toLocaleDateString('pt-BR')}</strong>
        </p>
      )}
    </div>
  )
}
