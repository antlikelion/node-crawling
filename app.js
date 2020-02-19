const xlsx = require("xlsx");
const axios = require("axios");
// ajax라이브러리
// ajax로 요청을 해서 페이지에 대한 html을 응답으로 받아냄
const cheerio = require("cheerio");
// html파싱

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
// for of문은 await과 함께 쓰면 순서가 보장된다

const crawler = async () => {
  for (const [index, element] of records.entries()) {
    const response = await axios.get(element.링크);
    if (response.status === 200) {
      const html = response.data;
      const $ = cheerio.load(html);
      const text = $(".score.score_left .star_score").text();
      //.text()가 태그는 무시하고 텍스트만 긁어옴
      console.log(element.제목, "평점~", text.trim());
    }
  }
  // await Promise.all(
  //   records.map(async element => {
  //     const response = await axios.get(element.링크);
  //     //페이지(html)를 요청하는 코드
  //     if (response.status === 200) {
  //       const html = response.data;
  //       const $ = cheerio.load(html);
  //       const text = $(".score.score_left .star_score").text();
  //       console.log(element.제목, "평점", text.trim());
  //     }
  //   })
  // );
};
crawler();
