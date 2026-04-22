// api/gemini.js

export default async function handler(req, res) {
  // 1. Cấu hình CORS (Cross-Origin Resource Sharing)
  // Cho phép frontend ở các domain khác có thể gọi được API này
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://breddyduong-qr0dvx15s-duongtriquang1-hashs-projects.vercel.app/'); // Trong thực tế, bạn nên thay '*' bằng domain frontend của bạn (VD: 'https://my-app.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-
