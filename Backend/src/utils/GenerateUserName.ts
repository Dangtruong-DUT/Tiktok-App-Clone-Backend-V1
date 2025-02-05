export default function generateTimeBasedUsername() {
    const timestamp = Date.now().toString().slice(-6) // Lấy 6 chữ số cuối của timestamp
    const random = Math.floor(10 + Math.random() * 90) // 2 số ngẫu nhiên
    return `User${timestamp}${random}`
}
