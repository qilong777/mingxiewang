const db = require('../tools/db.js');
const { createVerifyImg, Email } = require('../tools/base.js');

//用户登录
let login = async (req, res) => {
  let { username, password } = req.body;
  let sql = "select * from user where (username=? or email=?) and password=?";
  let data = [username, username, password];
  let result = await db.base(sql, data);

  if (result.length == 1) {
    req.session.username = username;
    res.send({
      status: 1,
      msg: "登录成功"
    });
    return;
  }
  sql = "select * from user where username=? or email=?";
  result = await db.base(sql, data);
  if (result.length == 1) {
    res.send({
      status: 0,
      msg: "密码错误"
    });
  } else {
    res.send({
      status: -1,
      msg: "账号不存在"
    });
  }
}

//用户注册
let register = async (req, res, next) => {
  let { username, password, email, verify } = req.body;

  if (email !== req.session.email || verify !== req.session.verify) {
    res.send({
      msg: '验证码错误',
      status: 0
    });
    return;
  }

  if ((Email.time - req.session.time) / 1000 > 30) {
    res.send({
      msg: '验证码已过期，请重新发送验证码',
      status: 0
    });
    return;
  }

  //检查用户名是否被注册
  let sql = "select * from user where username=?";
  let result = await db.base(sql, [username]);
  if (result.length == 1) {
    res.send({
      msg: "注册失败,用户名已被注册",
      status: -1
    })
    return;
  }
  //检查邮箱是否被注册
  sql = "select * from user where email=?";
  result = await db.base(sql, [email]);
  if (result.length == 1) {
    res.send({
      msg: "注册失败,邮箱已被注册",
      status: -2
    })
    return;
  }

  //插入数据库
  sql = "insert into user set?";
  result = await db.base(sql, { username, password, email });

  if (result.affectedRows == 1) {
    res.send({
      msg: "注册成功",
      status: 1
    })
  } else {
    res.send({
      msg: "未知原因注册失败",
      status: -3
    })
  }

}

let getUser = async (req, res) => {
  console.log(req.query.name);

  if (req.session.username) {
    res.send({
      msg: "获取用户信息成功",
      status: 1,
    })
  } else {
    res.send({
      msg: "获取用户信息失败",
      status: 0
    })
  }
}


//获取图形验证码
let verifyImg = async (req, res) => {
  let result = await createVerifyImg(req, res);
  if (result) {
    res.send(result);
  }
}


//发送邮箱验证码
let verifyEmail = async (req, res) => {
  let email = req.query.email;
  let verify = Email.verify;
  let time = Email.time;

  req.session.verify = verify;
  req.session.email = email;

  if (req.session.time && (time - req.session.time) / 1000 <= 30) {
    res.send({
      msg: "验证码已发送,请等30s再重发",
      status: 0
    });
    return;
  }

  let mailOptions = {
    from: '康爱网 1635889910@qq.com',
    to: email,
    subject: '康爱网注册邮箱验证码',
    text: '验证码为：' + verify + ' 请不要把该验证码发送给他人'
  }
  await Email.transporter.sendMail(mailOptions, err => {
    if (err) {
      res.send({
        msg: "验证码发送失败",
        status: 0
      });
    } else {
      req.session.time = time;
      res.send({
        msg: "验证码发送成功",
        status: 1
      });
    }
  });
}

module.exports = {
  login,
  register,
  getUser,
  verifyImg,
  verifyEmail
}