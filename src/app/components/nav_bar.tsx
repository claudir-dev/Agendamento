import styles from "@/app/home/pagina.module.css"
import Icone from '@/app/components/icone'
import { useRouter } from "next/navigation"
export default function Navbar() {
    const router = useRouter()
    const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:3002/api/logout', {
            method: 'DELETE',
            credentials: 'include'
        })

        if (response.ok) {
            router.push('/')
        }

    } catch (err) {
        console.log('Erro ao fazer logout', err)
    }
    }
    return (
            <div className={styles.nav}>
                <div className={styles.logo}>
                    <Icone></Icone>
                    Agendaki
                </div>
                <div className={styles.links}>
                    <ul className={styles.links_nav}>
                        <li className={styles.lista}><a className={styles.items} href="/home">Home</a></li>
                        <li className={styles.lista}><a className={styles.items} href="/escolher-data">Agenda</a></li>
                        <li className={styles.lista}><a className={styles.items} href="">Contato</a></li>
                    </ul>
                    <div>
                        <button className={styles.bnt_sair} onClick={handleLogout}>Sair</button>
                    </div>
                </div>
            </div>  
    )
}