"use strict";


let React = require('react'),
    ReactRouter = require('react-router'),
    Router = ReactRouter.Router,
    Route = ReactRouter.Route,
    IndexRoute = ReactRouter.IndexRoute,
    browserHistory = ReactRouter.browserHistory,
    Layout = require("./pages/Layout/Layout.js"),
    QuizPlayground = require("./pages/QuizPlayground/QuizPlayground.js"),
    NewQuiz = require("./pages/NewQuiz/NewQuiz.js"),
    ViewQuiz = require("./pages/ViewQuiz/ViewQuiz.js");



module.exports = (
	<Router history={browserHistory} >
        <Route path="/" component={Layout}>
            <IndexRoute component={QuizPlayground} />
            <Route path="new" component={NewQuiz} />
            <Route path="view/:name" component={ViewQuiz} />
        </Route>
    </Router>
);
