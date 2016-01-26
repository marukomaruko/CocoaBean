#!/usr/bin/env node

var program = require('commander');

program
  .version('0.0.1')
  .usage('<command> [options]')
  .option('-v, --version', 'output the version number')
  .option('-V, --verbose','log detail information');

program
  .command('new <appname>')
  .usage('<appname> [options]')
  .description('Create a new CocoaBean app.')
  .option('-l, --lang [lang]', 'choose programming language', /^(js|coffee)$/i, 'js')
  .option('-V, --verbose','log detail information')
  .action(function(appName, options) {
    console.log('new %s', appName);
    console.log('lang %s', options.lang);
  });

program
  .command('run')
  .description('Preview your CocoaBean app.')
  .option('-V, --verbose','log detail information')
  .action(function() {
    console.log('run');
  });

program.parse(process.argv);
