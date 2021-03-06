/*
 * @ContactRoutes.js
 */
"use strict";


let FetchDataHelper = require('./FetchDataHelper');
const { Client } = require('pg');

class FetchData {

    constructor() {
        this.ahelper = new FetchDataHelper();
		// methods
        this.FetchQuizs = this.FetchQuizs.bind(this);
        this.FetchQuiz = this.FetchQuiz.bind(this);
        this.FetchQuizEdit = this.FetchQuizEdit.bind(this);
    }
    /*  @route: /fetch/quizs/
     *     - GET
     */
    FetchQuizs(req, res) {
        console.log('FetchQuizsGet');
        res.setHeader('Content-Type', 'application/json');

        return this.ahelper.fetchQuizs()
                      .then(result => {
                            console.log(result);
                            return res.status(200).json(result);
                      }).catch(err => {
                            console.log(err);
                            return res.sendStatus(400);
                      });
    }
    /*  @route: /fetch/quiz/:name
     *     - GET
     */
    FetchQuiz(req, res) {
        console.log('FetchQuizGet');
        res.setHeader('Content-Type', 'application/json');

        console.log('params');
        console.log(req.params.name);
        return this.ahelper.fetchQuiz(req.params.name)
                      .then(result => {
                            console.log(result);
                            return res.status(200).json(result);
                      }).catch(err => {
                            console.log(err);
                            return res.sendStatus(400);
                      });
    }
    /*  @route: /fetch/quiz-edit/:name/:pwd
     *     - GET
     */
    FetchQuizEdit(req, res) {
        console.log('FetchQuizEditGet');
        res.setHeader('Content-Type', 'application/json');

        console.log('params');
        console.log(req.params.name);
        return this.ahelper.fetchQuizEdit(req.params.name, req.params.pwd)
                      .then(result => {
                            console.log(result);
                            return res.status(200).json(result);
                      }).catch(err => {
                            console.log(err);
                            return res.sendStatus(400);
                      });
    }


}

module.exports = FetchData;
