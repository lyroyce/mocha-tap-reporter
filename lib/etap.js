/**
 * Module dependencies.
 */

var Base = require('mocha').reporters.Base
  , cursor = Base.cursor
  , color = Base.color;

/**
 * Expose `eTAP`.
 */

exports = module.exports = eTAP;

/**
 * Initialize a new `eTAP` reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function eTAP(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , n = 1
    , passes = 0
    , failures = 0
    , skips = 0;

  runner.on('suite', function(suite) {
    if (suite.root || ! suite.tests.length) return;
    var suffix = " ";
    for (var x=0;x<(50-suite.title.length);x++)
      suffix += ".";
      
    console.log(suite.title + suffix);
    n = 1;
  });
  
  runner.on('suite end', function(suite) {
    if (suite.root || ! suite.tests.length) return;
    console.log('%d..%d', 1, suite.tests.length);
  });

  runner.on('test end', function(){
    ++n;
  });

  runner.on('pending', function(test){
    skips++;
    console.log('ok %d %s # SKIP -', n, title(test));
  });

  runner.on('pass', function(test){
    passes++;
    console.log('ok %d %s', n, title(test));
  });

  runner.on('fail', function(test, err){
    failures++;
    console.log('not ok %d %s', n, title(test));
    if (err.stack){ 
      // add prefix # for error
      // which could be used by Jenkins TAP plugin as diagnostics
      console.log(err.stack.replace(/^/gm, '#  '));
    }
  });

  runner.on('end', function(){
    console.log('# tests ' + (passes + failures + skips));
    console.log('# pass ' + passes);
    console.log('# fail ' + failures);
    console.log('# skip ' + skips);
  });
}

/**
 * Return a TAP-safe title of `test`
 *
 * @param {Object} test
 * @return {String}
 * @api private
 */

function title(test) {
  return test.fullTitle().replace(/#/g, '');
}

eTAP.prototype.__proto__ = Base.prototype;
