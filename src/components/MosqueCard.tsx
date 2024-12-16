import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mosque } from '@/types'

interface MosqueCardProps {
  mosque: Mosque
  nearestMosques: Mosque[]
  showCard: boolean
  onToggleCard: () => void
  lineCount: number
}

export default function MosqueCard({ 
  mosque, 
  nearestMosques, 
  showCard, 
  onToggleCard,
  lineCount 
}: MosqueCardProps) {
  return (
    <Card className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-black/90 border-neutral-800 text-white p-4 z-50">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">{mosque.name}</h2>
        <Button variant="ghost" size="sm" onClick={onToggleCard}>
          {showCard ? 'Hide' : 'Show'}
        </Button>
      </div>
      {showCard && (
        <>
          <p className="text-sm text-neutral-400 mb-4">
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {mosque.address}
            </a>
          </p>
          <div className="text-sm">
            <p>Nearest mosques:</p>
            <ul className="mt-2 space-y-1">
              {nearestMosques.slice(0, lineCount).map((mosque, i) => (
                <li key={mosque.id} className="text-neutral-400">
                  {i + 1}. {mosque.name} ({mosque.distance?.toFixed(1)} km)
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Card>
  )
}