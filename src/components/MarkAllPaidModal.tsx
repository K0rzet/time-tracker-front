import { Modal, Text, Button, Group } from '@mantine/core';

interface MarkAllPaidModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function MarkAllPaidModal({ 
  opened, 
  onClose, 
  onConfirm, 
  isLoading 
}: MarkAllPaidModalProps) {
  return (
    <Modal 
      opened={opened} 
      onClose={onClose}
      title="Подтверждение"
      centered
    >
      <Text mb="xl">
        Вы уверены, что хотите отметить все таймеры этого проекта как оплаченные?
      </Text>
      <Group justify="flex-end">
        <Button variant="light" onClick={onClose}>Отмена</Button>
        <Button 
          onClick={onConfirm} 
          loading={isLoading}
        >
          Подтвердить
        </Button>
      </Group>
    </Modal>
  );
} 