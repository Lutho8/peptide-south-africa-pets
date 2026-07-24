import { useState } from 'react'
import { motion } from 'framer-motion'
import { PackagePlus, Check } from 'lucide-react'
import { addToCart, openCart } from '@/lib/cart'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const spring = { type: 'spring', stiffness: 260, damping: 30 } as const

interface Props {
  slug: string
  /** Open the drawer after adding (default true). */
  openDrawer?: boolean
  className?: string
  /** Mono (small) vs serif (large) visual weight. */
  variant?: 'primary' | 'outline'
}

/** "ADD TO LAUNCH BOX" — adds to the reservation cart with added-state feedback. */
export default function AddToBoxButton({
  slug,
  openDrawer = true,
  className,
  variant = 'outline',
}: Props) {
  const [added, setAdded] = useState(false)
  const { t } = useI18n()

  function handleAdd() {
    addToCart(slug)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
    if (openDrawer) openCart()
  }

  return (
    <motion.button
      type="button"
      onClick={handleAdd}
      whileTap={{ scale: 0.96 }}
      transition={spring}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-5 py-3 transition-colors',
        variant === 'primary'
          ? 'bg-amber font-serif text-base font-semibold text-warmwhite hover:bg-amber-deep'
          : 'mono-label border border-espresso/25 bg-warmwhite !text-[10px] text-espresso hover:border-amber hover:text-amber-deep',
        added && 'border-clinical bg-clinical text-cream hover:text-cream',
        className,
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <PackagePlus className="h-4 w-4" />}
      {added ? t('addbox.added') : t('addbox.add')}
    </motion.button>
  )
}
