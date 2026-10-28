import { Navigate, useSearchParams } from 'react-router'
import Pets from '@/pages/Pets'
export default function PetsEntryPage() {
  const [search] = useSearchParams()
  const code = search.get('partner')
  if (code) {
    const query = new URLSearchParams()
    if (search.get('campaign')) query.set('campaign', search.get('campaign')!)
    if (search.get('via') === 'qr') query.set('via', 'qr')
    return <Navigate replace to={`/r/pets/${encodeURIComponent(code)}?${query}`} />
  }
  return <Pets />
}
