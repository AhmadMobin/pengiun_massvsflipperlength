async function drawScatter() {
  // * Step 1: Access Data
  const dataset = await d3.tsv(
    "https://raw.githubusercontent.com/ttimbers/palmerpenguins/aef2d7c48466b88dcfe0832a67b0a270607f1737/inst/extdata/penguins.tsv"
  )
  console.log(dataset)
  console.table(dataset[0])

  // ** x varaible: flipper_length_mm
  const xAccessor = (d) => parseInt(d.flipper_length_mm)
  console.log(xAccessor(dataset[0]))

  // ** y varaible: body_mass_g
  const yAccessor = (d) => parseInt(d.body_mass_g)
  console.log(yAccessor(dataset[0]))

  // ** color scale: sex

  const colorAccessor = (d) => d.sex
  // * male ; female ; NA

  //* Step 2: Chart Dimensions

  // want to make scatter plot even width and height to give a "square" appearance
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 10,
      left: 50,
      bottom: 50,
    },
  }

  // calculate bounds: the available area of the visual
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  console.log(dimensions)

  // * Step 3: Draw Canvas (svg)

  // * add wrapper and bounds to html element

  //* Wrapper
  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.append("g").style(
    "transform",
    `translate(${dimensions.margin.left}px,
      ${dimensions.margin.top}px)`
  )

  //* Step 4: Create Scales
  // convert data points to display pixels

  //* x-scale

  xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([0, dimensions.boundedWidth])
    .nice()

  console.log(d3.extent(dataset, xAccessor)) // min = 172 and max = 231
  console.log(xScale(172)) // this should be 0 px
  console.log(xScale(231)) //equal to dimensions.boundedWidth

  // * y-scale
  yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor)) // min = 2700 ; max = 6300
    .range([dimensions.boundedHeight, 0])
    .nice()

  console.log(d3.extent(dataset, yAccessor))
  console.log(yScale(6300)) // this should be 0 px
  console.log(yScale(2700)) // this should be equal to dimensions.boundedHeight

  // *color scale
  colorScale = d3
    .scaleOrdinal()
    .domain(["male", "female", "NA"])
    .range(["#F8766D", "#00BA38", "#619CFF"])

  console.log(colorScale("male"))
  console.log(colorScale("female"))
  console.log(colorScale("NA"))

  //* Step 5: Draw Data

  const dots = bounds.selectAll("circle").data(dataset)
  console.log(dots)

  dots
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 3.0)
    .attr("fill", (d) => colorScale(colorAccessor(d)))

// *Step 6: Draw Peripherals

// * x-axis

//* create the axis
const xAxisGenerator = 
      d3.axisBottom()
      .scale(xScale)

// add axis to visual
const xAxis = bounds.append("g")
  .call(xAxisGenerator)
  .style("transform", `translateY(${dimensions.boundedHeight}px)`)      

// add axis labels 
const xAxisLabel = xAxis.append("text")
      .attr("x",dimensions.boundedWidth/2)
      .attr("y", dimensions.margin.bottom-10)
      .attr("fill", "black")
      .style("font-size", "1.4em")
      .html("Flipper Length (mm)")

// *y-axis
const yAxisGenerator = d3.axisLeft()
  .scale(yScale)      

 // add axis to visual
 const yAxis = bounds.append("g")
      .call(yAxisGenerator)


// add axis labels
const yAxisLabel = yAxis.append("text")
  .attr("x", -dimensions.boundedHeight/2)
  .attr("y", -dimensions.margin.left + 10)
  .attr("fill", "black")      
  .style("font-size", "1.4em")
  .text("Body Mass (g)")
  .style("transform", "rotate(-90deg)")
  .style("text-anchor", "middle")

}

drawScatter()
