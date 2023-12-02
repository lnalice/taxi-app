import React, { useEffect, useState, useRef } from 'react';
import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { fetchData } from '../utils/DriverData.js';
import { createTaxiOverlay } from '../utils/TaxiOverlay.js';

//------------------------BUSSAMPLE-----------------------------
// const driver = require('/data/driver/driver.json');
//--------------------------------------------------------------

const { kakao } = window;


export default function Main() {

	const [map, setMap] = useState(null);

	const [listening, setListening] = useState(false)
	const [gotMessage, setGotMessage] = useState(false)

	var index = 0;
	var markers = []
	var kakaoMap


	useEffect(() => {
		//지도 생성
		const container = document.getElementById('map');
		const options = {
			center: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE,
				process.env.REACT_APP_MAP_LOGITUDE),
		};
		kakaoMap = new kakao.maps.Map(container, options);
		kakaoMap.setLevel(5);

		var zoomControl = new kakao.maps.ZoomControl();
		kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		setMap(kakaoMap);

		fetchData().then((result) => {
			for (var i = 0; i < result.length; i++) {
				createTaxiOverlay(result[i].driver, kakaoMap)
			}
			console.log("done")
			// setMarkers(kakaoMap);
		});
		
		moveOverlay(kakaoMap);
		
		//마커 배열
		// for (var i = 0; i < driver.length; i++) {
		// 	addOverlay(i, kakaoMap);
		// }

		//markers[i]
		// var personHi = new kakao.maps.CustomOverlay({
		// 	map: kakaoMap,
		// 	position: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE,
		// 		process.env.REACT_APP_MAP_LOGITUDE),
		// 	content: `<img src="/person_hi.png" style="width:100px;z-index:220">`
		// })
		// personHi.setMap(kakaoMap);

		// var person = new kakao.maps.CustomOverlay({
		// 	map: kakaoMap,
		// 	position: new kakao.maps.LatLng(driver[30].lat, driver[40].lng),
		// 	content: `<img src="/person.png" style="width:100px;z-index:250">`
		// })
		// person.setMap(kakaoMap);

		// var pin_icon = new kakao.maps.CustomOverlay({
		// 	map: kakaoMap,
		// 	position: new kakao.maps.LatLng(37.27646400284229, 127.00299362821762),
		// 	content: `<img src="/pickup.png" style="width:100px;z-index:400">`
		// })
		// pin_icon.setMap(kakaoMap);

		// var arrival = new kakao.maps.CustomOverlay({
		// 	map: kakaoMap,
		// 	position: new kakao.maps.LatLng(37.301396781329345, 127.03076748942133),
		// 	content: `<img src="/arrival.png" style="width:120px;z-index:250">`
		// })
		// arrival.setMap(kakaoMap);

	}, []);


	async function createTaxiOverlay(driverObject, kakaoMap) {
		var location = driverObject.currentLocation;
		var driverID = driverObject.driverID.toString();
		var routeID = driverID.substr(0, 2);
		var pathID = parseInt(driverObject.pathID);
		var status = driverObject.status;

		const response = await fetch(`/data/route/bus${routeID}.json`);
		const route = await response.json();

		var deg = await headingDeg(
			(pathID -1 > 0) ?
			[route[pathID - 2]["latitude"], route[pathID - 2]["longitude"]]
			: [route[pathID -1]["latitude"], route[pathID -1]["longitude"]],
		[route[pathID -1]["latitude"], route[pathID -1]["longitude"]]) - 90;

		var marker = new kakao.maps.CustomOverlay({
			position: new kakao.maps.LatLng(route[pathID-1]["latitude"], route[pathID-1]["longitude"]),
			content: `<img src="/taxi_upper_side.png" style="width:40px;height:20px;transform:rotate(${deg}deg);z-index:100;">`,
		})
		var markerObject = {
			"marker" : marker,
			"driverObject" : driverObject
		}
		markerObject["marker"].setMap(kakaoMap);
		markers.push(markerObject);
	}

	async function headingDeg([beforeX, beforeY], [nextX, nextY]) {
		var rad = Math.atan2(nextY - beforeY, nextX - beforeX);
		return (rad * 180) / Math.PI;
	}

	function moveOverlay(kakaoMap) {

		setInterval(async function interval() {

			//삭제 후 pathID 업데이트하고 이동
			for (var i = 0; i < markers.length; i++) {
				markers[i]["marker"].setMap(null);
				var driver = markers[i];
				markers.splice(i, 1);

				let newDriverObject = driver.driverObject;
				var status =  newDriverObject.status;
				var driverID =  newDriverObject.driverID.toString();
				var routeID =  driverID.substr(0, 2);
				var pathID =  parseInt(newDriverObject["pathID"]);
				
				const response = await fetch(`/data/route/bus${routeID}.json`);
				const route = await response.json();

				if(pathID >= route.length)  newDriverObject["pathID"] = 1;
				else newDriverObject["pathID"]++;
				
				createTaxiOverlay(newDriverObject, kakaoMap);
			}

		}, 5000);
	}

	return (
		<div id="map" style={{
			width: '100%',
			height: '100vh'
		}}></div>
	);
}