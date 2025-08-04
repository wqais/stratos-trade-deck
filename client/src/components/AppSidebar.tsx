import { useState } from "react"
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  ShoppingCart, 
  FileText, 
  Activity,
  LogIn
} from "lucide-react"
import { Link, useLocation } from "wouter"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/dashboard", 
    icon: BarChart3,
    description: "Overview & KPIs"
  },
  { 
    title: "Trading", 
    url: "/trading", 
    icon: TrendingUp,
    description: "Execute Orders"
  },
  { 
    title: "Portfolio", 
    url: "/portfolio", 
    icon: PieChart,
    description: "Holdings & Performance"
  },
  { 
    title: "Charts", 
    url: "/charts", 
    icon: Activity,
    description: "Analysis & Reports"
  },
  { 
    title: "Analytics", 
    url: "/analytics", 
    icon: ShoppingCart,
    description: "Technical Analysis"
  },
]

const authItems = [
  { 
    title: "Login", 
    url: "/login", 
    icon: LogIn,
    description: "Sign In"
  },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const [location] = useLocation()

  const isActive = (path: string) => location === path || (path === "/dashboard" && location === "/")
  const isExpanded = navigationItems.some((i) => isActive(i.url))

  const getNavClassName = (path: string) =>
    isActive(path)
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-r-2 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"

  return (
    <Sidebar
      className={state === "collapsed" ? "w-14" : "w-64"}
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo/Brand */}
        <div className="p-4 border-b border-sidebar-border">
          {state !== "collapsed" ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">Stratos</span>
                <span className="text-xs text-sidebar-foreground/60">Trade Deck</span>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-sidebar-primary rounded-md flex items-center justify-center mx-auto">
              <TrendingUp className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium text-xs uppercase tracking-wider">
            {state !== "collapsed" ? "Trading Platform" : ""}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center gap-2 w-full p-2 rounded-md transition-colors`}
                    >
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && (
                        <div className="flex flex-col">
                          <span className="text-sm">{item.title}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Auth Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-sidebar-foreground/80 font-medium text-xs uppercase tracking-wider">
            {state !== "collapsed" ? "Account" : ""}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {authItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      href={item.url} 
                      className={`${getNavClassName(item.url)} flex items-center gap-2 w-full p-2 rounded-md transition-colors`}
                    >
                      <item.icon className="w-4 h-4" />
                      {state !== "collapsed" && (
                        <div className="flex flex-col">
                          <span className="text-sm">{item.title}</span>
                          <span className="text-xs opacity-60">{item.description}</span>
                        </div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}