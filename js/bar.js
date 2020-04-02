var svg2 = d3.select("#bar")
	.append("svg")
	.attr("height", 400)
	.attr("width", 600)
	.style("border", "solid 1px #000");

d3.csv("count.csv").then(data => {
	console.log(data);
})