/*
 * @AddDataHelper.js
 */
"use strict";

const { Client } = require('pg');


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
                if (err){
                    reject();
                }
                currclient.end();
                resolve(res.rows);
            });
        });

    }

}

module.exports = AddDataHelper;
