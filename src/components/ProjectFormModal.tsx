import { Modal, TextInput, Textarea, Button, Stack, Select } from '@mantine/core'
import { useState, useEffect } from 'react'
import { useCategories } from '../hooks/useCategories'

interface ProjectFormModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string; categoryId?: string }) => void
  isLoading: boolean
  initialData?: {
    name: string
    description?: string
    categoryId?: string
  }
  mode: 'create' | 'edit'
}

export function ProjectFormModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
  initialData,
  mode,
}: ProjectFormModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined)
  const { categories } = useCategories()

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
      setCategoryId(initialData.categoryId)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ 
      name, 
      description,
      categoryId 
    })
    if (mode === 'create') {
      setName('')
      setDescription('')
      setCategoryId(undefined)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={mode === 'create' ? 'Создать проект' : 'Редактировать проект'}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Название"
            placeholder="Введите название проекта"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            label="Категория"
            placeholder="Выберите категорию"
            data={categories?.map(category => ({ 
              value: category.id, 
              label: category.name 
            })) || []}
            value={categoryId}
            onChange={(value) => setCategoryId(value || undefined)}
            clearable
          />
          <Textarea
            label="Описание"
            placeholder="Введите описание проекта"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={isLoading}>
            {mode === 'create' ? 'Создать' : 'Сохранить'}
          </Button>
        </Stack>
      </form>
    </Modal>
  )
} 