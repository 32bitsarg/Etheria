async function testBackend() {
    try {
        console.log('--- TEST: REGISTER USER ---');
        // Usamos un nombre aleatorio para evitar conflictos si ya existe
        const randomName = 'User_' + Math.floor(Math.random() * 10000);

        console.log(`Intentando registrar: ${randomName}`);

        const registerRes = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: randomName })
        });

        const registerData = await registerRes.json();
        console.log('Register Status:', registerRes.status);
        console.log('Register Data:', registerData);

        if (!registerData.success) {
            console.error('Register failed');
            return;
        }

        console.log('\n--- SYSTEM IS WORKING ---');

    } catch (e) {
        console.error('Test failed:', e);
    }
}

testBackend();
