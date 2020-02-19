const parse = require("csv-parse/lib/sync");
const stringify = require("csv-stringify/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

const csv = fs.readFileSync("csv/data.csv");
const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  try {
    const result = [];
    const browser = await puppeteer.launch({ headless: false });

    await Promise.all(
      records.map(async (record, index) => {
        try {
          const page = await browser.newPage();
          await page.goto(record[1]);
          const scoreEl = await page.$(".score.score_left .star_score");
          // $는 태그를 찾는 메서드이다
          if (scoreEl) {
            const text = await page.evaluate(tag => tag.textContent, scoreEl);
            // 찾은 태그의 텍스트를 뱉어낸다. 여기서 tag인자는 scoreEl을 의미한다
            // 즉, evaluate의 두번째 인자는 $로 잡아낸 태그이고, 첫번째 인자는 그 태그를 처리하는 콜백 함수
            console.log(record[0], "평점", text.trim());
            result[index] = [record[0], record[1], text.trim()];
            // result자체가 배열이기 때문에 이렇게 넣어주면 2차원 배열이 된다
            // 또한 인덱스를 지정해서 저장해주므로 이러면 for of처럼 순서도 보장된다.
          }
          await page.close();
          //페이지를 안 닫아주면 에러가 날 수도 있음
          const str = stringify(result);
          //2차원 배열을 문자열로 만들어주고,
          fs.writeFileSync("csv/result.csv", str);
          //그 문자열을 해당 경로의 csv파일로 만들어준다.
        } catch (crawlError) {
          console.error(crawlError);
        }
      })
    );
  } catch (error) {
    console.error(error);
  }
};
crawler();
