/**
 * DHWS Data Injector - Vedic Palm Reading App
 * Handles all data communication between frontend and backend
 * Manages Swiss Ephemeris calculations and palm analysis integration
 */

class DHSWDataInjector {
  constructor() {
    // Configure API endpoints based on environment
    this.API_BASE_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:3000' 
      : 'https://astrovanba.vercel.app';
    
    // Application state
    this.state = {
      userData: null,
      astrologyData: null,
      palmAnalysis: null,
      loading: false,
      error: null
    };
    
    // Initialize
    this.initEventListeners();
    this.setupErrorHandling();
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Birth details form submission
    document.getElementById('calculateBtn')?.addEventListener('click', () => {
      this.handleAstrologyCalculation();
    });

    // Palm analysis submission
    document.getElementById('analyzePalmBtn')?.addEventListener('click', () => {
      this.handlePalmAnalysis();
    });

    // Image upload handling
    document.getElementById('palmImage')?.addEventListener('change', (e) => {
      this.handleImageUpload(e);
    });
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    window.addEventListener('error', (event) => {
      this.displayError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.displayError(event.reason);
    });
  }

  /**
   * Handle astrology calculation
   */
  async handleAstrologyCalculation() {
    try {
      this.setLoading(true);
      
      // Get birth data from form
      const birthData = this.getBirthData();
      
      // Validate input
      if (!this.validateBirthData(birthData)) {
        throw new Error('Please enter valid birth details');
      }

      // Calculate astrology data
      const astrologyData = await this.calculateAstrology(birthData);
      
      // Update state
      this.state.astrologyData = astrologyData;
      this.state.userData = {
        ...birthData,
        calculatedAt: new Date().toISOString()
      };

      // Update UI
      this.displayAstrologyResults();
      this.preparePalmAnalysis();

    } catch (error) {
      this.displayError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Get birth data from form
   */
  getBirthData() {
    const dob = new Date(document.getElementById('dob').value);
    const timeString = document.getElementById('tob').value;
    const [hours, minutes] = timeString.split(':').map(Number);
    
    return {
      date: dob,
      year: dob.getFullYear(),
      month: dob.getMonth() + 1,
      day: dob.getDate(),
      hour: hours,
      minute: minutes || 0,
      lat: parseFloat(document.getElementById('lat').value) || 28.6139, // Default to Delhi
      lng: parseFloat(document.getElementById('lng').value) || 77.2090,
      ayanamsa: 'LAHIRI' // Vedic ayanamsa
    };
  }

  /**
   * Validate birth data
   */
  validateBirthData(data) {
    return data.date && !isNaN(data.date.getTime()) && 
           !isNaN(data.hour) && !isNaN(data.minute) &&
           !isNaN(data.lat) && !isNaN(data.lng);
  }

  /**
   * Calculate astrology data from backend
   */
  async calculateAstrology(birthData) {
    const response = await fetch(`${this.API_BASE_URL}/api/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(birthData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to calculate astrology data');
    }

    return await response.json();
  }

  /**
   * Display astrology results in UI
   */
  displayAstrologyResults() {
    if (!this.state.astrologyData) return;

    // Show results section
    document.getElementById('resultsSection')?.classList.remove('hidden');

    // Basic info
    this.updateElementText('rashi', this.state.astrologyData.rashi?.name || 'N/A');
    this.updateElementText('ascendant', this.state.astrologyData.ascendant?.name || 'N/A');
    this.updateElementText('nakshatra', this.state.astrologyData.nakshatra?.name || 'N/A');

    // Planetary positions
    this.renderPlanetaryPositions();

    // House positions
    this.renderHousePositions();

    // Planetary chart
    this.renderPlanetaryChart();
  }

  /**
   * Render planetary positions
   */
  renderPlanetaryPositions() {
    const container = document.getElementById('planetDetails');
    if (!container || !this.state.astrologyData?.planets) return;

    container.innerHTML = Object.entries(this.state.astrologyData.planets)
      .map(([planet, data]) => `
        <div class="flex justify-between py-1">
          <span class="capitalize font-medium">${planet}:</span>
          <span>
            ${data.longitude.toFixed(2)}° 
            (${this.getSignFromLongitude(data.longitude)})
          </span>
        </div>
      `)
      .join('');
  }

  /**
   * Render house positions
   */
  renderHousePositions() {
    const container = document.getElementById('houseDetails');
    if (!container || !this.state.astrologyData?.houses) return;

    container.innerHTML = this.state.astrologyData.houses
      .map((longitude, i) => `
        <div class="bg-gray-700 p-2 rounded text-center">
          <div class="font-medium">House ${i+1}</div>
          <div>${this.getSignFromLongitude(longitude)}</div>
          <div class="text-sm">${longitude.toFixed(2)}°</div>
        </div>
      `)
      .join('');
  }

  /**
   * Render planetary chart
   */
  renderPlanetaryChart() {
    const canvas = document.getElementById('planetChart');
    if (!canvas || !this.state.astrologyData?.planets) return;

    // Destroy previous chart if exists
    if (this.planetChart) {
      this.planetChart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const planets = Object.entries(this.state.astrologyData.planets);
    
    this.planetChart = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: planets.map(([name]) => name.charAt(0).toUpperCase() + name.slice(1)),
        datasets: [{
          label: 'Planetary Strength',
          data: planets.map(([, data]) => (data.speed + 1) * 10), // Example metric
          backgroundColor: 'rgba(124, 58, 237, 0.2)',
          borderColor: 'rgba(124, 58, 237, 1)',
          pointBackgroundColor: 'rgba(124, 58, 237, 1)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5
        }]
      },
      options: {
        scales: {
          r: {
            angleLines: { display: true },
            suggestedMin: 0,
            suggestedMax: 20
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  /**
   * Handle palm image upload
   */
  handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.setLoading(true, 'Processing palm image...');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('palmCanvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        
        // Store image data
        this.state.palmImage = canvas.toDataURL('image/jpeg');
      };
      img.src = e.target.result;
    };
    reader.onerror = (error) => {
      this.displayError(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  }

  /**
   * Handle palm analysis
   */
  async handlePalmAnalysis() {
    try {
      if (!this.state.palmImage) {
        throw new Error('Please upload a palm image first');
      }

      this.setLoading(true, 'Analyzing palm...');
      
      // In a real app, you would send to your palm analysis API
      // For demo, we'll simulate analysis with astrology data
      this.state.palmAnalysis = await this.simulatePalmAnalysis();
      
      // Display results
      this.displayPalmResults();

    } catch (error) {
      this.displayError(error);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * Simulate palm analysis (replace with real API call)
   */
  async simulatePalmAnalysis() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!this.state.astrologyData) {
          resolve(this.getGenericPalmAnalysis());
        }

        // Create analysis based on astrology data
        resolve({
          lines: this.generatePalmLinesFromAstrology(),
          analysisTime: new Date().toISOString(),
          astrologyIntegration: true
        });
      }, 1500);
    });
  }

  /**
   * Generate palm lines based on astrology
   */
  generatePalmLinesFromAstrology() {
    const { planets, houses } = this.state.astrologyData;
    
    return [
      {
        name: 'Heart Line',
        description: this.getHeartLineAnalysis(planets.venus, planets.moon),
        length: 'Medium',
        quality: 'Clear'
      },
      {
        name: 'Head Line',
        description: this.getHeadLineAnalysis(planets.mercury, houses[3]),
        length: 'Long',
        quality: 'Straight'
      },
      {
        name: 'Life Line',
        description: this.getLifeLineAnalysis(planets.mars, planets.sun),
        length: 'Long',
        quality: 'Strong'
      },
      {
        name: 'Fate Line',
        description: this.getFateLineAnalysis(planets.saturn, houses[10]),
        length: 'Developing',
        quality: 'Visible'
      }
    ];
  }

  /**
   * Display palm analysis results
   */
  displayPalmResults() {
    const container = document.getElementById('palmResults');
    if (!container || !this.state.palmAnalysis?.lines) return;

    container.innerHTML = this.state.palmAnalysis.lines
      .map(line => `
        <div class="bg-gray-800 p-4 rounded-lg mb-3">
          <h4 class="font-semibold text-purple-400">${line.name}</h4>
          <p class="text-sm mt-1">${line.description}</p>
          <div class="flex justify-between mt-2 text-xs text-gray-400">
            <span>Length: ${line.length}</span>
            <span>Quality: ${line.quality}</span>
          </div>
        </div>
      `)
      .join('');

    // Scroll to results
    container.scrollIntoView({ behavior: 'smooth' });
  }

  /**
   * Prepare palm analysis with astrology context
   */
  preparePalmAnalysis() {
    // Could highlight relevant planetary influences on palm
    console.log('Palm analysis prepared with astrology context');
  }

  /**
   * Helper: Get zodiac sign from longitude
   */
  getSignFromLongitude(longitude) {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
                  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    return signs[Math.floor((longitude % 360) / 30)];
  }

  /**
   * Helper: Update element text
   */
  updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  /**
   * Helper: Set loading state
   */
  setLoading(isLoading, message = '') {
    this.state.loading = isLoading;
    
    // You would implement your loading UI here
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = isLoading ? 'block' : 'none';
      if (message) {
        loader.querySelector('.loader-message').textContent = message;
      }
    }
  }

  /**
   * Helper: Display error
   */
  displayError(error) {
    console.error(error);
    this.state.error = error.message;
    
    // Implement your error display UI
    alert(`Error: ${error.message}`); // Replace with your UI
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.dataInjector = new DHSWDataInjector();
});