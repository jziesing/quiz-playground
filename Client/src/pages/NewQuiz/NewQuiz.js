import React from 'react';

let ajax = require('superagent');


class NewQuiz extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
            isLoading: false,
            name: '',
			description: '',
			quiz_pwd: '',
            errormsg: '',
            successmsg: ''
        };
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
	}

	handleFormChange(event) {
		console.log(this.state);
        switch(event.target.id) {
            case 'name':
                this.setState({name: event.target.value});
                break;
			case 'description':
                this.setState({description: event.target.value});
                break;
			case 'quiz_pwd':
                this.setState({quiz_pwd: event.target.value});
                break;
        }
	}
	validateForm() {
		if(this.state.name.length > 1) {
			this.setState({errormsg: ''});
			return true;
		} else {
			return false;
		}
	}
	addErrors() {
		this.setState({errormsg: 'Please add the Quiz name.  The name must be longer than 1 character'});
	}
	handleFormSubmit(event) {
        event.preventDefault();
		this.setState({isLoading: true});
		if(this.validateForm()) {
			let contactEndUrl = '/new/account/';
			ajax.post(contactEndUrl)
				.set({ 'Content-Type': 'application/json' })
				.send(this.state)
				.end((error, response) => {
                    this.setState({isLoading: false});
                    if(!error && response.status == 200) {
                        console.log('success');
                        console.log(response);
						this.setState({
                            isLoading: false,
                            name: '',
							successmsg: 'Success! Account added.',
                            errormsg: ''
						});
                    } else {
                        console.log('fail');
                        console.log(error);
                        this.setState({
                            isLoading: false,
                            name: '',
							successmsg: '',
                            errormsg: 'something went wrong, please try again.'
						})
                    }
                });
		} else {
			this.addErrors();
			this.setState({isLoading: false});
		}
	}
    msgMarkup() {
        if(this.state.errormsg != '') {
            return (
                <div class="alert alert-danger" role="alert">
                    { this.state.errormsg }
                </div>
            );
        } else if(this.state.successmsg != '') {
            return (
                <div class="alert alert-success" role="alert">
                    { this.state.successmsg }
                </div>
            );
        }
    }
	markup() {
		if(this.state.isLoading) {
			return (
				<form class="form-horizontal" action="">
					<div class="col-sm-offset-4 col-sm-4">
						<i class="fa fa-spinner fa-spin loadingCon" />
					</div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-cSend disabled">Send</button>
						</div>
					</div>
				</form>
			);
		} else {
			return (
				<form class="form-horizontal" action="" onSubmit={this.handleFormSubmit}>
                    <div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Name</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="name" placeholder="quiz name" onChange={this.handleFormChange} value={this.state.name} />
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Description</label>
                        <div class="col-sm-10">
                            <textarea rows="4" type="text" class="form-control" id="description" placeholder="quiz description" onChange={this.handleFormChange} value={this.state.description} ></textarea>
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Picture</label>
                        <div class="col-sm-10">
                            <input type="file" name="quizPic" id="quizPic"  />
                        </div>
                    </div>
					<div class="form-group">
                        <label for="message" class="col-sm-2 control-label">Quiz Admin Password to Edit</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" id="quiz_pwd" placeholder="quiz admin password" onChange={this.handleFormChange} value={this.state.quiz_pwd} />
                        </div>
                    </div>
					<div class="form-group">
						<div class="col-sm-offset-2 col-sm-10">
							<button type="submit" class="btn btn-cSend">Save &amp; Next</button>
						</div>
					</div>
				</form>
			);
		}
	}

	render() {


		return (
			<div>
				<div class="row">
	                <div class="text-center">
	                    <h1>Add a new Quiz</h1>
	                </div>
		    	</div>
                { this.msgMarkup() }
				{ this.markup() }
			</div>
		);
	}
}

export default NewQuiz;
