const xlsx = require("xlsx");
const puppeteer = require("puppeteer");
const add_to_sheet = require("./add_to_sheet");

const workbook = xlsx.readFile("xlsx/data.xlsx");
const ws = workbook.Sheets.영화목록;
const records = xlsx.utils.sheet_to_json(ws);

const crawler = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    //사람이 직접 하는 것처럼 속이기 위해 먼저 페이지를 띄우고,
    await page.setUserAgent(
      "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.106 Mobile Safari/537.36"
    );
    //크롬 브라우저의 개발자 도구 콘솔에서 navigator.userAgent를 친 값을 설정해준다
    //(물론 이것만으로 모든 페이지를 뚫을 수 있는 것은 아니지만 이것만으로도 많은 페이지가 뚫린다)
    //(참고로 포스트맨의 userAgent는 postman이다)
    //아래의 반복문으로 페이지를 여러번 넘나든다
    add_to_sheet(ws, "C1", "s", "평점"); //여기서 s는 string을 의미
    for (const [index, record] of records.entries) {
      //이렇게 for문 뒤에 await이 위치하면 await이 resolve되기 전까지
      //다음 루프를 돌지 않는다
      await page.goto(record.링크);
      console.log(await page.evaluate("navigator.userAgent"));
      //이걸로 상단에서 setUserAgent가 잘 작동했는지 확인한다
      const text = await page.evaluate(() => {
        const score = document.querySelector(".score.score_left .star_score");
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
      if (text) {
        console.log(record.제목, "평점", text.trim());
        const newCell = "C" + (index + 2);
        add_to_sheet(ws, newCell, "n", parseFloat(text.trim())); //여기서 n은 number이다.
      }
      await page.waitFor(1000);
      //사람이 하는 것처럼 속이기 위해 1초씩 기다림
      //정 속도를 빠르게 하고 싶다고 한다면 서버를 여러대를 만들어 사람이 여러명인척 해도 된다
    }
    await page.close();
    //페이지를 안 닫아주면 에러가 날 수도 있음
    await browser.close();
    xlsx.writeFile(workbook, "xlsx/result.xlsx");
    console.error(crawlError);
  } catch (error) {
    console.error(error);
  }
};
crawler();
