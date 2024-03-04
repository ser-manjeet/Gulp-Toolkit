/**
 * Utilizing gulpfile.js to automate your workflow 
 */

const { watch, src, dest, parallel } = require( 'gulp' );
const sass = require( 'gulp-sass' )( require( 'sass' ) );
const cleanCSS = require( 'gulp-clean-css' );
const terser = require( 'gulp-terser' );
const rename = require( 'gulp-rename' );

const assets = {
	scss : {
		watch: './assets/scss/**/*.scss',
		src: './assets/scss/*.scss',
		build: 'assets/css/',
	},
	css: {
		src: './assets/css/*.css',
		exclude: '!assets/css/*.min.css',
		build: '.', // (.) for same directory
	},
	js: {
		src: './assets/js/*.js',
		exclude: '!assets/js/*.min.js',
		build: '.', // (.) for same directory
	}
}


// Compile SCSS
const compileScss = () => {
	return src( assets.scss.src )
		.pipe(sass())
		.pipe(dest( assets.scss.build ));
}

// Minify CSS
function minifyCss() {
  return src([assets.css.src, assets.css.exclude], { base: './' })
  	.pipe(cleanCSS({ compatibility: 'ie8' } ))
  	.pipe(rename({ suffix: '.min' }))
	.pipe(dest(assets.css.build));
}

// Minify JS
function minifyJs() {
  return src([assets.js.src, assets.js.exclude], { base: './' })
	.pipe(terser())
	.pipe(rename({ suffix: '.min' }))
	.pipe(dest('.'));
}

// Watch files for changes
function watchFiles() {
	watch(assets.scss.watch, compileScss);
	watch([assets.css.src, assets.css.exclude], minifyCss);
	watch([assets.js.src, assets.js.exclude], minifyJs);
}

const build = parallel(compileScss, minifyCss, minifyJs);

// Export tasks
exports.compileScss = compileScss;
exports.minifyCss = minifyCss;
exports.minifyJs = minifyJs;
exports.build = build;
exports.default = watchFiles;
