jQuery(document).ready(function($) {

	$("#accordion").accordion({ header: "h4", collapsible: true, active: false, heightStyle: 'panel' });
	$("#accordion-2").accordion({ header: "h4", collapsible: true, active: false, heightStyle: 'panel' });
	$( "#tabs" ).tabs();
    $( "#check" ).button();
    $( "#format" ).buttonset();
	$( "#tooltip" ).tooltip();
	$("#accordion-2").accordion({ active: 0});
	$("#tabs").tabs({ active: 1});
	
	var addclass = 'color';
	var $cols = $('.divs').click(function(e) {
    $cols.removeClass(addclass);
    $(this).addClass(addclass);
	});
	
});


/////////////////
// FUNCTIONS ////
/////////////////

// add commas to numbers > 1000
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}	

// round to two hundredths
function roundToTwo(value) {
	return(Math.round(value * 100) / 100);
}


// Leaflet popup
function popup(lat, lon, type){
	var popup = L.popup()
	.setLatLng([lat, lon])
	.setContent('your selection')
	.openOn(map);
	} 	


// basemaps
var ESRIImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, and UPR-EGP'
});
var MapboxTerrain = L.tileLayer('http://a.tiles.mapbox.com/v3/geointerest.e4qjes5f/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZ2VvaW50ZXJlc3QiLCJhIjoiQ2czbnlDMCJ9.pQ-_LxzHCL6WqMm5rJrEWw', {attribution: '&copy; <a href="http://www.mapbox.com">Mapbox</a>'});
var CartoDark = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
		  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
		});

// map settings
L.mapbox.accessToken = 'pk.eyJ1IjoiZ2VvaW50ZXJlc3QiLCJhIjoiQ2czbnlDMCJ9.pQ-_LxzHCL6WqMm5rJrEWw';
	
// set base map and controls
var map = new L.Map('map', {
  zoomControl: false,
  layer_selector: true,
  layers: [MapboxTerrain],
  center: [40, -85],
  zoom: 4,
  minZoom: 3,
  maxZoom: 14
});


// scroll wheel and attribution
map.scrollWheelZoom.disable();	
//map.attributionControl.setPrefix('<center>Viewer by: <a href="mailto:gverutes@audubon.org" target="_top">Gregg Verutes</a></center>');
	
// add basemap and overlays
var baseMaps = {
	"<b>imagery</b>": ESRIImagery,
	"<b>streets</b>": CartoDark,
	"<b>terrain</b>": MapboxTerrain
};


// add CartoDB vector	
var ChapterBoundaries = 'https://gverutes.cartodb.com/api/v2/viz/aa7be229-d006-4ee8-ba39-b18196faf241/viz.json';
var layerGrid = 'https://gverutes.cartodb.com/api/v2/viz/f6362178-3a6b-11e7-9526-0e3ebc282e83/viz.json';
var layerEffortPts = 'https://gverutes.cartodb.com/api/v2/viz/a2095c13-7579-4f77-938e-b3d9d680a1fb/viz.json';
var StateBoundaries = 'https://gverutes.cartodb.com/api/v2/viz/05e6fa78-2722-4a89-9ae3-b02ad0f3976e/viz.json';
var Flyways = 'https://gverutes.cartodb.com/api/v2/viz/dc33b54a-0f7a-4766-95e5-aecbd6d9a680/viz.json';


function openMarkerPopup(id){
	geojson.eachLayer(function(feature){
		if(feature.feature.properties.id==id){
			feature.openPopup();
		}
	});
}    
map.closePopup();


// add cartoDB layer and set z-index so it shows up on top
	cartodb.createLayer(map, Flyways)
	.on('done', function(layer) {
		layer.setZIndex(9).addTo(map);
		var overlayMaps = {
		"flyways": layer
		};
		L.control.layers(baseMaps, overlayMaps, {position: 'topleft', collapsed: false}).addTo(map);
	});


	
// mini map
var MapboxStreets = 'http://a.tiles.mapbox.com/v3/mapbox.world-light/{z}/{x}/{y}.png';
var mb = new L.TileLayer(MapboxStreets	, {minZoom: 1, maxZoom: 14});
var miniMap = new L.Control.MiniMap(mb, { toggleDisplay: true, height: '125', width: '175'}).addTo(map); 

// zoom and scale controls
L.control.zoom({ position: 'topright' }).addTo(map);
L.control.scale({ position: 'topleft' }).addTo(map);


///////////////////////////////////////////////////////////////////////////////////////////////////	

// ADD LATEST SURVEY AT START (SUMMER 2018)
cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/eb12ff13-9ba0-4701-b272-8336688e569d/viz.json')
	.addTo(map)
	.on('done', function(layer) {
	layer.setZIndex(5);	
	});	


function check(basemap) {
	if (map.hasLayer(basemap) == 1){return true;}
	else{return false;}
}


var basemapSelect;	

// change event for radio button
$('input:radio[name="sightings"]').change(
    function(){

		if (check(MapboxTerrain)){basemapSelect = MapboxTerrain;}
		else if (check(ESRIImagery)){basemapSelect = ESRIImagery;}
		else{basemapSelect = CartoDark;}

        if ($(this).val() == '1') {
            //alert("Winter 16");
			$("#radio-1a").prop('checked', true);			
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://gverutes.cartodb.com/api/v2/viz/267b53b7-cb4a-4cc7-a5d5-b795cac14a79/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);				
					});	
			});	
		
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}	
		}		
		
		else if ($(this).val() == '2') {
            //alert("Summer 16");
			$("#radio-1b").prop('checked', true);		
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/61cf54d3-2e4d-4998-9858-28d658b2bf11/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);
					});	
			});	
			
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}				
		}
		
		else if ($(this).val() == '3') {
            //alert("Winter 17");	
			$("#radio-1a").prop('checked', true);		
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/bed13c71-b06e-4803-93ff-9f2d9dd657cd/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);				
					});	
			});	
			
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}						
		}		

        else if ($(this).val() == '4') {
            //alert("Summer 17");
			$("#radio-1b").prop('checked', true);
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/a2095c13-7579-4f77-938e-b3d9d680a1fb/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);				
					});	
			});	
			
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}		
		}
		

        else if ($(this).val() == '5') {
            //alert("Winter 18");
			$("#radio-1b").prop('checked', true);
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/f18338a7-51d6-4edd-84a5-4a138ddce5a6/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);				
					});	
			});	
			
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}		
		}

        else {
            //alert("Summer 18");
			$("#radio-1b").prop('checked', true);
			
			map.eachLayer(function(layer) {
				setTimeout(function () { // give a little time before removing previous tile layer 
					map.removeLayer(layer);
					map.addLayer(basemapSelect);
									
				}, 500);
			cartodb.createLayer(map, 'https://stanford.carto.com/u/gverutes/api/v2/viz/eb12ff13-9ba0-4701-b272-8336688e569d/viz.json')
					.addTo(map)
					.on('done', function(layer) {
					layer.setZIndex(5);				
					});	
			});	
			
			if ($( "#state").val() > 0){zoomState($( "#state option:selected" ).text());}
			else if ($( "#chapter").val() > 0){zoomChapter($( "#chapter option:selected" ).text());}
			else if ($( "#flyway").val() > 0){zoomFlyway($( "#flyway option:selected" ).text());}		
		}
		
		showSummary();
		

    });	

///////////////////////////////////////////////////////////////////////////////////////////////////	
	

// JQuery initialize map and HTML
jQuery(document).ready(function($) {
showSummary();
});

// when map moves, update AmCharts summary
map.on("moveend", function(e) {
  showSummary();
});	

// handle flyway, state and chapter drop-downs
$("#flyway").change(function(event){
	zoomFlyway($( "#flyway option:selected" ).text());
	$( "#state").val(0);
	$( "#chapter").val(0);
});

$("#state").change(function(event){
	zoomState($( "#state option:selected" ).text());
	$( "#flyway").val(0);
	$( "#chapter").val(0);
});

$("#chapter").change(function(event){
	zoomChapter($( "#chapter option:selected" ).text());
	$( "#flyway").val(0);
	$( "#state").val(0);
});



///////////////////////////////////////////////////////////////////////////////////////////////////	

var sql = cartodb.SQL({ user: 'gverutes' });

// zoom Flyway
var endFly = 0;  
var sublayersFly = [];

function zoomFlyway(name){	
	
	// catch if "Select Flyway..."
	if ($( "#flyway").val() == 0){HTML = ''; document.getElementById("CustomReport").innerHTML = '';}
	
	else{	
		// check year and season
		var button_2016_W = document.getElementById("2016_W");
		var button_2016_S = document.getElementById("2016_S");
		var button_2017_W = document.getElementById("2017_W");
		var button_2017_S = document.getElementById("2017_S");
		var button_2018_W = document.getElementById("2018_W");
		var button_2018_S = document.getElementById("2018_S");
		
		var yearseason = 0;
		var seasonyear = '';
		if (button_2016_W.checked){yearseason = 1;seasonyear = 'Winter 2016';}
		else if (button_2016_S.checked){yearseason = 2;seasonyear = 'Summer 2016';}	
		else if (button_2017_W.checked){yearseason = 3;seasonyear = 'Winter 2017';}	
		else if (button_2017_S.checked){yearseason = 4;seasonyear = 'Summer 2017';}
		else if (button_2018_W.checked){yearseason = 5;seasonyear = 'Winter 2018';}			
		else{yearseason = 6;seasonyear = 'Summer 2018';}
		
		// spatial intersect: FLYWAY
		var query = "SELECT sum(eabl) sumeabl, sum(mobl) summobl, sum(webl) sumwebl, sum(bhnu) sumbhnu, sum(rbnu) sumrbnu, sum(wbnu) sumwbnu, sum(pynu) sumpynu, min(eabl) mineabl, max(eabl) maxeabl, min(mobl) minmobl, max(mobl) maxmobl, min(webl) minwebl, max(webl) maxwebl, min(bhnu) minbhnu, max(bhnu) maxbhnu, min(rbnu) minrbnu, max(rbnu) maxrbnu, min(wbnu) minwbnu, max(wbnu) maxwbnu, min(pynu) minpynu, max(pynu) maxpynu, avg(cast(NULLIF(eabl, 0) AS BIGINT)) avgeabl, avg(cast(NULLIF(mobl, 0) AS BIGINT)) avgmobl, avg(cast(NULLIF(webl, 0) AS BIGINT)) avgwebl, avg(cast(NULLIF(bhnu, 0) AS BIGINT)) avgbhnu, avg(cast(NULLIF(rbnu, 0) AS BIGINT)) avgrbnu, avg(cast(NULLIF(wbnu, 0) AS BIGINT)) avgwbnu, avg(cast(NULLIF(pynu, 0) AS BIGINT)) avgpynu FROM cw_2016_2017_cmb, us_coastal_flyways WHERE cw_2016_2017_cmb.survey_id="+yearseason+" AND us_coastal_flyways.fly_name = '"+name+"' AND ST_Intersects(cw_2016_2017_cmb.the_geom, us_coastal_flyways.the_geom)";
		sql.execute(query).done(function(data){
		
			var HTML = "";

			HTML = HTML + "<br><fieldset><legend><img src='img/snapshot_sm.png' valign='middle'>&nbsp;<b>PROGRAM SNAPSHOT</b></legend><b>"+name+" Flyway</b><br>&nbsp;&nbsp;"+seasonyear+"<br><br><font color='#ec7014'><b>Bluebirds</b></font><br>";	
				
			// EABL
			if (data.rows[0].sumeabl > 0 || data.rows[0].sumeabl !== null){
				HTML = HTML + "&nbsp;&nbsp;Eastern<ul><li><i><b>"+data.rows[0].sumeabl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxeabl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgeabl)+"</i></b> when present</li></ul>"	
			}
			
			// MOBL
			if (data.rows[0].summobl > 0 || data.rows[0].summobl !== null){
				HTML = HTML + "&nbsp;&nbsp;Mountain<ul><li><i><b>"+data.rows[0].summobl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxmobl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgmobl)+"</i></b> when present</li></ul>"	
			}
			
			// WEBL	
			if (data.rows[0].sumwebl > 0 || data.rows[0].sumwebl !== null){
				HTML = HTML + "&nbsp;&nbsp;Western<ul><li><i><b>"+data.rows[0].sumwebl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwebl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwebl)+"</i></b> when present</li></ul>"	
			}
			
			// NO DATA
			if ((data.rows[0].sumeabl == 0 || data.rows[0].sumeabl == null) && (data.rows[0].summobl == 0 || data.rows[0].summobl == null) && (data.rows[0].sumwebl == 0 || data.rows[0].sumwebl == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}
			
			HTML = HTML + "<font color='#8B4513'><b>Nuthatches</b></font><br>";
			
			// BHNU
			if (data.rows[0].sumbhnu > 0 || data.rows[0].sumbhnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Brown-headed<ul><li><i><b>"+data.rows[0].sumbhnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxbhnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgbhnu)+"</i></b> when present</li></ul>"	
			}
			
			// RBNU
			if (data.rows[0].sumrbnu > 0 || data.rows[0].sumrbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Red-breasted<ul><li><i><b>"+data.rows[0].sumrbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxrbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgrbnu)+"</i></b> when present</li></ul>"	
			}
			
			// WBNU	
			if (data.rows[0].sumwbnu > 0 || data.rows[0].sumwbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;White-breasted<ul><li><i><b>"+data.rows[0].sumwbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwbnu)+"</i></b> when present</li></ul>"	
			}
			
			// PYNU
			if (data.rows[0].sumpynu > 0 || data.rows[0].sumpynu !== null){
				HTML = HTML + "&nbsp;&nbsp;Pygmy<ul><li><i><b>"+data.rows[0].sumpynu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxpynu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgpynu)+"</i></b> when present</li></ul>"	
			}

			// NO DATA
			if ((data.rows[0].sumbhnu == 0 || data.rows[0].sumbhnu == null) && (data.rows[0].sumrbnu == 0 || data.rows[0].sumrbnu == null) && (data.rows[0].sumwbnu == 0 || data.rows[0].sumwbnu == null) && (data.rows[0].sumpynu == 0 || data.rows[0].sumpynu == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}	
			
			HTML = HTML + "</fieldset>";	
		
		document.getElementById("CustomReport").innerHTML = HTML;
		
		});	

		
		var MapQueryFly = "SELECT * FROM us_coastal_flyways WHERE fly_name = '"+name+"'";
		sql.getBounds(MapQueryFly).done(function(bounds) {
		var FlyLatLon = [((bounds[0][0]+bounds[1][0])/2),((bounds[0][1]+bounds[1][1])/2)];
		if (name == 'Pacific'){FlyLatLon = [42,-122];}
		else if (name == 'Mississippi'){FlyLatLon = [45,-89];map.fitBounds(bounds);}
		else if (name == 'Atlantic'){FlyLatLon = [42,-75];map.fitBounds(bounds);}
		else if (name == 'Central'){FlyLatLon = [42,-105];map.fitBounds(bounds);}
		
		var popup = L.popup()
			.setLatLng(FlyLatLon)
			.setContent("<b>"+name+" Flyway</b>")
			.openOn(map);
			
		});	
	}
}


// zoom State
var endState = 0;  
var sublayersState = [];
function zoomState(name){	
	
	// catch if "Select State..."
	if ($( "#state").val() == 0){document.getElementById("CustomReport").innerHTML = '';}
	
	else{	
			// check year and season
		var button_2016_W = document.getElementById("2016_W");
		var button_2016_S = document.getElementById("2016_S");
		var button_2017_W = document.getElementById("2017_W");
		var button_2017_S = document.getElementById("2017_S");
		var button_2018_W = document.getElementById("2018_W");
		var button_2018_S = document.getElementById("2018_S");

		var yearseason = 0;
		var seasonyear = '';
		if (button_2016_W.checked){yearseason = 1;seasonyear = 'Winter 2016';}
		else if (button_2016_S.checked){yearseason = 2;seasonyear = 'Summer 2016';}	
		else if (button_2017_W.checked){yearseason = 3;seasonyear = 'Winter 2017';}	
		else if (button_2017_S.checked){yearseason = 4;seasonyear = 'Summer 2017';}	
		else if (button_2018_W.checked){yearseason = 5;seasonyear = 'Winter 2018';}			
		else{yearseason = 6;seasonyear = 'Summer 2018';}

		if (name == 'National'){
			// spatial intersect: NATIONAL
			var query = "SELECT sum(eabl) sumeabl, sum(mobl) summobl, sum(webl) sumwebl, sum(bhnu) sumbhnu, sum(rbnu) sumrbnu, sum(wbnu) sumwbnu, sum(pynu) sumpynu, min(eabl) mineabl, max(eabl) maxeabl, min(mobl) minmobl, max(mobl) maxmobl, min(webl) minwebl, max(webl) maxwebl, min(bhnu) minbhnu, max(bhnu) maxbhnu, min(rbnu) minrbnu, max(rbnu) maxrbnu, min(wbnu) minwbnu, max(wbnu) maxwbnu, min(pynu) minpynu, max(pynu) maxpynu, avg(cast(NULLIF(eabl, 0) AS BIGINT)) avgeabl, avg(cast(NULLIF(mobl, 0) AS BIGINT)) avgmobl, avg(cast(NULLIF(webl, 0) AS BIGINT)) avgwebl, avg(cast(NULLIF(bhnu, 0) AS BIGINT)) avgbhnu, avg(cast(NULLIF(rbnu, 0) AS BIGINT)) avgrbnu, avg(cast(NULLIF(wbnu, 0) AS BIGINT)) avgwbnu, avg(cast(NULLIF(pynu, 0) AS BIGINT)) avgpynu FROM cw_2016_2017_cmb WHERE cw_2016_2017_cmb.survey_id="+yearseason;
			sql.execute(query).done(function(data){
			

			var HTML = "";

			HTML = HTML + "<br><fieldset><legend><img src='img/snapshot_sm.png' valign='middle'>&nbsp;<b>PROGRAM SNAPSHOT</b></legend><b>"+name+"</b><br>&nbsp;&nbsp;"+seasonyear+"<br><br><font color='#ec7014'><b>Bluebirds</b></font><br>";	
				
			// EABL
			if (data.rows[0].sumeabl > 0 || data.rows[0].sumeabl !== null){
				HTML = HTML + "&nbsp;&nbsp;Eastern<ul><li><i><b>"+data.rows[0].sumeabl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxeabl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgeabl)+"</i></b> when present</li></ul>"	
			}
			
			// MOBL
			if (data.rows[0].summobl > 0 || data.rows[0].summobl !== null){
				HTML = HTML + "&nbsp;&nbsp;Mountain<ul><li><i><b>"+data.rows[0].summobl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxmobl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgmobl)+"</i></b> when present</li></ul>"	
			}
			
			// WEBL	
			if (data.rows[0].sumwebl > 0 || data.rows[0].sumwebl !== null){
				HTML = HTML + "&nbsp;&nbsp;Western<ul><li><i><b>"+data.rows[0].sumwebl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwebl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwebl)+"</i></b> when present</li></ul>"	
			}
			
			// NO DATA
			if ((data.rows[0].sumeabl == 0 || data.rows[0].sumeabl == null) && (data.rows[0].summobl == 0 || data.rows[0].summobl == null) && (data.rows[0].sumwebl == 0 || data.rows[0].sumwebl == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}
			
			HTML = HTML + "<font color='#8B4513'><b>Nuthatches</b></font><br>";
			
			// BHNU
			if (data.rows[0].sumbhnu > 0 || data.rows[0].sumbhnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Brown-headed<ul><li><i><b>"+data.rows[0].sumbhnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxbhnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgbhnu)+"</i></b> when present</li></ul>"	
			}
			
			// RBNU
			if (data.rows[0].sumrbnu > 0 || data.rows[0].sumrbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Red-breasted<ul><li><i><b>"+data.rows[0].sumrbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxrbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgrbnu)+"</i></b> when present</li></ul>"	
			}
			
			// WBNU	
			if (data.rows[0].sumwbnu > 0 || data.rows[0].sumwbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;White-breasted<ul><li><i><b>"+data.rows[0].sumwbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwbnu)+"</i></b> when present</li></ul>"	
			}
			
			// PYNU
			if (data.rows[0].sumpynu > 0 || data.rows[0].sumpynu !== null){
				HTML = HTML + "&nbsp;&nbsp;Pygmy<ul><li><i><b>"+data.rows[0].sumpynu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxpynu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgpynu)+"</i></b> when present</li></ul>"	
			}

			// NO DATA
			if ((data.rows[0].sumbhnu == 0 || data.rows[0].sumbhnu == null) && (data.rows[0].sumrbnu == 0 || data.rows[0].sumrbnu == null) && (data.rows[0].sumwbnu == 0 || data.rows[0].sumwbnu == null) && (data.rows[0].sumpynu == 0 || data.rows[0].sumpynu == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}	
			
			HTML = HTML + "</fieldset>";	
			
			document.getElementById("CustomReport").innerHTML = HTML;
			
			});			
			
			var MapQueryState = "SELECT * FROM us_states";
			
			map.setView([37, -85], 4);
			
		}

		
		else{
			// spatial intersect: STATE
			var query = "SELECT sum(eabl) sumeabl, sum(mobl) summobl, sum(webl) sumwebl, sum(bhnu) sumbhnu, sum(rbnu) sumrbnu, sum(wbnu) sumwbnu, sum(pynu) sumpynu, min(eabl) mineabl, max(eabl) maxeabl, min(mobl) minmobl, max(mobl) maxmobl, min(webl) minwebl, max(webl) maxwebl, min(bhnu) minbhnu, max(bhnu) maxbhnu, min(rbnu) minrbnu, max(rbnu) maxrbnu, min(wbnu) minwbnu, max(wbnu) maxwbnu, min(pynu) minpynu, max(pynu) maxpynu, avg(cast(NULLIF(eabl, 0) AS BIGINT)) avgeabl, avg(cast(NULLIF(mobl, 0) AS BIGINT)) avgmobl, avg(cast(NULLIF(webl, 0) AS BIGINT)) avgwebl, avg(cast(NULLIF(bhnu, 0) AS BIGINT)) avgbhnu, avg(cast(NULLIF(rbnu, 0) AS BIGINT)) avgrbnu, avg(cast(NULLIF(wbnu, 0) AS BIGINT)) avgwbnu, avg(cast(NULLIF(pynu, 0) AS BIGINT)) avgpynu FROM cw_2016_2017_cmb, us_states WHERE cw_2016_2017_cmb.survey_id="+yearseason+" AND us_states.state_name = '"+name+"' AND ST_Intersects(cw_2016_2017_cmb.the_geom, us_states.the_geom)";
			sql.execute(query).done(function(data){


			var HTML = "";

			HTML = HTML + "<br><fieldset><legend><img src='img/snapshot_sm.png' valign='middle'>&nbsp;<b>PROGRAM SNAPSHOT</b></legend><b>"+name+"</b><br>&nbsp;&nbsp;"+seasonyear+"<br><br><font color='#ec7014'><b>Bluebirds</b></font><br>";	
				
			// EABL
			if (data.rows[0].sumeabl > 0 || data.rows[0].sumeabl !== null){
				HTML = HTML + "&nbsp;&nbsp;Eastern<ul><li><i><b>"+data.rows[0].sumeabl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxeabl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgeabl)+"</i></b> when present</li></ul>"	
			}
			
			// MOBL
			if (data.rows[0].summobl > 0 || data.rows[0].summobl !== null){
				HTML = HTML + "&nbsp;&nbsp;Mountain<ul><li><i><b>"+data.rows[0].summobl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxmobl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgmobl)+"</i></b> when present</li></ul>"	
			}
			
			// WEBL	
			if (data.rows[0].sumwebl > 0 || data.rows[0].sumwebl !== null){
				HTML = HTML + "&nbsp;&nbsp;Western<ul><li><i><b>"+data.rows[0].sumwebl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwebl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwebl)+"</i></b> when present</li></ul>"	
			}
			
			// NO DATA
			if ((data.rows[0].sumeabl == 0 || data.rows[0].sumeabl == null) && (data.rows[0].summobl == 0 || data.rows[0].summobl == null) && (data.rows[0].sumwebl == 0 || data.rows[0].sumwebl == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}
			
			HTML = HTML + "<font color='#8B4513'><b>Nuthatches</b></font><br>";
			
			// BHNU
			if (data.rows[0].sumbhnu > 0 || data.rows[0].sumbhnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Brown-headed<ul><li><i><b>"+data.rows[0].sumbhnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxbhnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgbhnu)+"</i></b> when present</li></ul>"	
			}
			
			// RBNU
			if (data.rows[0].sumrbnu > 0 || data.rows[0].sumrbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;Red-breasted<ul><li><i><b>"+data.rows[0].sumrbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxrbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgrbnu)+"</i></b> when present</li></ul>"	
			}
			
			// WBNU	
			if (data.rows[0].sumwbnu > 0 || data.rows[0].sumwbnu !== null){
				HTML = HTML + "&nbsp;&nbsp;White-breasted<ul><li><i><b>"+data.rows[0].sumwbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwbnu)+"</i></b> when present</li></ul>"	
			}
			
			// PYNU
			if (data.rows[0].sumpynu > 0 || data.rows[0].sumpynu !== null){
				HTML = HTML + "&nbsp;&nbsp;Pygmy<ul><li><i><b>"+data.rows[0].sumpynu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxpynu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgpynu)+"</i></b> when present</li></ul>"	
			}

			// NO DATA
			if ((data.rows[0].sumbhnu == 0 || data.rows[0].sumbhnu == null) && (data.rows[0].sumrbnu == 0 || data.rows[0].sumrbnu == null) && (data.rows[0].sumwbnu == 0 || data.rows[0].sumwbnu == null) && (data.rows[0].sumpynu == 0 || data.rows[0].sumpynu == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}	
			
			
			HTML = HTML + "</fieldset>";	
			
			document.getElementById("CustomReport").innerHTML = HTML;
			
			});	
			
			var MapQueryState = "SELECT * FROM us_states WHERE state_name = '"+name+"'";
			
				
			sql.getBounds(MapQueryState).done(function(bounds) {
			map.fitBounds(bounds);

			var popup = L.popup()
				.setLatLng([((bounds[0][0]+bounds[1][0])/2),((bounds[0][1]+bounds[1][1])/2)])
				.setContent("<b>"+name+"</b>")
				.openOn(map);
			
			});

			sql.execute(MapQueryState).done(function(data){
			
			
			// remove previous
			if (endState > 0){sublayersState[endState-1].remove();}
			endState = endState + 1;
			
			var CartoCSSState = "#us_states{polygon-opacity:0.2;polygon-fill:#d3d3d3;line-opacity:0.75;line-color:#636363;line-width:4;[zoom < 7]{polygon-opacity:0; line-opacity:0;}}";
			
			  cartodb.createLayer(map, StateBoundaries)
			  .addTo(map)
			  .on('done', function(layer) {
				// change the query for the first layer
				var subLayerOptions = {
				  sql: MapQueryState,
				  cartocss: CartoCSSState,
				}
				var sublayer = layer.getSubLayer(0);
				layer.setZIndex(100);	
				sublayer.set(subLayerOptions);
				sublayersState.push(sublayer);
			  }).on('error', function() {
				// log the error
			  });
			})
		}
	}
}


// zoom Chapter
var endChapter = 0;  
var sublayersChapter = [];

function zoomChapter(name){	

	
	// catch if "Select Participant Group..."
	if ($( "#chapter").val() == 0){HTML = ''; document.getElementById("CustomReport").innerHTML = '';}
	
	else{	
		// check year and season
		var button_2016_W = document.getElementById("2016_W");
		var button_2016_S = document.getElementById("2016_S");
		var button_2017_W = document.getElementById("2017_W");
		var button_2017_S = document.getElementById("2017_S");
		var button_2018_W = document.getElementById("2018_W");
		var button_2018_S = document.getElementById("2018_S");
		
		var yearseason = 0;
		var seasonyear = '';
		if (button_2016_W.checked){yearseason = 1;seasonyear = 'Winter 2016';}
		else if (button_2016_S.checked){yearseason = 2;seasonyear = 'Summer 2016';}	
		else if (button_2017_W.checked){yearseason = 3;seasonyear = 'Winter 2017';}	
		else if (button_2017_S.checked){yearseason = 4;seasonyear = 'Summer 2017';}	
		else if (button_2018_W.checked){yearseason = 5;seasonyear = 'Winter 2018';}			
		else{yearseason = 6;seasonyear = 'Summer 2018';}

		// spatial intersect: CHAPTER
		var query = "SELECT sum(eabl) sumeabl, sum(mobl) summobl, sum(webl) sumwebl, sum(bhnu) sumbhnu, sum(rbnu) sumrbnu, sum(wbnu) sumwbnu, sum(pynu) sumpynu, min(eabl) mineabl, max(eabl) maxeabl, min(mobl) minmobl, max(mobl) maxmobl, min(webl) minwebl, max(webl) maxwebl, min(bhnu) minbhnu, max(bhnu) maxbhnu, min(rbnu) minrbnu, max(rbnu) maxrbnu, min(wbnu) minwbnu, max(wbnu) maxwbnu, min(pynu) minpynu, max(pynu) maxpynu, avg(cast(NULLIF(eabl, 0) AS BIGINT)) avgeabl, avg(cast(NULLIF(mobl, 0) AS BIGINT)) avgmobl, avg(cast(NULLIF(webl, 0) AS BIGINT)) avgwebl, avg(cast(NULLIF(bhnu, 0) AS BIGINT)) avgbhnu, avg(cast(NULLIF(rbnu, 0) AS BIGINT)) avgrbnu, avg(cast(NULLIF(wbnu, 0) AS BIGINT)) avgwbnu, avg(cast(NULLIF(pynu, 0) AS BIGINT)) avgpynu FROM cw_2016_2017_cmb, chapterboundaries WHERE cw_2016_2017_cmb.survey_id="+yearseason+" AND chapterboundaries.name = '"+name+"' AND ST_Intersects(cw_2016_2017_cmb.the_geom, chapterboundaries.the_geom)";
		sql.execute(query).done(function(data){
		
		var HTML = "";
		HTML = HTML + "<br><fieldset><legend><img src='img/snapshot_sm.png' valign='middle'>&nbsp;<b>PROGRAM SNAPSHOT</b></legend><b>"+name+"</b><br>&nbsp;&nbsp;"+seasonyear+"<br><br><font color='#ec7014'><b>Bluebirds</b></font><br>";
		
		// EABL
		if (data.rows[0].sumeabl > 0 || data.rows[0].sumeabl !== null){
			HTML = HTML + "&nbsp;&nbsp;Eastern<ul><li><i><b>"+data.rows[0].sumeabl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxeabl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgeabl)+"</i></b> when present</li></ul>"	
		}
		
		// MOBL
		if (data.rows[0].summobl > 0 || data.rows[0].summobl !== null){
			HTML = HTML + "&nbsp;&nbsp;Mountain<ul><li><i><b>"+data.rows[0].summobl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxmobl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgmobl)+"</i></b> when present</li></ul>"	
		}
		
		// WEBL	
		if (data.rows[0].sumwebl > 0 || data.rows[0].sumwebl !== null){
			HTML = HTML + "&nbsp;&nbsp;Western<ul><li><i><b>"+data.rows[0].sumwebl+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwebl+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwebl)+"</i></b> when present</li></ul>"	
		}
		
		// NO DATA
		if ((data.rows[0].sumeabl == 0 || data.rows[0].sumeabl == null) && (data.rows[0].summobl == 0 || data.rows[0].summobl == null) && (data.rows[0].sumwebl == 0 || data.rows[0].sumwebl == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}
		
		HTML = HTML + "<font color='#8B4513'><b>Nuthatches</b></font><br>";
		
		// BHNU
		if (data.rows[0].sumbhnu > 0 || data.rows[0].sumbhnu !== null){
			HTML = HTML + "&nbsp;&nbsp;Brown-headed<ul><li><i><b>"+data.rows[0].sumbhnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxbhnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgbhnu)+"</i></b> when present</li></ul>"	
		}
		
		// RBNU
		if (data.rows[0].sumrbnu > 0 || data.rows[0].sumrbnu !== null){
			HTML = HTML + "&nbsp;&nbsp;Red-breasted<ul><li><i><b>"+data.rows[0].sumrbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxrbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgrbnu)+"</i></b> when present</li></ul>"	
		}
		
		// WBNU	
		if (data.rows[0].sumwbnu > 0 || data.rows[0].sumwbnu !== null){
			HTML = HTML + "&nbsp;&nbsp;White-breasted<ul><li><i><b>"+data.rows[0].sumwbnu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxwbnu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgwbnu)+"</i></b> when present</li></ul>"	
		}
		
		// PYNU
		if (data.rows[0].sumpynu > 0 || data.rows[0].sumpynu !== null){
			HTML = HTML + "&nbsp;&nbsp;Pygmy<ul><li><i><b>"+data.rows[0].sumpynu+"</b></i> individuals observed</li><li>Max of <b><i>"+data.rows[0].maxpynu+"</i></b> individuals at one time</li><li>Average of <b><i>"+roundToTwo(data.rows[0].avgpynu)+"</i></b> when present</li></ul>"	
		}

		// NO DATA
		if ((data.rows[0].sumbhnu == 0 || data.rows[0].sumbhnu == null) && (data.rows[0].sumrbnu == 0 || data.rows[0].sumrbnu == null) && (data.rows[0].sumwbnu == 0 || data.rows[0].sumwbnu == null) && (data.rows[0].sumpynu == 0 || data.rows[0].sumpynu == null)){HTML = HTML + "<ul><li><i><b>0</b></i> individuals observed</li></ul>"}	
		
		HTML = HTML + "</fieldset>";	
		
		document.getElementById("CustomReport").innerHTML = HTML;
		
		});	

		var MapQuery = "SELECT * FROM chapterboundaries WHERE name = '"+name+"'";

		sql.getBounds(MapQuery).done(function(bounds) {
		map.fitBounds(bounds);

		var popup = L.popup()
			.setLatLng([((bounds[0][0]+bounds[1][0])/2),((bounds[0][1]+bounds[1][1])/2)])
			.setContent("<b>"+name+"</b>")
			.openOn(map);
		
		});

		sql.execute(MapQuery).done(function(data){
				
		// remove previous
		if (endChapter > 0){sublayersChapter[endChapter-1].remove();}
		endChapter = endChapter + 1;

		
		var CartoCSS = "#chapterboundaries{polygon-opacity:0.2;polygon-fill:#d3d3d3;line-opacity:0.75;line-color:#636363;line-width:2;[zoom < 7]{polygon-opacity:0; line-opacity:0;}}";
		
		  cartodb.createLayer(map, ChapterBoundaries)
		  .addTo(map)
		  .on('done', function(layer) {
			// change the query for the first layer
			var subLayerOptions = {
			  sql: MapQuery,
			  cartocss: CartoCSS,
			}
			var sublayer = layer.getSubLayer(0);
			layer.setZIndex(100);	
			sublayer.set(subLayerOptions);
			sublayersChapter.push(sublayer);
		  }).on('error', function() {
			// log the error
		  });
		})
	}
}


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
	

// clear Grid
function clearGrid(){

	// remove previous
	if (endGrid > 0){sublayersGrid[endGrid-1].remove();}
	endGrid = endGrid + 1;

	
	var MapQueryGrid = "SELECT * FROM cw_grid_2017 WHERE cartodb_id = 1";
	var CartoCSSGrid = "#cw_grid_winter2017{polygon-opacity:0;line-opacity:0;}";
	
	  cartodb.createLayer(map, layerGrid)
	  .addTo(map)
	  .on('done', function(layer) {
		// change the query for the first layer
		var subLayerOptions = {
		  sql: MapQueryGrid,
		  cartocss: CartoCSSGrid,
		}
		var sublayer = layer.getSubLayer(0);
		layer.setZIndex(3);	
		sublayer.set(subLayerOptions);
		sublayersGrid.push(sublayer);
	  }).on('error', function() {
		// log the error
	  });
	  
	  document.getElementById("CSLegend").innerHTML = '';
}



var endGrid = 0;  
var sublayersGrid = [];

// show Grid
function showGrid(){
	var buttonWinter = document.getElementById("radio-1a");

	var HTML1 = "";
	if (buttonWinter.checked){
		HTML1 = HTML1 + "<br><fieldset><legend><b>LEGEND</b></legend><b>"+$("#species7 option:selected").text()+"</b><br>&nbsp;&nbsp;Winter<br><img src='img/Legend_CS.png'></fieldset>";
	}
	else{
		HTML1 = HTML1 + "<br><fieldset><legend><b>LEGEND</b></legend><b>"+$("#species7 option:selected").text()+"</b><br>&nbsp;&nbsp;Summer<br><img src='img/Legend_CS.png'></fieldset>";	
	}

	// remove previous
	if (endGrid > 0){sublayersGrid[endGrid-1].remove();}
	endGrid = endGrid + 1;
	
	/* top pct gain:
	EABL = 0.207712
	MOBL = 0.103450
	WEBL = 0.097801
	BHNU = 0.194322
	PYNU = 0.039877
	RBNU = 0.019282
	WBNU = 0.188850
	*/
	
	// find focal species
	var speciesList = ['eabl','mobl','webl','bhnu','pynu','rbnu','wbnu'];
	var speciesLongList = ['Eastern Bluebird','Mountain Bluebird','Western Bluebird','Brown-headed Nuthatch','Pygmy Nuthatch','Red-breasted Nuthatch','White-breasted Nuthatch'];
	var speciesThreshold_W = [0.207712,0.103450,0.097801,0.194322,0.039877,0.019282,0.188850];
	var speciesThreshold_S = [0.106295,0.091358,0.049869,0.122642,0.046681,0.125337,0.117374];
    
	
	// get species index as selected drop-down
	var selected = $("#species7 option:selected").val();
	
	// switch tabs and accordion
	//$("#tabs").tabs({ active: 2});$("#accordion-2").accordion({ active: 0});
	

	// get season
	if (buttonWinter.checked){
		var MapQueryGrid = "SELECT * FROM cw_grid_2017 WHERE "+speciesList[selected]+" > "+speciesThreshold_W[selected]+" OR "+speciesList[selected]+"_r = 1";
	}
	else {
		var MapQueryGrid = "SELECT * FROM cw_grid_2017 WHERE "+speciesList[selected]+" > "+speciesThreshold_S[selected]+" OR "+speciesList[selected]+"_r = 1";
	}
	


	var CartoCSSGrid = "#cw_grid_2017{polygon-opacity:1;line-opacity:0;polygon-fill: #d3d3d3;line-color: #d3d3d3;}#cw_grid_2017[zoom<6]{polygon-opacity:1;line-opacity:0;}#cw_grid_2017[zoom>=6]{polygon-opacity:0;line-opacity:1;}#cw_grid_2017[zoom=7]{line-width:0.5;}#cw_grid_2017[zoom=7]{line-width:1;}#cw_grid_2017[zoom=8]{line-width:2;}[zoom=9]{line-width:4;}#cw_grid_2017[zoom=10]{line-width:7;}[zoom=11]{line-width:10;}[zoom=12]{line-width:13;}#cw_grid_2017["+speciesList[selected]+" > 0]{polygon-fill: #FFFF00;line-color: #FFFF00;}#cw_grid_2017["+speciesList[selected]+" < 0]{polygon-fill: #002673;line-color:#002673;}";
	
	  cartodb.createLayer(map, layerGrid)
	  .addTo(map)
	  .on('done', function(layer) {
		// change the query for the first layer
		var subLayerOptions = {
		  sql: MapQueryGrid,
		  cartocss: CartoCSSGrid,
		}
		var sublayer = layer.getSubLayer(0);
		layer.setZIndex(3);	
		sublayer.set(subLayerOptions);
		sublayersGrid.push(sublayer);
	  }).on('error', function() {
		// log the error
	  });
	  
	  /*
	  // effort
		cartodb.createLayer(map, layerEffortPts)
		.addTo(map)
        .on('done', function(layer) {
		layer.setZIndex(4);	
		});
	 */
	 
	 document.getElementById("CSLegend").innerHTML = HTML1;
	 
	 // zoom to extent of climate suitability selected
	sql.getBounds(MapQueryGrid).done(function(bounds) {
	map.fitBounds(bounds);
	});
}



// summary AmCharts
function showSummary(){	

	bounds = map.getBounds();
	west = bounds.getWest();
	westStr = west.toString();
	north = bounds.getNorth();
	northStr = north.toString();
	east = bounds.getEast();
	eastStr = east.toString();
	south = bounds.getSouth();
	southStr = south.toString();

	// check year and season
	var button_2016_W = document.getElementById("2016_W");
	var button_2016_S = document.getElementById("2016_S");
	var button_2017_W = document.getElementById("2017_W");
	var button_2017_S = document.getElementById("2017_S");
	var button_2018_W = document.getElementById("2018_W");
	var button_2018_S = document.getElementById("2018_S");
	
	var yearseason = 0;
	var seasonyear = '';
	if (button_2016_W.checked){yearseason = 1;}
	else if (button_2016_S.checked){yearseason = 2;}	
	else if (button_2017_W.checked){yearseason = 3;}	
	else if (button_2017_S.checked){yearseason = 4;}	
	else if (button_2018_W.checked){yearseason = 5;}			
	else{yearseason = 6;}
	
	var sql = new cartodb.SQL({ user: 'gverutes' });
	sql.execute("SELECT sum(eabl) sum_eabl, sum(mobl) sum_mobl, sum(webl) sum_webl, sum(bhnu) sum_bhnu, sum(rbnu) sum_rbnu, sum(wbnu) sum_wbnu, sum(pynu) sum_pynu FROM cw_2016_2017_cmb WHERE the_geom && ST_SetSRID(ST_MakeBox2D(ST_Point("+westStr+", "+northStr+"), ST_Point("+eastStr+", "+southStr+")), 4326) AND survey_id="+yearseason)
	  .done(function(data) {
	

	var chart = AmCharts.makeChart("chartdiv",
	{
		"type": "serial",
		"theme": "light",
		"dataProvider": [{
			"name": "Western",
			"points": data.rows[0].sum_webl,
			"color": "#ec7014",
			"bullet": "img/WEBL_window.png"
		}, {
			"name": "Mountain",
			"points": data.rows[0].sum_mobl,
			"color": "#ec7014",
			"bullet": "img/MOBL_window.png"
		}, {
			"name": "Eastern",
			"points": data.rows[0].sum_eabl,
			"color": "#ec7014",
			"bullet": "img/EABL_window.png"
		}],
		"valueAxes": [{
			"maximum":data.rows[0].sum_mobl+data.rows[0].sum_eabl+data.rows[0].sum_webl+100,
			"minimum": 0,
			"axisAlpha": 0,
			"dashLength": 4,
			"position": "left"
		}],
		"startDuration": 1,
		"graphs": [{
			"balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
			"bulletOffset": 15,
			"bulletSize": 75,
			"colorField": "color",
			"cornerRadiusTop": 8,
			"customBulletField": "bullet",
			"fillAlphas": 0.8,
			"lineAlpha": 0,
			"type": "column",
			"valueField": "points",
			"labelText": "[[value]]",
			"labelPosition": "middle",
		}],
		"marginTop": 0,
		"marginRight": 0,
		"marginLeft": 0,
		"marginBottom": 20,
		"autoMargins": false,
		"categoryField": "name",
		"categoryAxis": {
			"axisAlpha": 0,
			"gridAlpha": 0,
			"inside": true,
			"tickLength": 0
		},
		"export": {
			"enabled": false
		 }
	});		


	var chart2 = AmCharts.makeChart("chartdiv2",
	{
		"type": "serial",
		"theme": "light",
		"dataProvider": [{
			"name": "PY",
			"points": data.rows[0].sum_pynu,
			"color": "#8B4513",
			"bullet": "img/PYNU_window.png"
		}, {			
			"name": "BH",
			"points": data.rows[0].sum_bhnu,
			"color": "#8B4513",
			"bullet": "img/BHNU_window.png"
		}, {
			"name": "RB",
			"points": data.rows[0].sum_rbnu,
			"color": "#8B4513",
			"bullet": "img/RBNU_window.png"
		}, {
			"name": "WB",
			"points": data.rows[0].sum_wbnu,
			"color": "#8B4513",
			"bullet": "img/WBNU_window.png"
		}],
		"valueAxes": [{
			"maximum":data.rows[0].sum_pynu+data.rows[0].sum_rbnu+data.rows[0].sum_bhnu+data.rows[0].sum_wbnu+100,
			"minimum": 0,
			"axisAlpha": 0,
			"dashLength": 4,
			"position": "left"
		}],
		"startDuration": 1,
		"graphs": [{
			"balloonText": "<span style='font-size:13px;'>[[category]]: <b>[[value]]</b></span>",
			"bulletOffset": 15,
			"bulletSize": 75,
			"colorField": "color",
			"cornerRadiusTop": 8,
			"customBulletField": "bullet",
			"fillAlphas": 0.8,
			"lineAlpha": 0,
			"type": "column",
			"valueField": "points",
			"labelText": "[[value]]",
			"labelPosition": "middle",
		}],
		"marginTop": 0,
		"marginRight": 0,
		"marginLeft": 0,
		"marginBottom": 20,
		"autoMargins": false,
		"categoryField": "name",
		"categoryAxis": {
			"axisAlpha": 0,
			"gridAlpha": 0,
			"inside": true,
			"tickLength": 0
		},
		"export": {
			"enabled": false
		 }
	});		
	});
}