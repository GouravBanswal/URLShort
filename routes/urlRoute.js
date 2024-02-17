const { getlongUrl } = require("../controllers/urlController")

const router = require("express").Router()

router
      .get("/:shortUrl", getlongUrl)


      module.exports = router