import { Container, Title, Button, Grid, Text, Group, Select } from '@mantine/core'
import { useState } from 'react'
import { useProjects } from '../hooks/useProjects'
import { ProjectCard } from '../components/ProjectCard'
import { ProjectFormModal } from '../components/ProjectFormModal'
import { useMediaQuery } from '@mantine/hooks'
import { useCategories } from '../hooks/useCategories'
import { CategoryFormModal } from '../components/CategoryFormModal'

interface Project {
  id: string
  name: string
  description?: string
  totalTime: number
  categoryId?: string
}

export function ProjectsList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [createCategoryModalOpened, setCreateCategoryModalOpened] = useState(false)
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
  const { categories, createCategory, isCreatingCategory } = useCategories()

  const filteredProjects = selectedCategory
    ? projects?.filter((project: Project) => project.categoryId === selectedCategory)
    : projects

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
        <Group>
          <Button 
            variant="light"
            onClick={() => setCreateCategoryModalOpened(true)}
          >
            Создать категорию
          </Button>
          <Button onClick={() => setCreateModalOpened(true)}>
            {isMobile ? '+' : 'Создать проект'}
          </Button>
        </Group>
      </Group>

      <Select
        label="Категория"
        placeholder="Все категории"
        data={[
          { value: '', label: 'Все' },
          ...(categories?.map(category => ({ 
            value: category.id, 
            label: category.name 
          })) || [])
        ]}
        value={selectedCategory}
        onChange={(value) => setSelectedCategory(value)}
        clearable
        mb="md"
      />

      <Grid gutter={isMobile ? 'xs' : 'md'}>
        {filteredProjects?.map((project: Project) => (
          <Grid.Col key={project.id} span={{ base: 12, sm: 6, lg: 4 }}>
            <ProjectCard
              project={project}
              onDelete={deleteProject}
              onEdit={setEditingProject}
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

      <CategoryFormModal
        opened={createCategoryModalOpened}
        onClose={() => setCreateCategoryModalOpened(false)}
        onSubmit={(data) => {
          createCategory(data)
          setCreateCategoryModalOpened(false)
        }}
        isLoading={isCreatingCategory}
      />
    </Container>
  )
} 