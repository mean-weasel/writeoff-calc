import NavBar from '@/components/NavBar'

export default function CalculatorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page">
      <NavBar />
      {children}
    </div>
  )
}
