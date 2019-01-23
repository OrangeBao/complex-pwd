var assert = require('assert');
var ComplexPasswordCheck = require('./lib')

var complexPasswordCheck = new ComplexPasswordCheck({name: "byh"})
const errorList = complexPasswordCheck.getErrorList()
describe('检查', function() {
  describe('简单匹配用例', function() {
    it(errorList.a, function() {
      assert.equal(complexPasswordCheck.check('12tzx2312ss'), errorList.a);
    });
    // it('必须包含字母', function() {
    //   assert.equal(complexPasswordCheck.check('Ax2tzx2'), "必须包含字母");
    // });
    it(errorList.c, function() {
      assert.equal(complexPasswordCheck.check('Ax%%tzx&'), errorList.c);
    });
    it(errorList.d, function() {
      assert.equal(complexPasswordCheck.check('Ax2tzx2112'), errorList.d);
    });
    it(errorList.e, function() {
      assert.equal(complexPasswordCheck.check('Ax%2byhtzx2', {name: "byh"}), errorList.e);
    });
    it(errorList.f, function() {
      assert.equal(complexPasswordCheck.check('Ax2byht%zx2AAA'), errorList.f);
      assert.equal(complexPasswordCheck.check('Ax2byht!zx2Aaac'), errorList.f);
      assert.equal(complexPasswordCheck.check('Ax2byht@zx2111c'), errorList.f);
    });
    it(errorList.g, function() {
      assert.equal(complexPasswordCheck.check('Ax2byhtz@Asd'), errorList.g);
      assert.equal(complexPasswordCheck.check('Ax2@byhtqazc'), errorList.g);
      assert.equal(complexPasswordCheck.check('A123x2bDy#1qa321'), errorList.g);
    });
    it(errorList.h, function() {
      assert.equal(complexPasswordCheck.check('Ax2byhtz@Abc'), errorList.h);
      assert.equal(complexPasswordCheck.check('Ax2@byhtCbaBc'), errorList.h);
      assert.equal(complexPasswordCheck.check('A13x2by@htxyz'), errorList.h);
    });
  });

  describe('能通过的用例', function() {
    const passDemo = [
      'Q!23$af&ss',
      'Q!23$af&ss',
      'c12c31c23#11',
      's!232ade'
    ]
    passDemo.forEach(function(input) {
      it(input, function() {
        assert.equal(!complexPasswordCheck.check(input), true)
      });
    })
    
  });

  describe('不能通过的用例', function() {
    const notPassDemo = [
      'Q123$af&ss',
      'Q!23$af&ssaaaa'
    ]
    notPassDemo.forEach(function(input) {
      it(input, function() {
        assert.equal(!!complexPasswordCheck.check(input), true)
      });
    })
  });

});