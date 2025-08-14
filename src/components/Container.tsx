export default function Container({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`mx-auto max-w-6xl px-6 ${className}`} {...props} />
}