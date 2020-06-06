const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const puppeteer = require('puppeteer');

const [username, password] = (process.env.ATCODER_AUTH || process.env.ATCODER || ',').split(',').map(s => s.trim());
if (username) console.log('Username is given.');
if (password) console.log('Password is given.');

const [, , _url = ''] = process.argv;
assert(/atcoder\.jp\/contests/.test(_url), 'AtCoder contest page url must be passed.');

const taskTopPageUrl = getTaskUrl(_url);
console.log({ taskTopPageUrl });

const templateDir = path.join(process.cwd(), 'templates/atcoder');
const taskTemplateSrc = fs.readFileSync(path.join(templateDir, 'task.scala.template')).toString();
const testTemplateSrc = fs.readFileSync(path.join(templateDir, 'test.scala.template')).toString();

const taskListSelector = 'div#main-container table tbody tr td:nth-child(2) a';
const inputOutputFirstSelector = 'div#task-statement span.lang-en div.div-btn-copy + pre';
const inputOutputSecondSelector = 'div#task-statement div.div-btn-copy + pre';

async function main() {
  const results = await crawl();
  if (results.length === 0) {
    throw new Error('Crawling is failed.');
  }

  const category = taskTopPageUrl
    .split('/')
    .reverse()
    .slice(1, 2)[0]
    .replace(/-/g, '_');
  const testClass = category.toUpperCase() + 'Test';
  const taskDir = path.join(process.cwd(), 'src/main/scala', category.replace(/\./g, '/'));
  const testDir = path.join(process.cwd(), 'src/test/scala', category.replace(/\./g, '/'));

  const generateTaskFiles = () => {
    makeDir(taskDir);
    results.forEach(([title, url]) => {
      const taskPackage = url
        .split('/')
        .reverse()[0]
        .toUpperCase();
      const src = taskTemplateSrc
        .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
        .replace(new RegExp(`{{TASK_PACKAGE}}`, 'g'), taskPackage)
        .replace(new RegExp(`{{TASK_TITLE}}`, 'g'), title);
      const _path = path.join(taskDir, `${taskPackage}.scala`);
      if (!fs.existsSync(_path)) {
        fs.writeFileSync(_path, src);
        console.log('File generated:', _path);
      } else {
        console.log('File exists:', _path);
      }
    });
  };
  generateTaskFiles();

  const generateTestFile = () => {
    makeDir(testDir);
    let firstTaskName = null;
    const describes = results
      .map(([, url, inputOutput]) => {
        const taskName = url
          .split('/')
          .reverse()[0]
          .split('_')
          .reverse()[0]
          .toUpperCase();
        if (!firstTaskName) firstTaskName = taskName;
        const taskPackage = url
          .split('/')
          .reverse()[0]
          .toUpperCase();
        return getDescribe(taskName, taskPackage, inputOutput);
      })
      .map(s => s.trim())
      .join('\n\n  ');
    const src = testTemplateSrc
      .replace(new RegExp(`{{DESCRIBES}}`), describes)
      .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
      .replace(new RegExp(`{{TEST_CLASS}}`, 'g'), testClass)
      .replace(new RegExp(`{{FIRST_TASK_NAME}}`, 'g'), firstTaskName);
    const _path = path.join(testDir, `${testClass}.scala`);
    if (!fs.existsSync(_path)) {
      fs.writeFileSync(_path, src);
      console.log('File generated:', _path);
    } else {
      console.log('File exists:', _path);
    }
  };
  generateTestFile();
}

async function crawl() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  if (username && password) {
    console.log('Getting data with login ...');
    await page.goto('https://atcoder.jp/login?continue=' + encodeURIComponent(taskTopPageUrl));
    await page.type('input#username', username);
    await page.type('input#password', password);
    await page.click('button#submit');
    await page.waitForSelector('div#main-container');
  } else {
    console.log('Getting data without login ...');
    await page.goto(taskTopPageUrl);
  }
  const tasks = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector)).map(el => [el.text, el.href]);
  }, taskListSelector);
  console.log({ tasks });
  const results = [];
  for (let [taskTitle, taskUrl] of tasks) {
    results.push(await getInputOutputFromTaskPage(browser, taskTitle, taskUrl));
  }
  console.log({ results });
  await browser.close();
  return results;
}

async function getInputOutputFromTaskPage(browser, taskTitle, taskUrl) {
  const subPage = await browser.newPage();
  await subPage.goto(taskUrl);
  const inputOutput = await subPage.evaluate(
    (firstSelector, secondSelector) => {
      let list = Array.from(document.querySelectorAll(firstSelector))
        .map(e => e.innerText)
        .reduce((acc, v, i) => {
          let j = Math.floor(i / 2);
          if (!acc[j]) acc[j] = [];
          acc[j].push(v.trim().replace(/\n/g, '\\n'));
          return acc;
        }, []);
      if (list.length === 0)
        list = Array.from(document.querySelectorAll(secondSelector))
          .map(e => e.innerText)
          .reduce((acc, v, i) => {
            let j = Math.floor(i / 2);
            if (!acc[j]) acc[j] = [];
            acc[j].push(v.trim().replace(/\n/g, '\\n'));
            return acc;
          }, []);
      return JSON.stringify(list);
    },
    inputOutputFirstSelector,
    inputOutputSecondSelector,
  );
  await subPage.close();
  return [taskTitle, taskUrl, inputOutput];
}

function getTaskUrl(url) {
  const u = new URL(url);
  return /\/tasks$/.test(u.pathname) ? u.href : u.origin + u.pathname.replace(/\/$/, '') + '/tasks';
}

function makeDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function getDescribe(taskName, taskPackage, inputOutput) {
  return `
  describe("${taskName}") {
    val json =
      """
        |${inputOutput}
      """.stripMargin
    val customParams = List()
    testWrapper("${taskName}", ${taskPackage}.Main.solve, json, customParams)
  }
  `;
}

main().catch(console.error);
