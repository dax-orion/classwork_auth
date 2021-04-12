"use strict";

const Course = require("../models/course");

module.exports = {
    index: (req, res, next) => {
        Course.find()
        .then(courses => {
            res.locals.courses = courses;
            next();
        })
        .catch(error => {
            console.error(`Error fetching course data: ${error.message}`);
            next(error);
        })
    },
    indexView: (req, res) => {
        res.render("courses/index");
    },
    new: (req, res) => {
        res.render("courses/new");
    },
    create: (req, res, next) => {
        let newCourse = new Course({
            title: req.body.title,
            description: req.body.description,
            maxStudents: req.body.maxStudents,
            cost: req.body.cost
        });
        Course.create(newCourse)
        .then(course => {
            res.locals.course = course;
            res.locals.redirect = `/courses/${course._id}`;
            next();
        })
        .catch(error => {
            console.error(`Error saving user: ${error.message}`);
            next(error);
        });
    },
    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if(redirectPath != undefined) res.redirect(redirectPath);
        else next();
    },
    show: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
        .then(course => {
            res.locals.course = course;
            next();
        })
        .catch(error => {
            console.error(`Error fetching course by ID: ${error.message}`);
            next(error);
        });
    },
    showView: (req, res) => {
        res.render("courses/show");
    },
    edit: (req, res, next) => {
        let courseId = req.params.id;
        Course.findById(courseId)
        .then(course => {
            res.render("courses/edit", {course: course});
        })
        .catch(error => {
            console.error(`Error fetching course by ID: ${error.message}`);
            next(error);
        });
    },
    update: (req, res, next) => {
        let courseId = req.params.id;
        let updatedCourse = {
            title: req.body.title,
            description: req.body.description,
            maxStudents: req.body.maxStudents,
            cost: req.body.cost
        }
        Course.findByIdAndUpdate(courseId, updatedCourse)
        .then(course => {
            res.locals.course = course;
            res.locals.redirect = `/courses/${course._id}`;
            next();
        })
        .catch(error => {
            console.error(`Error fetching course by ID: ${error.message}`);
            next(error);
        });
    },
    delete: (req, res, next) => {
        let courseId = req.params.id;
        Course.findByIdAndRemove(courseId)
        .then(course => {
            res.locals.redirect = "/courses";
            next();
        })
        .catch(error => {
            console.error(`Error fetching course by ID: ${error.message}`);
            next(error);
        });
    }
}