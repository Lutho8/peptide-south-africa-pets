import { supabase } from '@/lib/supabase'
import type { CartItem } from '@/lib/cart'
import type { PetsCheckoutConsent } from '@/lib/petsConsent'
import { petsSessionId } from '@/lib/analytics'

export const EFT_SESSION_KEY = 'peptides4pets-eft-instructions'
const EFT_REQUEST_KEY = 'peptides4pets-eft-request'

export interface PetsCheckoutForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  addressLine1: string
  city: string
  province: string
  postalCode: string
  petName: string
  petSpecies: 'dog' | 'cat' | 'horse'
}

export interface EftInstructionsState {
  orderId: string
  amount: number
  paymentReference: string
  bank: {
    account_name: string
    bank: string
    account_number: string
    branch_code: string
    reference: string
  }
}

function selections(items: CartItem[]) {
  if (items.length < 1) throw new Error('Your order is empty')
  return items.map((item) => ({
    kind: 'item' as const,
    slug: `pets-${item.slug}`,
    quantity: item.qty,
  }))
}

function requestId(items: CartItem[], form: PetsCheckoutForm) {
  const fingerprint = JSON.stringify({ items: selections(items), form })
  try {
    const current = JSON.parse(sessionStorage.getItem(EFT_REQUEST_KEY) || 'null') as { id?: string; fingerprint?: string } | null
    if (current?.id && current.fingerprint === fingerprint) return current.id
    const id = crypto.randomUUID()
    sessionStorage.setItem(EFT_REQUEST_KEY, JSON.stringify({ id, fingerprint }))
    return id
  } catch {
    return crypto.randomUUID()
  }
}

export async function startPetsEftCheckout(
  items: CartItem[],
  form: PetsCheckoutForm,
  consent: PetsCheckoutConsent,
  partnerCode?: string,
): Promise<EftInstructionsState> {
  const { data } = await supabase.auth.getSession()
  if (!data.session) throw new Error('Sign in securely before placing the order')
  const id = requestId(items, form)
  const result = await fetch('/api/pets-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', authorization: `Bearer ${data.session.access_token}`, 'x-pets-session-id': petsSessionId() },
    body: JSON.stringify({
      requestId: id,
      partnerCode: partnerCode?.trim() || undefined,
      selections: selections(items),
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      consent,
      fulfilment: {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        phone: form.phone,
        address_line_1: form.addressLine1,
        city: form.city,
        province: form.province,
        postal_code: form.postalCode,
        pet_name: form.petName,
        pet_species: form.petSpecies,
      },
    }),
  })
  const response = await result.json().catch(() => null)
  if (!result.ok) throw new Error(response?.error || 'EFT checkout could not be started')
  if (!response?.order_id || !response?.payment_reference || !response?.bank || !Number.isFinite(response?.amount)) {
    throw new Error('The payment service returned an invalid response')
  }
  sessionStorage.removeItem(EFT_REQUEST_KEY)
  return {
    orderId: response.order_id,
    amount: response.amount,
    paymentReference: response.payment_reference,
    bank: response.bank,
  }
}
