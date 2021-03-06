'use strict';

const defaultErrorList = {
  a: '密码以字母开头，长度不小于8位，由大小写字母、数字以及特殊符号* _ # @ % $ &  = +组成',
  b: '必须包含大字母',
  c: '必须包含数字',
  d: '必须包含特殊字符* _ # @ % $ &  = +',
  e: '不要以姓名、电话号码以及出生日期等作为密码的组成部分',
  f: '不要出现3位及以上重复的字母、数字、特殊字符，如AAA、Aaa、111、###等',
  g: '不要出现3位及以上键盘连续的字母、数字、特殊字符，如qAz, qwer等',
  h: '不要出现3位及以上连续的字母、数字、特殊字符，如ABC、Abc、123、！@#等',
}

class ComplexPasswordCheck {
  constructor(options = {}) {
    this.options = Object.assign({
      errorList: defaultErrorList
    }, options)
  }

  getErrorList() {
    return this.options.errorList
  }

  check(pwd, {name, phone, birth} = {}) {
    var reg = /^[a-zA-Z]([a-zA-Z0-9]|[* _ # @ % $ &  = +]){7,19}$/;
    if (!reg.test(pwd)) {
      return this.options.errorList.a
    }
    if (!/[A-Z]/.test(pwd)) {
    	return this.options.errorList.b
    }
    if (!/[0-9]/.test(pwd)) {
      return this.options.errorList.c
    }
    if (!/[* _ # @ % $ &  = +]/.test(pwd)) {
      return this.options.errorList.d
    }
    if ([name, phone, birth].filter(item => !!item).find(item => pwd.indexOf(item) !== -1)) {
      return this.options.errorList.e
    }
    var repetReg = /(.)\1{2}/g
    if (pwd.match && pwd.toLocaleLowerCase().match(repetReg)) {
      return this.options.errorList.f
    }
    // 键盘连续值
    const hander = checkKeyBoard()
    if (pwd.split("").some(item => !hander(String(item).toLocaleLowerCase()))) {
      return this.options.errorList.g
    }

    // 连续值
    const vHandler = checkContinuous()
    if (pwd.split("").some(item => !vHandler(String(item).toLocaleLowerCase()))) {
      return this.options.errorList.h
    }
    return ""
  }
}
 

// -----  键盘连续值
var keyBoards = [
["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], [],          [],
[],         ["q"],      ["w"],      ["e"],      ["r"],      ["t"],      ["y"],      ["u"],      ["i"],      ["o"],      ["p"],      ["[", "{"], ["]", "}"],  ["\\", "|"],
[],         [],         ["a"],      ["s"],      ["d"],      ["f"],      ["g"],      ["h"],      ["j"],      ["k"],      ["l"],      [";", ":"], ["'", "\""], [],
[],         [],         [],         ["z"],      ["x"],      ["c"],      ["v"],      ["b"],      ["n"],      ["m"],      [",", "<"], [".", ">"], ["/", "?"],  []
]
const LINE = 14  // 二维数组 列数
const keyMap = keyBoards.reduce(function(ret, item, index) {
	// 如果是占位数组，直接返回
	if (!item.length) return ret;
  let ship = {
    L : [],
    R : [],
    T : [],
    LT : [],
    B : [],
    RB : []
  }
  
	if (index - 1 >= 0) {
		ship.L = [keyBoards[index - 1][0]]
	}
	if (index + 1 < keyBoards.length - 1 && (index + 1) % LINE > 0) {
		ship.R = [keyBoards[index + 1][0]]
	}
	if (index - LINE >= 0) {
		ship.T = [keyBoards[index - LINE][0]]
	}
	if (index - LINE - 1 >= 0) {
		ship.LT = [keyBoards[index - LINE - 1][0]]
	}
	if (index + LINE < keyBoards.length - 1) {
		ship.B = [keyBoards[index + LINE][0]]
	}
	if (index + LINE + 1 < keyBoards.length - 1 && (index + LINE + 1) % LINE > 0) {
		ship.RB = [keyBoards[index + LINE + 1][0]]
  }
  ret[item[0]] = ship
  if (item.length > 1) {
    // shift
    const shiftKey = {
      L : [],
      R : [],
      T: [],
      LT: [],
      B: [],
      RB: []
    }
    if (index - 1 >= 0) {
      shiftKey.L = [keyBoards[index - 1][1]]
    }
    if (index + 1 < keyBoards.length - 1 && (index + 1) % LINE > 0) {
      shiftKey.R = [keyBoards[index + 1][1]]
    }
  
    ret[item[1]] = shiftKey
  }
	return ret
}, {})

function checkKeyBoard() {
	let count = 0
  let per = undefined // 前一个值
  let dir = "" // 方向
	return function(input) {
		try {
			if (per) {
        const ship = keyMap[per]
        // 查找当前字符是否在之前字符的关系表里
        const tag = Object.keys(ship).find(k => ship[k].includes(String(input)))
        if (tag) {
          // 已经有两个点确定方向，并且方向不一致
          if (dir && dir !== tag) {
            count = 2 // 能确定方向 说明有两个点了
          } else {
            count ++
          }
          dir = tag
        } else {
          // 当前字符与前一个字符没有联系的话，当前字符要算做第一个
          count = 1
          dir = ""
        }
        if (count === 3) {
          return false
        }
      } else {
        count = 1
      }
      per = input
      return true
		} catch(e) {
			console.error(input)
			throw new Error(e)
		}
	}
}

//----  连续值
function checkContinuous() {
  let count = 0
  let dir = ""
  let per = ""
 return function(input) {
    if (per === "") {
      count += 1
    } else {
      if (String(input).charCodeAt() + 1 === String(per).charCodeAt()) {
        if (true === dir) {
          count += 1
        } else {
          dir = true
          count = 2
        }
      } else if (String(input).charCodeAt() - 1 === String(per).charCodeAt()) {
        if (false === dir) {
          count += 1
        } else {
          dir = false
          count = 2
        }
      } else {
        count = 1
        dir = ""
      }
    }
    per = input
    if (count === 3) {
      return false
    }
    return true
 } 
}

// window.RTO = RTO;
module.exports = ComplexPasswordCheck

// Allow use of default import syntax in TypeScript
module.exports.default = ComplexPasswordCheck

