var crimes = ["Arson", "Absconding from Lawful Custody", "Soliciting for Prostitution", "Concealing an Infant Death Close to Birth", "Criminal Damage", "Burglary - Business and Community", "Burglary - Residential", "Drug Trafficking", "Possession of Drugs", "Bail Offences", "Bigamy", "Dangerous Driving", "Disclosure, Obstruction, False or Misleading State", "Forgery or Use of Drug Prescription", "Fraud or Forgery Associated with Driver Records", "Going Equipped for Stealing", "Handling Stolen Goods", "Making, Supplying or Possessing Articles for use i", "Obscene Publications", "Other Forgery", "Other Notifiable Offences", "Perjury", "Perverting Course of Justice", "Possession of False Documents", "Profitting From or Concealing Proceeds of Crime", "Threat or Possession With Intent to Commit Crimina", "Wildlife Crime", "Other Firearm Offences", "Possession of Article with Blade or Point", "Possession of Firearm with Intent", "Possession of Firearms Offences", "Possession of Other Weapon", "Other Offences Against the State, or Public Order", "Public Fear Alarm or Distress", "Racially or Religiously Aggravated Public Fear, Al", "Violent Disorder", "Robbery of Business Property", "Robbery of Personal Property", "Other Sexual Offences", "Rape", "Bicycle Theft", "Other Theft", "Shoplifting", "Theft from Person", "Aggravated Vehicle Taking", "Interfering with a Motor Vehicle", "Theft from a Motor Vehicle", "Theft or Taking of a Motor Vehicle", "Homicide", "Violence with Injury", "Violence without Injury", "Exploitation of Prostitution", "Offender Management Act"];
var regions = ["Barking and Dagenham", "Barnet", "Bexley", "Brent", "Bromley", "Camden", "Croydon", "Ealing", "Enfield", "Greenwich", "Hackney", "Hammersmith and Fulham", "Haringey", "Harrow", "Havering", "Hillingdon", "Hounslow", "Islington", "Kensington and Chelsea", "Kingston upon Thames", "Lambeth", "Lewisham", "London Heathrow and London City Airports", "Merton", "Newham", "Redbridge", "Richmond upon Thames", "Southwark", "Sutton", "Tower Hamlets", "Waltham Forest", "Wandsworth", "Westminster"];

var sel_wrapper = document.createElement("div");
sel_wrapper.className = "sel_wrapper";

var crime_wrapper = document.createElement("select")
crime_wrapper.id = "sel-crime";
sel_wrapper.appendChild(document.createTextNode("MinorText: "));
sel_wrapper.appendChild(crime_wrapper);

var region_wrapper = document.createElement("select")
region_wrapper.id = "sel-region";
sel_wrapper.appendChild(document.createTextNode("LookUp_BoroughName: "))
sel_wrapper.appendChild(region_wrapper);

document.getElementById("chart").appendChild(sel_wrapper);

var svg_wrapper = document.createElement("div");
svg_wrapper.id = "figure";
document.getElementById("chart").appendChild(svg_wrapper);

crimes.forEach(crime => {
    var option = document.createElement("option");
    option.innerHTML = crime;
    document.getElementById("sel-crime").appendChild(option);
})

regions.forEach(region => {
    var option = document.createElement("option");
    option.innerHTML = region;
    document.getElementById("sel-region").appendChild(option);
})

var margin = {top: 50, right: 80, bottom: 50, left: 50};
var height = 450, width = 450;

// 绘图
var svg = d3.select("#figure")
    .append("svg")
    .attr("width", width+margin.left+margin.right)
    .attr("height", height+margin.top+margin.bottom);

d3.csv("data.csv").then(data => {
    //console.log(data);
    draw(data);

    document.getElementById('sel-crime').onchange = function() {
        draw(data);
    }
    document.getElementById('sel-region').onchange = function() {
        draw(data);
    }
})

function draw(data) {
    var crime = document.getElementById('sel-crime').value;
    var region = document.getElementById('sel-region').value;
    var filterdata = data.filter(d => d.MinorText == crime && d.LookUp_BoroughName == region)

    var lineData = [];
    filterdata.forEach(d => {
        var row = [];
        for(var dim in d) {
            if (isNaN(dim) == false) {
                row.push(+d[dim]);
            }
        }
        lineData.push(row);
    })
    //console.log("d", lineData)

    var xScale = d3.scaleLinear()
        .domain([0, 23])
        .range([margin.left, width + margin.left]);
        
    var yScale = d3.scaleLinear()
        .domain([d3.min(lineData.map(row => d3.min(row, d => d)), d => d), d3.max(lineData.map(row => d3.max(row, d => d)), d => d)])
        .range([margin.top + height, margin.top]);
    //console.log(d3.min(lineData.map(row => d3.min(row, d => d)), d => d), d3.max(lineData.map(row => d3.max(row, d => d)), d => d))

    // 线生成器
    var line = d3.line()
        .x((d,i) => xScale(i))
        .y(d => yScale(d));

    svg.selectAll(".path").remove();
    svg.selectAll(".axis").remove();

    svg.selectAll(".path")
        .data(lineData)
        .enter()
        .append("path")
        .attr("d", line)
        .attr("stroke", "steelblue") // stroke 属性是必需的
        .style("fill", "none")
        .style("stroke-width", 1.5)
        .attr("class", "path")/*
        .on("mouseover", function() {
            d3.select(this).style("stroke-width", 2).style("stroke", "red")
        })
        .on("mouseout", function() {
            d3.select(this).style("stroke-width", 0.5).style("stroke", "#000")
        })*/
        .on("click", d => {
            console.log(d);
        });

    var xAxis = d3.axisBottom()
        .scale(d3.scaleTime()
            .domain([new Date(2018, 0, 1), new Date(2019, 11, 1)])
            .range([margin.left, width + margin.left]))
        //.ticks(12)
        .ticks(d3.timeMonth.every(2))
        .tickFormat(d3.timeFormat("%y/%m"));

    svg.append("g")
        .attr("class","xaxis axis")
        .attr("transform","translate("+ 0 + "," + (margin.top + height) + ")")
        .call(xAxis);
        
    svg.append("text")
        .style("fill", "#000")
        .style("font-size", 13)
        .attr("y", margin.top+height+40)
        .attr("x", 225+margin.left)
        .text("Time");

    var yAxis = d3.axisLeft().scale(yScale);

    svg.append("g")
        .attr("class","yaxis axis")
        .attr("transform","translate(" + margin.left +","+ 0 +")")
        .call(yAxis);

    svg.append("text")
        .style("fill", "#000")
        .style("font-size", 13)
        .style("text-anchor", "middle")
        .attr("x", margin.left)
        .attr("y", margin.top-15)
        .text("Number");

    d3.selectAll(".xaxis").selectAll("text").attr("y", 12)
}