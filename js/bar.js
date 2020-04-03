var svg2 = d3.select("#bar")
	.append("svg")
	.attr("height", 1130)
	.attr("width", 900)
	.style("margin", "20px 0 0 0")
	//.style("border", "solid 1px #000");

d3.csv("count.csv").then(data => {
	//console.log(data);
	data.sort(function(a,b){return a.crime-b.crime});
	console.log(data);

	var lengthScale = d3//.scaleLinear()
		.scaleLog().base(20)
		.domain([d3.min(data, d => +d.sum), d3.max(data, d => +d.sum)])
		.range([342, 840])
	//console.log([d3.min(data, d => +d.sum), d3.max(data, d => +d.sum)])

	svg2.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", 340)
		.attr("y", (d,i) => 20*i+50)
		.attr("width", d => {
			return lengthScale(+d.sum)-340
		})
		.attr("height", 12)
		.attr("fill", "lightblue")
		.on("mouseover", function(p,j) {
			d3.select(this).style("stroke", "#666");
			tooltip.html("Number: " + p.sum);
            tooltip.style("visibility", "visible");
		})
		.on('mousemove', () => {
            tooltip.style("top",(d3.event.pageY-10)+"px").style("left",(d3.event.pageX + 10)+"px");
        })
		.on("mouseout", function() {
			d3.select(this).style("stroke", "none");
			tooltip.style("visibility", "hidden");
		});

	/*svg2.selectAll(".tick")
		.data(data)
		.enter()
		.append("text")
		.attr("x", d => {
			return lengthScale(+d.sum)+8
		})
		.attr("y", (d,i) => 20*i+60)
		.text(d => d.sum)
		.style("font-size", 10)
		.style("text-anchor", "start")
		.attr("class", "tick")*/

	svg2.selectAll(".crime")
		.data(data)
		.enter()
		.append("text")
		.attr("x", 330)
		.attr("y", (d,i) => 20*i+60)
		.text(d => d.crime)
		.style("font-size", 12)
		.style("text-anchor", "end")
		.attr("class", "crime");

	svg2.append("text")
        .style("font-size", 18)
        .style("text-anchor", "middle")
        .attr("x", 450)
        .attr("y", 15)
        .text("Number of different crime types in London");
})