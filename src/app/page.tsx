'use client'

import dynamic from 'next/dynamic'

// Dynamically import all client components with no SSR
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false })
const Hero = dynamic(() => import('@/components/Hero'), { ssr: false })
const ImageEditor = dynamic(() => import('@/components/ImageEditor'), { ssr: false })

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <ImageEditor />
        </div>
      </section>
    </main>
  )
} 