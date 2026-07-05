import { contextBridge, ipcRenderer } from 'electron'

const api = {
  projects: {
    getAll: () => ipcRenderer.invoke('projects:getAll'),
    getById: (id: string) => ipcRenderer.invoke('projects:getById', id),
    create: (data: unknown) => ipcRenderer.invoke('projects:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('projects:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('projects:delete', id),
  },
  tasks: {
    getAll: (filters?: unknown) => ipcRenderer.invoke('tasks:getAll', filters),
    getById: (id: string) => ipcRenderer.invoke('tasks:getById', id),
    getToday: () => ipcRenderer.invoke('tasks:getToday'),
    getByProject: (projectId: string) => ipcRenderer.invoke('tasks:getByProject', projectId),
    getForDateRange: (start: string, end: string) => ipcRenderer.invoke('tasks:getForDateRange', start, end),
    getPriorities: () => ipcRenderer.invoke('tasks:getPriorities'),
    getOverdue: () => ipcRenderer.invoke('tasks:getOverdue'),
    create: (data: unknown) => ipcRenderer.invoke('tasks:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('tasks:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('tasks:delete', id),
    updateStatus: (id: string, status: string) => ipcRenderer.invoke('tasks:updateStatus', id, status),
    reorder: (updates: unknown[]) => ipcRenderer.invoke('tasks:reorder', updates),
    search: (query: string) => ipcRenderer.invoke('tasks:search', query),
  },
  notes: {
    getAll: () => ipcRenderer.invoke('notes:getAll'),
    getById: (id: string) => ipcRenderer.invoke('notes:getById', id),
    getByProject: (projectId: string) => ipcRenderer.invoke('notes:getByProject', projectId),
    create: (data: unknown) => ipcRenderer.invoke('notes:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('notes:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('notes:delete', id),
    search: (query: string) => ipcRenderer.invoke('notes:search', query),
  },
  goals: {
    getAll: () => ipcRenderer.invoke('goals:getAll'),
    getByProject: (projectId: string) => ipcRenderer.invoke('goals:getByProject', projectId),
    getActive: () => ipcRenderer.invoke('goals:getActive'),
    create: (data: unknown) => ipcRenderer.invoke('goals:create', data),
    update: (id: string, data: unknown) => ipcRenderer.invoke('goals:update', id, data),
    delete: (id: string) => ipcRenderer.invoke('goals:delete', id),
    updateProgress: (id: string, progress: number) => ipcRenderer.invoke('goals:updateProgress', id, progress),
  },
  ai: {
    chat: (messages: unknown[], apiKey: string) => ipcRenderer.invoke('ai:chat', messages, apiKey),
    getSuggestions: (apiKey: string) => ipcRenderer.invoke('ai:suggestions', apiKey),
  },
  system: {
    getVersion: () => ipcRenderer.invoke('system:getVersion'),
    getPlatform: () => ipcRenderer.invoke('system:getPlatform'),
    saveDatabase: () => ipcRenderer.invoke('system:saveDatabase'),
    writeErrorLog: (text: string) => ipcRenderer.invoke('system:writeErrorLog', text),
    checkUpdate: () => ipcRenderer.invoke('system:checkUpdate'),
    downloadUpdate: () => ipcRenderer.invoke('system:downloadUpdate'),
    installUpdate: () => ipcRenderer.invoke('system:installUpdate'),
    onUpdateReady: (cb: () => void) => { ipcRenderer.on('update:ready', cb); return () => { ipcRenderer.removeAllListeners('update:ready') } },
  },
}

contextBridge.exposeInMainWorld('api', api)
