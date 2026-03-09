'use client'
import styles from "@/app/confirma-agendamento/confirma.module.css"
import { IconCalendar, IconClock, IconFileText } from '@tabler/icons-react'
import Navbar from "../components/nav_bar"
import {Center,Paper,Stack,Text,Group,Button,Divider,ThemeIcon} from '@mantine/core'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Flex from "react-calendar/dist/Flex.js"
import { request } from "http"
import { json, text } from "stream/consumers"
import { set } from "date-fns"
import { FaSleigh } from "react-icons/fa"
export default function ConfirmaAgendamento() {
    const [data, setdata] = useState()
    const [hora, sethora] = useState()
    const [observacoes, setobservacoes] = useState()
    const [error, seterror] = useState(false)
    const [texto, settexto] = useState('')
    const [sucesso, setSucesso] = useState(false)
    const [Loading, setLoading] = useState(false)
    const [trasnpar, settrasnpar] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const carregarDados = async () => {
            try {
                const response = await fetch('http://localhost:3002/buscar/dados/session', {
                    method: 'GET',
                    credentials: 'include',
                })

                const request = await response.json()
                console.log(request)

                if(request.success)  {
                    setdata(request.dados[0])
                    setobservacoes(request.dados[1])
                    sethora(request.dados[2])
                } else {
                    settexto('Erro interno no servidor')
                    seterror(true)
                    setTimeout(() => {
                        seterror(false)
                    }, 6000)
                }
            } catch(err) {
                settexto('Erro na chamada da API! Jà estamos verificando')
                console.log('erro', err)
            }
        } 

        carregarDados()
    }, [])

    const Realizar_agendamento = async () => {
        try {
            settrasnpar(true)
            setLoading(true)
            if (!data || !hora || !observacoes) {
                settexto('Dados inválidos! Não é possível realizar o agendamento')
                seterror(true) 
                setTimeout(() => {
                    seterror(false)
                }, 5000)
                return
            }

            const request = await fetch('http://localhost:3002/confirma-agendamento', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({data,observacoes,hora})
            })

            const response = await request.json()

            if(response.success) {
                settexto('Agedamento realizado')
                setSucesso(true)
                setTimeout(() => {
                    setSucesso(false)
                },5000)
            }
            else {
                seterror(true)
                settexto(response.error)
                setTimeout(() => {
                    seterror(false)
                }, 6000)
            }
        } catch (err) {
            console.log('erro ao enviar dados para api:', err)
            alert('Ao deu errado! Estamos verifiacando o error.')
        }  finally {
            settrasnpar(false)
            setLoading(false)
        }
    }
    return (
       <main className={styles.main}>
        <div>
            <Navbar></Navbar>
        </div>
        
        {Loading && (
            <div className={styles.carregar}>
                <span className={styles.span}></span>
            </div>
        )}
        
        {sucesso && (
            <div className={styles.div_sucesso}>
                <p>{texto}</p>
            </div>
        )}
        {error && (
            <div className={styles.invalido}>
                <p>{texto}</p>
            </div>
        )}
        <Center style={{height: '100vh'}}>
            <Paper
                shadow="xl"
                p="xl"
                radius="lg"
                withBorder
                ta="center"
                style={{ width: 480, margin: '0 auto',}}
            >
                <Stack gap="md" style={{ opacity: trasnpar ? 0.1 : ''}}>
                    <Text size="xl" fw={700} ta="center" c="black.7">
                        Confirme seu Agendamento
                    </Text>

                    <Divider />

                    <Group>
                        <ThemeIcon size="lg" radius="md" color="blue">
                        <IconCalendar size={20} />
                        </ThemeIcon>
                        <Text>Data: <b>{data ? data : 'Data nao definida'}</b></Text>
                    </Group>

                    <Group>
                        <ThemeIcon size="lg" radius="md" color="blue">
                        <IconClock size={20} />
                        </ThemeIcon>
                        <Text>Horário: <b>{hora? hora: 'Horário não definido'}</b></Text>
                    </Group>

                    <Group>
                        <ThemeIcon size="lg" radius="md" color="blue">
                        <IconFileText size={20} />
                        </ThemeIcon>
                        <Text>Observações: <b>{observacoes? observacoes: 'Observações nao definida'}</b></Text>
                    </Group>

                    <Divider />

                    <Group grow mt="md">
                        <Button
                        variant="outline"
                        color="gray"
                        onClick={() => router.back()}
                        >
                        Voltar
                        </Button>

                        <Button
                        
                        color="green"
                        onClick={Realizar_agendamento}
                        >
                        Confirmar
                        </Button>
                    </Group>
                </Stack>
            </Paper>
        </Center>    
       </main>
    )
}