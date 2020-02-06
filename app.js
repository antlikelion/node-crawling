const parse = require("csv-parse/lib/sync");
const fs = require("fs");
// csv파일을 읽기 위함

const csv = fs.readFileSync("csv/data.csv");
// csv파일의 형식은 버퍼이다.
// 버퍼는 이진수 0과 1로 이루어진 컴퓨터 친화적인 데이터이다
const csvToString = csv.toString("utf-8");
// 버퍼를 문자열로 바꿔줌
// utf-8은 인코딩
const records = parse(csvToString);
// csv-parse의 parse메서드가 문자열을 2차원 배열로 변환
records.forEach((record, index) => {
  console.log(index, record);
});
