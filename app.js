// Global Variables
let tsne, stepCounter = 0, tsneData = [], csvData = [];

// Load CSV Data
Papa.parse('https://github.com/vquynh/3d-seeds-data/blob/main/seeds.csv', {
  download: true,
  header: false,
  complete: function(results) {
    csvData = results.data.map(row => row.slice(0, 7).map(parseFloat)).filter(row => !isNaN(row[0]));
    initializeTSNE();
  }
});

// Initialize t-SNE
function initializeTSNE() {
  tsne = new tsnejs.tSNE({
    dim: 3,
    perplexity: 30,
    earlyExaggeration: 4.0,
    learningRate: 100,
    nIter: 1000
  });
  tsne.initDataRaw(csvData);
  stepCounter = 0;
  document.getElementById('step-counter').textContent = stepCounter;
  runTSNE(100); // Start with 100 iterations
}

// Run t-SNE
function runTSNE(steps) {
  for (let i = 0; i < steps; i++) tsne.step();
  tsneData = tsne.getSolution();
  updatePlot();
}

// Update Plot
function updatePlot() {
  const data = {
    x: tsneData.map(d => d[0]),
    y: tsneData.map(d => d[1]),
    z: tsneData.map(d => d[2]),
    mode: 'markers',
    type: 'scatter3d',
    marker: { size: 4, color: csvData.map(row => row[7]) } // Assuming class in 8th column
  };

  Plotly.newPlot('plot', [data], { margin: { l: 0, r: 0, b: 0, t: 0 } });
}

// Event Listeners
document.getElementById('restart').addEventListener('click', () => {
  initializeTSNE();
});

document.getElementById('step').addEventListener('click', () => {
  tsne.step();
  stepCounter++;
  document.getElementById('step-counter').textContent = stepCounter;
  updatePlot();
});
