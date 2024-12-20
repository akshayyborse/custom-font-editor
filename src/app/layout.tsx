import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Custom Font Image Editor</title>
        <meta name="description" content="Create stunning images with custom fonts using our powerful editor" />
      </head>
      <body suppressHydrationWarning={true}>
        <div suppressHydrationWarning={true}>
          {children}
        </div>
      </body>
    </html>
  )
}