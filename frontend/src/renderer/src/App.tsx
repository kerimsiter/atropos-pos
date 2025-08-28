import { useState } from 'react'
import { Container, Title, Stack, TextInput, Button, Text } from '@mantine/core'

function App(): React.JSX.Element {
  const [name, setName] = useState('')
  const [greeting, setGreeting] = useState('')

  const handleButtonClick = async (): Promise<void> => {
    if (name) {
      const response = await window.api.getGreeting(name)
      setGreeting(response)
    }
  }

  return (
    <Container>
      <Stack align="center">
        <Title order={1}>Restoran POS Sistemi</Title>
        <Text c="dimmed">Backend ile İletişim Testi</Text>

        <TextInput
          label="Adınızı Girin"
          placeholder="Örn: Ahmet"
          value={name}
          onChange={(event): void => setName(event.currentTarget.value)}
          mt="md"
        />

        <Button onClick={handleButtonClick} mt="sm">
          Selamlama İsteği Gönder
        </Button>

        {greeting && (
          <Text mt="lg" c="blue" ta="center">
            {greeting}
          </Text>
        )}
      </Stack>
    </Container>
  )
}

export default App