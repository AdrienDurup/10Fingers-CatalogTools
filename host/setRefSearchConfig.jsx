function setRefSearchConfigJSX() {
    // alert('setRefSearchConfigJSX() running...');
    try {
        var book = app.activeBook;
        var myScript = new ScriptObj($.fileName);
        myScript.initializeConfigFile();
        var localConfigFile = new File(book.fullName + ".refsearch_cfg.txt");

        function readConfig(file) {
            if (file.exists) {
                file.open();
                var value = file.read();
                file.close();
                return value;
            };
            return null;
        }
        if (!myScript.configFile.exists) {
            var parameter = null;
            // alert('1');
        } else {
            // alert('2');
            myScript.configFile.open('r');
            var parameter = myScript.configFile.read();
        };
        var w;
        // alert(parameter);
        if (parameter) { // SI le parametre par défaut existe : On passe à la suite : setFinalWin
            w = setFinalWin(parameter,readConfig(localConfigFile));
            w.show();

        } else { //Sinon, on crée d'abord le paramètre par défaut PUIS on execute le callback setFinalWin
            var win = new Window('palette', 'Créer le motif de recherche par défaut');
            win.setRx = win.add('edittext');
            win.setRx.preferredSize = [400,32];
            win.grp = win.add('group');
            win.ok = win.grp.add('button', undefined, 'Enregistrer');
            win.cancel = win.grp.add('button', undefined, 'Annuler');
            win.ok.onClick = function() {
                myScript.configFile.open('w');
                myScript.configFile.write(win.setRx.text);
                myScript.configFile.close();
                w = setFinalWin(win.setRx.text,readConfig(localConfigFile));
                win.close();
                w.show();
            }
            win.cancel.onClick = function() {
                win.close();
            }
            win.show();
        };


        function setFinalWin(param, param2) {
            if (param2) {
                var localParam = param2;
            } else {
                var localParam = '';
            }
            var formattedParam = param.split('\n').join();
            var win2 = new Window('palette', 'Etablir le motif GREP à contrôler pour ce livre');
            win2.label=win2.add('statictext',undefined,"Motif GREP par défaut. À copier/coller pour l'utiliser.");
            win2.label.alignment='left';
            win2.default = win2.add('edittext', undefined, formattedParam, {
                readonly: true,
                multiline: false
            });
            win2.default.preferredSize= [400,32];
            // win2.default.preferredSize.width = 400;
            win2.label2=win2.add('statictext',undefined,"Motif GREP pour ce livre.");
            win2.label2.alignment='left';
            win2.newRx = win2.add('edittext', undefined, localParam);
                      win2.newRx.preferredSize= [400,32];
            win2.newRx.multiline = false;
            win2.grp = win2.add('group');
            win2.grp.orientation = 'row';
            win2.ok = win2.grp.add('button', undefined, 'Enregistrer');
            win2.cancel = win2.grp.add('button', undefined, 'Annuler');
            win2.ok.onClick = function() {
                localConfigFile.open('w');
                localConfigFile.write(win2.newRx.text);
                localConfigFile.close();
                win2.close();
            }
            win2.cancel.onClick = function() {
                win2.close();
            };
            return win2;
        }



    } catch (e) {
        alert(e);
        return;
    };
}