import { Modal, TextInput, Textarea, Button, Stack } from '@mantine/core'
import { useState, useEffect } from 'react'

interface ProjectFormModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
  isLoading: boolean
  initialData?: {
    name: string
    description?: string
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

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setDescription(initialData.description || '')
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description: description || undefined })
    if (mode === 'create') {
      setName('')
      setDescription('')
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