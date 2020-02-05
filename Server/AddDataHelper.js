/*
 * @AddDataHelper.js
 */
"use strict";

const { Client } = require('pg');
var AWS = require("aws-sdk");

var s3  = new AWS.S3({
  accessKeyId: process.env.HDRIVE_S3_ACCESS_KEY,
  secretAccessKey: process.env.HDRIVE_S3_SECRET_KEY,
  region: 'us-east-1'
});




class AddDataHelper {

    constructor() {
		// methods
        this.addQuizBasicInfo = this.addQuizBasicInfo.bind(this);
    }

    addQuizBasicInfo(basic_info) {
        return new Promise((resolve, reject) => {

            let currclient = new Client({
                connectionString: process.env.DATABASE_URL,
                ssl: true,
            });
            console.log('basic_info');
            console.log(basic_info);

            currclient.connect();

            currclient.query('INSERT INTO salesforce.quiz__c(name, description__c, edit_password__c) VALUES($1, $2, $3) RETURNING *;', [basic_info.name, basic_info.description__c, basic_info.edit_password__c],(err, res) => {
                if(err) {
                    reject();
                }

                console.log('csccc');
                console.log(process.env.HDRIVE_S3_SECRET_KEY);

                s3.putObject({
                    Key: 'quizs/' + res.rows[0]["id"] + '/info',
                    Bucket: 'quiz-playground',
                    Body:  Buffer.from('quiz name: ' + res.rows[0]["name"] + ',  password: ' + res.rows[0]["edit_password__c"], 'utf8')
                }, (errorr, data) => {
                    if(errorr) {
                        console.log('s3 errr');
                        reject(errorr);
                    } else {
                        console.log('s3 successs');
                        console.log(data);
                        currclient.end();
                        resolve(res.rows);
                    }
                });
            });
        });

    }

}

module.exports = AddDataHelper;
