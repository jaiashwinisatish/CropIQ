import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const { method } = req

    switch (method) {
      case 'POST':
        return await handleAuth(req, supabase)
      case 'GET':
        return await handleProfile(req, supabase)
      case 'PUT':
        return await handleProfileUpdate(req, supabase)
      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
    }
  } catch (error) {
    console.error('Auth function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleAuth(req: Request, supabase: any) {
  const { action, email, phone, password, full_name, role, language } = await req.json()

  try {
    if (action === 'signup') {
      // Sign up with email
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            role: role || 'farmer',
            language: language || 'en'
          }
        }
      })

      if (error) throw error

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: data.user.email,
            full_name,
            role: role || 'farmer',
            language: language || 'en'
          })

        if (profileError) throw profileError
      }

      return new Response(JSON.stringify({ 
        message: 'Signup successful',
        user: data.user 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return new Response(JSON.stringify({ 
        message: 'Signin successful',
        user: data.user,
        session: data.session
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'phone-signup') {
      // Sign up with phone number
      const { data, error } = await supabase.auth.signUp({
        phone,
        password,
        options: {
          data: {
            full_name,
            role: role || 'farmer',
            language: language || 'en'
          }
        }
      })

      if (error) throw error

      // Create profile record
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            phone: data.user.phone,
            full_name,
            role: role || 'farmer',
            language: language || 'en'
          })

        if (profileError) throw profileError
      }

      return new Response(JSON.stringify({ 
        message: 'Phone signup successful',
        user: data.user 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (action === 'phone-signin') {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone,
        password
      })

      if (error) throw error

      return new Response(JSON.stringify({ 
        message: 'Phone signin successful',
        user: data.user,
        session: data.session
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    throw new Error('Invalid action')
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

async function handleProfile(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  // Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError) throw profileError

  return new Response(JSON.stringify({ 
    user,
    profile 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}

async function handleProfileUpdate(req: Request, supabase: any) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'No authorization header' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const updates = await req.json()

  // Update profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (profileError) throw profileError

  return new Response(JSON.stringify({ 
    message: 'Profile updated successfully',
    profile 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
}
