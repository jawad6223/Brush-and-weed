import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface QuoteSubmission {
  name: string;
  email: string;
  phone: string;
  address: string;
  acres: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const data: QuoteSubmission = await req.json();
    
    const { error: dbError } = await supabase
      .from('quote_submissions')
      .insert([{
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        acres: data.acres || '',
        message: data.message || '',
        status: 'new'
      }]);
    
    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`);
    }
    
    if (resendApiKey) {
      const emailBody = `
New Quote Request

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Property Address: ${data.address}
Approximate Acreage: ${data.acres || 'Not specified'}

Project Details:
${data.message || 'No additional details provided'}

Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
      `.trim();

      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: 'quotes@centraloregongoats.com',
          to: 'info@budtorcom.com',
          subject: `New Quote Request from ${data.name}`,
          text: emailBody,
        }),
      });

      if (!resendResponse.ok) {
        const errorText = await resendResponse.text();
        console.error('Resend API error:', errorText);
      }
    }
    
    return new Response(
      JSON.stringify({ success: true, message: 'Quote submitted successfully' }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing quote:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});