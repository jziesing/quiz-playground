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
// get quiz to edit
ApiRoutes.get("/fetch/quiz-edit/:name/:pwd", DataFetcher.FetchQuizEdit);
// add quiz
ApiRoutes.post("/new/quiz/basic", DataAdder.AddQuizBasicInfo);
// add questions
ApiRoutes.post("/new/questions/:name/:pwd", DataAdder.AddQuestions);

/*
 * export
 */
module.exports = ApiRoutes;
