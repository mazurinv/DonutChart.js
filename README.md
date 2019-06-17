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
Initialize instance of the Donut Chart. You should add DIV element to your page with ID param set.
Let the ID to be #DonutChart.
```
<div id="DonutChart"></div>
```
And put the code below to JS part of your application:
```
var chart1 = new DonutChart({
        id: 'donut1', // id of div element
        radius: 100, // radius of the circle
        percentage: 60, // how many percents you need to display
        lineWidth: 9, // width of the percentage line
        lineColor: "#345:rgb(44, 127, 211)", // colour of the percentage line
        // may be a gradient colour if you pass two colours divided by colon

        backLineColor: "orange:red", // colour of the background of percentage line
        fontColor: "rgb(44, 127, 211)",
        pointer: './pointer.png', // path to pointer image
        header: 'percents', // title above the percentage line
        speed:.5, // animation speed
        suffix:" rpm", // suffix of the donut value. "%" by default
        value: 900, // value to show. percents by default
    });
```


To redraw your chart you can use redraw method like this:

```
chart1.redraw();
```
