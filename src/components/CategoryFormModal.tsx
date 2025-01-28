import React, { useState } from 'react'
import { Modal, Stack, TextInput, Button } from '@mantine/core'

export function CategoryFormModal({
  opened,
  onClose,
  onSubmit,
  isLoading
}: {
  opened: boolean
  onClose: () => void
  onSubmit: (data: { name: string }) => void
  isLoading: boolean
}) {
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ name })
    setName('')
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Создать категорию">
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Название"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Button type="submit" loading={isLoading}>
            Создать
          </Button>
        </Stack>
      </form>
    </Modal>
  )
} 