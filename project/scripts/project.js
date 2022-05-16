var mapSvg;
var mapData, csvData, centered , IslandText;

var geoLineString= {
                
    "type": "LineString",
    "coordinates": [
      [0.5012512207031249, -0.02265930116714652],
      [0.3701019287109375, -0.05767821291444767],
      [0.503997802734375, 0.13938890059036932],
      [0.0130462646484375, -0.271223962631079],
      [-0.05973815917968749, -0.35362019151082],
      [-0.28564453125, -0.39550467153200675],
      [-0.569915771484375, -0.6344474832838974],
      [-0.729217529296875, -0.1263426710482923],
      [-0.682525634765625, -0.14694197759179453],
      [-0.751190185546875, -0.11398307911293089],
      [-0.791015625, -0.17028783523693297],
      [-1.4886474609375, -1.219390359762202],
      [-1.6603088378906248, -1.5873213274098943],
      [-1.494140625, -1.6573310908088101],
      [-1.318359375, -1.6065399343116196],
      [-1.285400390625, -1.6490947745002844],
      [-1.18927001953125, -1.7163570116310896],
      [-1.1178588867187498, -1.598303410509457],
      [-0.49850463867187494, -1.7026302136023004],
      [-0.41748046875, -1.7314563756147938],
      [0.03570556640625, -1.5420196224821954],
      [0.509490966796875, -1.6683127925687722],
      [0.369415283203125, -1.6985121550953755],
      [0.516357421875, -1.5530019436002471],
      [0.567169189453125, -1.7287110456248016],
      [0.602874755859375, -1.6449766035527875],
      [0.5287170410156249, -1.550256368655434],
      [1.5875244140625, -1.5159363834516735],
      [1.845703125, -1.3978715559946528],
      [2.1807861328125, -1.5324100450044358],
      [2.801513671875, -1.4143460858068593],
      [3.44696044921875, -1.334718132769963],
      [4.031982421875, -1.4308204986633148]
    ]
  
}

document.addEventListener('DOMContentLoaded', () => {



const OpenModalButtons = document.querySelectorAll('[data-modal-target]')
    const CloseModalButtons = document.querySelectorAll('[data-close-button]')

    OpenModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = document.querySelector(button.dataset.modalTarget);
            openModal(modal)
        })
    })

    overlay.addEventListener('click', () => {
        const modals = document.querySelectorAll('.modal.active')
        modals.forEach(modal => {
            closeModal(modal)
        })
    })

    CloseModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal')
            closeModal(modal)
        })
    })

    function openModal(modal) {
        if (modal == null) return
        modal.classList.add('active')

    }

    function closeModal(modal) {
        if (modal == null) return
        modal.classList.remove('active')

    }

    mapSvg = d3.select('#map');


    Promise.all([d3.json('data/MapOnePieceFinale.geojson'),
                 d3.csv('data/data.csv')])
                 .then(function(values){

        
        mapData = values[0];
        csvData = values[1];

        d3.select('#tooltip').style("opacity", 0)
        
        drawMap();
       
    });
});

function drawMap() {
    

    var  num;

    d3.select("div#wrapper svg#map g").remove();

    let Projection = d3.geoMercator()
                          .fitSize([+mapSvg.style('width').replace('px',''),
                                    +mapSvg.style('height').replace('px','')], 
                                    mapData);
    let geoPath = d3.geoPath()
                    .projection(Projection);

    document.body.onkeyup = function(e){
                        if(e.keyCode == 32){
                            if(mapData.features[num].properties.id == 32){  num = 0}
                            num = num+1
                            drawCircles(map, (mapData.features[num]) , geoPath)
                       

                        }
                    }
    
        var groupedData = d3.nest()
        .key(function (d) { return d.No; })
        .entries(csvData);


        IslandText = {}
        groupedData.forEach(element => {
            tooltipText = ""
            element.values.forEach(d => {
                tooltipText = tooltipText + "This is " + d.Villages
                    + "\n" + "on " + d.Iles
                    + "\n" + ": " + d.Description + "\n"
            })
            IslandText[element.key] = tooltipText
        });


    
    let g = mapSvg.append('g');
    
    let map = g.append("g")
    map.selectAll('.stateMap')
          .data(mapData.features)
          .enter()
          .append('path')
            .attr('d',geoPath)
            .classed('stateMap',true)
            .attr("stroke-width" , '1px')
            .attr('id', d => `${d.properties.id}`)
            .attr('fill' , 'white')
            .on('mouseover', function(d,i) {
                
                d3.select(this).attr("stroke-width" , '2px')
                d3.select('#tooltip').style("opacity", 1)
            })           
            .on('mousemove', function(d,i) {
                
                d3.select("#tooltip").style("opacity", 1)
                .html(/* "Id:" + d.properties.id + "\n" */ IslandText[d.properties.id] )
                .style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 15) + "px");
            })
            .on('mouseout', function(d,i) {
               d3.select(this).attr("stroke-width" , '1px')
               d3.select('#tooltip').style("opacity", 0)
            })
            .on('click', function(d,i) {
                mapData.features.forEach(function (element , i){
                    if(element == d){
                        num = i +1 }
                        
                        d3.select('#trajet').style("opacity", 0)
                    
                    
                });

                drawCircles(map,d , geoPath)
            })

            var linePath= mapSvg
                    .append("path").attr("d",geoPath(geoLineString))
                    .style("stroke", "red")
                    .attr("fill", "none")
                    .attr('id', `trajet`)

                    console.log(mapData);

                   /*  var test = d3.select(mapData.features[0])
                    test.enter().attr('fill' , 'green')
                    console.log(test); */
        
 
    
}

function drawCircles(map , d , geoPath) {

    d3.selectAll('#map g g circle').remove();

    var x, y, k;


    var centroid = geoPath.centroid(d);

            map.append('circle').attr('cx', centroid[0])
            .attr('cy', centroid[1])
            .attr('r', 5).attr('fill' , 'red');

    var width = 800, height = 400;
    if (d && centered !== d) {
      
      x = centroid[0];
      y = centroid[1];
      k = 4;
      centered = d;
    } else {
      x = width / 2;
      y = height / 2;
      k = 1;
      centered = null;
    }

    d3.select("#tooltip").style("opacity", 1)
    .html(/* "Id:" + d.properties.id + "\n" + */IslandText[d.properties.id] )
    .style("left", (centroid[1]-100) + "px")
    .style("top", (centroid[1]) + "px");
  
    map.selectAll("g path")
    .classed("active", centered && function(d) { return d === centered; })
    
    

map.transition()
    .duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");

    
 
}
