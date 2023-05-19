
function trimSpace(array) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    return array;
}

function stringIdentification() {
    var selectedFile = document.getElementById('files').files[0];
    var name = selectedFile.name;
    var size = selectedFile.size;
    console.log("文件名:" + name + "大小:" + size);
    var reader = new FileReader();
    reader.readAsText(selectedFile);
    var stringData;
    reader.onload = function () {
        stringData = this.result;
        stringData = stringData + " ";
        console.log(stringData);

        var set = {
            "if": 0,
            "then": 1,
            "else": 2,
            "while": 3,
            "begin": 4,
            "do": 5,
            "end": 6,
            "and": 39,
            "or": 40,
            "not": 41,
            "integer": 57,
            "identifier": 56,
            "illegal": -1
        };
        var word = stringData.split(" ");
        word = trimSpace(word);

        var sign = new Array(word.length);
        console.log(word);
        var index = 0;
        var state = 0;
        for (var i = 0; i < stringData.length; i++) {
            var tempChar = stringData[i];
            console.log("i" + i);
            console.log("tempChar:" + tempChar);
            console.log("state:" + state);
            console.log(sign);
            if (state == 0) {
                if (tempChar == "w") {
                    state = 1;
                } else if (tempChar == "d") {
                    state = 6;
                } else if (tempChar == "i") {
                    state = 8;
                } else if (tempChar == "t") {
                    state = 10;
                } else if (tempChar == "e") {
                    state = 14;
                } else if (tempChar == "b") {
                    state = 20;
                } else if (tempChar == "a") {
                    state = 25;
                } else if (tempChar == "o") {
                    state = 28;
                } else if (tempChar == "n") {
                    state = 30;
                } else if (tempChar == " ") {
                    state = 0;
                } else if (tempChar >= "a" && tempChar <= "z" || tempChar >= "A" && tempChar <= "Z") {
                    state = 33;
                } else if (tempChar >= "0" && tempChar <= "9") {
                    state = 34;
                } else {
                    state = 35;
                }
            } else if (state == 1) {
                if (tempChar == "h") {
                    state = 2;
                } else {
                    state = 33;
                }
            } else if (state == 2) {
                if (tempChar == "i") {
                    state = 3;
                } else {
                    state = 33;
                }
            } else if (state == 3) {
                if (tempChar == "l") {
                    state = 4;
                } else {
                    state = 33;
                }
            } else if (state == 4) {
                if (tempChar == "e") {
                    state = 5;
                } else {
                    state = 33;
                }
            } else if (state == 5) { //while
                if (tempChar == " ") {
                    sign[index] = "while";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 6) {
                if (tempChar == "o") {
                    state = 7;
                } else {
                    state = 33;
                }
            } else if (state == 7) { //do
                if (tempChar == " ") {
                    sign[index] = "do";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 8) {
                if (tempChar == "f") {
                    state = 9;
                } else {
                    state = 33;
                }
            } else if (state == 9) { //if
                if (tempChar == " ") {
                    sign[index] = "if";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 10) {
                if (tempChar == "h") {
                    state = 11;
                } else {
                    state = 33;
                }
            } else if (state == 11) {
                if (tempChar == "e") {
                    state = 12;
                } else {
                    state = 33;
                }
            } else if (state == 12) {
                if (tempChar == "n") {
                    state = 13;
                } else {
                    state = 33;
                }
            } else if (state == 13) { //then
                if (tempChar == " ") {
                    sign[index] = "then";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 14) {
                if (tempChar == "l") {
                    state = 15;
                } else if (tempChar == "n") {
                    state = 18;
                } else {
                    state = 33;
                }
            } else if (state == 15) {
                if (tempChar == "s") {
                    state = 16;
                } else {
                    state = 33;
                }
            } else if (state == 16) {
                if (tempChar == "e") {
                    state = 17;
                } else {
                    state = 33;
                }
            } else if (state == 17) { //else
                if (tempChar == " ") {
                    sign[index] = "else";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 18) {
                if (tempChar == "d") {
                    state = 19;
                } else {
                    state = 33;
                }
            } else if (state == 19) { //end
                if (tempChar == " ") {
                    sign[index] = "end";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 20) {
                if (tempChar == "e") {
                    state = 21;
                } else {
                    state = 33;
                }
            } else if (state == 21) {
                if (tempChar == "g") {
                    state = 22;
                } else {
                    state = 33;
                }
            } else if (state == 22) {
                if (tempChar == "i") {
                    state = 23;
                } else {
                    state = 33;
                }
            } else if (state == 23) {
                if (tempChar == "n") {
                    state = 24;
                } else {
                    state = 33;
                }
            } else if (state == 24) { //begin
                if (tempChar == " ") {
                    sign[index] = "begin";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 25) {
                if (tempChar == "n") {
                    state = 26;
                } else {
                    state = 33;
                }
            } else if (state == 26) {
                if (tempChar == "d") {
                    state = 27;
                } else {
                    state = 33;
                }
            } else if (state == 27) { //and
                if (tempChar == " ") {
                    sign[index] = "and";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 28) {
                if (tempChar == "r") {
                    state = 29;
                } else {
                    state = 33;
                }
            } else if (state == 29) { //or
                if (tempChar == " ") {
                    sign[index] = "or";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 30) {
                if (tempChar == "o") {
                    state = 31;
                } else {
                    state = 33;
                }
            } else if (state == 31) {
                if (tempChar == "t") {
                    state = 32;
                } else {
                    state = 33;
                }
            } else if (state == 32) { //not
                if (tempChar == " ") {
                    sign[index] = "not";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 33) {
                if (tempChar == " ") {
                    sign[index] = "identifier";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 33;
                }
            } else if (state == 34) {
                if (tempChar >= "9" || tempChar <= "0" && tempChar != " ") {
                    state = 35;
                } else if (tempChar == " ") {
                    sign[index] = "integer";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 34;
                }
            } else if (state == 35) {
                if (tempChar == " ") {
                    sign[index] = "illegal";
                    index = index + 1;
                    state = 0;
                } else {
                    state = 35;
                }
            }

        }
        var result = "";
        for (var i = 0; i < sign.length; i++) {
            var item = "(" + word[i] + "," + set[sign[i]] + ")";
            if (i != 0) {
                item = "," + item;
            }
            result = result + item;
            console.log(item);
        }
        console.log(result);
        document.getElementById("result").innerHTML = result;
    }
}
