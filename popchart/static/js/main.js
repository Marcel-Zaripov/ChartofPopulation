// some constants
var margin = {top: 40,
              right: 20,
              bottom: 150,
              left: 100};
var w = 1500 - margin.left - margin.right;
var h = 850 - margin.top - margin.bottom;
var colors = ["rgb(255,247,236)","rgb(254,232,200)","rgb(253,212,158)","rgb(253,187,132)",
              "rgb(252,141,89)","rgb(239,101,72)","rgb(215,48,31)","rgb(153,0,0)"];
var url = "http://127.0.0.1:5000/cities_pop/";

// scales
var x = d3.scaleBand()
          .range([0, w])
          .padding(.1);

var y = d3.scaleLinear()
          .range([h, 0]);

var colorScale = d3.scaleQuantile()
  .range(colors);

// get the main element to draw
var chart = d3.select("body")
            .append("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");

//data
d3.json(url, function(json){

var maxPop = d3.max(json, function(d){ return d.pop; });
x.domain(json.map(function(d){ return d.city; }));
y.domain([0, maxPop]);
colorScale.domain([0, colors.length - 1, maxPop])

//draw the bars
chart.selectAll(".bar")
     .data(json)
     .enter().append("rect")
     .attr("class", "bar")
     .attr("x", function(d){ return x(d.city); })
     .attr("width", x.bandwidth())
     .attr("y", function(d){ return y(d.pop); })
     .attr("height", function(d){ return h - y(d.pop); })
     .attr("fill", function(d){ return colorScale(d.pop); });

// add text to the bars
chart.selectAll("text")
     .data(json)
     .enter().append("text")
     .text(function(d){ return d.pop; })
     .attr("text-anchor", "middle")
     .attr("font-family", "sans-serif")
     .attr("dx", ".40em")
     .attr("dy", ".40em")
     .attr("transform", function(d){
        return "translate("+ (x(d.city) + x.bandwidth() / 2) + ", "
              +  (y(d.pop) + (h - y(d.pop)) / 2) + ")" + "rotate(-90)";});

// add the title
chart.append("text")
     .attr("x", (w / 2))             
     .attr("y", 0 - (margin.top / 2))
     .attr("text-anchor", "middle")  
     .style("font-size", "20px") 
     .style("text-decoration", "underline")  
     .text("Top 20 biggest city populations");

// axes
chart.append("g")
     .attr("transform", "translate(0, " + h + ")")
     .attr("class", "axis")
     .call(d3.axisBottom(x))
     .selectAll("text")
         .style("text-anchor", "end")
         .attr("dx", "-.8em")
         .attr("dy", ".15em")
         .attr("transform", function(d){ return "rotate(-65)"});

chart.append("g")
     .attr("class", "axis")
     .call(d3.axisLeft(y));

});
