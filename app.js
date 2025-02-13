// 初始化地图
const map = L.map('map').setView([35.0, 105.0], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 数据存储
let markers = JSON.parse(localStorage.getItem('travelMemories')) || [];

// 自定义爱心图标
const heartIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// 加载已有标记
function loadMarkers() {
    markers.forEach(marker => {
        const popupContent = `
            <b>${marker.name}</b><br>
            ${marker.province}·${marker.city}<br>
            ${marker.date}<br>
            ${marker.memo}
        `;
        
        L.marker([marker.lat, marker.lng], {icon: heartIcon})
         .addTo(map)
         .bindPopup(popupContent);
    });
}

// 表单提交
document.getElementById('addForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // 获取地理编码（这里使用Nominatim API）
    const address = `${document.getElementById('province').value} ${document.getElementById('city').value}`;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const data = await response.json();
    
    if(data.length > 0) {
        const newMarker = {
            name: document.getElementById('name').value,
            province: document.getElementById('province').value,
            city: document.getElementById('city').value,
            date: document.getElementById('date').value,
            memo: document.getElementById('memo').value,
            lat: data[0].lat,
            lng: data[0].lon
        };
        
        markers.push(newMarker);
        localStorage.setItem('travelMemories', JSON.stringify(markers));
        location.reload();
    } else {
        alert('找不到该位置！');
    }
});

// 初始化加载
loadMarkers();