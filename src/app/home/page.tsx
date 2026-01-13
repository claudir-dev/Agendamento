'use client'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import Icone from '@/app/components/icone'
import styles from '@/app/home/pagina.module.css'
export default function Home () {
    return (
        <>
            <main className={styles.background}>
                <div>
                    <div>
                        <Icone></Icone>
                        Agendaki
                    </div>
                    <div>
                        <ol>
                            <li><a href="">Home</a></li>
                            <li><a href="">Agenda</a></li>
                            <li><a href="">Contato</a></li>
                        </ol>
                    </div>
                </div>
                <div>
                    <div>
                        <h3>Agenda Seu Horário</h3>
                        <p>Rapído, Facil e sem complicação</p>
                    </div>
                    <div>
                        <button>Agendar Agora</button>
                    </div>
                </div>
            </main>
            <footer className={styles.dados}>
                <p>
                    2025 <strong>Agendaaki</strong> · Todos os direitos reservados
                </p>
        
                <div className="contato">
                    <span><FaEnvelope /> contato@exemplo.com.br</span>
                    <span><FaPhoneAlt /> (11) 99999-9999</span>
                </div>
            </footer>
        </>    
    )
}