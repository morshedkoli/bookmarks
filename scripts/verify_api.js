// Native fetch is available in Node 18+

async function main() {
    try {
        const response = await fetch('http://localhost:3000/api/category');
        const json = await response.json();

        if (json.status === 'success' && Array.isArray(json.data)) {
            console.log(`Success! Fetched ${json.data.length} categories.`);
            if (json.data.length > 0) {
                json.data.slice(0, 5).forEach(c => console.log(` - ${c.name}`));
            } else {
                console.log("No categories found in data.");
            }
        } else {
            console.log('Failed:', json);
        }
    } catch (e) {
        console.error('Error fetching API:', e);
    }
}

main();
