async function testTick() {
    const playerId = 'cm6rpkizj000212e69076ivsh';
    try {
        const res = await fetch('http://localhost:3000/api/player/tick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ playerId })
        });
        const data = await res.json();
        console.log('Response:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Fetch error:', e);
    }
}

testTick();
