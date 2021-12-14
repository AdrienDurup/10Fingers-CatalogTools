function pageControlJSX() {
    //alert('pageControlJSX running');
    //CREER DEUX FONCTIONS DANS TOOLBOX : INITIALISELOG INITIALISECONFIG


    try {
        var savedPref = saveAndDisableLinkCheckPref();
        var pageControlScript = new ScriptObject($.fileName);

        var myBook = app.activeBook;
        pageControlScript.logFolder = new Folder(myBook.filePath);
        pageControlScript.logFileName = myBook.name + '._pageErrors.txt';
        pageControlScript.logFile = new File(pageControlScript.logFolder + '\/' + pageControlScript.logFileName);
        if (pageControlScript.logFile.exists) {
            pageControlScript.logFile.open('w');
            pageControlScript.logFile.write('');
            pageControlScript.logFile.close();
        };

        pageControlScript.error = '';
        pageControlScript.doWhole = true;

        var myBookContents = myBook.bookContents;

        var openedArr = getOpenedBookContentNames(myBookContents);
        if (openedArr.length != 0) {
            throw ('Veuillez fermer tous les documents du livre à contrôler :\n' + openedArr.join('\n'));
        };

        function setProgWin() {
            var w = new Window('palette', 'Contrôle de la pagination (maintenir \'Esc\' pour arrêter)');
            w.labelFile = w.add('statictext', undefined, myBookContents[0].name);
            w.progBar = w.add('progressbar', undefined, 0, myBookContents.length);
            w.progBar.preferredSize.width = 300;

            //Pour pouvoir faire un cancel, il faut remplacer la loop par un enchainement avec callback et recursion....
            w.closeStatus = false;
            //~     var cancelBut=w.add('button',undefined,'Cancel');
            //~     cancelBut.onClick=function(){w.closeStatus=true;w.close();};
            return w;
        };

        var progWin = setProgWin();
        progWin.show();

        var progCounter = 0;
        var myKeyState = ScriptUI.environment.keyboardState;
        var previousPageDetail = [];

        function openCheckClose(x) {
            //alert("openCheckClose running...");
            for (var u = 0; u < 500; u++) { // BOUCLE FOR pour tester l'appui sur ESC et quitter
                myKeyState = ScriptUI.environment.keyboardState;
                if (myKeyState.keyName == 'Escape') {
                    progWin.closeStatus = true;
                    break;
                };
                $.sleep(1);
            };
            if (!progWin.closeStatus) {
                progWin.labelFile.text = myBookContents[x].name;
                app.open(myBookContents[x].fullName);
                var myDoc = app.activeDocument;
                var allPages = myDoc.pages;
                for (var i = 0; i < allPages.length; i++) {

                    ////////////////////////////////////////////////////////////////////////////////////////////////
                    //AJOUTER UN CONTROLE SUR LES PAGES VIDES (contenu inférieur à 10 objets)
                    ////////////////////////////////////////////////////////////////////////////////////////////////
                    try {
                        var pageNum = Number(allPages[i].name);
                        //alert(allPages[i].name);
                        //alert(pageNum);
                    } catch (e) {
                        alert(e);
                    };

                    var errorVal = false;

                    if (isNaN(pageNum)) {
                        var errorStr01 = 'Ce fichier contient probablement des pages hors numérotation.';
                        //pageControlScript.sumOfErrors += errorStr01;
                        WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, errorStr01);
                        alert(errorStr01);
                        continue;
                    } else {
                        var isPair = function() {
                            if (pageNum % 2 == 0) {
                                return true;
                            } else {
                                return false;
                            };
                        }
                        var pageSide = allPages[i].side.toString();
                        if ((isPair() && pageSide != 'LEFT_HAND') || (!isPair() && pageSide != 'RIGHT_HAND')) { //S'IL Y A INADEQUATION NUMERO/COTE DE PAGE
                            //errorString = errorString + 'Il y a un problème d\'adéquation numéro/côté à la page : ' + pageNum + '\n';
                            pageControlScript.error = 'Il y a un problème d\'adéquation numéro/côté à la page : ' + pageNum;
                            //alert('alternance error : '+pageControlScript.sumOfErrors);
                            WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                            //alert('error : '+pageControlScript.sumOfErrors);
                            errorVal = true;
                        };

                        if (allPages[i] == allPages[0] && allPages[i].appliedSection.sectionPrefix !== '') { //CONTROLE SUR LA PRESENCE D UN PREFIXE SUR UNE PREMIERE PAGE
                            //alert('error de section ok');
                            pageControlScript.error = 'ERREUR DE SECTION :  préfix sur la première page : ' + pageNum;
                            WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                            //alert('error : '+pageControlScript.sumOfErrors);
                            errorVal = true;
                        };
                        if (previousPageDetail[0] !== undefined) { //SI ON NE TESTE PAS LA PREMIERE PAGE
                            if (previousPageDetail[1] == pageSide) { //S'IL Y A ERREUR D'ALTERNANCE
                                //errorString = errorString + 'Il y a une erreur d\'alternance à la page : ' + pageNum + '\n';
                                pageControlScript.error = 'Il y a une erreur d\'alternance à la page : ' + pageNum;
                                WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                                //alert('error : '+pageControlScript.sumOfErrors);
                                errorVal = true;
                            };

                            if (allPages[i].appliedSection != allPages[i - 1].appliedSection) { //CONTROLE QUE CHAQUE PAGE EST SUR LA MEME SECTION QUE LA PRECEDENTE
                                //alert('error de section différente');
                                pageControlScript.error = 'Erreur de section (Page Hors Numérotation ?) à la page : ' + pageNum;
                                WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                                //alert('error : '+pageControlScript.sumOfErrors);
                                errorVal = true;
                            };
                            if (pageNum !== previousPageDetail[0] + 1) { //S'IL Y A RUPTURE DANS LA NUMEROTATION (HORS PAGE BIS)
                                //errorString = errorString + 'Il y a une erreur de numérotation à la page : ' + pageNum;
                                pageControlScript.error = 'Erreur de numérotation (problème de suite) à la page : ' + pageNum;
                                WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                                //alert('error : '+pageControlScript.sumOfErrors);
                                errorVal = true;
                            };

                        };
                        if (allPages[i].allPageItems.length < 10) { //CHERCHE si une page est plutôt vide (moins de 10 objets)
                            pageControlScript.error = 'ALERTE : la page ' + pageNum + ' est vide ?';
                            WriteLogLn(pageControlScript.logFolder, pageControlScript.logFileName, pageControlScript.error);
                            //alert('error : '+pageControlScript.sumOfErrors);
                            errorVal = true;
                        };

                        if (!pageControlScript.doWhole) {
                            if (errorVal) {
                                //alert(pageControlScript.sumOfErrors);
                                progWin.hide();
                                progWin.close();
                                return;
                            } else {
                                previousPageDetail = [pageNum, allPages[i].side.toString()];
                            };
                        };
                        if (pageControlScript.doWhole) {
                            previousPageDetail = [pageNum, allPages[i].side.toString()];
                        };
                    };
                };
                myDoc.close(SaveOptions.NO);
                x++;
                progWin.progBar.value = x;
                if (x == myBookContents.length) {
                    progWin.hide();
                    progWin.close();
                    return;
                } else if (x < myBookContents.length) {
                    progWin.progBar.value = x;
                    return openCheckClose(x);
                };

            };
        }


        openCheckClose(progCounter);
        progWin.close();
        pageControlScript.logFile.open('r');
        var logRes = pageControlScript.logFile.read();
        pageControlScript.logFile.close();
        alert('Liste d\'erreurs\n' + logRes);


    } catch (e) {
        alert(e);
    } finally {
        restoreLinkCheckPref(savedPref);
    };
}