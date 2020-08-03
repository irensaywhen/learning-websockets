const gulp = require("gulp");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

function styles() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["defaults"],
      })
    )
    .pipe(gulp.dest("./public/css"))
    .pipe(browserSync.stream());
}

function copyHTML() {
  return gulp.src("src/**/*.html").pipe(gulp.dest("./public"));
}

function copyImages() {
  return gulp.src(["./src/img/*"]).pipe(gulp.dest("./public/img"));
}

function scripts() {
  return gulp.src("./src/js/**/*.js").pipe(gulp.dest("./public/js"));
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
  gulp.watch("./scss/**/*.scss", styles);
  gulp.watch("./src/*.html").on("change", gulp.series(copyHTML, reload));
  gulp.watch("./src/js/**/*.js").on("change", gulp.series(scripts, reload));
}

exports.develop = gulp.series(
  gulp.parallel(styles, scripts, copyHTML, copyImages),
  serve,
  watch
);
