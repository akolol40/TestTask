const express = require('express')
const router = express.Router()
const passport = require('../passport/passport')
const apiVerison = 'v1'
const controller = require('../controller/controller')

router.post('/'+apiVerison+'/login', controller.loginIn);
router.post('/'+apiVerison+'/reg', controller.regestration);
router.post('/'+apiVerison+'/delAddr', passport.authenticate('jwt', {session: false}), controller.delAddr)
router.post('/'+apiVerison+'/addAddr', passport.authenticate('jwt', {session: false}), controller.addTableData)
router.post('/'+apiVerison+'/updateTable', passport.authenticate('jwt', {session: false}), controller.UpdateTable)

router.get('/'+apiVerison+'/info', passport.authenticate('jwt', {session: false}), controller.getUserInfo)
router.get('/'+apiVerison+'/getlist', passport.authenticate('jwt', {session: false}), controller.listAdressWithUser)
router.get('/'+apiVerison+'/getAllList', passport.authenticate('jwt', {session: false}), controller.listAdressAll)


module.exports = router