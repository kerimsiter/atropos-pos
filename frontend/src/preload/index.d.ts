import { ElectronAPI } from '@electron-toolkit/preload'

interface CustomAPI {
  getOsInfo: () => Promise<string>
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: CustomAPI
  }
}
