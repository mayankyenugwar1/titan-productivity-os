type TopNavbarProps = {
  title?: string
}

export function TopNavbar({ title = 'Dashboard' }: TopNavbarProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Overview
        </p>
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div
        aria-hidden="true"
        className="size-9 rounded-full border border-border bg-muted"
      />
    </header>
  )
}
