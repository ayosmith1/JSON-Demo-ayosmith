let stockData;
let minPrice = Infinity;
let maxPrice = -Infinity;
let dx;
let dates = [];
let prices = [];
let hoverIndex = -1; // To track hover position

function preload() {
  let apiKey = "YOUR_ALPHAVANTAGE_API_KEY"; // Replace with your API key
  let symbol = "AAPL"; // Change to any stock symbol
  let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}&outputsize=compact`;
  stockData = loadJSON(url);
}

function setup() {
  createCanvas(800, 500);
  noLoop();
}

function draw() {
  setGradient(0, 0, width, height, color(20, 20, 50), color(10, 10, 30), "Y");

  fill(255);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Stock Price Trend", width / 2, 30);

  if (!stockData["Time Series (Daily)"]) {
    text("Loading data...", width / 2, height / 2);
    return;
  }

  dates = Object.keys(stockData["Time Series (Daily)"]).slice(0, 10);
  prices = dates.map((d) => float(stockData["Time Series (Daily)"][d]["4. close"]));

  minPrice = min(prices);
  maxPrice = max(prices);
  dx = width / (dates.length + 2);

  stroke(100, 200, 255);
  strokeWeight(2);
  let px = dx;
  let py = map(prices[0], minPrice, maxPrice, 0.8 * height, 0.2 * height);

  for (let i = 1; i < prices.length; i++) {
    let cx = dx * (i + 1);
    let cy = map(prices[i], minPrice, maxPrice, 0.8 * height, 0.2 * height);
    
    // Smooth curve effect
    stroke(255, 150, 100);
    strokeWeight(3);
    line(px, py, cx, cy);

    // Draw data point markers
    fill(255, 100, 100);
    noStroke();
    ellipse(cx, cy, 10, 10);

    // Display date labels
    fill(255);
    textSize(10);
    text(dates[i], cx, height - 20);

    px = cx;
    py = cy;
  }

  // If hovering over a point, show stock price
  if (hoverIndex !== -1) {
    let cx = dx * (hoverIndex + 1);
    let cy = map(prices[hoverIndex], minPrice, maxPrice, 0.8 * height, 0.2 * height);

    fill(0);
    stroke(255);
    strokeWeight(1);
    rect(cx - 25, cy - 30, 50, 20, 5);

    fill(255);
    noStroke();
    textSize(12);
    text(`$${prices[hoverIndex].toFixed(2)}`, cx, cy - 20);
  }
}

// Detect hover over points
function mouseMoved() {
  hoverIndex = -1;
  for (let i = 0; i < prices.length; i++) {
    let cx = dx * (i + 1);
    let cy = map(prices[i], minPrice, maxPrice, 0.8 * height, 0.2 * height);

    if (dist(mouseX, mouseY, cx, cy) < 10) {
      hoverIndex = i;
      redraw();
      return;
    }
  }
}

// Gradient background function
function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();
  for (let i = y; i <= y + h; i++) {
    let inter = map(i, y, y + h, 0, 1);
    let c = lerpColor(c1, c2, inter);
    stroke(c);
    line(x, i, x + w, i);
  }
}

function keyPressed() {
  redraw();
}
