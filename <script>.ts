<script>
    // Test if the element exists first
    const weatherDiv = document.getElementById('weather');
    console.log('Weather div found:', weatherDiv);
    
    async function loadWeather() {
        try {
            console.log('Starting weather fetch...');
            const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weather_code');
            console.log('Response received:', res);
            const data = await res.json();
            console.log('Data received:', data);
            const temp = data.current.temperature_2m;
            document.getElementById('weather').textContent = `Seattle: ${temp}°C`;
        } catch (err) {
            console.error('Weather fetch error:', err);
            document.getElementById('weather').textContent = 'Failed to load weather';
        }
    }

    loadWeather();
</script>