'use strict';

var gulp = require('gulp');

var jshint = require('gulp-jshint'),
	jshintReporter = require('jshint-stylish'),
	watch = require('gulp-watch'),
	shell = require('gulp-shell');

var sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    jade = require('gulp-jade');


var paths = {
	'scripts':{
		front: {
			sources: [
				'./bower_components/modernizr/modernizr.js',
				'./bower_components/jquery/dist/jquery.js',
				'./bower_components/jquery-placeholder/jquery.placeholder.js',
				'./bower_components/jquery.cookie/jquery.cookie.js',
				'./bower_components/fastclick/lib/fastclick.js',
				'./bower_components/foundation/js/foundation/foundation.js',
				'./bower_components/foundation/js/foundation/foundation.dropdown.js',
				'./bower_components/foundation/js/foundation/foundation.topbar.js',
				'./public/js/custom/*.js'
			],
			output: {
				folder: './public/js/',
				mainScriptsFile: 'scripts.js'
			}
		}
	},
	'style': {
		all: './public/styles/**/*.scss',
		output: './public/styles/'
	},
	'jadeFiles': {
		templates: [
			'./public/**/*.jade',
		]
	},
	'html': {
		distFolder: './public/',
		distFiles: './public/**/*.html'
	}	


};


// ----------   LINT   -----
// 
// gulp.task('lintBack', function(){
// 	gulp.src(paths.scripts.back)
// 		.pipe(jshint())
// 		.pipe(jshint.reporter(jshintReporter));
// });


// ----------   SASS   -----
// 
gulp.task('sass:dev', function () {
  gulp.src(paths.style.all)
	.pipe(sourcemaps.init())
	.pipe(sass({includePaths: [ './public/styles/foundation' ]}).on('error', sass.logError))
	.pipe(gulp.dest(paths.style.output))
	.pipe(livereload());
});
 
gulp.task('sass:build',function () {
  gulp.src(paths.style.all)
    .pipe(sass())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(minifycss())
	.pipe(gulp.dest(paths.style.output));
});


// ----------   JSCONCAT   -----
// 
gulp.task('jsconcat:dev', function() {
  return gulp.src(paths.scripts.front.sources)
	// .pipe(jshint())
	// .pipe(jshint.reporter(jshintReporter))
    .pipe(concat(paths.scripts.front.output.mainScriptsFile))
    .pipe(gulp.dest(paths.scripts.front.output.folder))
    .pipe(livereload());
});

gulp.task('jsconcat:build', function() {
  return gulp.src(paths.scripts.front.sources)
    .pipe(concat(paths.scripts.front.output.mainScriptsFile))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.front.output.folder));
});


//----------- JADE -> HTML -------------------
gulp.task('jadeHtml', function() {
 
  gulp.src(paths.jadeFiles.templates)
    .pipe(jade({
      locals: paths.jadeFiles.templates
    }))
    .pipe(gulp.dest(paths.html.distFolder))
    .pipe(livereload());
});

//-----------   SERVER   ---------------------
gulp.task('server:start', function() {
  connect.server({
    port: 8000,
    root: './public',
  });
  // server close ?
});


//-----------   WATCHERS   ---------------------

// gulp watcher for sass
gulp.task('watch:sass', function () {
	livereload.listen();
	gulp.watch(paths.style.all, ['sass:dev']);
});

// gulp watcher for lint
// gulp.task('watch:lintBack', function () {
// 	gulp.src(paths.scripts.back)
// 		.pipe(watch())
// 		.pipe(jshint())
// 		.pipe(jshint.reporter(jshintReporter));
// });

// gulp watcher for js
gulp.task('watch:js', function () {
	livereload.listen();
	gulp.watch(paths.scripts.front.sources, ['jsconcat:dev']);
});

gulp.task('watch:jadeHtml', function () {
  livereload.listen();
  gulp.watch(paths.jadeFiles.templates, ['jadeHtml']);
  gulp.watch(paths.html.distFiles).on('change', livereload.changed);
});

// gulp watch sass, lint & js
gulp.task('watch', [
  'watch:sass',
  // 'watch:lintBack',
  'watch:js',
  'watch:jadeHtml'
]);


// ----------   RUN tasks   ------------------
// gulp run Keystone
// gulp.task('runKeystone', shell.task('node keystone.js'));

// default task (watch & serve)

gulp.task('serve', ['server:start', 'watch'],function () {
});
