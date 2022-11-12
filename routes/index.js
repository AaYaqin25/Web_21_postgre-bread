var express = require('express');
const Manipulation = require('../models/user')
const moment = require('moment')
var router = express.Router();

module.exports = function (db) {
  router.get("/", function (req, res, next) {
    const page = parseInt(req.query.page) || 1
    const word = req.query
    const link = req.url
    Manipulation.read(db, page, word, link, (value, jumlahPage, offset, url) =>{
      res.render("index", {value, moment, page, jumlahPage, offset, query : word, url})
    })
  });

  router.get("/add", function (req, res, next) {
    res.render("formadd")
  });

  router.post("/add", function (req, res, next) {
    const {string, integer, float, date, boolean} = req.body;
    Manipulation.add(db, string, integer, float, date, boolean, () => {
      res.redirect("/")
    })
  });

  router.get("/delete/:id", function (req, res, next) {
    const id = req.params.id;
    Manipulation.delete(db, id, () => {
      res.redirect("/")
    })
  })

  router.get("/edit/:id", function (req, res, next) {
    const id = req.params.id;
    Manipulation.showUpdate(db, id, (data) => {
      res.render("formedit", {data, moment})
    })
  })

  router.post("/edit/:id", function (req, res, next) {
    const id = req.params.id
    const {string, integer, float, date, boolean} = req.body;
    Manipulation.update(db, string, integer, float, date, boolean, id, () => {
      res.redirect("/")
    })
  });

  return router;
}