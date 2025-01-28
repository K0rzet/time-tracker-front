import { Card, Text, Group, ActionIcon, Menu, Stack, Badge } from '@mantine/core'
import { IconDots, IconTrash, IconEdit } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    totalTime?: number
    timers?: Array<{ isPaid: boolean }>
    category?: {
      id: string
      name: string
    }
  }
  onDelete: (id: string) => void
  onEdit: (project: { id: string; name: string; description?: string }) => void
  formatTime: (seconds: number) => string
}

export function ProjectCard({ project, onDelete, onEdit, formatTime }: ProjectCardProps) {
  const isProjectPaid = project.timers && project.timers.length > 0 && 
    project.timers.every(timer => timer.isPaid)

  return (
    <Card 
      component={Link} 
      to={`/projects/${project.id}`}
      shadow="sm" 
      padding="lg" 
      radius="md" 
      withBorder
      style={{ 
        textDecoration: 'none', 
        color: 'inherit',
        display: 'block',
        height: '100%'
      }}
    >
      <Stack justify="space-between" h="100%">
        <div>
          <Group justify="space-between" mb="xs">
            <Stack gap="xs">
              <Group>
                <Text fw={500} size="lg">
                  {project.name}
                </Text>
                {project.timers && project.timers.length > 0 && (
                  <Badge color={isProjectPaid ? 'green' : 'red'}>
                    {isProjectPaid ? 'Оплачен' : 'Не оплачен'}
                  </Badge>
                )}
              </Group>
              {project.category && (
                <Badge variant="light" color="blue">
                  {project.category.name}
                </Badge>
              )}
            </Stack>
            <Menu withinPortal position="bottom-end" shadow="sm">
              <Menu.Target>
                <ActionIcon 
                  variant="subtle" 
                  onClick={(e) => {
                    e.preventDefault() // Предотвращаем переход по ссылке при клике на меню
                  }}
                >
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={(e) => {
                    e.preventDefault()
                    onEdit(project)
                  }}
                >
                  Редактировать
                </Menu.Item>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={(e) => {
                    e.preventDefault()
                    onDelete(project.id)
                  }}
                >
                  Удалить
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
          {project.description && (
            <Text size="sm" c="dimmed">
              {project.description}
            </Text>
          )}
        </div>
        {project.totalTime !== undefined && (
          <Text size="sm" c="dimmed">
            Общее время: {formatTime(project.totalTime)}
          </Text>
        )}
      </Stack>
    </Card>
  )
} 