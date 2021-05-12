interface AnnouncementProps {
  children: JSX.Element | JSX.Element[]
  variant: "info" | "success" | "warning"
}

export default function Announcement({ children, variant }: AnnouncementProps): JSX.Element {
  let className = "lbh-page-announcement"

  if (variant) {
    className += ` ${className}--${variant}`
  }

  return (
    <section className={className}>
      {children}
    </section>
  )
}