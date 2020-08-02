const gulp = require("gulp");
const sass = require("gulp-sass");
const nodemon = require("gulp-nodemon");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

function styles() {
  return gulp
    .src("scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["defaults"],
      })
    )
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
}

// Initialize server
function serve(done) {
  browserSync.init(
    {
      server: {
        baseDir: "./public",
      },
      port: 5000,
      host: "0.0.0.0",
    },
    done
  );
}

function reload(done) {
  browserSync.reload();
  done();
}

function watch() {
  gulp.watch("scss/**/*.scss", styles);
  gulp.watch("./public/*.html").on("change", gulp.series(reload));
  gulp.watch("./public/**/*.js").on("change", gulp.series(reload));
}

exports.develop = gulp.series(styles, serve, watch);
