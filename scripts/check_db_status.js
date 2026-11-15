const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abyhkfzhqxkvugtqcshr.supabase.co';
const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

async function check() {
  if (!secret) {
    console.log('No Supabase key provided in environment variables.');
    return [];
  }
  try {
    const res = await fetch(url + '/rest/v1/', {
      headers: {
        'apikey': secret,
        'Authorization': 'Bearer ' + secret
      }
    });
    const data = await res.json();
    const tables = Object.keys(data.paths || {})
      .map(p => p.replace('/', ''))
      .filter(p => p && !p.startsWith('rpc/'));
    
    console.log('Tables detected (' + tables.length + '):', tables.join(', '));
    return tables;
  } catch (e) {
    console.error('Error:', e.message);
    return [];
  }
}

check();
