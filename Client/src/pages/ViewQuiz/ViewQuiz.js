import React from 'react';
import {Link} from 'react-router';

let ajax = require('superagent');


class ViewQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            isLoading: false,
            quizName: ''
        };
	}

	componentWillMount() {
        console.log('mounting view quiz cmp');
        let urlstrpart = encodeURIComponent(this.props.params.name);
        this.setState({isLoading: true, quizName: urlstrpart});
        // console.log(this.props);
        // console.log(this.props.params.name);
        // this.setState({quizName: this.props.params.name})
        // let currLocc = this.props.location.pathname;
		// console.log(currLocc);
		// console.log(this.props.location);

        let fetchQuizUrl = '/fetch/quiz/' + encodeURI(urlstrpart);
        console.log(fetchQuizUrl);
        ajax.get(fetchQuizUrl)
        	.end((error, response) => {
          		if (!error && response) {
                    // console.log(JSON.parse(response.text));
	              	// this.setState({
	                // 	quizs: JSON.parse(response.text),
                    //     searchQuizs: JSON.parse(response.text)
	            	// });
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
