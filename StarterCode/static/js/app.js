// Use D3 to read the samples.json file.
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    // Call the functions to create the bar chart, bubble chart, and display the demographic information.
    CreateBarChart(data);
    CreateBubbleChart(data);
    DisplayMetadata(data);
  })
  .catch(error => {
    console.log(error);
  });

function CreateBarChart(data) {
  // Get the top 10 OTUs for the selected individual.
  var sample_values = data.samples[0].sample_values.slice(0, 10).reverse();
  var otu_ids = data.samples[0].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  var otu_labels = data.samples[0].otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart.
  var trace = {
    x: sample_values,
    y: otu_ids,
    text: otu_labels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array.
  var chartData = [trace];

  // Create the layout for the bar chart.
  var layout = {
    title: "Top 10 OTUs"
  };

  // Plot the bar chart.
  Plotly.newPlot("bar", chartData, layout);
}

function CreateBubbleChart(data) {
  // Get the sample values, OTU IDs, and OTU labels.
  var sample_values = data.samples[0].sample_values;
  var otu_ids = data.samples[0].otu_ids;
  var otu_labels = data.samples[0].otu_labels;

  // Create the trace for the bubble chart.
  var trace = {
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: "markers",
    marker: {
      size: sample_values,
      color: otu_ids,
      colorscale: "Earth"
    }
  };

  // Create the data array.
  var chartData = [trace];

  // Create the layout for the bubble chart.
  var layout = {
    showlegend: false,
    height: 600,
    width: 1200,
    xaxis: { title: "OTU ID" }
  };

  // Plot the bubble chart.
  Plotly.newPlot("bubble", chartData, layout);
}

function DisplayMetadata(data) {
  // Get the IDs from the samples data.
  var sampleIDs = data.samples.map(sample => sample.id);

  // Select the dropdown in the Test Subject ID No.: box.
  var selectDropdown = d3.select("#selDataset");

  // Clear any existing options.
  selectDropdown.html("");

  // Add the options to the select element.
  selectDropdown
    .selectAll("option")
    .data(sampleIDs)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);
}

function optionChanged(value) {
  // Read the samples.json file again.
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
    .then(data => {
      // Update the bar chart with the new sample information.
      UpdateBarChart(data, value);
      // Update the bubble chart with the new sample information.
      UpdateBubbleChart(data, value);
      // Update the metadata panel with the new sample information.
      UpdateMetadata(data, value);
    })
    .catch(error => {
      console.log(error);
    });
}

function UpdateBarChart(data, value) {
  // Find the selected individual's index in the samples array.
  var index = data.samples.findIndex(sample => sample.id === value);

  // Get the top 10 OTUs for the selected individual.
  var sample_values = data.samples[index].sample_values.slice(0, 10).reverse();
  var otu_ids = data.samples[index].otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  var otu_labels = data.samples[index].otu_labels.slice(0, 10).reverse();

  // Update the trace for the bar chart.
  Plotly.restyle("bar", "x", [sample_values]);
  Plotly.restyle("bar", "y", [otu_ids]);
  Plotly.restyle("bar", "text", [otu_labels]);
}

function UpdateBubbleChart(data, value) {
  // Find the selected individual's index in the samples array.
  var index = data.samples.findIndex(sample => sample.id === value);

  // Get the sample values, OTU IDs, and OTU labels for the selected individual.
  var sample_values = data.samples[index].sample_values;
  var otu_ids = data.samples[index].otu_ids;
  var otu_labels = data.samples[index].otu_labels;

  // Update the trace for the bubble chart.
  Plotly.restyle("bubble", "x", [otu_ids]);
  Plotly.restyle("bubble", "y", [sample_values]);
  Plotly.restyle("bubble", "text", [otu_labels]);
  Plotly.restyle("bubble", "marker.size", [sample_values]);
  Plotly.restyle("bubble", "marker.color", [otu_ids]);
}

function UpdateMetadata(data, value) {
  // Find the selected individual's index in the metadata (demographic information) array.
  var index = data.metadata.findIndex(meta => meta.id.toString() === value);

  // Get the demographic information for the selected individual.
  var metadata = data.metadata[index];

  // Select the demographic information panel.
  var panel = d3.select("#sample-metadata");

  // Clear any existing demographic information.
  panel.html("");

  // Loop through each key-value pair in the demographic information and display it.
  Object.entries(metadata).forEach(([key, value]) => {
    panel.append("p").text(`${key}: ${value}`);
  });
}