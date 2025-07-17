import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, orderId } = await req.json()
    
    // Получаем токен АДМИНСКОГО бота и chat_id администратора
    const TELEGRAM_ADMIN_BOT_TOKEN = Deno.env.get('TELEGRAM_ADMIN_BOT_TOKEN')
    const TELEGRAM_ADMIN_CHAT_ID = Deno.env.get('TELEGRAM_ADMIN_CHAT_ID')
    
    console.log('Environment check:', {
      hasAdminToken: !!TELEGRAM_ADMIN_BOT_TOKEN,
      hasAdminChat: !!TELEGRAM_ADMIN_CHAT_ID,
      orderId
    })
    
    if (!TELEGRAM_ADMIN_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
      console.error('Missing Telegram admin credentials')
      throw new Error('Telegram admin credentials not configured')
    }

    // Отправляем сообщение администратору через админского бота
    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_ADMIN_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_ADMIN_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      }
    )

    if (!telegramResponse.ok) {
      const error = await telegramResponse.text()
      console.error('Telegram API error:', error)
      throw new Error(`Telegram API error: ${error}`)
    }

    const result = await telegramResponse.json()
    console.log('Admin notification sent successfully:', result.message_id)
    
    return new Response(
      JSON.stringify({ success: true, messageId: result.message_id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error sending Telegram admin notification:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})