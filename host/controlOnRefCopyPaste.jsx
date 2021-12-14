function controlOnRefCopyPasteJSX(info) {
    try {
        //POUR INFORMATION :
        // var info={
        //     multi:true,
        //     index:i,
        //     indexMax:myBookContents[ln],
        //     bookContent:myBookContents[i]
        //     progressBox:myProgBox
        // };
        //alert('controlOnRefCopyPasteJSX() running');
        var ln = 'length'; //Raccourci pour les propriétés length, à récup comme ceci : object[ln]
        var sep = "\t";
        var doc = app.activeDocument;
        var logFile = new File(doc.fullName + ".refcontrol.txt");
            if(app.books.length!=0){
                var book=app.activeBook;
        var myBookContents = book.bookContents;
        };

        if (myBookContents!=undefined&&myBookContents.itemByName(doc.name).isValid) { //COMPORTEMENT NORMAL : LE DOCUMENT ACTIF APPARTIENT AU LIVRE ACTIF.
            // alert(myBookContents.itemByName(doc.name).isValid);
            var configFile = new File(book.fullName + ".refsearch_cfg.txt");
            if (!configFile.exists) {
                throw "Pas de phrase GREP configurée pour cette recherche.";
            };
        } else { //DANS LE CAS CONTRAIRE ON VERIFIE SI LE FICHIER DE CONFIG PAR DEFAUT EXISTE AFIN DE L'UTILISER.
            var script = new ScriptObj($.fileName);
            var defaultConfig = new File(script.file.parent.parent + "\/config/config_setRefSearchConfig.txt"); //FICHIER DE CONFIG PAR DEFAUT DEFINI PAR LE SCRIPT setRefSearchConfig.jsx
            // alert(defaultConfig.fullName);
            if (defaultConfig.exists) {
                alert("Il n'y a pas de livre ouvert, ou le document actif n'appartient pas au livre actif.\nLe contrôle se fera sur la base de la phrase GREP par défaut.");
                var configFile = defaultConfig;
            } else { //SI LE FICHIER DE CONFIG PAR DEFAUT N'EXISTE PAS NON PLUS, ON LEVE UNE EXCEPTION.
                throw 'Pas de phrase GREP par défaut définie dans les paramètres.';
            }

        }

        configFile.open('r');
        var grepRef = configFile.read();
        configFile.close();




        logFile.reset();

        function isMulti(info, callb1, callb2) {
            if (info !== undefined && info.multi == true) {
                callb1();
            } else if (callb2 !== undefined) {
                callb2();
            };
        }
        //-------Set progress box
        var myProgress;
        isMulti(info, function() {
                myProgress = info.progressBox;
            },
            function() {
                myProgress = new ProgressBox('doublons de réfs ?');
            }
        );
        myProgress.ok = myProgress.add('button', undefined, 'ok');
        myProgress.ok.onClick = function() {
            myProgress.hide();
            myProgress.close();
        }

        // BUG : la fenetre n'apparaît pas, sauf si on refait hide et show, ou si on utilise une alerte.
        // POURQUOI NE FONCTIONNE PAS AVEC JUSTE LE PREMIER SHOW() ? BUG IRRESOLU...
        myProgress.show();
        // isMulti(
        //     info,
        //     function() { //SI ON EXECUTE SUR L ENSEMBLE DU LIVRE
        //         myProgress.field2.text = info.bookContent.name + " : " + info.index + "\/" + info.indexMax;
        //     }
        // );

        myProgress.field.text = 'Initialisation...';
        // myProgress.hide();
        // myProgress.show();

        //alert('window initiated', 1);
        //---------------

        var spreads = doc.spreads.everyItem();

        //PREVOIR UN FICHIER DE CONFIG SUR LES AUTRES SCRIPTS POUR GERER LE CHANGEMENT DE CHARTE


        var stories = doc.stories;
        debugln("Number of stories = " + stories.length, 1);
        //Avec les stories de tout le doc directement :
        var res = getAndSortRefs(doc, grepRef);
        myProgress.update('Liste des refs extraites : ' + res[ln]);
        // myProgress.update('Liste des refs extraites : ' + res[ln]);

        debugln("Result = " + res, 0);
        var Obj = function(param1, param2, param3) {
            this.spread = param1;
            this.reference = param2;
            this.page = param3;
        };


        mainfor: for (var i = 0; i < res.length; i++) { //Pour chaque référence présente sur la spread

            myProgress.update((i + 1) + '/' + res[ln]);

            // myProgress.show();
            var arr = res[i].split('\t');
            var obj = new Obj(arr[0], arr[1], arr[2]);
            for (var j = i + 1; j < res.length; j++) { //Et pour chaque autre référence présente sur la spread
                var arr2 = res[j].split('\t');
                var obj2 = new Obj(arr2[0], arr2[1], arr2[2]);
                if (obj.spread == obj2.spread) {
                    debugln(obj.spread + " == " + obj2.spread + " ? " + (obj.spread == obj2.spread), 0);
                    if (obj.reference == obj2.reference) { // Si deux références sont identiques sur la meme spread
                        debugln(obj.reference + " == " + obj2.reference + " ? " + (obj.reference == obj2.reference), 0);
                        var page = obj.page;
                        if (obj.page !== obj2.page) {
                            page = page + " et " + obj2.page;
                        };
                        debugln("Référence doublée : " + obj.reference + sep + "sur les page(s) : " + page, 0);
                        WriteLogLn(logFile.parent, logFile.name, "Référence doublée : " + obj.reference + sep + "sur les page(s) : " + page);
                    };
                } else {
                    debugln("---Force Next Reference----", 0);
                    continue mainfor;
                };
            };
        }; //FOR

        isMulti(info,
            //    function(){myProgress.hide();myProgress.close();},
            function() {

                if (logFile.exists) {
                    var foundOrNotError_Str = "Consultez le fichier :\r" + logFile.name;
                } else {
                    var foundOrNotError_Str = "RAS.";
                };
                myProgress.update(myProgress.field.text + ".\rFin du contrôle.\r" + foundOrNotError_Str);
            },
            function() {
                if (logFile.exists) {
                    var foundOrNotError_Str = "Consultez le fichier :\r" + logFile.name;
                } else {
                    var foundOrNotError_Str = "RAS.";
                };
                myProgress.update(myProgress.field.text + ".\rFin du contrôle.\r" + foundOrNotError_Str);
            }
        );

        //myProgress.field2.text='Consultez le fichier : ' + logFile.name;
        //alert("Fin du contrôle. Consultez le fichier : " + logFile.name);

        //}; //while

        function getAndSortRefs(doc, grep) {
            try {
                var separator = '\t';
                var refs = [];
                debugln(doc.name, 1);
                var textObjects = findAll(doc, grep);
                if (textObjects !== null) {
                    debugln(textObjects[ln], 1);
                    for (var i = 0; i < textObjects.length; i++) {
                        // ON POUSSE UNE LIGNE AU FORMAT : INDEX_DU_SPREAD REFERENCE PAGE_CONCERNEE 
                        var myPage = textObjects[i].parentTextFrames[0].parentPage;
                        if (myPage !== null) {
                            debugln('step' + i + ' => ' + textObjects[i].parentTextFrames[0].id + ' => ' + myPage.name, 0);
                            refs.push(textObjects[i].parentTextFrames[0].parentPage.parent.index + separator + textObjects[i].contents.match(/\d{5}/)[0] + separator + myPage.name);

                            //debugln(refs.lastValue(), 0);
                        };
                    }; //FOR
                    return refs.sort();
                }; //IF
            } catch (e) {
                alert('getAndSortRefs() : \n' + e);
                return;
            }; //CATCH

        }

        function findAll(obj, whatRx) { //MODIFIER AVEC GREP et gestion de tableau et cibler une story particulière

            try {
                if (obj.hasOwnProperty('findGrep')) {
                    app.findTextPreferences = NothingEnum.nothing; // now empty the find what field!!! that's important!!!
                    app.changeTextPreferences = NothingEnum.nothing; // empties the change to field!!! that's important!!!

                    // some settings
                    app.findChangeGrepOptions.includeFootnotes = true;
                    app.findChangeGrepOptions.includeHiddenLayers = false;
                    app.findChangeGrepOptions.includeLockedLayersForFind = false;
                    app.findChangeGrepOptions.includeLockedStoriesForFind = true;
                    app.findChangeGrepOptions.includeMasterPages = true;

                    // What we want to find
                    app.findGrepPreferences.findWhat = whatRx;

                    // and now hit the button
                    var res = obj.findGrep(); //QUE RETOURNE REELLEMENT FINDGREP ? DES OBJETS ? AVEC QUELLE PRORPIETE ?

                    app.findGrepPreferences = NothingEnum.nothing; // now empty the find what field!!! that's important!!!
                    app.changeGrepPreferences = NothingEnum.nothing; // empties the change to field!!! that's important!!!
                    // we are done
                    return res;

                } else {
                    throw "Tentative de recherche Grep sur un Objet ne poss\u00e9dant pas la m\u00e9thode findGrep().";

                };

            } catch (e) {
                alert("Erreur dans findAll() : " + e);
            };
        };

    } catch (e) {
        alert(e);
        if (myProgress != null) {
            myProgress.close();
        };
        return;
    };
}