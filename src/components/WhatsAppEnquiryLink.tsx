import type { ReactNode } from 'react'
import { useLocation } from 'react-router'
import { waLink } from '@/lib/data'
import { dogOwnerEnquiryMessage } from '@/lib/enquiryCampaign'

/** Plain link: no click telemetry, storage, account lookup or send action. */
export default function WhatsAppEnquiryLink({
  children, className, label, message, onClick,
}: {
  children: ReactNode
  className?: string
  label?: string
  message?: string
  onClick?: () => void
}) {
  const { pathname, search } = useLocation()
  const text = pathname === '/dog-owners'
    ? dogOwnerEnquiryMessage(search)
    : message ?? 'Hi Peptides4Pets! I have a question about your pet products.'

  return (
    <a
      href={waLink(text)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={onClick}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className ?? ''}`}
    >
      {children}
    </a>
  )
}
