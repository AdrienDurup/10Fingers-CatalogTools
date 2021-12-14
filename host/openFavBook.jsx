var gtest=new ScriptObject($.fileName);
var openFavBook=new ScriptObject($.fileName);
openFavBook.configFolder=new Folder(openFavBook.parentFolder.fsName+'\/'+'config');
//alert(openFavBook.configFolder.fsName);
openFavBook.confFileName='config_openFavBook.txt';
openFavBook.configFile=new File(openFavBook.configFolder+'\/'+openFavBook.confFileName);

function setFavJSX(){
//alert('Extenscript script running');
var fileToOpen=File.openDialog();
var fPath=fileToOpen.fsName;
//alert(fPath);
reWriteLog(openFavBook.configFolder,openFavBook.confFileName,fPath);
}
function openFavJSX(){
//alert('Extenscript script running');
try{
var fileToOpen=new File(openFavBook.configFolder+'\/'+openFavBook.confFileName);
if(fileToOpen.exists){
fileToOpen.open("r");
var settings=fileToOpen.read();
}else{
throw('Définissez d\'abord votre Livre Favori.');
};
   var fileRef = new File(settings);
   if(!fileRef.exists){
alert('Le fichier cible est introuvable (déplacé, renommé ou supprimé), ou la sauvegarde du lien a été corrompue.\nLa sauvegarde du lien va être supprimée.');
fileToOpen.remove();
   }else{
var docRef = app.open(fileRef);
   };
  }catch(e){
alert(e);
  }
}