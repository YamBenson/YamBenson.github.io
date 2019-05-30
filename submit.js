var stock;
var stocks = [];
var submitButton = document.querySelector('#enter');
var ticker = document.querySelector('#ticker');
var symbol;
var keyword;
var error;

submitButton.addEventListener('submit', function(event) {
  document.querySelector('#current').innerHTML = "Loading...";

  symbol = ticker.value;

  let part1 = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=";
  let part2 = "&outputsize=full&apikey=49DEXHFDWAIV6FXX&datatype=csv";

  let url = part1 + symbol + part2;

  getStock(url);

  event.preventDefault();
});

async function getStock(url) {
  stocks.length = 0;
  // await response of fetch call
  let response = await fetch(url);
  // only proceed once promise is resolved
  stock = await response.text();

  process();
  graph();
}

function process() {
    let str0 = stock.split('\n');
    let size = str0.length - 2;
    if (size > 200) {
      size = 200;
    }
    if (str0.length > 3) {
    let c = 0;
    for (let i = size; i > 0; i--) {
      let str = str0[i].split(',');
      let date = str[0];
      let open = str[1];
      let high = str[2];
      let low = str[3];
      let close = str[4];
      let cutter = {
        "date": date,
        "open": open,
        "high": high,
        "low": low,
        "close": close,
        };
      stocks[c] = cutter;
      c++;
    }
    str0.length = 0;
    error = false;
  }
  else {
    error = true;
  }
}

function graph(){
  am4core.ready(function() {

  // Themes begin
  am4core.useTheme(am4themes_animated);
  // Themes end

  var chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.paddingRight = 20;

  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd";

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.grid.template.location = 0;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;

  var series = chart.series.push(new am4charts.CandlestickSeries());
  series.dataFields.dateX = "date";
  series.dataFields.valueY = "close";
  series.dataFields.openValueY = "open";
  series.dataFields.lowValueY = "low";
  series.dataFields.highValueY = "high";
  series.tooltipText = "Open: ${openValueY.value}\nLow: ${lowValueY.value}\nHigh: ${highValueY.value}\nClose: ${valueY.value}";

  series.riseFromPreviousState.properties.fillOpacity = 1;
  series.dropFromPreviousState.properties.fillOpacity = 0;

  chart.cursor = new am4charts.XYCursor();

  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.dateX = "date";
  lineSeries.dataFields.valueY = "close";
  lineSeries.defaultState.properties.visible = false;

  lineSeries.hiddenInLegend = true;
  lineSeries.fillOpacity = 0.5;
  lineSeries.strokeOpacity = 0.5;

  var scrollbarX = new am4charts.XYChartScrollbar();
  scrollbarX.series.push(lineSeries);
  chart.scrollbarX = scrollbarX;

  chart.data = stocks;

  let part1 = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=";
  let part2 = "&apikey=49DEXHFDWAIV6FXX&datatype=csv";

  let url = part1 + symbol + part2;
  getKeyword(url);
  });
}

async function getKeyword(url) {
  let response = await fetch(url);
  keyword = await response.text();
  let str0 = keyword.split('\n');

  let tick = [];
  let name = [];
  let results = str0.length - 2;
  for (let i = 1; i < str0.length; i++) {
    let str = str0[i].split(',');
    tick[i - 1] = str[0];
    name[i - 1] = str[1];
  }

  if (error == true) {
    document.querySelector('#current').innerHTML = "";
    document.querySelector("#dym").innerHTML = "Did you mean:";
    for (let i = 0; i < results; i++) {
      if (i == 0) {
        document.querySelector("#r1").innerHTML = "- " + tick[i] + " (" + name[i] + ")";
      }
      if (i == 1) {
        document.querySelector("#r2").innerHTML = "- " + tick[i] + " (" + name[i] + ")";
      }
      if (i == 2) {
        document.querySelector("#r3").innerHTML = "- " + tick[i] + " (" + name[i] + ")";
      }
      if (i == 3) {
        document.querySelector("#r4").innerHTML = "- " + tick[i] + " (" + name[i] + ")";
      }
      if (i == 4) {
        document.querySelector("#r5").innerHTML = "- " + tick[i] + " (" + name[i] + ")";
      }
    }
  }
  else if (error == false) {
    document.querySelector('#current').innerHTML = "Currently Viewing: " + tick[0] + " (" + name[0] + ")";
    document.querySelector("#dym").innerHTML = "";
    document.querySelector("#r1").innerHTML = "";
    document.querySelector("#r2").innerHTML = "";
    document.querySelector("#r3").innerHTML = "";
    document.querySelector("#r4").innerHTML = "";
    document.querySelector("#r5").innerHTML = "";
  }
}