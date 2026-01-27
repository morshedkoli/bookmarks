// Native fetch is available in Node 18+

async function main() {
    try {
        // First get some website IDs
        const allRes = await fetch('http://localhost:3000/api/website?limit=5');
        const allJson = await allRes.json();
        const ids = allJson.data.slice(0, 3).map(w => w.id);

        console.log(`Testing with IDs: ${ids.join(',')}`);

        // Now fetch specific IDs
        const res = await fetch(`http://localhost:3000/api/website?ids=${ids.join(',')}`);
        const json = await res.json();

        if (json.status === 'success' && Array.isArray(json.data)) {
            console.log(`Fetched ${json.data.length} websites.`);
            json.data.forEach(w => console.log(` - ${w.name} (${w.id})`));

            if (json.data.length === ids.length) {
                console.log("SUCCESS: Fetched exactly the requested IDs.");
            } else {
                console.log("WARNING: Fetched count does not match requested count.");
            }
        } else {
            console.log('Failed:', json);
        }
    } catch (e) {
        console.error('Error fetching API:', e);
    }
}

main();
