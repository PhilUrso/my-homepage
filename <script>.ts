<script>
    async function loadWeather() {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6062&longitude=-122.3321&current=temperature_2m,weather_code&temperature_unit=fahrenheit');
        const data = await res.json();
        const temp = data.current.temperature_2m;
        document.getElementById('weather').textContent = `Seattle: ${temp}°F`;
    }

    loadWeather().catch(err => {
        document.getElementById('weather').textContent = 'Failed to load weather';
        console.error(err);
    });
</script>