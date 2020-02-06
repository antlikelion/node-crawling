const xlsx = require("xlsx");

const workbook = xlsx.readFile("xlsx/data.xlsx");
// xlsx파일을 읽어들인다
// 물론 가짜 xlsx파일을 만들어 놨기 때문에 읽히는 건 없다

const ws = workbook.Sheets.영화목록;

const records = xlsx.utils.sheet_to_json(ws);

records.forEach((record, index) => {
  console.log(index, r.제목, r.링크);
});

// 위와 아래는 동일한 기능을 함

for (const [index, record] of records.entries()) {
  // 자바스크립트 객체.entries()를 쓰면 내부 배열이 [key, value]모양 배열로 바뀐다
  console.log(index, record);
}
