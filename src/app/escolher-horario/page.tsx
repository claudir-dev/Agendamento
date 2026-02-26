'use client'; // Obrigatório para usar useRef e eventos de clique

import { useRef, useState } from 'react';
import { TimeInput } from '@mantine/dates';
import { ActionIcon, rem, Center, Stack, Text, Paper } from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

export default function RelogioGrande() {
  // Referência para o input (usada para abrir o seletor visual)
  const ref = useRef<HTMLInputElement>(null);
  const [horario, setHorario] = useState<string>('');

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
    <Center style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      <Paper shadow="md" p="xl" radius="lg" withBorder style={{ width: 450 }}>
        <Stack align="stretch" gap="md">
          <Text size="xl" fw={700} ta="center" c="blue.7">
            Seletor de Horário
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
        </Stack>
      </Paper>
    </Center>
  );
}