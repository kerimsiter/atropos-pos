import { Button, Stack } from '@mantine/core'
import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>

      {/* Mevcut actions bölümünü Mantine bileşenleri ile değiştirelim */}
      <Stack align="center" mt="xl">
        <Button
          variant="gradient"
          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
          component="a"
          href="https://electron-vite.org/"
          target="_blank"
          rel="noreferrer"
        >
          Documentation
        </Button>
        <Button variant="outline" onClick={ipcHandle}>
          Send IPC
        </Button>
      </Stack>

      <Versions />
    </>
  )
}

export default App