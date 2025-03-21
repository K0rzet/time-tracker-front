import { Card, Text, Group, Button, Menu, ActionIcon, Stack, Switch, TextInput, Textarea, NumberInput } from '@mantine/core'
import { IconDots, IconTrash, IconEdit, IconCheck, IconX, IconClock } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface TimerCardProps {
  timer: {
    id: string
    name: string
    description?: string
    startTime: string
    endTime: string | null
    isPaused: boolean
    pausedAt: string | null
    totalPause: number
    isPaid: boolean
    isLogged: boolean
    updatedAt?: string
  }
  onPause: (id: string) => void
  onResume: (id: string) => void
  onStop: (id: string) => void
  onUpdate: (data: { id: string; name?: string; description?: string; elapsed?: number; isPaid?: boolean; isLogged?: boolean }) => void
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
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(timer.name || '')
  const [editDescription, setEditDescription] = useState(timer.description || '')
  const [editHours, setEditHours] = useState(Math.floor(elapsedTime / 3600))
  const [editMinutes, setEditMinutes] = useState(Math.floor((elapsedTime % 3600) / 60))
  const [editSeconds, setEditSeconds] = useState(elapsedTime % 60)

  useEffect(() => {
    if (timer.endTime) return

    const interval = setInterval(() => {
      setElapsedTime(calculateElapsedTime(timer))
    }, 1000)

    return () => clearInterval(interval)
  }, [timer, calculateElapsedTime])

  useEffect(() => {
    setEditName(timer.name || '')
    setEditDescription(timer.description || '')
    setElapsedTime(calculateElapsedTime(timer))
  }, [timer, calculateElapsedTime])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = () => {
    onDelete(timer.id)
  }

  const handlePause = () => {
    onPause(timer.id)
  }

  const handleResume = () => {
    onResume(timer.id)
  }

  const handleStop = () => {
    onStop(timer.id)
  }

  const handleUpdate = (field: string, value: boolean | string) => {
    onUpdate({ id: timer.id, [field]: value })
  }

  const handleEdit = () => {
    setIsEditing(true)
    const currentElapsedTime = calculateElapsedTime(timer)
    setEditHours(Math.floor(currentElapsedTime / 3600))
    setEditMinutes(Math.floor((currentElapsedTime % 3600) / 60))
    setEditSeconds(currentElapsedTime % 60)
  }

  const handleSaveEdit = () => {
    const totalSeconds = (editHours * 3600) + (editMinutes * 60) + editSeconds
    
    onUpdate({
      id: timer.id,
      name: editName,
      elapsed: totalSeconds
    })
    
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditName(timer.name || '')
    setEditDescription(timer.description || '')
    const currentElapsedTime = calculateElapsedTime(timer)
    setEditHours(Math.floor(currentElapsedTime / 3600))
    setEditMinutes(Math.floor((currentElapsedTime % 3600) / 60))
    setEditSeconds(currentElapsedTime % 60)
    setIsEditing(false)
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        {isEditing ? (
          <>
            <TextInput
              label="Название"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              mb="xs"
            />
            <Textarea
              label="Описание"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              mb="xs"
            />
            <Group align="flex-end" grow>
              <NumberInput
                label="Часы"
                value={editHours}
                onChange={(val) => setEditHours(Number(val))}
                min={0}
                max={999}
              />
              <NumberInput
                label="Минуты"
                value={editMinutes}
                onChange={(val) => setEditMinutes(Number(val))}
                min={0}
                max={59}
              />
              <NumberInput
                label="Секунды"
                value={editSeconds}
                onChange={(val) => setEditSeconds(Number(val))}
                min={0}
                max={59}
              />
            </Group>
            <Group mt="md">
              <Button 
                leftSection={<IconCheck size={16} />} 
                onClick={handleSaveEdit}
              >
                Сохранить
              </Button>
              <Button 
                variant="light" 
                leftSection={<IconX size={16} />} 
                onClick={handleCancelEdit}
              >
                Отмена
              </Button>
            </Group>
          </>
        ) : (
          <>
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
                    leftSection={<IconEdit size={14} />}
                    onClick={handleEdit}
                  >
                    Редактировать
                  </Menu.Item>
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

            {timer.description && (
              <Text size="sm" c="dimmed" mb="xs">
                {timer.description}
              </Text>
            )}

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
            
            {timer.updatedAt && (
              <Group gap="xs" mt="xs">
                <IconClock size={14} />
                <Text size="xs" c="dimmed">
                  Последнее изменение: {formatDate(timer.updatedAt)}
                </Text>
              </Group>
            )}
          </>
        )}
      </Stack>
    </Card>
  )
} 