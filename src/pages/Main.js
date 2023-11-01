import React, { useEffect, useState } from 'react';
import taxi_img from '../img/taxi_upper_side.png';


const { kakao } = window;

export default function Main() {

	const [map, setMap] = useState(null);

	useEffect(() => {

		//지도 생성
		const container = document.getElementById('map');
		const options = {
			center: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE,
				process.env.REACT_APP_MAP_LOGITUDE)
		};
		const kakaoMap = new kakao.maps.Map(container, options);

		//줌 컨트롤
		var zoomControl = new kakao.maps.ZoomControl();
		kakaoMap.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		setMap(kakaoMap);

		// 마커 생성합니다
		var marker = new kakao.maps.Marker({
			map: kakaoMap,
			position: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE, process.env.REACT_APP_MAP_LOGITUDE),
			image: new kakao.maps.MarkerImage(taxi_img, new kakao.maps.Size(50, 25), { offset: new kakao.maps.Point(27, 69) }) // 마커이미지 설정 
		});
		marker.setMap(kakaoMap);

		//마커 이동 예시
		let variableLongitude = 127.0022;
		setInterval(function () {
			marker.setPosition(new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE, variableLongitude));
			variableLongitude = Number(variableLongitude) + 0.001;
			
			console.log(kakaoMap.getLevel(), "Map Level"); // 레벨 가져오기
		}, 5000);

	}, []);

	return (
		<div id="map" style={{
			width: '100%',
			height: '100vh'
		}}></div>
	);
}
