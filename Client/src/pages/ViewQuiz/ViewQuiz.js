import React from 'react';
import {Link} from 'react-router';

let ajax = require('superagent');


class ViewQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            isLoading: false,
            quizName: '',
			id: '',
			sfid: '',
			description__c: '',
			edit_password__c: '',
			picture_url__c: ''
        };
	}

	componentWillMount() {
        console.log('mounting view quiz cmp');
        this.setState({isLoading: true, quizName: this.props.params.name});

        let fetchQuizUrl = '/fetch/quiz/' + encodeURI(this.props.params.name);
        console.log(fetchQuizUrl);
        ajax.get(fetchQuizUrl)
        	.end((error, response) => {
          		if (!error && response) {
                    console.log(JSON.parse(response.text));
					let respObj = JSON.parse(response.text);
	              	this.setState({
	                	isLoading: false,
                        quizName: respObj[0].name,
						id: respObj[0].id,
						sfid: respObj[0].sfid,
						description__c: respObj[0].description__c,
						edit_password__c: respObj[0].edit_password__c,
						picture_url__c: respObj[0].picture_url__c
	            	});
          		} else {
              		console.log(`Error fetching data`, error);
          		}
        	});
    }

	render() {


		return (
			<div>
				<div class="row">
	                <div class="text-center">
	                    <h1>View a Quiz</h1>
	                </div>
		    	</div>
                <div class="row">
	                <div class="text-left">
	                    <Link to='/'><h3>Back</h3></Link>
	                </div>
                    <div class="text-center">
	                    <h1>{this.state.quizName}</h1>
	                </div>
		    	</div>
			</div>
		);
	}
}

export default ViewQuiz;
