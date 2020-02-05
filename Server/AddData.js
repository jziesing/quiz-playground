/*
 * @AddData.js
 */
"use strict";


// let AddDataHelper = require('./AddDataHelper');
// const { Client } = require('pg');

let AddDataHelper = require('./AddDataHelper'),
    { Client } = require('pg'),
    multer = require('multer'),
    multerS3 = require('multer-s3'),
    AWS = require("aws-sdk");

var s3  = new AWS.S3({
  accessKeyId: process.env.HDRIVE_S3_ACCESS_KEY,
  secretAccessKey: process.env.HDRIVE_S3_SECRET_KEY,
  region: 'us-east-1'
});

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
        console.log('AddQuizBasicInfo');
        res.setHeader('Content-Type', 'application/json');

        var fileDateName = new Date().toJSON().replace(/-/g,'_').replace(/:/g,'-').replace(/\./g,'--')  + '.csv';

        var upload = multer({
            storage: multerS3({
                s3: s3,
                bucket: 'quiz-playground',
                key: 'quizs/' + req.body.id  + '/questions/' + fileDateName
            })
        });




        upload.array('upl',1)

        return res.sendStatus(200);

        // return this.ahelper.addQuizBasicInfo(req.body)
        //               .then(result => {
        //                     console.log(result);
        //                     return res.status(200).json(result);
        //               }).catch(err => {
        //                     console.log(err);
        //                     return res.sendStatus(400);
        //               });
    }


}

module.exports = AddData;
