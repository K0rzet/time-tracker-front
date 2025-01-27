import { Container, TextInput, PasswordInput, Button, Paper, Title, Text, Group, Alert } from '@mantine/core'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { IconAlertCircle } from '@tabler/icons-react'

export function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { register, isRegisterPending, registerError } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register({ email, password })
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Регистрация</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {registerError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {registerError}
            </Alert>
          )}
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label="Пароль"
            placeholder="Ваш пароль"
            required
            mt="md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth mt="xl" loading={isRegisterPending}>
            Зарегистрироваться
          </Button>
        </form>
        <Group justify="center" mt="md">
          <Text size="sm">
            Уже есть аккаунт?{' '}
            <Text component={Link} to="/login" size="sm" c="blue">
              Войти
            </Text>
          </Text>
        </Group>
      </Paper>
    </Container>
  )
} 