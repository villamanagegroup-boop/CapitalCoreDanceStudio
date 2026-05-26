import { supabase } from './supabase'

// Validate a promo code against the public.promo_codes table.
// Returns { valid, code, label, discountType, discountValue, error }.
//
// scope: optional string ('summer_classes' | 'camps' | ...) — codes scoped to
// a different program are rejected. 'any' codes are always accepted.
export async function validatePromoCode(rawCode, scope) {
  const code = String(rawCode || '').trim().toUpperCase()
  if (!code) return { valid: false, error: 'Enter a code.' }

  const { data, error } = await supabase
    .from('promo_codes')
    .select('code, label, discount_type, discount_value, applies_to, expires_at, active')
    .eq('code', code)
    .eq('active', true)
    .maybeSingle()

  if (error) {
    console.error('Promo lookup error:', error)
    return { valid: false, error: 'Could not check that code. Please try again.' }
  }
  if (!data) return { valid: false, error: 'That code isn\'t valid.' }
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    return { valid: false, error: 'That code has expired.' }
  }
  if (scope && data.applies_to !== 'any' && data.applies_to !== scope) {
    return { valid: false, error: 'That code doesn\'t apply to this program.' }
  }

  return {
    valid: true,
    code: data.code,
    label: data.label,
    discountType: data.discount_type,   // 'full' | 'percent' | 'fixed'
    discountValue: Number(data.discount_value) || 0,
  }
}

// Given a promo and a subtotal, return { discount, total }.
export function applyPromo(promo, subtotal) {
  if (!promo || !promo.valid) return { discount: 0, total: subtotal }
  const t = Number(subtotal) || 0
  if (promo.discountType === 'full') {
    return { discount: t, total: 0 }
  }
  if (promo.discountType === 'percent') {
    const d = Math.min(t, +(t * (promo.discountValue / 100)).toFixed(2))
    return { discount: d, total: +(t - d).toFixed(2) }
  }
  if (promo.discountType === 'fixed') {
    const d = Math.min(t, promo.discountValue)
    return { discount: d, total: +(t - d).toFixed(2) }
  }
  return { discount: 0, total: t }
}
