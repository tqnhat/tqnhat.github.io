var nRange1 = 0;
var nRange2 = 99;
var isSimple = true; //simpleInWord
var nTime = 1;    //1 minute
var nSpeed = 5;     // speed : 1->15
var isPlaying = false;

var a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
var b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
var arrZeroToNine = ['zero','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ']
var th = ['','thousand','million', 'billion','trillion'];
var dg = ['zero','one','two','three','four', 'five','six','seven','eight','nine'];
var tn = ['ten','eleven','twelve','thirteen', 'fourteen','fifteen','sixteen', 'seventeen','eighteen','nineteen'];
var tw = ['twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];

//timer
let vTimeout;
let speedInterval;

//add some even listeners
window.onload = function() {
    var rSpeed = document.getElementById("speed");
    var spLabel = document.getElementById("speed_label");

    rSpeed.addEventListener("input", function() {
        nSpeed  = rSpeed.value;
        spLabel.innerHTML = nSpeed;

        if(document.getElementById("bPlayGame").disabled && (speedInterval != null)){
            clearInterval(speedInterval);
            startGenerateNumber(nSpeed);
        }

    }, false); 

    var rTime = document.getElementById("time");
    var stLabel = document.getElementById("time_label");

    rTime.addEventListener("input", function() {
        nTime = rTime.value;
        stLabel.innerHTML = nTime;
    }, false); 
  };  

function setRange(){
    var r1 = document.getElementById("nRange1").value;
    var r2 = document.getElementById("nRange2").value;

    if(r1 != ""){
        nRange1 = parseInt(r1, 0);
    }

    if(r2 != ""){
        nRange2 = parseInt(r2, 0);
    }
}

function setType(){
    var radios = document.getElementsByName('type');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            // do whatever you want with the checked radio
            if(radios[i].value == 1){
                isSimple = true;
            }
            if(radios[i].value == 2){
                isSimple = false;
            }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

function playGame(){
    document.getElementById("bPlayGame").disabled = true;
    setType();
    setRange();
    generateNumber();

    vTimeout = setTimeout(stopGame, nTime*60*1000);
    startGenerateNumber(nSpeed);
}

function startGenerateNumber( speed){
    speedInterval = setInterval(generateNumber, 1000 * speed);
}

function stopGame(){
    clearTimeout(vTimeout);
    clearInterval(speedInterval);
    document.getElementById("bPlayGame").disabled = false;
}

function generateNumber(){
    var rdnNum = getRandomInRange(nRange1, nRange2);
    var sNum;
    if(isSimple){
        sNum = simpleInWord(rdnNum);
    }else{
        sNum = toWords(rdnNum);
    }

    document.getElementById("tNumber").innerHTML = rdnNum + "";
    document.getElementById("tText").innerHTML = sNum +  "";
}

function getRandomInRange(min, max){
    //return 33330222;
    return Math.floor(Math.random() * (max - min) + min);
}

/* convert one number to one word - add double, triple cases */
function simpleInWord(num){
    var s = "";
    if((num = num.toString()).length > 12) return 'over long';
    var arrNumbers = num.toString().split('');
    var nLength = arrNumbers.length;
    var hasTriple = false;
    for(var i = 0 ; i < arrNumbers.length; i++){ 
        hasTriple = false;       
        if(i+2 < nLength){
            if(arrNumbers[i] === arrNumbers[i+1] && arrNumbers[i] === arrNumbers[i+2]){
                s+= " triple ";
                i = i + 2;
                hasTriple = true;
            }
        }
        
        if((i+1 < nLength) && !hasTriple){
            if(arrNumbers[i] === arrNumbers[i+1]){
                s+= " double ";
                i = i + 1;
            }
        }

        s += arrZeroToNine[parseInt(arrNumbers[i])] + " ";
    }
    return s;
}

/* convert number to word - south asian */
function inWords (num) {
    if ((num = num.toString()).length > 9) return 'overflow';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    console.log(n);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + '' : '';
    return str;
}
/* convert number to words */
function toWords(s) {
    s = s.toString();
    s = s.replace(/[\, ]/g,'');
    if (s != parseFloat(s)) return 'not a number';
    var x = s.indexOf('.');
    if (x == -1)
        x = s.length;
    if (x > 15)
        return 'too big';
    var n = s.split(''); 
    var str = '';
    var sk = 0;
    for (var i=0;   i < x;  i++) {
        if ((x-i)%3==2) { 
            if (n[i] == '1') {
                str += tn[Number(n[i+1])] + ' ';
                i++;
                sk=1;
            } else if (n[i]!=0) {
                str += tw[n[i]-2] + ' ';
                sk=1;
            }
        } else if (n[i]!=0) { // 0235
            str += dg[n[i]] +' ';
            if ((x-i)%3==0) str += 'hundred ';
            sk=1;
        }
        if ((x-i)%3==1) {
            if (sk)
                str += th[(x-i-1)/3] + ' ';
            sk=0;
        }
    }
    
    if (x != s.length) {
        var y = s.length;
        str += 'point ';
        for (var i=x+1; i<y; i++)
            str += dg[n[i]] +' ';
    }
    return str.replace(/\s+/g,' ');
}