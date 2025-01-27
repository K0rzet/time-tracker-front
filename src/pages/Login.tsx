import { Container, TextInput, PasswordInput, Button, Paper, Title, Text, Group, Alert } from '@mantine/core'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { IconAlertCircle } from '@tabler/icons-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoginPending, loginError } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <Container size={420} my={40}>
      <Title ta="center">Вход</Title>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          {loginError && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
              {loginError}
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
          <Button type="submit" fullWidth mt="xl" loading={isLoginPending}>
            Войти
          </Button>
        </form>
        <Group justify="center" mt="md">
          <Text size="sm">
            Нет аккаунта?{' '}
            <Text component={Link} to="/register" size="sm" c="blue">
              Зарегистрироваться
            </Text>
          </Text>
        </Group>
      </Paper>
    </Container>
  )
} 