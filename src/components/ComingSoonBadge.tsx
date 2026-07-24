import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  dark?: boolean
}

export default function ComingSoonBadge({ className, dark = false }: Props) {
  const { t } = useI18n()
  return (
    <span
      className={cn(
        'coming-soon-pulse mono-label inline-flex items-center gap-1.5 rounded-full border px-3 py-1 !text-[10px]',
        dark
          ? 'border-amber/70 text-amber'
          : 'border-amber bg-warmwhite/80 text-amber-deep backdrop-blur-sm',
        className,
      )}
    >
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber" />
      {t('badge.comingSoon')}
    </span>
  )
}
