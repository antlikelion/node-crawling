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
          const text = await page.evaluate(() => {
            const score = document.querySelector(
              ".score.score_left .star_score"
            );
            const score2 = document.querySelector(
              ".score.score_left .star_score"
            );
            // window와 document는 evaluate메서드 안에서만 사용 가능하다
            // https://try-puppeteer.appspot.com/
            // 여기서 퍼페티어 코드를 실험해볼 수도 있다
            // 이미지를 안 가져와서 크롤링 속도를 높일 수도 있다;;
            // 심지어 크롤링한 페이지를 스크린샷으로 저장하거나 pdf로도 저장 가능함;;

            if (score) {
              // return {
              //   score: score.textContent,
              //   score2: score2.textContent
              // };
              // 결국 이 return값이 상단에 선언한 text변수의 값이 되는 것!!
              return score.textContent;
            }
          });
          if (result) {
            console.log(record[0], "평점", text.trim());
            result[i] = [record[0], record[1], text.trim()];
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
