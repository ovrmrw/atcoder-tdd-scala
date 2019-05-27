const fs = require('fs');
const path = require('path');

const [, , _category = '', _contest = ''] = process.argv;

if (!_category || !_contest) {
  throw new Error('Execute command with 2 args for CategoryName and ContenstName.');
}

const tasks = ['A', 'B', 'C', 'D'];

const category = _category.toLowerCase();
const contest = _contest.toUpperCase();

const templateDir = path.join(process.cwd(), 'templates/atcoder');

const taskDir = path.join(process.cwd(), 'src/main/scala', category.replace(/\./g, '/'));
const testDir = path.join(process.cwd(), 'src/test/scala', category.replace(/\./g, '/'));

const taskTeamplateSrc = fs.readFileSync(path.join(templateDir, 'task.scala.template')).toString();
const testTeamplateSrc = fs.readFileSync(path.join(templateDir, 'test.scala.template')).toString();

function makeDir(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

function createTaskFiles() {
  makeDir(taskDir);
  tasks
    .map(task => contest + task)
    .map(contestTask => {
      const src = taskTeamplateSrc
        .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
        .replace(new RegExp(`{{TASK_PACKAGE}}`, 'g'), contestTask);
      return { path: path.join(taskDir, `${contestTask}.scala`), src };
    })
    .forEach(({ path, src }) => {
      if (!fs.existsSync(path)) {
        fs.writeFileSync(path, src);
        console.log('file generated:', path);
      } else {
        console.log('file exists:', path);
      }
    });
}

function createTestFile() {
  makeDir(testDir);
  let src = testTeamplateSrc
    .replace(new RegExp(`{{CATEGORY_PACKAGE}}`, 'g'), category)
    .replace(new RegExp(`{{TEST_CLASS}}`, 'g'), `${contest}Test`);
  for (let task of tasks) {
    src = src.replace(new RegExp(`{{TASK_${task}_PACKAGE}}`, 'g'), `${contest}${task}`);
  }
  const _path = path.join(testDir, `${contest}Test.scala`);
  if (!fs.existsSync(_path)) {
    fs.writeFileSync(_path, src);
    console.log('file generated:', _path);
  } else {
    console.log('file exists:', _path);
  }
}

createTaskFiles();
createTestFile();
