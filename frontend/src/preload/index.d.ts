import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  getGreeting: (name: string) => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
