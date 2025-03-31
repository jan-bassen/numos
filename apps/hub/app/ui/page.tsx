import { Grid } from '@repo/ui/blocks/backgrounds/grid'
import { ThemeToggle } from '@/components/theme-toggle'
import { ComponentsGrid } from '@repo/ui/showcase/components-grid'
import Logo from '@repo/ui/blocks/brand/logo'

export default function ComponentsPage() {
  return (
    <div className="container mx-auto px-4 py-10">
      <Logo name className="absolute top-4 left-4 h-6 w-auto" />
      <ThemeToggle className="absolute top-4 right-4 " />
      <ComponentsGrid />
      <Grid />
    </div>
  )
}
