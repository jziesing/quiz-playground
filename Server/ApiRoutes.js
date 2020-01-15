/*
 * @ApiRoutes.js
 */
"use strict";


let express = require('express'),
    FetchData = require('./FetchData'),
    AddData = require('./AddData'),
    ApiRoutes = express.Router(),
    DataFetcher = new FetchData(),
    DataAdder = new AddData();



/*
 *  routes
 */
// add account
// ApiRoutes.post("/new/account/", PubAddAccount.AddAccountPost);

// get quizs
ApiRoutes.get("/fetch/quizs/", DataFetcher.FetchQuizs);
// get quiz
ApiRoutes.get("/fetch/quiz/:name", DataFetcher.FetchQuiz);
// add quiz
ApiRoutes.post("/new/quiz/basic", DataAdder.AddQuizBasicInfo);

/*
 * export
 */
module.exports = ApiRoutes;
