/** Proposed print pilot codes. Register public campaign codes here, never customer IDs. */
export const ENQUIRY_CAMPAIGNS = ['senior-dog-flyer-pilot', 'senior-dog-partner-pilot'] as const

/** Only known public codes can enter a message; arbitrary query data is discarded. */
export function enquiryCampaign(search: string): string | null {
  const values = new URLSearchParams(search).getAll('campaign')
  if (values.length !== 1) return null
  return ENQUIRY_CAMPAIGNS.find((code) => code === values[0]) ?? null
}

export function dogOwnerEnquiryMessage(search: string): string {
  const campaign = enquiryCampaign(search)
  return 'Hi Peptides4Pets! I am reading your dog-owner guide and have a question about your educational resources or Mobility Collagen.'
    + (campaign ? `\nCampaign reference: ${campaign}` : '')
}
