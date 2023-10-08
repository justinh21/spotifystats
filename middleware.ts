import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req: any) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res },)
  const session = await supabase.auth.getSession()
  const user_id = session?.data.session?.user.id
  // Add user's provider_refresh_token to Supabase
  if (session?.data.session?.provider_refresh_token !== null) {
    const provider_refresh_token = session?.data.session?.provider_refresh_token
    const {error} = await supabase
    .from('users')
    .upsert({ provider_refresh_token: provider_refresh_token})
    .eq('id', user_id)
  }
  return res
}