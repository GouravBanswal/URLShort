const { adminGetAllUsers, adminUpdateUsers, adminGetUsersUrls } = require("../controllers/adminController")

const router = require("express").Router()

router
      .get("/user", adminGetAllUsers )
      .put("/user/:userId", adminUpdateUsers )
      .get("/user/url/:userId", adminGetUsersUrls )


      module.exports = router