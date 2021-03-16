const StorageCtrl = (function(){
  return {
    storeInLs: function(data){
       let items;
       if(localStorage.getItem('items')=== null){
           items = [];
           items.push(data);
           localStorage.setItem('items', JSON.stringify(items));
       }else{
          items = JSON.parse(localStorage.getItem('items'));

          items.push(data);

          localStorage.setItem('items', JSON.stringify(items));
       }
       
    },
    // Get data in local storage
    getdataInLs: function(){
      let items;
      if(localStorage.getItem('items') === null){
        items = [];
      }else{
        
        items = JSON.parse(localStorage.getItem('items'));
      }
      return items;
    },
    updateLs: function(updateItem){
     let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(updateItem.id === item.id){
          items.splice(index, 1, updateItem);
        }
        
      });
      localStorage.setItem('items', JSON.stringify(items));
    },
    deleteFromLs: function(id){
      let items = JSON.parse(localStorage.getItem('items'));
      items.forEach(function(item, index){
        if(id === item.id){
           items.splice(index, 1);
        }
      })
    },
    clearFromLs: function(){
      localStorage.removeItem('items');
    }
  }
})()


const CalCtrl = (function (){
  const Item = function(id, meal, calories){
    this.id = id;
    this.meal = meal;
    this.calories = calories;
  }

//Data structure/ state
  const data = {
    //items: [
      // {id: 1, name:'Spov',   calories: 234},
      // {id: 2, name:'Caloen', calories: 2345},
      // {id: 3, name:'gesdr',  calories: 400}
   // ],
     items: StorageCtrl.getdataInLs(),
     current: null,
     totalCalories: 0
}

return {
  getItem: data.items,
  addToDataCtrl: function(meal,calories){
     //Create Id
     let ID;
     if(data.items.length > 0){
       ID = data.items[data.items.length - 1].id +1;
     }else{
       //set id to 0
       ID = 0;
     }

     //Convert calories value into integer
      calo = parseInt(calories);

     //create dynamic data
     //Whatever argument is passed into the addToDataCtrl is passed into the Item obj
     const newData = new Item(ID,meal,calo);
     data.items.push(newData);
     return newData;
  },
  addUpdateToData:function(meal, calories){
  
      calories = parseInt(calories); 

      let found = null;
      data.items.forEach(function(item){
        if(item.id === data.current.id){
          item.meal = meal;
          item.calories = calories;
          found = item; 
         
        }
      });
      return found;
      
  },

  //Get total calories by looping
  getTotalCal: function(){
    let total = 0;
    data.items.forEach(function(item){
       total = total + item.calories;
    });
   return data.totalCalories = total;
  },
  
  getItemById: function(id){
      let found = null;
      data.items.forEach(function(item){
        if(item.id === id){
           found = item; 
        }
      });
      return found;
  },

  setToCurrent: function(curr){
    return data.current = curr;
  },
  getCurrentItem: function(){
    return data.current
  },
  deleteItem: function(id){
    //get the id from the data structure
     const getId =  data.items.map(function(item){
       return item.id;
     })
     const index = getId.indexOf(id);

     //remove
     data.items.splice(index, 1);
  },
  clearAllData: function(){
    data.items = [];
  },

  logData : function(){
    return data;
  }


  
}

})();

const UICtrl = (function(){
   const UISelectors = {
     addBtn:'.add',
     updateBtn:'.update',
     deleteBtn:'.delete',
     clearBtn:'.clear-btn',
     editBtn:'.edit-item',
     mealInput:'item-meal',
     calInput: 'item-calories',
     listItem:'.collection',
     allList:'.collection li',
     calCount:'.cal-count',
     backBtn:'.back' 
   }
    
  //Public methods goes here
  return{
     populateItem: function(itemsObj){
       let html = "";
       itemsObj.forEach(function(item){
          html += `
          <li class="collection-item" id="item-${item.id}">
          <strong>${item.meal}:</strong> <em>${item.calories}</em>
          <a href="#" class="secondary-content edit-item">+</a>
          </li>
          `
       })
       document.querySelector(UISelectors.listItem).innerHTML = html;
     },
     getAllInput: function(){
       return{
        meal: document.getElementById(UISelectors.mealInput).value,
        calories: document.getElementById(UISelectors.calInput).value
       }
 
     },

     displayToList: function(newObj){
       //Get the parents
       const ul = document.querySelector(UISelectors.listItem);
       const li = document.createElement('li');
       li.className = 'collection-item';
       li.id = `item-${newObj.id}`;
       li.innerHTML = ` <strong>${newObj.meal}:</strong> <em>${newObj.calories}</em>
          <a href="#" class="secondary-content edit-item">+</a>`
       ul.insertAdjacentElement("beforeend",li);
       ul.style.display = 'block';
    
    },

    clearInput: function(){
      document.getElementById(UISelectors.mealInput).value = '';
      document.getElementById(UISelectors.calInput).value  = '';
    },
    hideList:function(){
      document.querySelector(UISelectors.listItem).style.display = 'none';
    },

    displayTotalCal:function(totalCal){
       document.querySelector(UISelectors.calCount).textContent = totalCal;
    },

    clearEditState: function(){
     this.clearInput()
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';

    },

    showCurrToInput: function(item){
      document.getElementById(UISelectors.mealInput).value = item.meal;
      document.getElementById(UISelectors.calInput).value  = item.calories;
      this.showhiddenBtn();
    },

    showhiddenBtn: function(){
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display    = 'none';

    },
    getUpdateInput:function(){
      return this.getAllInput();
    },
    showUpdateData:function(update){
    
         let allListItems = document.querySelectorAll(UISelectors.allList);

         liItems = Array.from(allListItems);

         liItems.forEach(function(liItem){
          listItemId = liItem.getAttribute('id');
          if(listItemId === `item-${update.id}`)  {
         document.querySelector(`#${listItemId}`).innerHTML = `
         <strong>${update.meal}:</strong> <em>${update.calories}</em>
           <a href="#" class="secondary-content edit-item">+</a>
         `
          }
         });  
    },
    deletedItem: function(id){
      const itId = `#item-${id}`;
      const item = document.querySelector(itId)
      item.remove();
      },
    removeAll: function(){
      let allList = document.querySelectorAll(UISelectors.allList);

      //Convert Node List to array
      const listArr = Array.from(allList);
       listArr.forEach(function(list){
        list.remove();
       });
    },
     getSelectors: function(){
       return UISelectors;
     }
  }
})();

const App = (function(CalCtrl, UICtrl){
   //Load events
   const loadEvent = function(){
     //Pull The selectors 
     const pulledSelectors = UICtrl.getSelectors();
     document.querySelector(pulledSelectors.addBtn).addEventListener('click', getInput);

     //Add event to edit button
     document.querySelector(pulledSelectors.listItem).addEventListener('click', editList);

     //Add event to update button
    document.querySelector(pulledSelectors.updateBtn).addEventListener('click', updateList);

    //Add event to back button
    document.querySelector(pulledSelectors.backBtn).addEventListener('click', back);

    //Add event to a button
    document.querySelector(pulledSelectors.deleteBtn).addEventListener('click', del);

    //Add event to clear all button
    document.querySelector(pulledSelectors.clearBtn).addEventListener('click', clearAll);




   }
    
   //Pulled input values from UI controller
   const getInput = function(e){
      const inputVal = UICtrl.getAllInput();
        //storing the values into the data structure
      if(inputVal.meal !== '' && inputVal.calories !== ''){
        const dynamicData = CalCtrl.addToDataCtrl(inputVal.meal, inputVal.calories);

        //Add to local storage
        StorageCtrl.storeInLs(dynamicData);
        //Display the dynamic data
        UICtrl.displayToList(dynamicData);

        const totalCal = CalCtrl.getTotalCal();

        UICtrl.displayTotalCal(totalCal);

        //Clear after click event
        UICtrl.clearInput();

      }
      e.preventDefault();
    
   }

   const editList = function(e){
     if(e.target.classList.contains('edit-item')){
       //Get list id from the list element (item-0)
       const listId     =  e.target.parentNode.id;
       const divideItem = listId.split('-');
       const getIdInt   = parseInt(divideItem[1]);

       //list item according to the id
       const ItemById = CalCtrl.getItemById(getIdInt);

       //S

       //Set to current state
       const currState = CalCtrl.setToCurrent(ItemById);

       //display the current list in the input
       const displayCurr = UICtrl.showCurrToInput(currState);
      
      return displayCurr;
     
     }
     e.preventDefault();
   }

   //update method
   const updateList = function(e){
     const update = UICtrl.getUpdateInput();

     //Add update input data into data structure
     const UpdateTodata = CalCtrl.addUpdateToData(update.meal, update.calories);
  
      UICtrl.showUpdateData(UpdateTodata);

      const totalCal = CalCtrl.getTotalCal();

      UICtrl.displayTotalCal(totalCal);
      StorageCtrl.updateLs(UpdateTodata);

      UICtrl.clearEditState();

     e.preventDefault();
   }

   const back = function(e){
    UICtrl.clearEditState();
     e.preventDefault();
   }

   const del = function(e){
     const currentIt = CalCtrl.getCurrentItem();

     CalCtrl.deleteItem(currentIt.id);

     UICtrl.deletedItem(currentIt.id);
 
     const totalCal = CalCtrl.getTotalCal();

     UICtrl.displayTotalCal(totalCal);

     UICtrl.clearInput();

     StorageCtrl.deleteFromLs(currentIt.id);
     UICtrl.clearEditState();

     e.preventDefault();
  }


  //Clear all list event
  const clearAll = function(e){
   //Clear all data from data structure
    CalCtrl.clearAllData();
   
    //remove all the list from UI on clearAll event
    UICtrl.removeAll();

    StorageCtrl.clearFromLs();

    const totalCal = CalCtrl.getTotalCal();

    UICtrl.displayTotalCal(totalCal);
    
    UICtrl.hideList();
    e.preventDefault();

  }


    //Public method
    return {
      init:function(){

        UICtrl.clearEditState();
        const items = CalCtrl.getItem;

        if(items.length === 0 ){
          UICtrl.hideList();
        }else{
         // UICtrl.populateItem(items);
        }
        
         loadEvent();
        
      }
      
    }
  
})(CalCtrl, UICtrl);

App.init();

