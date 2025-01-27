import { Container, Title, Button, Grid, Text, Group } from '@mantine/core'
import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectFormModal } from '../components/ProjectFormModal'
import { useMediaQuery } from '@mantine/hooks'

interface Project {
  id: string
  name: string
  description?: string
  totalTime: number
}

export function ProjectsList() {
  const [createModalOpened, setCreateModalOpened] = useState(false)
  const [editingProject, setEditingProject] = useState<{
    id: string
    name: string
    description?: string
  } | null>(null)
  
  const isMobile = useMediaQuery('(max-width: 768px)')
  const {
    projects,
    isLoadingProjects,
    createProject,
    updateProject,
    deleteProject,
    isCreating,
    isUpdating,
    formatTime,
  } = useProjects()

  if (isLoadingProjects) {
    return (
      <Container>
        <Text>Загрузка...</Text>
      </Container>
    )
  }

  return (
    <Container size="lg" px={isMobile ? 'xs' : 'md'}>
      <Group justify="space-between" mb="md">
        <Title order={isMobile ? 2 : 1}>Проекты</Title>
        <Button onClick={() => setCreateModalOpened(true)}>
          {isMobile ? '+' : 'Создать проект'}
        </Button>
      </Group>

      <Grid gutter={isMobile ? 'xs' : 'md'}>
        {projects?.map((project: Project) => (
          <Grid.Col key={project.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <ProjectCard
              project={project}
              onDelete={deleteProject}
              formatTime={formatTime}
            />
          </Grid.Col>
        ))}
      </Grid>

      <ProjectFormModal
        opened={createModalOpened}
        onClose={() => setCreateModalOpened(false)}
        onSubmit={(data) => {
          createProject(data)
          setCreateModalOpened(false)
        }}
        isLoading={isCreating}
        mode="create"
      />

      <ProjectFormModal
        opened={!!editingProject}
        onClose={() => setEditingProject(null)}
        onSubmit={(data) => {
          if (editingProject) {
            updateProject({ id: editingProject.id, data })
            setEditingProject(null)
          }
        }}
        isLoading={isUpdating}
        initialData={editingProject || undefined}
        mode="edit"
      />
    </Container>
  )
} 