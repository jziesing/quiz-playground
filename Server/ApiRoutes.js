/*
 * @ApiRoutes.js
 */
"use strict";


let express = require('express'),
    FetchData = require('./FetchData'),
    ApiRoutes = express.Router(),
    DataFetcher = new FetchData();



/*
 *  routes
 */
// add account
// ApiRoutes.post("/new/account/", PubAddAccount.AddAccountPost);

// get quizs
ApiRoutes.get("/fetch/quizs/", DataFetcher.FetchQuizs);
// get quiz
ApiRoutes.get("/fetch/quiz/:name", DataFetcher.FetchQuiz);

/*
 * export
 */
module.exports = ApiRoutes;
