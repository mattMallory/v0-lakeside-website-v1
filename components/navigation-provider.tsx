"use client"

import { createContext, useContext, type ReactNode } from "react"

import { defaultNavigationContent, type NavigationContent } from "@/lib/navigation-defaults"

const NavigationContext = createContext<NavigationContent>(defaultNavigationContent)

export function NavigationProvider({
  value,
  children,
}: {
  value: NavigationContent
  children: ReactNode
}) {
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}

export function useNavigation() {
  return useContext(NavigationContext)
}
