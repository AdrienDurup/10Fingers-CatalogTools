function controlOnRefAllJSX() {
    // alert('function controlOnRefJSX() running');
    try{

        var savedPref = saveAndDisableLinkCheckPref();
    var ln = 'length';
    var oMyFuncJSX = new ScriptObject($.fileName);
    var myBook = app.activeBook;
    var myBookContents = myBook.bookContents;
                    var openedArr=getOpenedBookContentNames(myBookContents);
                        if (openedArr.length != 0) {
            throw ('Veuillez fermer tous les documents du livre à contrôler :\n' + openedArr.join('\n'));
        };
    debugln('step1', 1);
    var myProgBox = new ProgressBox('Contrôle doublons de réfs : tout');
    myProgBox.grp2 = myProgBox.add('group');
    myProgBox.grp2.alignment='fill';
    myProgBox.field2=myProgBox.grp2.add('statictext',undefined,undefined);
    myProgBox.field2.preferredSize.width=300;
myProgBox.field2.justify='right';
        myLoop: for (var i = 0; i < myBookContents[ln]; i++) {
            var info={
                multi:true,
                index:i,
                indexMax:myBookContents[ln],
                bookContent:myBookContents[i],
                progressBox:myProgBox
            };
               info.progressBox.field2.text=  info.bookContent.name + " : " + (info.index+1).toString() + "\/" + info.indexMax;        
                //   info.progressBox.layout.layout();
            // alert(info.progressBox.field2.text);
            app.open(myBookContents[i].fullName,true);// FALSE PERMET D'OUVRIR LE FICHIER SANS OUVRIR DE FENETRE MAIS CE N EST PAS COMPATIBLE AVEC LE FONCTIONNEMENT DU SCRIPT
            var extractionRes = controlOnRefCopyPasteJSX(info);//Multi = true permet d'apporter des modifs à l'intérieur de controlOnRefCopyPasteJSX()
            var myDoc = app.activeDocument;
            myDoc.close(SaveOptions.NO);
        }; //FOR
        delete myProgBox;
        myProgBox.show();
        // myProgBox.hide();
        // myProgBox.close();
    }
    catch (e) {
        alert(e);
    }finally {
        restoreLinkCheckPref(savedPref);
    };

    // }
    //openExtractClose(progCounter);
    //progWin.close();
}