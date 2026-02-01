import fetch from 'node-fetch';

const url = 'https://dtpydjllcreeibrrtcna.supabase.co/storage/v1/object/public/audios/translated/letter-romanos-es.m4a';

async function testFetch() {
    console.log(`Fetching: ${url}`);
    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status} ${res.statusText}`);
        console.log(`Content-Type: ${res.headers.get('content-type')}`);
        console.log(`Content-Length: ${res.headers.get('content-length')}`);

        if (res.ok) {
            console.log('✅ URL is accessible!');
        } else {
            console.log('❌ Failed to access URL.');
        }
    } catch (err) {
        console.error('❌ Network error:', err.message);
    }
}

testFetch();
