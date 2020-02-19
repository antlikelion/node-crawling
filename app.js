const parse = require("csv-parse/lib/sync");
const fs = require("fs");
const puppeteer = require("puppeteer");

// const csv = fs.readFileSync("csv/data.csv");
// const records = parse(csv.toString("utf-8"));

const crawler = async () => {
  const browser = await puppeteer.launch({ headless: false });
  //await은 프로미스가 resolve되기를 기다리는 것!
  const page = await browser.newPage();
  // 1.브라우저를 띄우고
  const page2 = await browser.newPage();
  // 2.새 탭을 띄우고
  const page3 = await browser.newPage();
  // 3.새 탭을 띄우고
  await page.goto("https://zerocho.com");
  // 4.첫번째 탭에서 제로초로 이동한다
  await page2.goto("https://naver.com");
  // 5.두번째 탭에서 제로초로 이동한다
  await page3.goto("https://google.com");
  // 6.세번째 탭에서 제로초로 이동한다
  await page.waitFor(3000);
  // 7.첫번째 탭을 띄우고 3초 기다린다.
  await page2.waitFor(1000);
  // 8.두번째 탭을 띄우고 1초 기다린다.
  await page3.waitFor(2000);
  // 9.세번째 탭을 띄우고 2초 기다린다.
  await page.close();
  // 10.첫번째 탭을 끈다(메모리 관리를 위함)
  await page2.close();
  // 11.두번째 탭을 끈다(메모리 관리를 위함)
  await page3.close();
  // 12.세번째 탭을 끈다(메모리 관리를 위함)
  await browser.close();
  // 13.브라우저를 끈다(메모리 관리를 위함)
};
crawler();
