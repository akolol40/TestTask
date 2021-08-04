const bcrypt = require('bcryptjs')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const Table = require('../model/Table')
const passport = require('passport')

genToken = user => {
    return jwt.sign({
        iss: 'Mihael_kharadjidi',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),
        email: user.email,
        fio: user.fio
    }, 'kristik') 
}
//Получение фио ( я сохранил его в токине, для простоты, но в идеале так делать нельзя, не знаю почему, но так думаю)
exports.getUserInfo = async(req, res) => {
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, 'kristik');
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        return res.status(200).json({fio: decoded.fio})
    }
    return res.send(500);
}
//Вывод всех элементов из бд
exports.listTable = async(req, res) => {
    await Table.aggregate([
        {
          $group: {
            "_id": '$_id',
            title: {'$last': "$addr"},
            v: {'$last':'$_v'}
          }
        }
      ]).exec((err, result) => {
        res.status(200).json(result.reverse())
      })
}
//Удаление по айди
exports.delAddr = async(req, res) => {
    const {id} = req.body 
    await Table.deleteOne({_id: id}).then((tabl, status) => {
        res.status(200).json({status: tabl})
    })
}
//Обновление адреса
exports.UpdateTable = async(req, res) => {
    const {name} = req.body
    Table.updateOne({name: name}).then(async(table) =>{
        table.addr = name
        await table.save()
        res.status(200).json({status:"Ok" , message: 'update'})
    })
}

//добавление адреса
exports.addTableData = async(req, res) => {
    const {addr} = req.body

    await Table.findOne({addr: addr}).then(async (row) => {
        if (row) {
            res.status(404).json({status:"error" , message: 'Адрес уже существует'})
        } else {
            const newAddr = new Table({
                addr: addr
            })
            await newAddr.save()
            res.status(200).json({status:'ok'})
        }
    })
}

exports.regestration = async(req, res) => {
    const {email,  pwd, fio, phone} = req.body
    if (email === undefined   )
    {
        res.status(404).json({status:"error" , message: 'Incorrect user data'})
    } else 
    {
        await User.findOne({email: email}).then(async user => {
            if (user) {
                console.log(user)
                res.status(404).json({status:"error" , message: 'Email alredy exits'})
            } else 
            {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(pwd , salt, async (err, hash) => {
                        if (err) console.log(err);
                            const newUser = new User({
                                email, 
                                fio,
                                phone,
                            })
                            newUser.pwd = hash
                    
                            const token = genToken(newUser)
                            await newUser.save()
                            
                            res.status(200).json({status:"ok" , message: 'null', token: token})
                   
                    })
                })     

            }
        })
    }
}

exports.loginIn = (req, res, next) => {
    passport.authenticate('local', (err,user , info) => {
        if (err) {
            return next(err);
          }
          if (!user) {
            return res.status(404).json({status:"error" , message: 'Incorrect username/password'})
          }
          req.logIn(user, (err) => {
              if (err) next(err)
              const token = genToken(user)
              return res.status(200).json({status:"success" , message: 'ok', token: token, id: user._id})          
          }) 
    })(req, res, next)   
}