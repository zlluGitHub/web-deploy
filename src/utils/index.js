// import { EventEmitter } from 'events';
// export const events = new EventEmitter();

import mitt from 'mitt';
export const events = mitt();
function S4() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
export const getUUID = () => {
	// let s = [];
	// let hexDigits = "0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
	// for (let i = 0; i < 36; i++) {
	// 	s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	// }
	// s[14] = "4";
	// s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
	// s[8] = s[13] = s[18] = s[23] = "-";

	// let uuid = s.join("");
	// return uuid.replace(/-/g, '');

	return (S4() + S4() + "-" + S4() + "-" + S4());
}
export const deepClone = source => {
	const targetObj = source.constructor === Array ? [] : {}; // 判断复制的目标是数组还是对象
	for (let keys in source) {
		// 遍历目标
		if (source.hasOwnProperty(keys)) {
			if (source[keys] && typeof source[keys] === "object") {
				// 如果值是对象，就递归一下
				targetObj[keys] = source[keys].constructor === Array ? [] : {};
				targetObj[keys] = deepClone(source[keys]);
			} else {
				// 如果不是，就直接赋值
				targetObj[keys] = source[keys];
			}
		}
	}
	return targetObj;
}
export const uploadFile = (input, callBack) => {
	//支持chrome IE10  
	if (window.FileReader) {
		let file = input.files[0], filename = file.name.split(".")[0];
		let reader = new FileReader();
		reader.onload = function () {
			// console.log(this.result);
			callBack(this.result, filename)
		}
		reader.readAsText(file);
	}
	//支持IE 7 8 9 10  
	else if (typeof window.ActiveXObject != 'undefined') {
		let xmlDoc;
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.load(input.value);
		callBack(xmlDoc.xml)
	}
	//支持FF  
	else if (document.implementation && document.implementation.createDocument) {
		let xmlDoc;
		xmlDoc = document.implementation.createDocument("", "", null);
		xmlDoc.async = false;
		xmlDoc.load(input.value);
		callBack(xmlDoc.xml)
	} else {
		console.error('文件读取失败！')
	}
}
//序列化方法
export const formatJson = (json, options) => {
	var reg = null,
		formatted = "",
		pad = 0,
		PADDING = "    "; // one can also use '\t' or a different number of spaces

	// optional settings
	options = options || {};
	// remove newline where '{' or '[' follows ':'
	options.newlineAfterColonIfBeforeBraceOrBracket =
		options.newlineAfterColonIfBeforeBraceOrBracket === true ? true : false;
	// use a space after a colon
	options.spaceAfterColon = options.spaceAfterColon === false ? false : true;

	// begin formatting...
	if (typeof json !== "string") {
		// make sure we start with the JSON as a string
		json = JSON.stringify(json);
	} else {
		// is already a string, so parse and re-stringify in order to remove extra whitespace
		json = JSON.parse(json);
		json = JSON.stringify(json);
	}

	// add newline before and after curly braces
	reg = /([\{\}])/g;
	json = json.replace(reg, "\r\n$1\r\n");

	// add newline before and after square brackets
	reg = /([\[\]])/g;
	json = json.replace(reg, "\r\n$1\r\n");

	// add newline after comma
	reg = /(\,)/g;
	json = json.replace(reg, "$1\r\n");

	// remove multiple newlines
	reg = /(\r\n\r\n)/g;
	json = json.replace(reg, "\r\n");

	// remove newlines before commas
	reg = /\r\n\,/g;
	json = json.replace(reg, ",");

	// optional formatting...
	if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
		reg = /\:\r\n\{/g;
		json = json.replace(reg, ":{");
		reg = /\:\r\n\[/g;
		json = json.replace(reg, ":[");
	}
	if (options.spaceAfterColon) {
		reg = /\:/g;
		json = json.replace(reg, ": ");
	}

	$.each(json.split("\r\n"), function (index, node) {
		var i = 0,
			indent = 0,
			padding = "";

		if (node.match(/\{$/) || node.match(/\[$/)) {
			indent = 1;
		} else if (node.match(/\}/) || node.match(/\]/)) {
			if (pad !== 0) {
				pad -= 1;
			}
		} else {
			indent = 0;
		}

		for (i = 0; i < pad; i++) {
			padding += PADDING;
		}

		formatted += padding + node + "\r\n";
		pad += indent;
	});

	return formatted;
}

export const isMobile = (s) => {
	return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(s)
}
export const isEmail = (s) => {
	return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(s);
}
export default {
	events, getUUID, deepClone, uploadFile, formatJson, isMobile, isEmail
}