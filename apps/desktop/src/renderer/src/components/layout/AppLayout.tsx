import React from 'react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { StatusBar } from './StatusBar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      <TopBar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  )
}
