var gulp 			= require('gulp'),
	sass 			= require('gulp-sass'),
	browserSync 	= require('browser-sync'),
	imagemin 		= require('gulp-imagemin'),
	del		 		= require('del'),
	cache			= require('gulp-cache'),
	autoprefixer	= require('gulp-autoprefixer'),
	cssmin 			= require('gulp-cssmin'),
	useref 			= require('gulp-useref'),
	uglify 			= require('gulp-uglify'),
	wiredep 		= require('wiredep').stream,
	gulpif 			= require('gulp-if'),
	runSequence 	= require('run-sequence');

gulp.task('bower', function () {
	gulp.src('./source/index.html')
		.pipe(wiredep({
			directory: 'source/bower_components'
		}))
		.pipe(gulp.dest('./source'));
});

gulp.task('css', function() {
	return gulp.src('source/sass/**/*.sass')
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
		.pipe(autoprefixer({ browsers: ['> 0%'], cascade: true}))
		.pipe(gulp.dest('source/css'))
		.pipe(browserSync.reload({stream: true}));
});

gulp.task('useref', function () {
    return gulp.src('source/*.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', cssmin()))
        .pipe(gulp.dest('docs'));
});

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'source'
		}
	});
});

gulp.task('imageMin', function() {
	gulp.src('source/images/**/*')
		.pipe(cache(imagemin({
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}]
		})))
		.pipe(gulp.dest('docs/images'));
});

gulp.task('fonts', function() {
	gulp.src('source/fonts/**/*')
		.pipe(gulp.dest('docs/fonts'));
});
gulp.task('php', function() {
	gulp.src('source/*.php')
		.pipe(gulp.dest('docs/'));
});
gulp.task('htaccess', function() {
	gulp.src('source/*.htaccess')
		.pipe(gulp.dest('docs/'));
});
gulp.task('robots', function() {
	gulp.src('source/robots.txt')
		.pipe(gulp.dest('docs/'));
});

gulp.task('clear', function() {
	return cache.clearAll();
});

gulp.task('clean', function() {
	return del.sync('docs/');
});

gulp.task('build', function(callback) {
	runSequence('clean', 'css',
		['imageMin', 'useref', 'php', 'fonts', 'htaccess', 'robots'],
		callback
	);
});

gulp.task('default', ['browser-sync', 'css'], function() {
	gulp.watch('source/sass/**/*.sass', ['css']);
	gulp.watch('source/*.html', browserSync.reload);
	gulp.watch('source/js/**/*.js', browserSync.reload);
	gulp.watch('bower.json', ['bower']);
});