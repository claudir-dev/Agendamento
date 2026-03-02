'use client'
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa'
import styles from '@/app/home/pagina.module.css'
import Image from 'next/image'
import Img from '@/app/assets/baner.png'
import { useRouter } from "next/navigation";
import Navbar from '../components/nav_bar'
export default function Home () {
    const router = useRouter()
    const Abadata = () => {
        router.push('/escolher-data')
    }
    const horario = () => {
        router.push('/escolher-horario')
    }
    const schedule = () => {
        router.push('/escolher-data')
    }
    return (
        <>  
        <main className={styles.background}>
            <Navbar></Navbar>
                <section className={styles.hero}>
                    <div className={styles.heroText}>
                        <h1>Agenda Seu Horário</h1>
                        <p>Rápido, fácil e sem complicação.</p>
                        <button className={styles.cta} onClick={schedule}>Agendar Agora</button>
                    </div>

                    <div className={styles.heroImg}>
                        <Image src={Img} alt="Ilustração de agenda" />
                    </div>
                </section>

                <section className={styles.section}>
                    <div className={styles.subtext}>
                        <div className={styles.linha}></div>
                        <h2 >Como Funciona</h2>
                        <div className={styles.linha}></div>
                    </div>    

                    <div className={styles.steps}>
                        <div className={styles.card} onClick={Abadata}>
                        <span>📅</span>
                        <p><strong>1</strong><br />Escolha a data</p>
                        </div>

                        <div className={styles.card} onClick={horario}>
                        <span>🕒</span>
                        <p><strong>2</strong><br />Selecione o horário</p>
                        </div>

                        <div className={styles.card}>
                        <span>✅</span>
                        <p><strong>3</strong><br />Confirme o agendamento</p>
                        </div>
                    </div>
                    </section>

                    {/* DISPONIBILIDADES */}
                    <section className={styles.section}>
                    <div className={styles.subtext}>
                        <div></div>
                        <h2>Próximas Disponibilidades</h2>
                        <div></div>
                    </div>    

                    <div className={styles.availability}>
                        <div className={styles.availCard}>
                        <strong>Amanhã</strong>
                        <span>5 horários disponíveis</span>
                        </div>

                        <div className={styles.availCardDark}>
                        <strong>Quarta-feira, 15 Mai</strong>
                        <span>3 horários disponíveis</span>
                        </div>
                    </div>

                    <button className={styles.secondaryBtn}>Ver horários</button>
                </section>
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