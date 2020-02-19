const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

// const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  //headless를 true로 설정하면, 브라우저를 뒷단에서 실행함
  //어차피 크롤러는 서버(백엔드 에플리케이션)에서 돌아가는 것이기 때문
  //(이 때는 콘솔을 찍어주던가 해서 크롤러가 실행되고 있다는 것을 확인해주자)
  //개발 단계에서만 false로 설정하여 직접 돌아가는 것을 확인하는 것
  // (config에서 관리해주면 될 듯)
  //참고로 headless값을 설정하지 않으면 디폴트 값이 true이다.
  //await은 프로미스가 resolve되기를 기다리는 것!

  //그런데 애초에 탭을 여러개 연다는 것 자체가 여러 작업을 동시에 하기 위함인데
  //순차대로 실행하는 것은 매우 비효율적이다.
  // 그래서 아래와 같이 프로미스 올을 활용해준다
  const [page, page2, page3] = await Promise.all([
    browser.newPage(),
    browser.newPage(),
    browser.newPage()
  ]);
  await Promise.all([
    page.goto("https://zerocho.com"),
    page2.goto("https://naver.com"),
    page3.goto("https://google.com")
  ]);
  await Promise.all([
    page.waitFor(3000),
    page2.waitFor(1000),
    page3.waitFor(2000)
  ]);
  // 끄는 작업은 그다지 시간이 걸리지 않기 때문에 굳이 프로미스 올을 써줄 이유가 없다
  await page.close();
  await page2.close();
  await page3.close();
  await browser.close();
  // 13.브라우저를 끈다(메모리 관리를 위함)
};
crawler();
