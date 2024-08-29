//console.log("Hello world! test");

// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredData = metadata.filter((meta) => meta.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    let samplemetadata = d3.select("#sample-metadata");

    // Use `.html("")` to clear any existing metadata
    samplemetadata.html("");

    // Inside a loop, use d3 to append new tags for each key-value in the filtered metadata
    Object.entries(filteredData[0]).forEach(([key, value]) => {
      samplemetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  })
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples; 

    // Filter the samples for the object with the desired sample number
    let results = sample_data.filter(result => result.id == sample);

    // Get the otu_ids, otu_labels, and sample_values
    let sample_values = results.sample_values;
    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: "Earth"
      }
    }];

    // Render the Bubble Chart
    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30 }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let yticks = otu_ids.map(id => `OTU ${id}`).reverse();
    let xticks = sample_values.reverse();
    let labels = otu_labels.reverse();

    let barData = [{
      x: xticks,  
      y: yticks,  
      text: labels,  
      type: "bar",  
      orientation: "h"  
    }];

    // Render the Bar Chart
    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    Plotly.newPlot("bar", barData, barLayout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sample_ids = data.names; 

    // Use d3 to select the dropdown with id of `#selDataset`
    let selectdropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    console.log(sample_ids);
    for (const id of sample_ids) {
      selectdropdown.append("option").attr("value", id).text(id);
    };

    // Get the first sample from the list
    let first_entry = sample_ids[0];
      console.log(first_entry);

    // Build charts and metadata panel with the first sample
    buildMetadata(first_entry);
    buildCharts(first_entry);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialise the dashboard
init();
