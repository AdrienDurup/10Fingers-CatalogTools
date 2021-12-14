/* 1) Create an instance of CSInterface. */
var csInterface = new CSInterface();
/* 2) Make a reference to your HTML button and add a click handler with callback. */

var setFavB=document.querySelector("#setFav").addEventListener("click",()=>{
  //alert('go1');
  csInterface.evalScript("setFavJSX()");
});

var openFavB=document.querySelector("#openFav").addEventListener("click",()=>{
    //alert('go2');
    csInterface.evalScript("openFavJSX()");
});

var pageControlB=document.querySelector("#pageControl").addEventListener("click",()=>{
  //alert('go2');
  csInterface.evalScript("pageControlJSX()");
});

document.querySelector('#setRefSearchConfig').addEventListener('click',()=>{
  // alert('launch setRefSearchConfigJSX');
  csInterface.evalScript("setRefSearchConfigJSX()");
})

var BookCheckBox=document.querySelector('#onBook');

document.querySelector("#goControlRef").addEventListener("click", ()=>{
  if(BookCheckBox.checked){
    csInterface.evalScript("controlOnRefAllJSX()");
  }else{
  csInterface.evalScript("controlOnRefCopyPasteJSX()");
};
});

