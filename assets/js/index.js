
const myURL =
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",

  margin = {top: 50, right: 50, bottom: 150, left:50},
  
  width = 900 - margin.right - margin.left,
  height = 600 - margin.top - margin.bottom,

  months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//tooltip
let tip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-20, 0])
  .html(function(d) {
    return (
          '<div class="myTip">Date: ' + months[d.month - 1] + ' '  + d.year + 
            '<p>Variance : ' + d.variance + '</p>' + 
          '</div>');
  });


//get data
d3.json(myURL, function(error, allData) {
  if(error)  console.log('Error getting data: ' + error);

  // allData is an object with two props. The second one, monthlyVariance, is the array I need. 
  let data = allData.monthlyVariance;

  console.log(data);

  // SCALES
  let x = d3.scale.linear()
    .domain(d3.extent(data, function(d){
      return d.year
    }))
    .range([0, width])

  let y = d3.scale.linear()
    .domain(d3.extent(data, function(d){
      return d.month
    }))
    .range([0, height])

  let z = d3.scale.linear()
    .domain(d3.extent(data, function(d){
      return d.variance;
    }))
    .range(["skyblue", "orange"])
  
  //x and y axis
  let xAxis = d3.svg.axis()
    .scale(x)
    .tickFormat(function(years){
      return years;
    })
    .orient("bottom")
  
  let yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat(function(m){
      return months[m - 1];
    })
    .orient("left")

  //chart
  let svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.top + "," +  margin.left + ")");

  svg.call(tip);  
  
  //add x and y axis  
  svg.append("g")
    .attr("transform", "translate(0," + 433 + ")")
    .call(xAxis)
  
  svg.append("g")
    .attr("transform", "translate(0," + 15 + ")")
    .call(yAxis)  
    
    
  //add temperatures
  svg
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", function(d){
      return x(d.year);
    })
    .attr("y", function(d){
      return y(d.month);
    })
    .attr("height", 36)
    .attr("width", 25)
    .attr("fill", function(d){
      return z(d.variance);
    })
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)

});