import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"

interface TradingLayoutProps {
  children: React.ReactNode
}

export function TradingLayout({ children }: TradingLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-4">
            <SidebarTrigger className="text-foreground hover:bg-accent hover:text-accent-foreground" />
            
            <div className="flex-1 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  Market Status: <span className="text-profit font-medium">Open</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last Update: <span className="text-foreground">12:34:56 EST</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <div className="text-muted-foreground">
                  S&P 500: <span className="text-profit">+0.24%</span>
                </div>
                <div className="text-muted-foreground">
                  NASDAQ: <span className="text-profit">+0.18%</span>
                </div>
                <div className="text-muted-foreground">
                  DOW: <span className="text-loss">-0.12%</span>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}