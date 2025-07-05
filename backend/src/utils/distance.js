// Tính khoảng cách giữa 2 điểm tọa độ (km)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Bán kính Trái Đất (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// Kiểm tra phạm vi giao hàng (giới hạn trong TP.HCM)
const checkDeliveryRange = (storeLocation, deliveryLocation, maxDistance = 15) => {
  const distance = calculateDistance(
    storeLocation.coordinates[1], // lat1
    storeLocation.coordinates[0], // lon1
    deliveryLocation.coordinates[1], // lat2
    deliveryLocation.coordinates[0] // lon2
  );
  
  return {
    isInRange: distance <= maxDistance,
    distance: Math.round(distance * 100) / 100, // Làm tròn 2 chữ số thập phân
    maxDistance
  };
};

// Tính phí giao hàng dựa trên khoảng cách
const calculateDeliveryFee = (distance) => {
  if (distance <= 3) return 15000; // 3km đầu: 15k
  if (distance <= 7) return 20000; // 3-7km: 20k
  if (distance <= 12) return 25000; // 7-12km: 25k
  return 30000; // >12km: 30k
};

// Tìm cửa hàng gần nhất trong phạm vi giao hàng
const findNearestStore = (stores, deliveryLocation, maxDistance = 15) => {
  let nearestStore = null;
  let minDistance = Infinity;
  
  for (const store of stores) {
    const distance = calculateDistance(
      store.location.coordinates[1],
      store.location.coordinates[0],
      deliveryLocation.coordinates[1],
      deliveryLocation.coordinates[0]
    );
    
    if (distance <= maxDistance && distance < minDistance) {
      minDistance = distance;
      nearestStore = { ...store.toObject(), distance };
    }
  }
  
  return nearestStore;
};

module.exports = {
  calculateDistance,
  checkDeliveryRange,
  calculateDeliveryFee,
  findNearestStore
}; 