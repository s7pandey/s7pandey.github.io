var colors = d3.scaleOrdinal(d3.schemeCategory10);

function redraw() {
    var width = document.getElementById("container").clientWidth,
        height = document.getElementById("container").clientHeight;

    d3.select("svg").remove();

    var svg = d3.select("div#container")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    svg.selectAll("*").remove();

    var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) {
            return d.id;
        }).distance(function() { return 150; }))
        .force("charge", d3.forceManyBody().distanceMin(function() {
            return 150;
        }))
        .force("center", d3.forceCenter(width / 2, height / 2));

    var link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter().append("line");
    var node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(data.nodes)
        .enter().append("circle")
        .attr("r", 12)
        .attr("fill", function(d) {
            return colors(d.group)
        })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("mouseover", function(d) {
            d3.select(this)
                .attr("r", 20);
            // .style("opacity", 1)
            $("#node-detail").show();
            $("#node-detail-card .content .header").text(d.id);
        })
        .on("mouseleave", function(d) {
            d3.select(this)
                .attr("r", 12)
        });

    node.append("title")
        .text(function(d) {
            return d.id;
        });

    simulation
        .nodes(data.nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(data.links);

    function ticked() {
        link
            .attr("x1", function(d) {
                return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        node
            .attr("cx", function(d) {
                return d.x;
            })
            .attr("cy", function(d) {
                return d.y;
            });
    }


    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }

}
// Draw for the first time to initialize.
redraw();

// Redraw based on the new size whenever the browser window is resized.
window.addEventListener("resize", redraw);