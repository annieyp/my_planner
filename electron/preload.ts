import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('scrapPlanner', {
  platform: process.platform,
})
