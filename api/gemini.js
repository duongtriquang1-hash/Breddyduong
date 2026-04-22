// api/gemini.js

module.exports = async function handler(req, res) {
  // 1. Cấu hình CORS (Cross-Origin Resource Sharing)
  // Cho phép frontend ở các domain khác có thể gọi được API này
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', 'https://breddyduong.vercel.app/'); // Trong thực tế, bạn nên thay '*' bằng domain frontend của bạn (VD: 'https://my-app.com')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // 2. Xử lý preflight request (Trình duyệt tự động gửi OPTIONS trước khi POST)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 3. Chỉ cho phép gọi bằng method POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Vui lòng sử dụng POST request.' });
  }

  try {
    // 4. Lấy câu hỏi (prompt) từ Frontend gửi lên
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Thiếu trường "prompt" trong dữ liệu gửi lên.' });
    }

    // 5. Lấy API Key từ biến môi trường (Environment Variables) của Vercel
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: 'Chưa cấu hình biến môi trường GEMINI_API_KEY trên Vercel.' });
    }

    // 6. Gọi sang API của Google Gemini
    // Sử dụng model gemini-2.5-flash (model tiêu chuẩn và nhanh nhất hiện tại)
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${AIzaSyAHhittTt3xwIkyVriNFWL4iGfHww-OBnM}`;

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();

    // 7. Trả kết quả từ Gemini về lại cho Frontend
    return res.status(200).json(data);

  } catch (error) {
    console.error('Lỗi khi gọi API Gemini:', error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi phía Server.' });
  }
};
