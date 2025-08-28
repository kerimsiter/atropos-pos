import { useState } from 'react'
import { Container, Title, Stack, Button, Text } from '@mantine/core'

function App(): React.JSX.Element {
  const [osInfo, setOsInfo] = useState('')

  const handleButtonClick = async (): Promise<void> => {
    const response = await window.api.getOsInfo()
    setOsInfo(response)
  }

  return (
    <Container>
      <Stack align="center">
        <Title order={1}>Restoran POS Sistemi</Title>
        <Text c="dimmed">Backend ile İletişim Testi</Text>

        <Button onClick={handleButtonClick} mt="xl">
          İşletim Sistemi Bilgisini Al
        </Button>

        {osInfo && (
          <Text mt="lg" c="blue" ta="center">
            {osInfo}
          </Text>
        )}
      </Stack>
    </Container>
  )
}

export default App