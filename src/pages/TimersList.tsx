import { Container, Title, Button, Grid, Text, Group, Loader } from '@mantine/core'
import { useState } from 'react'
import { useTimers } from '../hooks/useTimers'
import { useProject } from '../hooks/useProject'
import { TimerCard } from '../components/TimerCard'
import { CreateTimerModal } from '../components/CreateTimerModal'
import { MarkAllPaidModal } from '../components/MarkAllPaidModal'
import { useMediaQuery } from '@mantine/hooks'
import { useParams } from 'react-router-dom'
import { notifications } from '@mantine/notifications'
import { Timer } from '../types/timer'

export function TimersList() {
  const [createModalOpened, setCreateModalOpened] = useState(false)
  const [markAllPaidModalOpened, setMarkAllPaidModalOpened] = useState(false)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const { id: projectId } = useParams()
  
  const { data: project, isLoading } = useProject(projectId)
  const {
    createTimer,
    deleteTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateTimer,
    markAllPaid,
    isCreating,
    isMarkingAllPaid,
    calculateElapsedTime,
  } = useTimers(projectId)

  const handleMarkAllPaid = async () => {
    try {
      if (projectId) {
        await markAllPaid()
        setMarkAllPaidModalOpened(false)
        notifications.show({
          title: 'Успешно',
          message: 'Все таймеры отмечены как оплаченные',
          color: 'green',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Ошибка',
        message: 'Не удалось отметить таймеры как оплаченные',
        color: 'red',
      })
    }
  }

  if (isLoading) {
    return (
      <Container>
        <Group justify="center">
          <Loader />
        </Group>
      </Container>
    )
  }

  if (!project) {
    return (
      <Container>
        <Text>Проект не найден</Text>
      </Container>
    )
  }

  return (
    <Container size="lg" px={isMobile ? 'xs' : 'md'}>
      <Group justify="space-between" mb="md">
        <Title order={isMobile ? 2 : 1}>{project.name}</Title>
        <Group>
          <Button 
            variant="light" 
            onClick={() => setMarkAllPaidModalOpened(true)}
          >
            Отметить все как оплаченные
          </Button>
          <Button onClick={() => setCreateModalOpened(true)}>
            {isMobile ? '+' : 'Создать таймер'}
          </Button>
        </Group>
      </Group>

      {project.timers.length === 0 ? (
        <Text c="dimmed" ta="center">
          У этого проекта пока нет таймеров
        </Text>
      ) : (
        <Grid gutter={isMobile ? 'xs' : 'md'}>
          {project.timers.map((timer: Timer) => (
            <Grid.Col key={timer.id} span={{ base: 12, sm: 6, lg: 4 }}>
              <TimerCard
                timer={timer}
                onPause={() => pauseTimer(timer.id)}
                onResume={() => resumeTimer(timer.id)}
                onStop={() => stopTimer(timer.id)}
                onUpdate={(data) => updateTimer(data)}
                onDelete={() => deleteTimer(timer.id)}
                calculateElapsedTime={() => calculateElapsedTime(timer)}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}

      <CreateTimerModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        onSubmit={(data) => {
          if (projectId) {
            createTimer({ ...data, projectId })
            setCreateModalOpened(false)
          }
        }}
        isLoading={isCreating}
      />

      <MarkAllPaidModal
        opened={markAllPaidModalOpened}
        onClose={() => setMarkAllPaidModalOpened(false)}
        onConfirm={handleMarkAllPaid}
        isLoading={isMarkingAllPaid}
      />
    </Container>
  )
} 