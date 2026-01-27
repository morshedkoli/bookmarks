
async function main() {
    try {
        const res = await fetch('http://localhost:3000/api/category');
        const json = await res.json();
        if (json.status === 'success') {
            const categories = json.data;
            console.log(`Total Categories: ${categories.length}`);
            categories.forEach(c => {
                console.log(`\nCategory: ${c.name} (ID: ${c.id})`);
                if (c.countries && c.countries.length > 0) {
                    console.log(`  Countries: ${c.countries.length}`);
                    c.countries.forEach(country => {
                        console.log(`    - ${country.name} (${country.code})`);
                    });
                }
                if (c.websites && c.websites.length > 0) {
                    c.websites.forEach(w => console.log(`  - ${w.name} (${w.link}) [Country: ${w.countryId || 'None'}]`));
                } else {
                    console.log('  (No websites directly in category)');
                }
            });
        } else {
            console.error('Failed to fetch:', json);
        }
    } catch (e) {
        console.error(e);
    }
}
main();
