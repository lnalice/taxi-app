import React, { useEffect, useState, useRef } from 'react';

//------------------------BUSSAMPLE-----------------------------
const driver = require('../data/driver.json');
//--------------------------------------------------------------

const { kakao } = window;

export default function Main() {

	const [map, setMap] = useState(null);

	var index = 0;
	var markers = []
	var kakaoMap

	const headingDeg = async function ([beforeX, beforeY], [nextX, nextY]) {
		var rad = Math.atan2(nextY - beforeY, nextX - beforeX);
		return (rad * 180) / Math.PI;
	}

	useEffect(() => {
		//지도 생성
		const container = document.getElementById('map');
		const options = {
			center: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE,
				process.env.REACT_APP_MAP_LOGITUDE),
			
		};
		kakaoMap = new kakao.maps.Map(container, options);
		kakaoMap.setLevel(5);

		//줌 컨트롤
		var zoomControl = new kakao.maps.ZoomControl();
		kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		setMap(kakaoMap);

		//마커 배열
		for (let i = 0; i< driver.length; i++){
			addOverlay(i, kakaoMap);
		}
		setMarkers(kakaoMap);

	}, []);

	async function addOverlay(i, kakaoMap) {
		var deg = await headingDeg(
			(i > 0) ?
				[driver[i-1].lat, driver[i-1].lng]
				: [driver[i].lat, driver[i].lng],
			[driver[i].lat, driver[i].lng]) - 90;
		// console.log(deg, "heading");
		// console.log(driver[i].lat, driver[i].lng, "driver[i].lat, driver[i].lng");

		var marker = new kakao.maps.CustomOverlay({
			map: kakaoMap,
			position: new kakao.maps.LatLng(driver[i].lat, driver[i].lng),
			content: `<img src="/taxi_upper_side.png" style="width:34px;height:17px;transform:rotate(${deg}deg);">`
		})
		marker.setMap(kakaoMap);
		markers.push(marker);
	}

	function setMarkers(kakaoMap) {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(kakaoMap);
		}
	}

	function moveOverlay(driver,kakaoMap, customOverlayMarker) {

		//커스텀 오버레이 이동
		setInterval(async function interval() {
			if (customOverlayMarker) customOverlayMarker.setMap(null);

			if (i < driver.length) {
				var deg = await headingDeg(
					(i > 0) ?
						[driver[i-1].lat, driver[i-1].lng]
						: [driver[i].lat, driver[i].lng],
					[driver[i].lat, driver[i].lng]) - 90;
				console.log(deg, "heading");

				if (i > 0) {
					customOverlayMarker = new kakao.maps.CustomOverlay({
						position: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE, process.env.REACT_APP_MAP_LOGITUDE),
						content: `<img src="/taxi_upper_side.png" style="width:40px;height:20px;transform:rotate(${deg}deg);">`
					})
				}
				if (customOverlayMarker) {
					customOverlayMarker.setMap(kakaoMap);
					await customOverlayMarker.setPosition(new kakao.maps.LatLng(lat, lon));
				}

				i++;
			} else {
				clearInterval(interval); 
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
