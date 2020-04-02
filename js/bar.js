var svg2 = d3.select("#chart")
	.append("svg")
	.attr("height", 1200)
	.attr("width", 600)
	.style("border", "solid 1px #000");

d3.csv("count.csv").then(data => {
	console.log(data);

	var lengthScale = d3.scaleLinear()
		.domain([0, d3.max(data, d => +d.count)])
		.range([280, 500])
	console.log([d3.min(data, d => +d.count), d3.max(data, d => +d.count)])

	svg2.selectAll("rect")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", 280)
		.attr("y", (d,i) => 20*i+50)
		.attr("width", d => {
			console.log(lengthScale(+d.count))
			return lengthScale(+d.count)-280
		})
		.attr("height", 12)
		.attr("fill", "lightblue");

	svg2.selectAll("text")
		.data(data)
		.enter()
		.append("text")
		.attr("x", 270)
		.attr("y", (d,i) => 20*i+60)
		.text(d => d.crime)
		.style("font-size", 10)
		.style("text-anchor", "end")
		//.attr("fill", "lightblue");
})