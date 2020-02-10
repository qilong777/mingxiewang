const db = require('../tools/db.js');
const { createVerifyImg, Email } = require('../tools/base.js');

//用户登录
let login = async (req, res) => {
  let { username, password, verify } = req.body;
  if (verify != req.session.verifyImg) {
    res.send({
      status: -2,
      msg: "验证码错误"
    });
    return;
  }
  let sql = "select * from user where (username=? or email=?) and password=?";
  let data = [username, username, password];
  let result = await db.base(sql, data);

  if (result.length == 1) {
    req.session.username = result[0].username;
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

//自动登录
let autologin = async (req, res) => {
  let userInfo = JSON.parse(req.cookies.userInfo)
  let { username, password } = userInfo;
  let sql = "select * from user where (username=? or email=?) and password=?";
  let data = [username, username, password];
  let result = await db.base(sql, data);

  if (result.length == 1) {
    req.session.username = username;
    res.send({
      status: 1,
      msg: "登录成功"
    });
  } else {
    res.send({
      status: 0,
      msg: "用户信息失效"
    });
  }

}

//判断是否已经登录
let islogined = async (req, res) => {
  if (req.session.username) {
    res.send({
      msg: "获取用户信息成功",
      status: 1,
      data: req.session.username
    })
  } else {
    res.send({
      msg: "获取用户信息失败",
      status: 0
    })
  }
}

//用户注册
let register = async (req, res) => {
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

//退出登录
let logout = async (req, res) => {
  req.session.username = '';
  res.send({
    msg: "退出成功",
    status: 1
  })
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
  let sql = "select * from user where email=?";
  let data = [email];
  let result = await db.base(sql, data);
  if (result.length) {
    res.send({
      msg: "该邮箱已注册，请重新输入",
      status: 0
    });
    return;
  }


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
    from: '名鞋网 1635889910@qq.com',
    to: email,
    subject: '名鞋网注册邮箱验证码',
    text: '验证码为：' + verify + ' 请不要把该验证码发送给他人'
  }
  Email.transporter.sendMail(mailOptions, err => {
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
  autologin,
  islogined,
  register,
  logout,
  verifyImg,
  verifyEmail
}