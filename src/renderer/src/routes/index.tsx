import { createFileRoute } from '@tanstack/react-router'
import { JSX } from 'react'
import logo from '../assets/FREMATT_Logo_Groot-6044097.webp'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent(): JSX.Element {
  return (
    <div className="w-screen flex items-center justify-center">
      <img src={logo} alt="logo" className="w-auto h-52" />
    </div>
  )
}
