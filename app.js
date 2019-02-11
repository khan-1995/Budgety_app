

//budgetcontroller---------------------------------------------->
var budgetcontroller=(function(){

var Income=function(id,desc,value){
    this.id=id;
    this.desc=desc;
    this.value=value;
};

var Expenses=function(id,desc,value){
    this.id=id;
    this.desc=desc;
    this.value=value;
};



var  cal_total = function(type){
  var sum=0;
  money_data.allitems[type].forEach(function(current,index,array)
  { 
	sum+=current.value;

   });
  
  money_data.total[type]=sum;
  
};

var money_data={
	allitems:{
	 exp: [],
	 inc: []
  },

  total:{
  	exp: 0,
  	inc : 0
  },
  
  budget : 0
};

return { additem: function(type,dec,val){
    
  // var  id = money_data.allitems[type].length;
 
    var new_item;

 if(money_data.allitems[type].length===0)
 {
  var ID=money_data.allitems[type].length;	
 }

else{
  var ID=money_data.allitems[type][money_data.allitems[type].length-1].id+1;
   }
      if(type==="inc"){ 
      	new_item = new Income(ID,dec,val);
       money_data.allitems[type].push(new_item);
      }
    
      else if(type==="exp"){

       new_item = new Expenses(ID,dec,val);
      money_data.allitems[type].push(new_item); 

     }

   return new_item;
 },

 deleteItem: function(type,id){
            
            var ty;
             if(type==="income"){
               ty="inc";
             }
                else{
               ty="exp";
             }
              
       var arry= money_data.allitems[ty].map(function(current){
                    return current.id;
        });

        var index = arry.indexOf(id);
        
        if(index!==-1){
       money_data.allitems[ty].splice(index,1);
       console.log(arry);
        }
     },
 calculate_budget : function(){
     //calculate sum of expenses and income

     cal_total('inc');//taking input form controller
     cal_total('exp');
    
    //calculating budget from income and expenses

    money_data.budget=money_data.total.inc-money_data.total.exp;
 

 },
  
  tester : function(){
  return money_data;
 },

  getBudget : function(){
    return {
        total_data : money_data.budget,
        total_income : money_data.total.inc,
         total_expense : money_data.total.exp       
      };    

  }



};  



})();


//UIcontroller--------------------------------------
var uicontroller=(function(){
   
     var domclasses={
     	types:".add__type",
     	desc:".add__description",
     	val: ".add__value",
      click : ".add__btn",
     	inc_list: ".income__list",
     	exp_list: ".expenses__list",
     	total_income : ".budget__income--value",
     	total_expense:".budget__expenses--value",
      total_budget: ".budget__value",
      container: ".container",
      monthlabel:".budget__title--month"
     };

     var numberFormatter = function(num,type){
       var numsplit,integer,decimal;

      num = Math.abs(num);///absolute 
      num = num.toFixed(2);
      
      numsplit = num.split(".");

      integer = numsplit[0];
      decimal = numsplit[1];

       if(integer.length>3){
           integer = integer.substr(0,integer.length-3)+","+integer.substr(integer.length-3,3 );
       } 

       ;

       return (type=== "exp" ? sign = "-" : sign = "+")+" "+integer+"."+decimal;
      
     };


    return {

       getInputpara: function(){
        return {
    	type_input: document.querySelector(domclasses.types).value,
    	desc_input: document.querySelector(domclasses.desc).value,
    	val_input: parseFloat(document.querySelector(domclasses.val).value)
        };//return type for function
      },//object input para
       
       addListitem: function(obj,type){
                var html,newHtml,element;

//add the item to ui
     if(type==="inc"){
  
      html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';   
       element=domclasses.inc_list;    
       
  }

   else if(type==="exp"){
    
    html  = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
    element=domclasses.exp_list; 
   }
 
  
    newHtml = html.replace('%id%',obj.id);
    newHtml = newHtml.replace('%description%',obj.desc);
    newHtml = newHtml.replace('%value%',numberFormatter(obj.value,type));

    document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);//inserting an HTML code snippet into html code.   

  },


  deleteItemui: function(selectid){

  
  document.getElementById(selectid).parentNode.removeChild(document.getElementById(selectid));


  },

    budgetvalue: function(obj){
      if(obj.total_data>=0){
      document.querySelector(domclasses.total_income).textContent=numberFormatter(obj.total_income,"inc"); 
      document.querySelector(domclasses.total_expense).textContent=numberFormatter(obj.total_expense,"exp");      
      document.querySelector(domclasses.total_budget).textContent=numberFormatter(obj.total_data,"inc"); 
      }
    },


     clearfielditems:function(){
         var field_list,field_array;

     	field_list=document.querySelectorAll(domclasses.desc+","+domclasses.val);
        
        field_array=Array.prototype.slice.call(field_list); 
        
        field_array.forEach(function(current,index,array){
           
           current.value="";//emptying all the fileds with empty string.
  
          }); 
        
          field_array[0].focus();// Bringing back the cursor to the description field.
     },

     updatemonth : function(){
          
          var timestamp = new Date();
          var year = timestamp.getFullYear();//for getting year of current date.
          var months = ["January","February","March","April","May","June","July","August","September","November","October","December"];
          var month = timestamp.getMonth();
          document.querySelector(domclasses.monthlabel).textContent=months[month]+" "+year;
     },

       getDomclasses: function(){
       
       	return domclasses;
       }

    };//return type for uictrl 
      
 })();




//appcontroler---------------------------------------->

var appcontroller=(function(bdgctrl,uictrl){
  
  var eventstarter = function(){
  
   var Dom=uictrl.getDomclasses();//getting Dom classes from uicontroller

  document.querySelector(Dom.click).addEventListener("click",function(){
    after__click();//adding event listener while initialization of the budget app.
  });

   document.addEventListener("keypress",function(event){ // adding keypress event to enter the input using enter key(ASCII value = 13).
  
  if(event.which===13){
    after__click();
  }
  
});//key press event.

   document.querySelector(Dom.container).addEventListener("click",controlDelete); //adding event listenser for delete button to delete an item from list.

}//end of event starter

var updateBudget=function(){
   //calculating budget
   bdgctrl.calculate_budget();
   
   var budget=bdgctrl.getBudget();
 
  uictrl.budgetvalue(budget);

}
                                                   
var after__click = function(){
//get input :	 
var input_from_uictrl = uictrl.getInputpara();


 if(input_from_uictrl.desc_input!=="" && !isNaN(input_from_uictrl.val_input) && input_from_uictrl.val_input>0){
//add item to budget controller:
var ret_bdg = bdgctrl.additem(input_from_uictrl.type_input,input_from_uictrl.desc_input,input_from_uictrl.val_input);
    
//call additelList feom ui controller
uictrl.addListitem(ret_bdg,input_from_uictrl.type_input);

//clearing input fields
uictrl.clearfielditems();

//updating the total budget 
 updateBudget();

 var testy= bdgctrl.tester(); //test function to get money_data
// console.log(test);
console.log(testy);

    }//if condition

    else{window.alert("please do enter valid input !");}
  }//after__click function


  var controlDelete=function(event){

    var itemid,label,type,id;

     itemid = event.target.parentNode.parentNode.parentNode.id;
     label = itemid.split("-");     
     type = label[0];
     id = parseInt(label[1]);
     console.log(label[0]);//printing output to the console for verification.

     var testy= bdgctrl.tester(); //test function to get money_data
     
     console.log(testy);//printing output to the console for verification.

    //1.Delete itemefrom datastructure
    bdgctrl.deleteItem(type,id); 
   

    //2.Delete from UI
    uictrl.deleteItemui(itemid);

    //3.update new Budget
    updateBudget();
  }

  
  return {
     
     init: function(){
     	console.log("app started on work");
      uictrl.updatemonth();
      uictrl.budgetvalue({
                total_data : 0,
                total_income : 0,
                total_expense : 0       

      });
     	eventstarter();

     }

  };

})(budgetcontroller,uicontroller);//passing arguments to the appcontroller.

appcontroller.init();//initializing app
