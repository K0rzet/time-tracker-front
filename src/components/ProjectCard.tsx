import { Card, Text, Group, ActionIcon, Menu, Stack } from '@mantine/core'
import { IconDots, IconTrash } from '@tabler/icons-react'
import { Link } from 'react-router-dom'

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description?: string
    totalTime?: number
  }
  onDelete: (id: string) => void
  formatTime: (seconds: number) => string
}

export function ProjectCard({ project, onDelete, formatTime }: ProjectCardProps) {
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
            <Text fw={500} size="lg">
              {project.name}
            </Text>
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
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={(e) => {
                    e.preventDefault() // Предотвращаем переход по ссылке при удалении
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