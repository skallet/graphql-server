/* eslint-disable no-undef, no-console */
import bg from 'gulp-bg';
import fs from 'fs';
import del from 'del';
import eslint from 'gulp-eslint';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import path from 'path';
import runSequence from 'run-sequence';
import shell from 'gulp-shell';
import yargs from 'yargs';
import webpackBuild from './webpack/build';

import Schema from './src/server/graphql/schema.js';
import { graphql } from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';

const args = yargs
  .alias('p', 'production')
  .argv;

const runEslint = () => {
  const isFixed = file => args.fix && file.eslint && file.eslint.fixed;
  return gulp.src([
    'gulpfile.babel.js',
    'src/**/*.js',
    'webpack/*.js'
  ], { base: './' })
    .pipe(eslint({ fix: args.fix }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest('./')));
};


gulp.task('env', () => {
  process.env.NODE_ENV = args.production ? 'production' : 'development';
});

gulp.task('build-webpack', ['env'], webpackBuild);
gulp.task('build', ['build-webpack']);

gulp.task('clean', () => del('build/*'));

gulp.task('eslint', () => runEslint());

gulp.task('schema-human', done => {
  const output = path.join(__dirname, './schema.graphql');
  fs.writeFile(output, printSchema(Schema), done);
});

gulp.task('schema-json', done => {
  graphql(Schema, introspectionQuery)
    .then((result) => {
      if (result.errors) {
        const errMsg = JSON.stringify(result.errors, null, 2);
        throw new Error(`ERROR introspecting schema: ${errMsg}`);
      } else {
        fs.writeFile(
          path.join(__dirname, './schema.json'),
          JSON.stringify(result, null, 2),
          done
        );
      }
    });
});

gulp.task('schema', ['env'], done => {
  runSequence('schema-human', 'schema-json', done);
});

gulp.task('server-node', bg('node', './src/server'));
gulp.task('server-hot', bg('node', './webpack/server'));
// Shell fixes Windows este/issues/522, bg is still needed for server-hot.
gulp.task('server-nodemon', shell.task(
  // Normalize makes path cross platform.
  path.normalize('node_modules/.bin/nodemon --ignore webpack-assets.json src/server')
));

gulp.task('server', ['env', 'schema'], done => {
  if (args.production) {
    runSequence('clean', 'build', 'server-node', done);
  } else {
    runSequence('server-hot', 'server-nodemon', done);
  }
});

gulp.task('default', ['server']);
