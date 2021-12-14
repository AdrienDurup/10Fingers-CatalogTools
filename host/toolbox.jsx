//Toolbox functions V.2.1 07/12/2020
//Nouveauté : progressBox, Deprecate
//var test=['01234','23456','khugkjhg','','kjlkjh','45678','01234','01234'];
function Deprecate(func, msg) { //Vient remplacer le corps d'une fonction périmée. En premier argument : le nom de ladite fonction. On peut ajouter un message d'erreur particulier en deuxième argument.
    if (msg == undefined) {
        msg = '';
    };
    try {
        throw func.name + ' is deprecated.\n' + msg;
    } catch (e) {
        alert(e);
        return;
    }
}
Array.prototype.lastValue = function() {
    return this[this.length - 1];
};
Array.prototype.getObjByKeyValue = function(idKey, id) { //BETA, AJOUTER DES CONTROLES sur la nature des items de l'Array
    try {
        if (typeof idKey == "string") {
            for (var i = 0; i < this.length; i++) {
                if (this[i][idKey] == id) {
                    return this[i];
                };
            };
            return false;
        } else {
            return null;
        };
    } catch (e) {
        alert(e);
        return
    };
}
Array.prototype.test = function(chaine, sep) {
    if (typeof sep == "string") {
        var tmpStr = this.join(sep);
        var rx = new RegExp(chaine, 'g');
        var res = rx.test(tmpStr);
        return res;
    } else {
        return null;
    };
}
Array.prototype.strictFilter = function(arg) {
    var tempArr = new Array;
    if (arg instanceof RegExp) {
        for (var y = 0; y < this.length; y++) {
            if (arg.test(this[y])) {
                tempArr.push(this[y]);
            };
        };
    } else {
        for (var y = 0; y < this.length; y++) {
            if (this[y] == arg) {
                tempArr.push(this[y]);
            };
        };
    };
    return tempArr;
}

Array.prototype.filter = function(arg) {
    var tempArr = new Array;
    if (typeof arg == 'string' || arg instanceof RegExp) {
        var tmpRE = arg;
    } else {
        $.writeln('\.filter() supports String or RegExp argument only\.');
        return false;
    };

    for (var y = 0; y < this.length; y++) {
        if (this[y].match(tmpRE)) {
            tempArr.push(this[y]);
        };
    };
    return tempArr;
}
//TEST OF FILTER
//~ var test=['azefzef01234zefzfe','fzefzef23456','khugkjhg','','kjlkjh','45678','01234zefzef','01234'];
//~ var st='01234';
//~ var print=test.filter(st);$.writeln(print);
//~ var rx=new RegExp(/\d{5}/);
//~ print=test.filter(rx);$.writeln(print);

Array.prototype.uniqueVal = function() {
    var tmpArr = [this[0]];
    try {
        var uv3;
        for (var uv = 1; uv < this.length; uv++) {
            uv3 = true;
            for (var uv2 = 0; uv2 < tmpArr.length; uv2++) {
                if (this[uv] == tmpArr[uv2]) {
                    uv2 = tmpArr.length;
                    uv3 = false;
                };
            };
            if (uv3) {
                tmpArr.push(this[uv]);
            };
        };

        return tmpArr;
    } catch (error) {
        $.writeln('uniqueVal() method failed : ' + error);
    };

}
//~  var test=['1324','2345','4567','1234','1324','2345','4567','1234'];
//~  var print=test.uniqueVal();$.writeln(print);

Array.prototype.uniqueByRegex = function(aRegex) {
    if (!(aRegex instanceof RegExp)) {
        $.writeln('Error : argument not a RegExp object');
        return false;
    };
    try {

        var uv3;
        var testThis;
        var match1 = [];
        var match2 = [];
        var tmpArr = [];

        for (var uv = 0; uv < this.length; uv++) {

            if (typeof this[uv] != 'string') {
                $.writeln('Error : Array value is not of type "string"');
                return false;
            };

            testThis = aRegex.test(this[uv]);
            $.writeln(this[uv]); //TEST : est ce que lentrée du tableau correspond à l'expression régulière ?
            if (testThis) {
                match1 = this[uv].match(aRegex);
                uv3 = true;
            } else {
                match1 = [];
                uv3 = false;
            }; //Si oui, récupérer la string dans match1, sinon, réinitialiser match1. uv3=false doit être avant la boucle for qui ne s'execute pas tant que tmpArr.length==0

            for (var uv2 = 0; uv2 < tmpArr.length; uv2++) { //iterate through new array, looking for equality
                if (!uv3) {
                    break;
                }; //si une entrée du tableau testé n'est pas conforme, break la recherche d'égalité.
                match2 = tmpArr[uv2].match(aRegex);
                //if(match2=== null){match2=[];}; //CETTE LIGNE DEVRAIT ETRE INUTILE (puisque match2 devrait toujours matcher la regex) LA GARDER POUR LES TESTS ET DEBUGGAGE
                var testThis2 = (match1[0] == match2[0]); //$.writeln(testThis2);
                //$.writeln('testThis2 = '+testThis+' /// '+'match1 = '+match1+' ET match2 = '+match2);
                if (testThis2) {
                    uv2 = tmpArr.length;
                    uv3 = false; //$.writeln('UV3 = '+uv3);
                };
            };
            if (uv3) {
                tmpArr.push(this[uv]);
                //$.writeln('PUSH = '+this[uv]);$.writeln(match1+' différent de '+match2);$.writeln();
            };
        };

        return tmpArr;
    } catch (error) {
        $.writeln('uniqueByRegex() method failed : ' + error);
    };

}
//~  var test=['incroyable','non1234non','uuuuu','4567','1234','faux1824','123','1236non','non1234faux'];
//~  var reg=new RegExp(/\d{4}/);
//~  var print=test.uniqueByRegex(reg);$.writeln(print);


File.prototype.shortName = function() {
    var tmp = this.name.split('\.');
    tmp.pop();
    var tmp2 = tmp.join('\.');
    //$.writeln(tmp2.toString());
    return tmp2.toString();
}
File.prototype.ext = function() {
    var tmp = this.name.split('\.');
    this.ext = tmp[tmp.length - 1];
    return tmp[tmp.length - 1];
}

function delExt(file) {
    try {
        var tmp = file.name;
        var tmp = tmp.split('\.');
        tmp.pop();
        tmp.join('\.');
        return tmp;
    } catch (error) {
        $.writeln(error);
    };
}

function keepOldModifyDate(oDate, oFile) { //A TESTER
    if (!oFile instanceof File || !oFile.exists) return false;
    if (File.fs == "Windows") {
        alert('Can\'t keep ModifyDate on Windows system');
        return false;
    } else if (File.fs == "Macintosh") {
        var myAppleScript =
            'tell application "Finder"\r' +
            'set modificationDate to ' + oDate + ' of ' + oFile.fsName + '\r' +
            'end tell\r'
        app.doScript(myAppleScript, ScriptLanguage.applescriptLanguage);
    };
}

function sortUp(a, b) {
    return a - b;
}

function sortDown(a, b) {
    return b - a;
}

function WriteLogLn(logFolder, logName, string, encoding) { //encoding n'accepte que "UTF-8" pour le moment. pour raisons de fiabilité.
    if (!logFolder.exists) {
        try {
            logFolder.create();
            //alert(logCreateRes);
        } catch (e) {
            alert('Erreur : ' + e);
        };
    };
    var logFile = new File(logFolder + '\/' + logName);

    if (encoding != undefined) {
        if (encoding == 'UTF-8') {
            logFile.encoding = encoding;
        } else {
            alert('encodage non valide.');
            return false;
        };
    };
    if (!logFile.exists) {
        logFile.open('w');
    } else {
        logFile.open('a');
    };
    //$.writeln(appendString);
    try {
        logFile.writeln(string);
    } catch (e) {
        alert(e);
    };
    var closeRes = logFile.close();
    // alert(closeRes);
}

function reWriteLog(logFolder, logName, aString, encoding) { //encoding n'accepte que "UTF-8" pour le moment. pour raisons de fiabilité.
    //alert('reWriteLog running');
    var myFolder = logFolder;
    //alert(myFolder.exists);
    if (!myFolder.exists) {
        //alert('folder doesnt exists');
        try {
            var logCreateRes = myFolder.create();
            //alert(logCreateRes);
        } catch (e) {
            alert('Erreur : ' + e);
        };
    };

    var logFile = new File(logFolder + '\/' + logName);

    //     if(encoding!=undefined){
    //     logFile.encoding='UTF-8';
    // };

    if (encoding != undefined) {
        if (encoding == 'UTF-8') {
            logFile.encoding = encoding;
        } else {
            alert('encodage non valide.');
            return false;
        };
    };

    logFile.open('w');
    var hasWritten = logFile.write(aString);

    if (hasWritten) {
        $.writeln('Written : ' + hasWritten + '\n======================');
    } else {
        $.writeln('Failed to append log file.\n======================');
    };
    logFile.close();
}

function WriteLog(logFolder, logName, aString, encoding) { //encoding n'accepte que "UTF-8" pour le moment. pour raisons de fiabilité.
    if (!logFolder.exists) {
        logFolder.create();
    };
    //
    var logFile = new File(logFolder + '\/' + logName);
    //if(logFile.exists){$.writeln('logFile.exists = '+logFile.exists);};   
    if (!logFile.exists) {
        logFile.open('w');
    } else {
        logFile.open('a');
    };
    // if (encoding != undefined) {
    //     logFile.encoding = 'UTF-8';
    // };
    if (encoding != undefined) {
        if (encoding == 'UTF-8') {
            logFile.encoding = encoding;
        } else {
            alert('encodage non valide.');
            return false;
        };
    };

    var hasWritten = logFile.write(aString);
    if (hasWritten) {
        $.writeln('Written : ' + hasWritten + '\n======================');
    } else {
        $.writeln('Failed to append log file.\n======================');
    };
    logFile.close();
}

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\\/^$|#\s]/g, '\\$&');
}
var flashboxwin;
var flashboxfield;

function flashBox(str, time) {
    if (flashboxwin == undefined) {
        //~          alert('new flashbox');
        flashboxwin = new Window('palette', 'flashbox');
        flashboxfield = flashboxwin.add('statictext', [0, 0, 150, 150], undefined);
    }
    flashboxfield.text = str;
    flashboxwin.show();
    $.sleep(time);
    flashboxwin.hide();
}

function ProgressBox(name) { //Make an option canQuit:kill a loop or throw an error
    var progressBoxWin = new Window('palette', name);
    progressBoxWin.grp1 = progressBoxWin.add('group');
    progressBoxWin.field = progressBoxWin.grp1.add('statictext', [0, 0, 200, 100], undefined, {
        multiline: true
    });
    //progressBoxWin.ok=progressBoxWin.add('button',undefined,'ok');
    // progressBoxWin.ok.onClick = function(){
    // progressBoxWin.hide();
    // progressBoxWin.close();
    // };

    progressBoxWin.update = function(string) {
        progressBoxWin.field.text = string;
        //progressBoxWin.show();
    }
    return progressBoxWin;
}


// function ProgressBox(name) {//Make an option canQuit:kill a loop or throw an error
// progressBoxWin=new Window('dialog', name);
//         progressBoxWin.field = progressBoxWin.add('statictext', [0, 0, 150, 150], undefined);

//     progressBoxWin.update=function(string){
// progressBoxWin.field.text = string;
//     }
//     return progressBoxWin;
// }

//NOT TESTED YET
function ExecAndWaitInput(callback) { //Callback must define break option
    var skip = false;
    var quit = false;
    execAndWaitInputLoop: while (quit) {
        if (skip) {
            continue
        };
        skip = true;
        callback();
    };
}

function launch(aPath) {
    var fileToLaunch = new File(aPath);
    if (fileToLaunch.exists) {
        try {
            $.evalFile(fileToLaunch);
        } catch (e) {
            alert('Erreur dans le fichier ' + fileToLaunch.name + ' : ' + e);
        };
    } else {
        alert('Script introuvable : ' + fileToLaunch.name);
    };
    return true;
}

function debugln(string, lvlString) {
    try {
        var debugln = debug[lvlString] ? $.writeln(string) : false;
        //  var debugln=debug[lvlString]?alert(string):false;
    } catch (e) {
        $.writeln(e);
    };
}

$.setTimeout = function(func, time) {
    if (typeof func == 'function') {
        var res = func();
    };
    for (var i = 0; i < time; i++) {
        if (res != 'undefined') {
            i = time;
        };
        $.sleep(1 * time);
    };

};


//OPTIONNEL : on peut définir un nom et un emplacememnt pour un futur fichier de configuration (pas créé dans cette fonction)
var ScriptObject = function(fileFullName) {
    try {
        this.JSXFullName = fileFullName;
        this.arrName = this.JSXFullName.split('\/');
        this.arrName.pop();

        this.scriptPath = this.arrName.join('\/');
        this.JSXFolder = new Folder(this.scriptPath);
        this.parentFolder = this.JSXFolder.parent;
        //alert(this.parentFolder.fsName);
        //alert(this.JSXFolder.fsName);
    } catch (e) {
        alert(e);
    };
}

function ScriptObj(fileFullName) {
    // alert($.fileName);
    this.file = new File(fileFullName);
    if (this.file.exists) {
        // alert('tmpScriptFile.exists ');
        this.rootFolder = this.file.parent.parent;

        this.initializeConfigFile = function(fileName) {
            // alert('initializeConfigFile running : ' + fileName);
            this.configFolder = new Folder(this.rootFolder.fsName + '\/' + 'config');
            if (fileName !== undefined) {
                this.configFileName = fileName;
            } else {
                this.configFileName = 'config_' + this.file.shortName() + '.txt';
            }
            this.configFile = new File(this.configFolder + '\/' + this.configFileName);


        };

        this.initializeLogFile = function(fileName) {
            this.logFolder = new Folder(this.rootFolder.fsName + '\/' + 'log');
            if (fileName !== undefined) {
                var finalFileName = fileName;
            } else {
                var finalFileName = 'log_' + this.file.shortName() + '.txt';
            };
            // return {
            //     'file': new File(this.logFolder + '\/' + finalFileName)
            // };
            return new File(this.logFolder + '\/' + finalFileName);
        }
    } else {
        return false;
    };

}
//--------Pour utiliser .colCompare(), la fonction callback doit imperativement etre construite sur le modele suivant :
//function exemple([paramètres,séparés,par des, virgules],x,y){} où x,y seront réservés pour récupérer les incrémentations des deux boucles for i et j
//ATTENTION CELA REND LES FONCTIONS DESTINEES A ETRE APPELEES EN CALLBACK ASSEZ PEU LISIBLES. Conseil pour la lisibilité : déclarer des variables pour récupérer les paramètres.
Array.prototype.colCompare = function(targetArray, callback, paramArray) {
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < targetArray.length; j++) {
            callback(paramArray, i, j);
        };

    };
}
File.prototype.reset = function() {
    if (this.exists) {
        this.open('w');
        this.write('');
        this.close();
    };
}

function plural(number) {
    if (typeof number == 'number') {
        if (number > 1) {
            return 's';
        } else {
            return '';
        };
    };
}

function saveAndDisableLinkCheckPref() {
    var toRestoreLater = {
        checkLinks: app.linkingPreferences.checkLinksAtOpen,
        findMissing: app.linkingPreferences.findMissingLinksAtOpen
    };
    app.linkingPreferences.checkLinksAtOpen = false;
    app.linkingPreferences.findMissingLinksAtOpen = false;
    return toRestoreLater;
}

function restoreLinkCheckPref(saveVar) {
    app.linkingPreferences.checkLinksAtOpen = saveVar.checkLinks;
    app.linkingPreferences.findMissingLinksAtOpen = saveVar.findMissing;
}

function getOpenedBookContentNames(bookContents) {
    var openedBCArray = [];
    for (var i = 0; i < bookContents.length; i++) {
        if (bookContents[i].status == BookContentStatus.DOCUMENT_IS_OPEN) {
            openedBCArray.push(bookContents[i].name);
        };
    };
    return openedBCArray;
}

// var test=new ScriptObj($.fileName);
// test.log=test.initializeLogFile();
// var arr=[1,2,3];
// var mots = ["un", "deux", "trois", "quatre"];
// mots.forEach(function(mot) {
//   console.log(mot);
//   if (mot === "deux") {
//     mots.shift();
//   }
// });
// Array.prototype.forEach=function (){
// this.forEach.func=function(){};
//     for (var i=0;i<myArray.length;i++){
// this.forEach.func();
//     };
// }