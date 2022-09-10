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
    var samples = data.samples;
    console.log(samples);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleNumber = samples.filter(sampleObjid => sampleObjid.id == sample);
    console.log(sampleNumber);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleNumber[0];
    console.log(firstSample);
 
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = firstSample.otu_ids;
    console.log(otuIDs);

    var otuLabels = firstSample.otu_labels;
    console.log(otuLabels);

    var sampleValues = firstSample.sample_values;
    console.log(sampleValues);

    

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otuIDs.slice(0,10).map(otuID => "OTU " + otuID.toString()).reverse()
    console.log(yticks)

    // 8. Create the trace for the bar chart. 
    var trace = {
      x: sampleValues,
      y: yticks,
      type: "bar",
      orientation: 'h'
    };

    // Create the data array for the plot
    var data = [trace];

    // 9. Create the layout for the bar chart. 
    var layout = {
      title: "OTU IDs",
      xaxis: { title: "Values" },
      yaxis: { title: "OTU IDs" }
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);

    // Bubble charts
    var bubbleColors = function chooseColor(sampleValues) {
      if(sampleValues>=2500) return "red";
      if(sampleValues>=1500) return "orange";
      if(sampleValues>=1000) return "yellow";
      if(sampleValues>=500) return "green";
      return "blue";
    };

    // 1. Create the trace for the bubble chart.
    var trace1 = {
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        color: [bubbleColors],
        colorscale: [[0, 'rgb(200, 255, 200)'], [1, 'rgb(0, 100, 0)']],
        size: sampleValues
      }
    };

    var data1 = [trace1];

    // 2. Create the layout for the bubble chart.
    var layout1 = {
      title: 'Bubble Chart Hover Text',
      xaxis: {
        automargin: true,
        tickangle: 90,
        title: {
          text: "OTU IDs",
          standoff: 20
        }},
      showlegend: false,
      height: 600,
      width: 1000
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data1, layout1); 

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    d3.json("samples.json").then((data) => {
    var metadata1 = data.metadata;
    var metadataArray = metadata1.filter(sampleObj => sampleObj.id == sample);
    
    // 2. Create a variable that holds the first sample in the metadata array.
    var result1 = metadataArray[0];
    
    // 3. Create a variable that holds the washing frequency.
    var washingFrequency = result1.wfreq;
    console.log(washingFrequency);
    

    // 4. Create the trace for the gauge chart.
     var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washingFrequency,
        title: { text: "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number"
      }
     ];
    
    // 5. Create the layout for the gauge chart.
     var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 }
     };

    // 6. Use Plotly to plot the gauge data and layout.
     Plotly.newPlot("gauge", gaugeData, gaugeLayout);

    });
  }

  )};
