import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import PreviewCards from '@/components/PreviewCards'

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <PreviewCards />
    </main>
  )
}
