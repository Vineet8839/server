document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const birthForm = document.getElementById('birthForm');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultsSection = document.getElementById('resultsSection');
    const analyzePalmBtn = document.getElementById('analyzePalmBtn');
    const palmCanvas = document.getElementById('palmCanvas');
    const ctx = palmCanvas.getContext('2d');

    // Event Listeners
    calculateBtn.addEventListener('click', calculateAstrology);
    analyzePalmBtn.addEventListener('click', analyzePalm);

    // Set default coordinates for major cities
    document.getElementById('lat').value = '28.6139'; // Default to Delhi
    document.getElementById('lng').value = '77.2090';

    // Calculate Astrology Data
    async function calculateAstrology() {
        const dob = new Date(document.getElementById('dob').value);
        const timeString = document.getElementById('tob').value;
        const [hours, minutes] = timeString.split(':').map(Number);
        const lat = parseFloat(document.getElementById('lat').value);
        const lng = parseFloat(document.getElementById('lng').value);

        if (!dob || isNaN(dob.getTime())) {
            alert('Please enter a valid date of birth');
            return;
        }

        const apiUrl = '/api/calculate';
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    year: dob.getFullYear(),
                    month: dob.getMonth() + 1,
                    day: dob.getDate(),
                    hour: hours,
                    minute: minutes,
                    lat,
                    lng
                })
            });

            const data = await response.json();

            if (data.success) {
                displayResults(data.data);
                resultsSection.classList.remove('hidden');
            } else {
                throw new Error(data.error || 'Failed to calculate astrology data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error calculating astrology data: ' + error.message);
        }
    }

    // Display Results
    function displayResults(data) {
        // Basic info
        document.getElementById('rashi').textContent = data.rashi;
        document.getElementById('ascendant').textContent = data.ascendant;
        document.getElementById('nakshatra').textContent = data.nakshatra;

        // Planet details
        const planetDetails = document.getElementById('planetDetails');
        planetDetails.innerHTML = '';
        
        for (const [planet, info] of Object.entries(data.planets)) {
            const div = document.createElement('div');
            div.className = 'flex justify-between';
            div.innerHTML = `
                <span class="capitalize font-medium">${planet}:</span>
                <span>${info.longitude.toFixed(2)}° (${getRashi(info.longitude)})</span>
            `;
            planetDetails.appendChild(div);
        }

        // House details
        const houseDetails = document.getElementById('houseDetails');
        houseDetails.innerHTML = '';
        
        data.houses.forEach((longitude, i) => {
            const div = document.createElement('div');
            div.className = 'bg-gray-600 p-2 rounded text-center';
            div.innerHTML = `
                <div class="font-medium">House ${i+1}</div>
                <div>${getRashi(longitude)}</div>
                <div class="text-sm">${longitude.toFixed(2)}°</div>
            `;
            houseDetails.appendChild(div);
        });

        // Create planet chart
        createPlanetChart(data.planets);
    }

    // Create Planet Chart
    function createPlanetChart(planets) {
        const ctx = document.getElementById('planetChart').getContext('2d');
        
        const planetNames = Object.keys(planets).map(p => p.charAt(0).toUpperCase() + p.slice(1));
        const planetLongitudes = Object.values(planets).map(p => p.longitude % 30);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: planetNames,
                datasets: [{
                    label: 'Position in Zodiac (0-30°)',
                    data: planetLongitudes,
                    backgroundColor: 'rgba(124, 58, 237, 0.7)',
                    borderColor: 'rgba(124, 58, 237, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 30,
                        title: {
                            display: true,
                            text: 'Degrees in Sign'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // Analyze Palm Image
    function analyzePalm() {
        const fileInput = document.getElementById('palmImage');
        const file = fileInput.files[0];
        
        if (!file) {
            alert('Please upload a palm image first');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                // Draw image on canvas
                palmCanvas.width = img.width;
                palmCanvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                
                // Simulate palm analysis (in a real app, this would use ML)
                simulatePalmAnalysis();
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    // Simulate Palm Analysis (Replace with actual ML model in production)
    function simulatePalmAnalysis() {
        const palmResults = document.getElementById('palmResults');
        palmResults.innerHTML = '';
        
        // Sample analysis based on astrology data
        const lines = [
            {
                name: 'Heart Line',
                description: 'Your heart line shows emotional depth and strong relationship potential, matching your Venus position.',
                length: 'Long',
                quality: 'Clear'
            },
            {
                name: 'Head Line',
                description: 'Your head line indicates analytical thinking, aligned with Mercury in your chart.',
                length: 'Medium',
                quality: 'Straight'
            },
            {
                name: 'Life Line',
                description: 'A strong life line suggests vitality, corresponding with Mars in your first house.',
                length: 'Long',
                quality: 'Unbroken'
            },
            {
                name: 'Fate Line',
                description: 'Your fate line shows career development that will strengthen after Saturn matures.',
                length: 'Developing',
                quality: 'Faint'
            }
        ];
        
        lines.forEach(line => {
            const div = document.createElement('div');
            div.className = 'bg-gray-700 p-4 rounded';
            div.innerHTML = `
                <h4 class="font-semibold text-purple-400">${line.name}</h4>
                <p class="text-sm">${line.description}</p>
                <div class="flex justify-between mt-2 text-xs">
                    <span>Length: ${line.length}</span>
                    <span>Quality: ${line.quality}</span>
                </div>
            `;
            palmResults.appendChild(div);
        });
    }

    // Helper function to get Rashi from longitude
    function getRashi(longitude) {
        const signs = [
            'Aries', 'Taurus', 'Gemini', 'Cancer', 
            'Leo', 'Virgo', 'Libra', 'Scorpio', 
            'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
        ];
        return signs[Math.floor((longitude % 360) / 30)];
    }
});