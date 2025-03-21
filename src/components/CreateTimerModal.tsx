import { Modal, TextInput, Button, Textarea, Stack } from '@mantine/core'
import { useState } from 'react'

interface CreateTimerModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description?: string }) => void
  isLoading: boolean
}

export function CreateTimerModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
}: CreateTimerModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name, description: description.trim() || undefined })
    setName('')
    setDescription('')
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Создать таймер">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Название"
            placeholder="Введите название таймера"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            label="Описание"
            placeholder="Введите описание таймера"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button type="submit" loading={isLoading} fullWidth>
            Создать
          </Button>
        </Stack>
      </form>
    </Modal>
  )
} 