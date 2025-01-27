import { Modal, TextInput, Button } from '@mantine/core'
import { useState } from 'react'

interface CreateTimerModalProps {
  opened: boolean
  onClose: () => void
  onSubmit: (data: { name: string }) => void
  isLoading: boolean
}

export function CreateTimerModal({
  opened,
  onClose,
  onSubmit,
  isLoading,
}: CreateTimerModalProps) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
    setName('')
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Создать таймер">
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Название"
          placeholder="Введите название таймера"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          mb="md"
        />
        <Button type="submit" loading={isLoading} fullWidth>
          Создать
        </Button>
      </form>
    </Modal>
  )
} 