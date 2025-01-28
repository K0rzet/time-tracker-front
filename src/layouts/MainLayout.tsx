import { AppShell, Button, Group, Tabs, Stack } from '@mantine/core'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useMediaQuery } from '@mantine/hooks'
import { IconLayoutDashboard, IconChartBar, IconLogout } from '@tabler/icons-react'
import { MouseEvent } from 'react'

export function MainLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(min-width: 769px) and (max-width: 1024px)')
  const isVerySmallScreen = useMediaQuery('(max-width: 400px)')

  const handleLogout = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    logout()
  }

  if (isMobile) {
    return (
      <AppShell
        padding="md"
        footer={{ height: 60 }}
      >
        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
        
        <AppShell.Footer>
          <Tabs
            value={location.pathname}
            onChange={(value) => {
              if (value === '/logout') {
                logout()
              } else if (value) {
                navigate(value)
              }
            }}
            variant="pills"
            style={{ height: '100%' }}
          >
            <Tabs.List grow style={{ height: '100%' }}>
              <Tabs.Tab
                value="/projects"
                leftSection={<IconLayoutDashboard size={20} />}
                style={{ height: '100%' }}
              >
                {!isVerySmallScreen && 'Проекты'}
              </Tabs.Tab>
              <Tabs.Tab
                value="/statistics"
                leftSection={<IconChartBar size={20} />}
                style={{ height: '100%' }}
              >
                {!isVerySmallScreen && 'Статистика'}
              </Tabs.Tab>
              <Tabs.Tab
                value="/logout"
                leftSection={<IconLogout size={20} />}
                style={{ height: '100%' }}
              >
                {!isVerySmallScreen && 'Выйти'}
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </AppShell.Footer>
      </AppShell>
    )
  }

  if (isTablet) {
    return (
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="xs" justify="space-between" wrap="nowrap">
            <Group style={{ flex: '0 1 auto', overflow: 'hidden' }} gap={4} wrap="nowrap">
              <Button component={Link} to="/projects" variant="subtle" size="xs" style={{ padding: '0 8px' }}>
                Проекты
              </Button>
              <Button component={Link} to="/statistics" variant="subtle" size="xs" style={{ padding: '0 8px' }}>
                Статистика
              </Button>
            </Group>
            <Button 
              variant="subtle" 
              color="red" 
              onClick={handleLogout} 
              size="xs"
              style={{ padding: '0 8px', flexShrink: 0 }}
            >
              Выйти
            </Button>
          </Group>
        </AppShell.Header>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>
      </AppShell>
    )
  }

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm' }}
      padding="md"
    >
      <AppShell.Navbar p="md">
        <Stack>
          <Button
            component={Link}
            to="/projects"
            variant="subtle"
            leftSection={<IconLayoutDashboard size={20} />}
            justify="start"
            fullWidth
            color={location.pathname === '/projects' ? 'blue' : 'gray'}
          >
            Проекты
          </Button>
          <Button
            component={Link}
            to="/statistics"
            variant="subtle"
            leftSection={<IconChartBar size={20} />}
            justify="start"
            fullWidth
            color={location.pathname === '/statistics' ? 'blue' : 'gray'}
          >
            Статистика
          </Button>
          <Button
            variant="subtle"
            color="red"
            onClick={handleLogout}
            leftSection={<IconLogout size={20} />}
            justify="start"
            fullWidth
          >
            Выйти
          </Button>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  )
} 