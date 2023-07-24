const { Router } = require('express');
const express = require("express");

const pokemonRouter = require("../routes/pokemonRouter");
const tiposRouter = require('./tiposRouter');

const router = Router();
router.use(express.json());

router.use("/pokemon", pokemonRouter)
router.use("/types", tiposRouter)

module.exports = router;
