// curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY" \
// -H 'Content-Type: application/json' \
// -X POST \
// -d '{
//   "contents": [{
//     "parts":[{"text": "Explain how AI works"}]
//     }]
//    }'
export type Step = {
  title: string;
  content: string;
  codeKey: string;
};
const getContentAI = async (promt: string) => {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDWyp4_p1PTbBE8ToH_TzBNozkoHIEIdzs",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: promt }],
          },
        ],
      }),
    }
  );
  const data: any = await response.json();

  return data.candidates[0].content.parts[0].text;
};

export const analyzeCode = async (code: string) => {
  const promt = `Bạn là một Senior Developer giàu kinh nghiệm. Hãy phân tích đoạn code sau và cung cấp đánh giá chi tiết:  

${code}  

### Yêu cầu:  
- Phân tích mã theo từng bước, chỉ ra cách hoạt động của từng phần.  
- Nếu có lỗi hoặc có thể tối ưu, hãy đề xuất cách cải thiện.  
- Cung cấp ví dụ code nếu cần thiết.  

### Định dạng câu trả lời:  
Trả lời dưới dạng một mảng JSON với cấu trúc sau:  
\`\`\`json
[
  {
    "title": "Tiêu đề bước 1",
    "content": "Giải thích chi tiết về bước 1, bao gồm chức năng của mã và các điểm cần lưu ý.",
    "codeKey": "Đoạn mã chính liên quan đến bước 1 (nếu có)"
  },
  {
    "title": "Tiêu đề bước 2",
    "content": "Giải thích chi tiết về bước 2, bao gồm chức năng của mã và các điểm cần lưu ý.",
    "codeKey": "Đoạn mã chính liên quan đến bước 2 (nếu có)"
  },
  ...
]`;
  const content = await getContentAI(promt);

  const startIndex = content.indexOf("[");
  const endIndex = content.lastIndexOf("]") + 1;
  const jsonContent = content.substring(startIndex, endIndex);
  const steps: Step[] = JSON.parse(jsonContent);

  return steps;
};
