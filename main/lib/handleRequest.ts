import * as request from 'request';
import * as inquirer from "inquirer";

const {get} = request;

export const configHandler = (choicesList: { name: string, value: string }[] = []) => [
  {
    type: 'checkbox',
    message: '请选择创建项目类型',
    name: 'select',
    choices: choicesList,
    validate: function (answer) {
      if (answer.length !== 1) {
        return '只能选择一个初始化项目模板';
      }
      return true;
    }
  }
];

const handleRequest = () => {
  return new Promise((resolve, reject) => {
    get({
      url: 'https://api.github.com/users/art-cli-template/repos',
      headers: {
        'User-Agent': 'request'
      },
    }, (error, res, body) => {
      if (error) reject(error);
      if (body) resolve(body);
    })
  })
};

export const handleResponseSource = (res: any[]) => {
  if (typeof res === 'string') res = JSON.parse(res);

  return res.map(item => ({
    value: item.name,
    name: item.description,
  }))
};

export default handleRequest


