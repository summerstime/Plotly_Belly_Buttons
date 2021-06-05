init();

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
// init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h4").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesBB = data.samples;
    // console.log("data", samplesBB);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleRequest = samplesBB.filter(sampleObj => sampleObj.id == sample);
    // console.log("sample request", sampleRequest);
    //  5. Create a variable that holds the first sample in the array.
    var sample1 = sampleRequest[0];
    // console.log("sample1", sample1);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIds = Object.values(sample1.otu_ids);
    var otuIdsRev = otuIds.slice(0, 10).reverse();
    var otuLabels = Object.values(sample1.otu_labels);
    var otuLabelsRev = otuLabels.slice(0, 10).reverse();
    var sampleValues = Object.values(sample1.sample_values);
    var sampleValuesRev = sampleValues.slice(0, 10).reverse();

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIds.slice(0, 10).reverse();
    // console.log(yticks.map(sampleObj => sampleObj.id == sample));

    // 8. Create the trace for the bar chart. 

    var barData = {
      x: sampleValuesRev,
      y: yticks,
      text: otuLabelsRev, otuIdsRev, sampleValuesRev,
      name: "bellies",
      type: "bar",
      marker: { colorscale: [[0.0, "rgb(85,228,197)"],
      // [0.1, "rgb(215,48,39)"],
      // [0.2, "rgb(244,109,67)"],
      // [0.3, "rgb(253,174,97)"],
      [0.2, "rgb(254,224,144)"],
      [0.5, "rgb(85,228,226)"],
      // [0.6, "rgb(171,217,233)"],
      [0.7, "rgb(116,173,209)"],
      [0.8, "rgb(85,194,228)"],
      [1.0, "rgb(85,135,228)"]], reversescale: false, color:sampleValuesRev },
      orientation: "h"
    }
    // console.log(barData);

    var config = { responsive: true }

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: { text: "Top 10 Bacteria Cultures Found", font: { size: 20, style: 'bold' } },
      xaxis: { title: "", linecolor: 'black', mirror: true, linewidth: 2 },
      yaxis: { title: "", showtickprefix: 'all', tickprefix: "OTU-", tick0: otuIdsRev[0], type: "category", linecolor: 'black', mirror: true, linewidth: 2 },
      hovermode: 'closest',
      hovertemplate: otuLabelsRev,
      width: 675
    };
    // console.log(barLayout);
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout, config);


    ////////////////////////   BUBBLE CHART SECTION    ///////////////////////////////////
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels, otuIds, sampleValues,
      mode: 'markers',
      type: 'scatter',
      marker: {
        colorscale: 'Earth',
        color: otuIds,
        size: sampleValues
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: { text: 'Bacteria Cultures Per Sample', font: { size: 25 } },
      xaxis: { title: "OTU Identification Number", linecolor: 'black', mirror: true, linewidth: 2 },
      yaxis: { linecolor: 'black', mirror: true, linewidth: 2 },
      hovermode: 'closest',
      hovertemplate: otuLabels,
      showlegend: false,
      // height: 600,
      // width: 1700
    };

    var config = { responsive: true }

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [bubbleData], bubbleLayout, config);




    ////////////////////////////    GUAGE CHART    ////////////////////////////////
    // Create a variable that holds the samples array. 
    sampleFreq = data.metadata;
    console.log(sampleFreq);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var freqArray = sampleFreq.filter(sampleObj => sampleObj.id == sample);
    // console.log(freqArray);

    // 2. Create a variable that holds the first sample in the metadata array.
    var freqResult = freqArray[0];

    // 3. Create a variable that holds the washing frequency.
    var wfreqAmt = freqResult.wfreq;
    console.log(wfreqAmt);

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreqAmt,
        title: {
          text: "Belly Button Washing Frequency <br> Scrubs per Week", font: { size: 20 }
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "'rgb(85,135,228)'" },
            { range: [2, 4], color: "'rgb(85,168,228)'" },
            { range: [4, 6], color: "'rgb(85,194,228)'" },
            { range: [6, 8], color: "'rgb(85,228,226)'" },
            { range: [8, 10], color: "'rgb(85,228,197)'" }
          ],
          threshold: {
            line: {color: "'rgb(125,114,114)'", width: 1 }, thickness: 1, value: wfreqAmt
          }
        }
      }
    ];

    var config = { responsive: true }

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      // width: 600, height: 450,
      margin: { t: 75, r: 25, l: 25, b: 25 },


    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout, config);
  });
};



