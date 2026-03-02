'use client'; // Obrigatório para usar useRef e eventos de clique

import { useRef, useEffect, useState } from 'react';
import { TimeInput } from '@mantine/dates';
import { ActionIcon, rem, Center, Stack, Text, Paper } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';
import styles from '@/app/escolher-horario/horario.module.css';
import { tree } from 'next/dist/build/templates/app-page';
import { useRouter } from 'next/navigation';
import Navbar from '../components/nav_bar';
export default function RelogioGrande() {
  // Referência para o input (usada para abrir o seletor visual)
  const ref = useRef<HTMLInputElement>(null);
  const [horario, setHorario] = useState<string>('');
  const [invalido, setinvalido] = useState(false)
  const router = useRouter()
    const confirm_schedule = async () => {
      try {
        if(!horario) {
          setinvalido(true)
          setTimeout(() => {
            setinvalido(false)
          },5000)
          return
        }
        
        const request = await fetch('http://localhost:3002/save/horario/session', {
          method: 'POST',
          headers: {
            'Content-Type' : 'application/json'
          },
          body: JSON.stringify({horario}),
          credentials: 'include'
        })

        const response = await request.json()

        if(response.success) {
          router.push('/confirma-agendamento')
        }
        else {
          console.log(response.error)
          alert('Erro interno! tente recarregar a página')
        }
      } catch (err) {
        console.log(err)
      }  
    } 

  // Ícone que, ao ser clicado, abre o relógio nativo/visual do navegador
  const controleRelogio = (
    <ActionIcon 
      variant="subtle" 
      color="blue" 
      size="xl" 
      onClick={() => ref.current?.showPicker()} // Abre o seletor visual grande
    >
      <IconClock style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
    </ActionIcon>
  );

  return (
    <>
    <Navbar></Navbar>
    <main className={styles.main}>
      {invalido && (
        <div className={styles.invalido}>
          <p>Horário invalido</p>
        </div>
      )}
      <Center style={{ height: '100vh',}}>
        <Paper shadow="md" p="xl" radius="lg" withBorder style={{ width: 450 }}>
          <Stack align="stretch" gap="md">
            <Text size="xl" fw={700} ta="center" c="blue.7">
              Selecione o Horário
            </Text>

            <TimeInput
              label="Clique no ícone para ver o relógio"
              ref={ref}
              value={horario}
              onChange={(e) => setHorario(e.currentTarget.value)}
              rightSection={controleRelogio}
              size="xl"
              withAsterisk
              // Estilização Customizada para ficar GRANDE
              styles={{
                input: {
                  fontSize: rem(48), // Tamanho da fonte gigante
                  height: rem(120),  // Altura do campo bem grande
                  textAlign: 'center',
                  letterSpacing: rem(2),
                  fontWeight: 800,
                  color: '#1c7ed6',
                  borderRadius: '16px'
                },
                label: {
                  fontSize: rem(18),
                  marginBottom: rem(10),
                  fontWeight: 500
                }
              }}
            />

            {horario && (
              <Text ta="center" size="sm" c="dimmed" mt="sm">
                Horário selecionado: <strong>{horario}</strong>
              </Text>
            )}

            <button className={styles.btn} onClick={confirm_schedule}>confirmar</button>
          </Stack> 
        </Paper>
      </Center>
    </main>  
    </> 
  );
}