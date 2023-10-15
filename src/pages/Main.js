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
		map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
		setMap(kakaoMap);

		//마커 이미지 설정
		var imageSrc = taxi_img,
			imageSize = new kakao.maps.Size(50, 25),
			imageOption = { offset: new kakao.maps.Point(27, 69) };

		var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption),
			markerPosition = new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE,
				process.env.REACT_APP_MAP_LOGITUDE); // 마커가 표시될 위치입니다

		// 마커 이미지 생성합니다
		var marker = new kakao.maps.Marker({
			position: markerPosition,
			image: markerImage // 마커이미지 설정 
		});

		//마커 이미지 지도에 표시
		marker.setMap(kakaoMap);
	}, []);

	return (
		<div id="map" style={{
			width: '100%',
			height: '100vh'
		}}></div>
	);
}
