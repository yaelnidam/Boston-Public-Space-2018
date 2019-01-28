var pingData = [];

d3.csv("data/all_parks_counts_top10.csv", function(d) {
  return {
    site : d.SITE_NAME,
    pings : +d.PING_CT
  };
}, function(error, rows) {
  pingData = rows;
  console.log();
  createVisualization();
});

function createVisualization(){
  // Width and height of SVG
  var w = 450;
  var h = 575;

  // Get length of Array and set length so we can an input dataset of variable length
  var arrayLength = pingData.length; // length of dataset
  var maxValue = d3.max(pingData, function(d) { return +d.pings;} ); // get maximum value of our dataset
  var x_axisLength = 400; // length of x-axis in our layout
  var y_axisLength = 500; // length of y-axis in our layout

  // Use a scale for the height of the visualization
  var yScale = d3.scale.linear()
      .domain([0, maxValue])
      .range([0, y_axisLength]);

  //Create SVG element
  var svg = d3.select("parkpings")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  // Select and generate rectangle elements
  svg.selectAll( "rect" )
    .data( pingData )
    .enter()
    .append("rect")
    .attr( "x", function(d,i){
      return i * (x_axisLength/arrayLength) + 30; // Set x coordinate of rectangle to index of data value (i) *25
    })
    .attr( "y", function(d){
      return h - yScale(d.pings) - 75; // Set y coordinate of rect using the y scale
    })
    .attr( "width", (x_axisLength/arrayLength) - 1)
    .attr( "height", function(d){
      return yScale(d.pings); // Set height of using the scale
    })
    .attr( "fill", "gray")
    .on("mouseover", function(d){return tooltip.style("visibility", "visible").text(d.site + ": " + d.pings + " Pings");})
    .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px").text(d.site + ": " + d.pings+ " Pings");})
    .on("mouseout", function(d){return tooltip.style("visibility", "hidden");});

  // Create y-axis
  svg.append("line")
    .attr("x1", 30)
    .attr("y1", 0)
    .attr("x2", 30)
    .attr("y2", 500)
    .attr("stroke-width", 2)
    .attr("stroke", "black");

  // Create x-axis
  svg.append("line")
    .attr("x1", 30)
    .attr("y1", 500)
    .attr("x2", 500)
    .attr("y2", 500)
    .attr("stroke-width", 2)
    .attr("stroke", "black");

  // y-axis label
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .text("No. of Pings")
    .attr("transform", "translate(20, 20) rotate(-90)")
    .attr("font-size", "14px")
    .attr("font-family", "'Open Sans', sans-serif");

  // Create Tooltip and set it to be hidden
  var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("font-family", "'Open Sans', sans-serif")
    .style("font-size", "14px")
    .style("z-index", "10")
    .style("visibility", "hidden");
};
