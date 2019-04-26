//// Your code here!
//function createMatrices(id) {
//    // the table rows, typically loaded from data file using d3.csv
//    let matrixData = [];
//    for (let i = 0; i < 20; i++) {
//        let bg = [i];
//        for (let j = 1; j <= 20; j++) {
//            bg.push(Math.round(Math.random() * 100) / 100);
//        }
//        matrixData.push(bg);
//    }


//    // create table
//    let table = d3.select("body").append("table");
//    table.id = id;
//    let header = table.append("thead").append("tr");
//    header
//        .selectAll("th")
//        .data(["Connect", '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '15', '16', '17', '18', '19'])
//        .enter()
//        .append("th")
//        .text(function (d) { return d; });
//    let tablebody = table.append("tbody");
//    rows = tablebody
//        .selectAll("tr")
//        .data(matrixData)
//        .enter()
//        .append("tr");
//    // We built the rows using the nested array - now each row has its own array.
//    cells = rows.selectAll("td")
//        // each row has data associated; we get it and enter it for the cells.
//        .data(function (d) {
//            return d;
//        })
//        .enter()
//        .append("td")
//        .text(function (d) {
//            return d;
//        });
//    return matrixData;
//}
//function findMiddle(tableData1, tableData2) {
//    let differenceTable = [];
//    for (let i in tableData1) {
//        differenceTable[i] = [];
//        for (let j in tableData1[i]) {
//            differenceTable[i][j] = Math.round((tableData2[i][j] - tableData1[i][j]) * 100) / 100;
//        }
//    }
//    return differenceTable;
//}
//function createDifTable(difData) {
//    let table = d3.select("body").append("table");
//    table.id = "diff";
//    let header = table.append("thead").append("tr");
//    header
//        .selectAll("th")
//        .data(["Connect", '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '15', '16', '17', '18', '19'])
//        .enter()
//        .append("th")
//        .text(function (d) { return d; });
//    let tablebody = table.append("tbody");
//    rows = tablebody
//        .selectAll("tr")
//        .data(difData)
//        .enter()
//        .append("tr");
//    // We built the rows using the nested array - now each row has its own array.
//    cells = rows.selectAll("td")
//        // each row has data associated; we get it and enter it for the cells.
//        .data(function (d) {
//            return d;
//        })
//        .enter()
//        .append("td")
//        .text(function (d) {
//            return d;
//        })
//        .attr("style", (d) => { return "background-color:" + heatGradient(d); });
//}
//function heatGradient(value) {
//    let r, g = 60, b;
//    if (value < 0) {
//        let num = 255 * (1 - Math.abs(value));
//        num = Math.round(num);
//        b = num;
//        r = 255;
//    } else if (value > 0) {
//        let num = 255 * (1 - Math.abs(value));
//        num = Math.round(num);
//        r = num;
//        b = 255;
//    } else {
//        r = 255;
//        b = 255;
//    }
//    let rgb = "rgb(" + r + ',' + g + ',' + b + ")";
//    return rgb;
//}
//"""""""""""""""""""""""""""""""""""""""""""""""""
//:::::::::::::::::::::::::::::::::::::::::::::::::
function run() {
    //let table1Data = createMatrix("table1");
    //let table2Data = createMatrix("table2");
    //createDifTable(findMiddle(table1Data, table2Data));

    let edges = new edgeBundling();
    let connections = [];
    for (let i in [...Array(20).keys()]) {
        let nam = "circ" + i;
        let obj = startingWeights(i, 20);
        connections[i] = {
            name: nam,
            imports: [],
            words: nam,
            weights: obj
        };
    }
    edges.addLine(connections);
    d3.select("#remover").on("click", function () {
        if (this.value === "rest") {
            this.value = "remover";
        } else {
            this.value = "rest";
        }

        edges.hideInputs();
        this.innerHTML = this.value;
    });

    d3.select("#mode").on("click", () => {
        let mode = document.getElementById("mode");
        if (mode.name === "line") {
            mode.name = "circle";
            mode.textContent = "Mode: Adding Circles";
        } else if (mode.name === "circle") {
            mode.name = "line";
            mode.textContent = "Mode: Adding Lines";
        }
    });

    //Retrieve info HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH

}
function startingWeights(num, size) {
    let obj = {};
    for (let i in [...Array(size).keys()]) {
        obj["circ" + i] = "";
    }
    obj["circ" + num] = 1;
    return obj;

}

function clickCirc(selection) {
    if (document.getElementById('mode').name === "circle") {
        let circle = d3.select(selection);
        let currId = circle.id;
        d3.select("#weightButton").attr("style", "visibility: visible");
        d3.select("#namer").attr("style", "visibility: visible");
        namer.current = circle;
        if (circle.attr("words")) {
            namer.value = circle.attr("words");
            updateDisplay(circle.attr("words"));
        } else {
            updateDisplay(circle.attr("id"));
        }
    }
}

class edgeBundling {
    constructor() {
        this.diameter = 700,
            this.radius = this.diameter / 2,
            this.innerRadius = this.radius - 120;
        this.cluster = d3.cluster()
            .size([360, this.innerRadius]);

        this.svg = d3.select("#svg2")
            .attr("width", this.diameter)
            .attr("height", this.diameter)
            .append("g")
            .attr("transform", "translate(" + this.radius + "," + this.radius + ")");
        this.line = d3.radialLine()
            .curve(d3.curveBundle.beta(0.85))
            .radius(function (d) { return d.y; })
            .angle(function (d) { return d.x / 180 * Math.PI; });
    }
    collectEvent() {
        let self = this;
        function sortFunc(a, b) {
            let list = [a[0], b[0]];
            list.sort();
            if (list[0] === a[0]) {
                return 1;
            } else {
                return -1;
            }
        }
        let matrix = [];
        for (let i in self.connections) {
            let column = self.connections[i];
            matrix[i] = [];
            let weights = column["weights"];
            for (let j in self.connections) {
                let holder = weights[self.connections[j].name];
                matrix[i].push(holder);
            }
        }
        this.createTable(matrix);
    }

    addLine(classes) {
        this.svg.selectAll("*").remove();
        let link = this.svg.append("g").selectAll(".link");
        let node = this.svg.append("g").selectAll(".node");
        let roots = this.packageHierarchy(classes);
        this.cluster(roots);
        link = link
            .data(this.packageImports(roots.leaves()))
            .enter().append("path")
            .each(function (d) { d.source = d[0]; d.target = d[d.length - 1]; })
            .attr("class", "link")
            .attr("d", this.line);
        link.on("click", function () {
            let mode = document.getElementById("mode");
            if (mode.name === "line") {
                let input = document.getElementById("inputter");
                input.current = d3.select(this);
                if (input.current.attr("weight")) {
                    updateDisplay(input.current.attr("weight"));
                } else {
                    updateDisplay('');
                }

            }
        });
        node = node
            .data(roots.leaves())
            .enter()
            .append("g")
            .attr("class", "node")
            .attr("dy", "0.31em")
            .attr("transform", function (d) { return "rotate(" + (d.x - 90) + ")translate(" + (d.y + 8) + ",0)" + (d.x < 180 ? "" : "rotate(180)"); });

        let circles = node.append("circle")
            .attr("r", 20)
            .attr("class", "circ")
            .attr("class", "edgeclass")
            .attr("id", function (d) {
                return d.data.key;
            });
        this.circs = circles["_groups"][0];
        node.append("text")
            .attr("text-anchor", function (d) { return d.x < 180 ? "middle" : "middle"; })
            .text(function (d) { return d.data.words; })
            .attr("style", "pointer-events: none");
        this.connections = classes;
        this.collectEvent();
        this.edgeClassEvents();
    }
    packageHierarchy(classes) {
        let map = {};

        function find(name, data) {
            let node = map[name], i;
            if (!node) {
                node = map[name] = data || { name: name, children: [] };
                if (name.length) {
                    node.parent = find(name.substring(0, i = name.lastIndexOf(".")));
                    node.parent.children.push(node);
                    node.key = name.substring(i + 1);
                }
            }
            return node;
        }

        classes.forEach(function (d) {
            find(d.name, d);
        });

        return d3.hierarchy(map[""]);
    }
    packageImports(nodes) {
        let map = {},
            imports = [];
        // Compute a map from name to node.
        nodes.forEach(function (d) {
            //if (map.hasOwnProperty(d.data.name)) {
            map[d.data.name] = d;
            //}
        });
        // For each import, construct a link from the source to target node.
        nodes.forEach(function (d) {
            if (d.data.imports) d.data.imports.forEach(function (i) {
                if (map.hasOwnProperty(d.data.name)) {
                    imports.push(map[d.data.name].path(map[i]));
                }
            });
        });

        return imports;
    }

    edgeClassEvents() {
        let self = this;
        this.coords = [];
        let target = false, source = false;
        d3.selectAll(".edgeclass").on('mouseover', function () {
            let curr = d3.select(this);
            target = curr;
        });
        d3.selectAll(".edgeclass").on('mouseout', function () {
            target = false;
        });
        d3.selectAll(".edgeclass").on('click', function () {
            let currId = d3.event.target.id;
            let toggleRemove = d3.select("#remover");
            if (toggleRemove["_groups"][0][0].value === "remover") {
                self.removeNode(currId);
                return;
            }
            clickCirc("#" + currId);
            self.addLine(self.connections);
        });

        let dragLine = d3.drag();
        d3.selectAll(".edgeclass").call(dragLine.on("start", function () {
            self.coords[0] = d3.event.x;
            self.coords[1] = d3.event.y;
            source = d3.select(this);

        }));
        d3.selectAll(".edgeclass").call(dragLine.on("end", function () {
            let eventX = d3.event.x;
            let eventY = d3.event.y;
            d3.selectAll(".edgeclass")
                .attr("fill", "#fa9fb5");
            if (target) {
                if (self.coords.length > 0) {
                    if (Math.abs(eventX - self.coords[0]) > 20 || Math.abs(eventY - self.coords[1]) > 20) {
                        let mode = document.getElementById("mode");
                        if (mode.name === "line") {
                            let to;
                            let fro;
                            for (let i = 0; i < self.connections.length; i++) {
                                if (!(to && fro)) {
                                    if (self.connections[i].name === target["_groups"][0][0].id) {
                                        to = i;
                                    }
                                    if (self.connections[i].name === source["_groups"][0][0].id) {
                                        fro = i;
                                    }
                                } else {
                                    break;
                                }
                            }
                            self.connections[fro].imports.push(self.connections[to].name);
                            self.connections[fro].weights[self.connections[to].name] = 0;
                            self.addLine(self.connections);
                            source = false;
                            target = false;
                        }
                    }
                }
            }
            self.coords = [];
        }));

        d3.select("body").on("mousedown", function () {
            let co = [d3.event.x, d3.event.y];
            if (document.elementFromPoint(co[0], co[1]).nodeName === 'svg') {
                if (document.getElementById('mode').name === "circle" &&
                    co[0] < 580 && co[1] < 580) {
                    if (!isCircle(co[0], co[1], Math.pow(40))) {
                        let newId = self.circs[self.circs.length - 1].id;
                        newId = newId.split("circ");
                        newId = parseInt(newId[1]);
                        newId++;
                        self.connections.push({ name: "circ" + newId, imports: [], words: "circ" + newId, weights: startingWeights(newId, self.circs.length + 1) });
                        self.addLine(self.connections);
                    }
                }
            }
        });

        d3.select("#weightButton").on("click", () => {
            let input = document.getElementById("inputter");
            let text = document.getElementById("namer");
            let weight = document.getElementById("weightButton");
            let mode = document.getElementById("mode");
            if (mode.name === "line") {
                if (!isNaN(parseInt(input.value))) {
                    let source = input.current["__data__"]["source"]["data"]["name"];
                    let target = input.current["__data__"]["target"]["data"]["name"];
                    updateDisplay('');
                    input.current.weight = input.value;
                    input.value = 0;
                    text.value = '';
                    for (let i in self.connections) {
                        if (self.connections[i].name === source) {
                            self.connections[i]["weights"][target] = input.current.weight;
                            break;
                        }
                    }
                    self.hideInputs();
                }
            } else {
                text.current.attr("words", text.value);
                updateDisplay('');
                input.style = "visibility: hidden";
                text.style = "visibility: hidden";
                input.value = 0;
                text.value = '';
                weight.style = "visibility: hidden";

                let currId = text.current.attr("id");
                self.connections.forEach((d, i) => {
                    if (d.name === currId) {
                        d.words = text.current.attr("words");
                    }
                });
                
                self.addLine(self.connections);
            }
        });

        d3.selectAll("path.link").on("dblclick", function () {
            let mode = document.getElementById("mode");
            if (mode.name === "line") {
                let input = document.getElementById("inputter");
                input.style = "visibility: visible";
                input.current = d3.select(this)["_groups"][0][0];

                if (input.current.weight) {
                    updateDisplay(input.current.weight);
                } else {
                    updateDisplay('No weight');
                }
                let weight = d3.select("#weightButton");
                weight.attr("style", "visibility: visible");
            }
        });
        d3.selectAll("path.link").on("click", function () {
            let mode = document.getElementById("mode");
            if (mode.name === "line") {
                updateDisplay('No weight');
                let curr = d3.select(this);
                curr = curr["_groups"][0][0];
                if (curr.weight) {
                    updateDisplay(curr.weight);
                }

            }
        });
        d3.select("#inputter").on("input", () => {
            let input = document.getElementById("inputter");
            updateDisplay(input.value);
        });
    }
    removeNode(id) {
        this.hideInputs();
        let key;
        for (key in this.connections) {
            let curr = this.connections[key];
            if (curr.name === id) {
                this.connections.splice(key, 1);
                break;
            }
        }
        for (let i in this.connections) {
            this.connections[i].weights[id] = "";
            loopOne: for (key in this.connections[i].imports) {
                let curr = this.connections[i].imports[key];
                console.log(curr)
                if (curr === id) {
                    this.connections[i].imports.splice(key, 1);
                    break loopOne;
                }
            }
        }

        //for (let i in this.connections[key].imports) {
        //    let end = this.connections[key].imports[i];
        //    end = end.split("circ");
        //    end = parseInt(end[1]);
        //    end++;
        //    delete this.connections[end].weights[key];
        //}
        console.log(this.connections)
        this.addLine(this.connections);
    }
    hideInputs() {
        d3.select("#namer").attr("style", "visibility: hidden");
        d3.select("#inputter").attr("style", "visibility: hidden");
        d3.select("#weightButton").attr("style", "visibility: hidden");
        d3.select("#displayValues").innerHTML = '';
    }

    heatGradient(value) {
        let r, g = 255, b;
        if (value < 0) {
            let num = 255 * Math.abs(value);
            num = Math.round(num);
            b = 255;
            r = 255 - num;
            g = 255 - num + 100;
        } else if (value > 0) {
            let num = 255 * Math.abs(value);
            num = Math.round(num);
            r = 255;
            b = 255 - num;
            g = 255 - num + 100;
        } else {
            g = 255;
            r = 255;
            b = 255;
        }
        let rgb = "rgb(" + r + ',' + g + ',' + b + ")";
        return rgb;
    }
    createTable(matrix) {
        $("#table").empty();
        let table = d3.select("#table").append("table");
        let self = this;
        let headerRay = [];
        for (let i in this.connections) {
            matrix[i].unshift(this.connections[i].words);
            headerRay.push(this.connections[i].words);
        }

        headerRay.unshift("Node");
        let header = table.append("thead").append("tr");
        header.selectAll("th")
            .data(headerRay)
            .enter()
            .append("th")
            .text(function (d) { return d; });
        let tablebody = table.append("tbody");
        let rows = tablebody
            .selectAll("tr")
            .data(matrix)
            .enter()
            .append("tr");
        //// We built the rows using the nested array - now each row has its own array.
        let cells = rows.selectAll("td")
            // each row has data associated; we get it and enter it for the cells.
            .data(function (d) {
                return d;
            })
            .enter()
            .append("td")
            .text(function (d) {
                return d;
            })
            .attr("style", function (d) {
                return "background-color:" + self.heatGradient(d);
            });
    }
}


function updateDisplay(text) {
    document.getElementById("displayValue").innerHTML = text;
}
function isCircle(x, y, dist) {
    if (!dist) {
        dist = 400;
    }
    let circles = d3.selectAll(".edgeclass");
    circles = circles._groups[0];
    for (let i = 0; i < circles.length; i++) {
        if (Math.pow(circles[i].getAttribute("cx") - x, 2) + Math.pow(circles[i].getAttribute("cy") - y, 2) <= dist) {
            return circles[i];
        }
    }
    return null;
}
window.onload = run;