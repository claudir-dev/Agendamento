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
export default function ConfirmaAgendamento() {
    const [data, setdata] = useState()
    const [hora, sethora] = useState()
    const [observacoes, setobservacoes] = useState()
    const [error, seterror] = useState(false)
    const [texto, settexto] = useState('')
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
    return (
       <main className={styles.main}>
        <div>
            <Navbar></Navbar>
        </div>
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
                style={{ width: 480, margin: '0 auto',  }}
            >
                <Stack gap="md">
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
                        <Text>Horário: <b>{hora}</b></Text>
                    </Group>

                    <Group>
                        <ThemeIcon size="lg" radius="md" color="blue">
                        <IconFileText size={20} />
                        </ThemeIcon>
                        <Text>Observações: <b>{observacoes}</b></Text>
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
                        onClick={() => console.log('Confirmado')}
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