import { useState } from 'react'
import { Container, Title, Stack, Button, Text, Code } from '@mantine/core'

function App(): React.JSX.Element {
  const [backendResponse, setBackendResponse] = useState<string | null>(null)

  const handleBackendTestClick = async (): Promise<void> => {
    try {
      // NestJS backend'i varsayılan olarak 3000 portunda çalışır
      const response = await fetch('http://localhost:3000/test-db')
      const data = await response.json()
      setBackendResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Backend ile iletişim kurulamadı:', error)
      setBackendResponse('Hata: Backend sunucusuna bağlanılamadı. Çalıştığından emin olun.')
    }
  }

  return (
    <Container>
      <Stack align="center">
        <Title order={1}>Restoran POS Sistemi</Title>
        <Text c="dimmed">NestJS Backend Bağlantı Testi</Text>

        <Button onClick={handleBackendTestClick} mt="xl">
          Backend'den Veritabanı Durumunu Al
        </Button>

        {backendResponse && (
          <Code block mt="lg">
            {backendResponse}
          </Code>
        )}
      </Stack>
    </Container>
  )
}

export default App