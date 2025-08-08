// bắt đầu với file home
// là trang dành cho trang chủ, chứa các thông tin tổng quát
// bất cứ file nào cũng phải import các thư viện như thế này

const express = require("express")
const router = express.Router()
const verifyToken = require("./middlewares/auth")
// nạp file HomeController
const UserController = require("../../controllers/UserController")

router.get('/get_information/:userID', UserController.getInformation)

router.post('/sign_in', UserController.sign_in)
router.post('/login', UserController.login)

// phần dưới này nên cho verifyToken là middlewares
router.post('/change_password', UserController.changePassword)
router.put('/update_info', UserController.updateUserInfo)
module.exports = router