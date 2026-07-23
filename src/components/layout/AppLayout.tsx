import type { ReactNode } from 'react'

import { Sidebar } from '@/components/layout/Sidebar'
import { TopNavbar } from '@/components/layout/TopNavbar'

type AppLayoutProps = {
  children: ReactNode
  pageTitle?: string
}

export function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <div className="flex h-svh bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNavbar title={pageTitle} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
