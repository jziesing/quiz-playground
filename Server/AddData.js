/*
 * @AddData.js
 */
"use strict";


let AddDataHelper = require('./AddDataHelper');
const { Client } = require('pg');

class AddData {

    constructor() {
        this.ahelper = new AddDataHelper();
		// methods
        this.AddQuizBasicInfo = this.AddQuizBasicInfo.bind(this);
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


}

module.exports = AddData;
