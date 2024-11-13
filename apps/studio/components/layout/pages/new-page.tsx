export default function Page({
  children,
}: {
  children?: React.ReactNode
}) {
  return (
    <div className="flex min-h-full w-full flex-col overflow-y-auto overflow-x-hidden bg-background">
      {children}
    </div>
  )
}
