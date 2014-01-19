beforeEach(function () {
  jasmine.addMatchers({
    toBeAlmostEqual: function () {
      return {
        compare: function (actual, expected) {
          return {
            pass: new String(actual).substring(0,15) === new String(expected).substring(0,15)
          }
        }
      };
    }
  });
});
