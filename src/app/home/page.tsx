'use client'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import Icone from '@/app/components/icone'
import styles from '@/app/home/pagina.module.css'
export default function Home () {
    return (
        <>
            <main className={styles.background}>
                <div className={styles.nav}>
                    <div className={styles.logo}>
                        <Icone></Icone>
                        Agendaki
                    </div>
                    <div className={styles.links}>
                        <ul className={styles.links_nav}>
                            <li className={styles.lista}><a className={styles.items} href="">Home</a></li>
                            <li className={styles.lista}><a className={styles.items} href="">Agenda</a></li>
                            <li className={styles.lista}><a className={styles.items} href="">Contato</a></li>
                        </ul>
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
                <div>
                    <div></div><p>Como funciona</p><div></div>
                </div>
                <div>
                    <div>
                        <button>
                            <div>📅</div>
                            <div>
                                <div>1</div>
                                <div>
                                    <p>Escolher a Data</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <div>
                        <button>
                            <div>🕒</div>
                            <div>
                                <div>2</div>
                                <div>
                                    <p>Seleciona horário</p>
                                </div>
                            </div>
                        </button>
                    </div> 
                    <div>
                        <button>
                            <div>✅</div>
                            <div>
                                <div>3</div>
                                <div>Meus Agendamentos</div>
                            </div>
                        </button>
                    </div>                       
                </div>
                <div>
                    <div></div><p>Próximas Disponibilidades</p><div></div>
                    <div>

                    </div>
                    <div>
                        <button>Ver meus horários</button>
                    </div>
                </div>
                <div>
                    <div></div><p>Compromissos</p><div></div>
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