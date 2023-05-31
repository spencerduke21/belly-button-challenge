// Use D3 to read the samples.json file.
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
  // Call the functions to create the bar chart, bubble chart, and display the demographic information.
  CreateBarChart(data);
  CreateBubbleChart(data);
  DisplayMetadata(data);

  // Add event listener to the dropdown menu.
  d3.select("#selDataset").on("change", function() {
    const value = d3.select(this).property("value");
    optionChanged(data, value);
  });
}).catch(error => {
  console.log(error);
});

function CreateBarChart(data) {
  const sample = data.samples[0];

  // Get the top 10 OTUs for the selected individual.
  const sample_values = sample.sample_values.slice(0, 10).reverse();
  const otu_ids = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  const otu_labels = sample.otu_labels.slice(0, 10).reverse();

  // Create the trace for the bar chart.
  const trace = {
    x: sample_values,
    y: otu_ids,
    text: otu_labels,
    type: "bar",
    orientation: "h"
  };

  // Create the data array.
  const data = [trace];

  // Create the layout for the bar chart.
  const layout = {
    title: "Top 10 OTUs"
  };

  // Plot the bar chart.
  Plotly.newPlot("bar", data, layout);
}

function CreateBubbleChart(data) {
  const sample = data.samples[0];

  // Get the sample values, OTU IDs, and OTU labels.
  const sample_values = sample.sample_values;
  const otu_ids = sample.otu_ids;
  const otu_labels = sample.otu_labels;

  // Create the trace for the bubble chart.
  const trace = {
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
  const data = [trace];

  // Create the layout for the bubble chart.
  const layout = {
    showlegend: false,
    height: 600,
    width: 1200,
    xaxis: { title: "OTU ID" }
  };

  // Plot the bubble chart.
  Plotly.newPlot("bubble", data, layout);
}

function DisplayMetadata(data) {
  // Get the IDs from the samples data.
  const sampleIDs = data.samples.map(sample => sample.id);

  // Select the dropdown in the Test Subject ID No.: box.
  const selectDropdown = d3.select("#selDataset");

  // Add the options to the select element.
  selectDropdown.selectAll("option")
    .data(sampleIDs)
    .enter()
    .append("option")
    .attr("value", d => d)
    .text(d => d);

  // Call the optionChanged function with the initial value.
  const initialValue = selectDropdown.property("value");
  optionChanged(data, initialValue);
}

function optionChanged(data, value) {
  // Update the bar chart with the new sample information.
  UpdateBarChart(data, value);
  // Update the bubble chart with the new sample information.
  UpdateBubbleChart(data, value);
  // Update the metadata panel with the new sample information.
  UpdateMetadata(data, value);
}

function UpdateBarChart(data, value) {
  const sample = data.samples.find(sample => sample.id === value);

  // Get the top 10 OTUs for the selected individual.
  const sample_values = sample.sample_values.slice(0, 10).reverse();
  const otu_ids = sample.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
  const otu_labels = sample.otu_labels.slice(0, 10).reverse();

  // Update the trace for the bar chart.
  Plotly.restyle("bar", "x", [sample_values]);
  Plotly.restyle("bar", "y", [otu_ids]);
  Plotly.restyle("bar", "text", [otu_labels]);
}

function UpdateBubbleChart(data, value) {
  const sample = data.samples.find(sample => sample.id === value);

  // Get the sample values, OTU IDs, and OTU labels for the selected individual.
  const sample_values = sample.sample_values;
  const otu_ids = sample.otu_ids;
  const otu_labels = sample.otu_labels;

  // Update the trace for the bubble chart.
  Plotly.restyle("bubble", "x", [otu_ids]);
  Plotly.restyle("bubble", "y", [sample_values]);
  Plotly.restyle("bubble", "text", [otu_labels]);
  Plotly.restyle("bubble", "marker.size", [sample_values]);
  Plotly.restyle("bubble", "marker.color", [otu_ids]);
}

function UpdateMetadata(data, value) {
  // Find the selected individual's index in the metadata (demographic information) array.
  const index = data.metadata.findIndex(meta => meta.id.toString() === value);

  // Get the demographic information for the selected individual.
  const metadata = data.metadata[index];

  // Select the demographic information panel.
  const panel = d3.select("#sample-metadata");

  // Clear any existing demographic information.
  panel.html("");

  // Loop through each key-value pair in the demographic information and display it.
  Object.entries(metadata).forEach(([key, value]) => {
    panel.append("p").text(`${key}: ${value}`);
  });
}
