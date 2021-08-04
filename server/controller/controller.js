const bcrypt = require('bcryptjs')
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const House = require('../model/House')
const passport = require('passport')

genToken = user => {
    return jwt.sign({
        iss: 'Mihael_kharadjidi',
        sub: user._id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1),

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
      if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, 'kristik');
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        await House.aggregate([
            {$match: {userId: decoded.sub}},
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
}
//Удаление по айди
exports.delAddr = async(req, res) => {
    const {id} = req.body 
    await House.deleteOne({_id: id}).then((tabl, status) => {
        res.status(200).json({status: tabl})
    })
}
//Обновление адреса
exports.UpdateTable = async(req, res) => {
    const {id, name} = req.body
    await House.findByIdAndUpdate({_id: id}, {addr: name}, {upsert: true}, function(err, doc) {
        if (err) return res.status(500).json({err: err});
        return res.status(200).json({status: 'ok'})
    });
}

//добавление адреса
exports.addTableData = async(req, res) => {
    const {addr} = req.body
    if (req.headers && req.headers.authorization) {
        let authorization = req.headers.authorization.split(' ')[1],
            decoded;
        try {
            decoded = jwt.verify(authorization, 'kristik');
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        
                const newAddr = new House({
                    addr: addr,
                    userId: decoded.sub
                })
                await newAddr.save()
                res.status(200).json({status:'ok',id: newAddr._id})
         

    }
    return res.send(500);

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