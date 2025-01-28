import { Card, Text, Group, Button, Menu, ActionIcon, Stack, Switch } from '@mantine/core'
import { IconDots, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface TimerCardProps {
  timer: {
    id: string
    name: string
    startTime: string
    endTime: string | null
    isPaused: boolean
    pausedAt: string | null
    totalPause: number
    isPaid: boolean
    isLogged: boolean
  }
  onPause: (id: string) => void
  onResume: (id: string) => void
  onStop: (id: string) => void
  onUpdate: (data: { id: string; isPaid?: boolean; isLogged?: boolean }) => void
  onDelete: (id: string) => void
  calculateElapsedTime: (timer: any) => number
}

export function TimerCard({
  timer,
  onPause,
  onResume,
  onStop,
  onUpdate,
  onDelete,
  calculateElapsedTime,
}: TimerCardProps) {
  const [elapsedTime, setElapsedTime] = useState(calculateElapsedTime(timer))

  useEffect(() => {
    if (!timer.endTime && !timer.isPaused) {
      const interval = setInterval(() => {
        setElapsedTime(calculateElapsedTime(timer))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer, calculateElapsedTime])

  const handleDelete = () => {
    onDelete(timer.id)
  }

  const handleUpdate = (field: 'isPaid' | 'isLogged', value: boolean) => {
    onUpdate({ id: timer.id, [field]: value })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePause = () => {
    if (timer.id) onPause(timer.id)
  }

  const handleResume = () => {
    if (timer.id) onResume(timer.id)
  }

  const handleStop = () => {
    if (timer.id) onStop(timer.id)
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="lg" style={{ flex: 1 }}>
            {timer.name || 'Без названия'}
          </Text>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={handleDelete}
              >
                Удалить
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Text size="xl" fw={700}>
          {formatTime(elapsedTime)}
        </Text>

        <Group>
          {timer.endTime ? (
            <Text c="dimmed">Таймер остановлен</Text>
          ) : (
            <>
              {timer.isPaused ? (
                <Button onClick={handleResume}>Продолжить</Button>
              ) : (
                <Button onClick={handlePause}>Пауза</Button>
              )}
              <Button color="red" onClick={handleStop}>
                Остановить
              </Button>
            </>
          )}
        </Group>

        <Stack gap="xs">
          <Switch
            label="Оплачен"
            checked={timer.isPaid}
            onChange={(event) => handleUpdate('isPaid', event.currentTarget.checked)}
          />
          <Switch
            label="Занесен в таблицу"
            checked={timer.isLogged}
            onChange={(event) => handleUpdate('isLogged', event.currentTarget.checked)}
          />
        </Stack>
      </Stack>
    </Card>
  )
} 