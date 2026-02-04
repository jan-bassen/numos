import type { ReactNode } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'
import { Badge } from '@repo/ui/components/badge'

interface ComponentCardProps {
  name: string
  category: string
  children: ReactNode
}

export function ComponentCard({
  name,
  category,
  children,
}: ComponentCardProps) {
  return (
    <Card className="">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="">{name}</CardTitle>
        <Badge
          variant="outline"
          className="font-medium text-muted-foreground text-xs capitalize"
        >
          {category}
        </Badge>
      </CardHeader>
      <CardContent className="h-full bg-background/50 p-3 pt-4">
        <div className="flex h-full min-h-[120px] items-center justify-center">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
