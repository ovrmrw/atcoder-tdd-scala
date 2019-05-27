const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const puppeteer = require('puppeteer');

const [, , _url = ''] = process.argv;
if (!/atcoder\.jp\/contests/.test(_url)) {
  throw new Error('An AtCoder contest page url must be given.');
}

const taskTopPageUrl = getTaskUrl(_url);
console.log({ taskTopPageUrl });

const templateDir = path.join(process.cwd(), 'templates/atcoder');
const taskTeamplateSrc = fs.readFileSync(path.join(templateDir, 'task.scala.template')).toString();
const testTeamplateSrc = fs.readFileSync(path.join(templateDir, 'test.scala.template')).toString();

const taskListSelector = 'div#main-container table tbody tr td:nth-child(2) a';
const inputOutputSelector = 'span.lang-en div.div-btn-copy + pre';

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
      const src = taskTeamplateSrc
        .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
        .replace(new RegExp(`{{TASK_PACKAGE}}`, 'g'), taskPackage)
        .replace(new RegExp(`{{TASK_TITLE}}`, 'g'), title);
      const _path = path.join(taskDir, `${taskPackage}.scala`);
      if (!fs.existsSync(_path)) {
        fs.writeFileSync(_path, src);
        console.log('file generated:', _path);
      } else {
        console.log('file exists:', _path);
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
    const src = testTeamplateSrc
      .replace(new RegExp(`{{DESCRIBES}}`), describes)
      .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
      .replace(new RegExp(`{{TEST_CLASS}}`, 'g'), testClass)
      .replace(new RegExp(`{{FIRST_TASK_NAME}}`, 'g'), firstTaskName);
    const _path = path.join(testDir, `${testClass}.scala`);
    if (!fs.existsSync(_path)) {
      fs.writeFileSync(_path, src);
      console.log('file generated:', _path);
    } else {
      console.log('file exists:', _path);
    }
  };
  generateTestFile();
}

async function crawl() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(taskTopPageUrl);
  const tasks = await page.evaluate(selector => {
    return Array.from(document.querySelectorAll(selector)).map(el => [el.text, el.href]);
  }, taskListSelector);
  console.log({ tasks });
  const results = await Promise.all(
    tasks.map(([taskTitle, taskUrl]) => getInputOutputFromTaskPage(browser, taskTitle, taskUrl)),
  );
  console.log({ results });
  await browser.close();
  return results;
}

async function getInputOutputFromTaskPage(browser, taskTitle, taskUrl) {
  const subPage = await browser.newPage();
  await subPage.goto(taskUrl);
  const inputOutput = await subPage.evaluate(selector => {
    return JSON.stringify(
      Array.from(document.querySelectorAll(selector))
        .map(e => e.innerText)
        .reduce((acc, v, i) => {
          let j = Math.floor(i / 2);
          if (!acc[j]) acc[j] = [];
          acc[j].push(v.trim().replace(/\n/g, '\\n'));
          return acc;
        }, []),
    );
  }, inputOutputSelector);
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
