/*
 * @AddData.js
 */
"use strict";


let AddDataHelper = require('./AddDataHelper');

class AddData {

    constructor() {
        this.ahelper = new AddDataHelper();
		// methods
        this.AddQuizBasicInfo = this.AddQuizBasicInfo.bind(this);
        this.AddQuestions = this.AddQuestions.bind(this);
    }
    /*  @route: /new/quiz/basic
     *     - POST
     */
    AddQuizBasicInfo(req, res) {
        console.log('AddQuizBasicInfo');
        res.setHeader('Content-Type', 'application/json');

        return this.ahelper.addQuizBasicInfo(req.body)
                      .then(result => {
                            console.log(result);
                            return res.status(200).json(result);
                      }).catch(err => {
                            console.log(err);
                            return res.sendStatus(400);
                      });
    }

    /*  @route: /new/questions/:name/:pwd
     *     - POST
     */
    AddQuestions(req, res) {
        console.log('AddQuestions');
        res.setHeader('Content-Type', 'application/json');

        return this.ahelper.addQuestions(req, res)
                      .then(result => {
                            return res.sendStatus(200);
                      }).catch(err => {
                            console.log(err);
                            return res.sendStatus(400);
                      });
    }


}

module.exports = AddData;
