import { Container, Title, SegmentedControl, Paper, Table, Radio, Text, Group, Stack, Badge, Box } from '@mantine/core'
import { useState } from 'react'
import { useStatistics, Period, PaidFilter } from '../hooks/useStatistics'
import { useMediaQuery } from '@mantine/hooks'

export function Statistics() {
  const [period, setPeriod] = useState<Period>('week')
  const [paidFilter, setPaidFilter] = useState<PaidFilter>('all')
  const { statistics, isLoading, formatTime, formatDate } = useStatistics(period, paidFilter)
  const isMobile = useMediaQuery('(max-width: 768px)')

  const periodData = [
    { label: 'Неделя', value: 'week' },
    { label: 'Месяц', value: 'month' },
    { label: 'Год', value: 'year' },
    { label: 'Все', value: 'all' },
  ]

  return (
    <Container size="lg">
      <Title order={1} mb="xl">Статистика</Title>

      <SegmentedControl
        fullWidth
        data={periodData}
        value={period}
        onChange={(value) => setPeriod(value as Period)}
        mb="xl"
      />

      <Paper shadow="xs" p="md" mb="xl">
        <Stack>
          <Title order={2}>Общее время</Title>
          <Group>
            <Paper shadow="xs" p="md" style={{ flex: 1 }}>
              <Text size="sm" c="dimmed">Всего</Text>
              <Text size="xl" fw={700}>
                {statistics ? formatTime(statistics.totalTime) : '0ч 0м'}
              </Text>
            </Paper>
            
            <Paper shadow="xs" p="md" style={{ flex: 1 }}>
              <Text size="sm" c="dimmed">Оплачено</Text>
              <Text size="xl" fw={700} c="green">
                {statistics ? formatTime(statistics.totalPaidTime) : '0ч 0м'}
              </Text>
            </Paper>
            
            <Paper shadow="xs" p="md" style={{ flex: 1 }}>
              <Text size="sm" c="dimmed">Не оплачено</Text>
              <Text size="xl" fw={700} c="red">
                {statistics ? formatTime(statistics.totalUnpaidTime) : '0ч 0м'}
              </Text>
            </Paper>
          </Group>
        </Stack>
      </Paper>

      <Paper shadow="xs" p="md">
        <Title order={2} mb="md">Время по проектам</Title>
        
        <Radio.Group
          value={paidFilter}
          onChange={(value) => setPaidFilter(value as PaidFilter)}
          name="paidFilter"
          mb="md"
        >
          <Group>
            <Radio value="all" label="Все" />
            <Radio value="paid" label="Оплаченные" />
            <Radio value="unpaid" label="Неоплаченные" />
          </Group>
        </Radio.Group>

        {statistics?.projectStats && statistics.projectStats.length > 0 ? (
          <Stack gap="lg">
            {statistics.projectStats.map((project) => (
              <Paper key={project.id} shadow="xs" p="md">
                <Group justify="space-between" mb="xs">
                  <Title order={3}>{project.name}</Title>
                  <Badge color={project.isPaid ? 'green' : 'red'}>
                    {project.isPaid ? 'Оплачен' : 'Не оплачен'}
                  </Badge>
                </Group>
                <Text mb="md">Общее время: {formatTime(project.totalTime)}</Text>
                
                <Box style={{ overflowX: 'auto' }}>
                  <Table style={{ minWidth: isMobile ? 600 : 'auto' }}>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Таймер</Table.Th>
                        <Table.Th>Начало</Table.Th>
                        <Table.Th>Конец</Table.Th>
                        <Table.Th>Время</Table.Th>
                        <Table.Th>Статус</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {project.timers.map((timer) => (
                        <Table.Tr key={timer.id}>
                          <Table.Td style={{ whiteSpace: 'nowrap' }}>
                            {timer.name || 'Без названия'}
                          </Table.Td>
                          <Table.Td style={{ whiteSpace: 'nowrap' }}>
                            {formatDate(timer.startTime)}
                          </Table.Td>
                          <Table.Td style={{ whiteSpace: 'nowrap' }}>
                            {timer.endTime ? formatDate(timer.endTime) : 'Активен'}
                          </Table.Td>
                          <Table.Td style={{ whiteSpace: 'nowrap' }}>
                            {formatTime(timer.time)}
                          </Table.Td>
                          <Table.Td style={{ whiteSpace: 'nowrap' }}>
                            <Badge color={timer.isPaid ? 'green' : 'red'}>
                              {timer.isPaid ? 'Оплачен' : 'Не оплачен'}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </Box>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Text c="dimmed" ta="center">
            {isLoading ? 'Загрузка...' : 'Нет данных за выбранный период'}
          </Text>
        )}
      </Paper>
    </Container>
  )
} 