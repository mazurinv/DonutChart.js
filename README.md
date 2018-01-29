# DonutChart.js
Tiny JS library to draw animated donut charts
## DEMO PAGE
[link](http://mazurinv.ru/demo/DonutChart/)
## Installation

just include DonutChart.js to your page
```
<script src="scripts/DonutChart.js"></script>
```

## Usage
to init instance of Donut Chart you must add DIV element to your page with ID param set.
Let the ID be #DonutChart.
```
<div id="DonutChart"></div>
```
And in JS part of your code:
```
var chart1 = new DonutChart({
        id: 'DonutChart',
        radius: 100,
        percentage: 90,
        lineWidth: 3,
        lineColor: "#003951",
        backgroundColor: "#fff"
    });
```
Where:
```
id              - element ID in DOM (#donutChart by default) 
radius          - radius of the chart
percentage      - percents to draw on the chart
lineWidth       - width of the percentage line
lineColor       - color of the percentage line
backgroundColor - background color of the chart (transparent by default)
```

To redraw your chart you can use redraw method like this:

```
chart1.redraw();
```