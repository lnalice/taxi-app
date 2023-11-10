import React, { useEffect, useState, useRef} from 'react';

const { kakao } = window;

export default function Main() {

	const [map, setMap] = useState(null);

	var index = 0;
	var customOverlayMarker;
	var prevDegree;

	const seoulLocation = [
		[37.47955935212742, 126.94312011533331],
		[37.47957794314708, 126.94431852476892],
		[37.4795004314708, 126.94500852476892],
		[37.47941636191352, 126.94560751248083],
		[37.47930006191352, 126.94600751248083],
		[37.47929101942485, 126.94737131425384],
		[37.47918344574943, 126.94861503023887],
		[37.47905783879834, 126.94985875471353],
		[37.47891412357071, 126.95092159430716],
		[37.478824505208976, 126.95209745291311],
		[37.47922106798528, 126.95239115132607],
		[37.48068981242196, 126.95263895259016],
		[37.481347302479165, 126.95202800554102],
		[37.48152707261361, 126.95097641620833],
		[37.48164376757, 126.94993617012781],
		[37.48177844906954, 126.9488393774952],
		[37.48188603004106, 126.94760692504032],
		[37.48196653708894, 126.9463066509525],
		[37.48209213806814, 126.94513070990521],
		[37.48213213806814, 126.94413070990521],
		[37.482235768949664, 126.94399997659112],
		[37.48235238061101, 126.94291448472713],
	]

	const headingDeg = async function ([beforeX, beforeY], [nextX, nextY]) {
		var rad = Math.atan2(nextY - beforeY, nextX - beforeX);
		return (rad*180)/Math.PI ;
	}

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
		
		//커스텀 오버레이 이동
		setInterval(async function interval () {
			if (customOverlayMarker) customOverlayMarker.setMap(null);
			
			if (index < seoulLocation.length) {
				let [lat, lon] = seoulLocation[index];
				// console.log(lat, lon, "lan / lon");

				var deg = await headingDeg((index>0)? seoulLocation[index-1] : seoulLocation[index], seoulLocation[index])-90;
				console.log(deg, "heading");

				if (index > 0) {
					customOverlayMarker = new kakao.maps.CustomOverlay({
						position: new kakao.maps.LatLng(process.env.REACT_APP_MAP_LATITUDE, process.env.REACT_APP_MAP_LOGITUDE),
						content: `<img src="/taxi_upper_side.png" style="width:40px;height:20px;transform:rotate(${deg}deg);">`
					})
				}
				if (customOverlayMarker) {
					customOverlayMarker.setMap(kakaoMap);
					await customOverlayMarker.setPosition(new kakao.maps.LatLng(lat, lon));
				}

				index++;
				// console.log(index, "index");

			} else {
				clearInterval(interval); // 배열의 끝에 도달하면 타이머 종료
			}
	
		}, 5000);
	}, []);


	return (
		<div id="map" style={{
			width: '100%',
			height: '100vh'
		}}></div>
	);
}
