'use strict';

function $complexPwd(pwd) {
	// 密码长度不小于8位，由大小写字母、数字以及特殊符号组成。	
	// var reg = /^([a-zA-Z0-9]|[*_#@%$&=+]){8,20}$/;
	// if (!reg.test(pwd)) {
	// 	return '密码以字母开头，长度不小于8位，由大小写字母、数字以及特殊符号组成'
	// }
	// if (!/[A-Z]/.test(pwd)) {
	// 	return '必须包含大写字母'
	// }
	// if (!/[a-z]/.test(pwd)) {
	// 	return '必须包含小写字母'
	// }
	// if (!/[0-9]/.test(pwd)) {
	// 	return '必须包含数字'
	// }
	// if (!/[*_#@%$&=+]/.test(pwd)) {
	// 	return '必须包含特殊字符*_ # @ % $ &  = +'
	// }
	// if ([name, phone, birth].find(item => pwd.indexOf(item) !== -1)) {
	// 	return '不要以姓名、电话号码以及出生日期等作为密码的组成部分'
	// }
	var repetReg = /(.)\1{2}/g
	if (pwd.match && pwd.toLocaleLowerCase().match(repetReg)) {
		return "有重复"
	}
  const hander = checkKeyBoard()
	if (pwd.split("").some(item => !hander(String(item).toLocaleLowerCase()))) {
    return "有连续"
	}
	return ""
}

var keyBoards = [
["1", "!"], ["2", "@"], ["3", "#"], ["4", "$"], ["5", "%"], ["6", "^"], ["7", "&"], ["8", "*"], ["9", "("], ["0", ")"], ["-", "_"], ["=", "+"], [],          [],
[],         ["q"],      ["w"],      ["e"],      ["r"],      ["t"],      ["y"],      ["u"],      ["i"],      ["o"],      ["p"],      ["[", "{"], ["]", "}"],  ["\\", "|"],
[],         [],         ["a"],      ["s"],      ["d"],      ["f"],      ["g"],      ["h"],      ["j"],      ["k"],      ["l"],      [";", ":"], ["'", "\""], [],
[],         [],         [],         ["z"],      ["x"],      ["c"],      ["v"],      ["b"],      ["n"],      ["m"],      [",", "<"], [".", ">"], ["/", "?"],  []
]
const line = 14
const keyMap = keyBoards.reduce(function(ret, item, index) {
	// 如果是占位数组，直接返回
	if (!item.length) return ret;
  let ship = {
    L : [],
    R : [],
    T : [],
    LT : [],
    B : [],
    BR : []
  }
  
	if (index - 1 >= 0) {
		ship.L = keyBoards[index - 1]
	}
	if (index + 1 < keyBoards.length - 1 && (index + 1) % line > 0) {
		ship.R = keyBoards[index + 1]
	}
	if (index - line >= 0) {
		ship.T = keyBoards[index - line]
	}
	if (index - line - 1 >= 0) {
		ship.LT = keyBoards[index - line - 1]
	}
	if (index + line < keyBoards.length - 1) {
		ship.B = keyBoards[index + line]
	}
	if (index + line + 1 < keyBoards.length - 1 && (index + line + 1) % line > 0) {
		ship.BR = keyBoards[index + line + 1]
	}
	item.forEach(k => {
		ret[k] = ship
	})
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

// window.RTO = RTO;

module.exports = $complexPwd

// Allow use of default import syntax in TypeScript
module.exports.default = $complexPwd