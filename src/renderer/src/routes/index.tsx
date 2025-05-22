import { createFileRoute } from '@tanstack/react-router'
import { JSX } from 'react'

export const Route = createFileRoute('/')({
  component: RouteComponent
})

function RouteComponent(): JSX.Element {
  return <div className="">Dit is de homepagina van de Frematt-tools site</div>
}
