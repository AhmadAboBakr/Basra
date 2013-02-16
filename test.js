//var Test = {
//    name:"ahmed",
//    talk:function(){
//        console.log("hi");
//    }
//}
//
//var t = Object.create(Test);
//console.log(t.name);
//t.talk();

var Test = function(){
    this.name = "ahmed";
    this.talk = function(){
        console.log("hi");
    }
}
var t = new Test();
console.log(t.name);
t.talk();