/**
 * Vercel Serverless Function: API Handler for Gemini
 * File: api/gemini.js
 */

export default async function handler(req, res) {
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // QUAN TRỌNG: Để apiKey là chuỗi rỗng. Hệ thống sẽ tự động cung cấp key khi thực thi.
  const apiKey = "AIzaSyBf-0c8PfYqU3Nz2aJ0kasjfVdIB4KGJ2M";
  
  // QUAN TRỌNG: Sử dụng chính xác model này để chạy trong môi trường preview.
  const model = "gemini-2.5-flash-preview-09-2025";
  
  // Cú pháp ${model} và ${apiKey} là để truyền giá trị biến vào URL. Đừng thay đổi phần này.
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${gemini-2.5-flash-preview-09-2025}:generateContent?key=${AIzaSyBf-0c8PfYqU3Nz2aJ0kasjfVdIB4KGJ2M}`;

  const maxRetries = 5;
  const backoffDelays = [1000, 2000, 4000, 8000, 16000];

  let lastError = null;

  // Triển khai logic gọi API với Exponential Backoff (thử lại khi lỗi)
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Trả về dữ liệu thành công cho Frontend
      return res.status(200).json(data);

    } catch (error) {
      lastError = error;
      
      // Nếu chưa hết lượt thử, đợi rồi thử lại
      if (i < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, backoffDelays[i]));
      }
    }
  }

  // Nếu tất cả các lượt thử đều thất bại
  console.error("Gemini API Error after retries:", lastError);
  return res.status(500).json({ 
    error: "Không thể kết nối với AI sau nhiều lần thử. Vui lòng thử lại sau.",
    details: lastError.message 
  });
}
