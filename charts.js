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
init();

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
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samplesBB = data.samples;
    console.log("data", samplesBB);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleRequest = samplesBB.filter(sampleObj => sampleObj.id == sample);
    console.log("sample request", sampleRequest);
    //  5. Create a variable that holds the first sample in the array.
    var sample1 = sampleRequest[0];
    console.log("sample1", sample1);

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
    console.log(yticks.map(sampleObj => sampleObj.id == sample));


    // 8. Create the trace for the bar chart. 

    var barData = {
      x: sampleValuesRev,
      y: otuIdsRev,
      text: otuLabelsRev, otuIdsRev, sampleValuesRev,
      name: "bellies",
      type: "bar",
      orientation: "h"
    }
    console.log(barData);

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "" },
      yaxis: { title: "", showtickprefix: 'all', tickprefix: "OTU-", tick0: otuIdsRev[0], type: "category" },
      hovermode: 'closest',
      hovertemplate: otuLabelsRev
    };
    console.log(barLayout);
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", [barData], barLayout);


    ////////////////////////   BUBBLE CHART SECTION    ///////////////////////////////////
    // 1. Create the trace for the bubble chart.
    var bubbleData = [

    ];

    var trace1 = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels, otuIds, sampleValues,
      mode: 'markers',
      marker: {
        //   colorscale= 'rgb(100,200,60)',
        //   color= 1,
        size: sampleValues,
        colorscale: [0,'rgb(93, 164, 214)'],
        // color: ['otuIds']
        color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)', 'rgb(44, 160, 101)', 'rgb(255, 65, 54)']
        
      }
    };

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {

    };
    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      hovermode: 'closest',
      hovertemplate: otuLabels,
      showlegend: false,
      height: 600,
      width: 1200
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", [trace1], layout);
  });
};
