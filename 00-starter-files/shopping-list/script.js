const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.querySelector('.form-input-filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems () {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item =>addItemToDOM(item));
    checkUI();
}

function onAddItemSubmit(e) {
    e.preventDefault();

    const newItem = itemInput.value;
    
    //Validate Input
    if (newItem === '') {
        alert('Please enter an item');
        return;
    }
    
    // Check for edit mode
    if (isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else {
        if (checkIfItemExists(newItem)) {
            alert('Item already exists');
            return;
        }
    }

    ///create item DOM element
    addItemToDOM(newItem);

    //add item ti local storage
    addItemToStorage(newItem);

    checkUI();

    itemInput.value = '';   
}

function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    //add new item to array
    itemsFromStorage.push(item);

    //convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function createButton(classes) {
    const button = document.createElement('button');
    button.className = classes;
    const icon = createIcon('fa-solid fa-xmark')
    button.appendChild(icon);
    return button;
}

function createIcon(classes) {
    const icon = document.createElement('i')
    icon.className = classes;
    return icon;
}

function addItemToDOM (item) {
    //Create list item
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button)
    
    //add li to DOM
    itemList.appendChild(li);
}

function getItemsFromStorage () {
    let itemsFromStorage;

    if (localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }
    return itemsFromStorage;
}

function onClickItem(e) {
    if (e.target.parentNode.classList.contains('remove-item')) {
        removeItem(e.target.parentNode.parentNode);
    } else {
        setItemToEdit(e.target);
    }
}

function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item); 
}

function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(item => item.classList.remove('edit-mode'));
    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>&nbsp;Update Item';
    formBtn.style.backgroundColor = '#228b22'
    itemInput.value = item.textContent;
}

function removeItem (item) {
    console.log(item);
    if (confirm('Are you sure you want to remove item ' + item.innerText)) {
            // Remove item from DOM
            item.remove();

            //Remove Item from storage
            removeItemFromStorage(item.textContent);
            
            checkUI();
        }
};

function removeItemFromStorage(item) {
    let itemsFromStorage = getItemsFromStorage();
    
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);
    
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearAll () {
    
    if (confirm('Are you sure you want to remove all items?')) {
        while (itemList.firstChild) {
            itemList.removeChild(itemList.firstChild);
        }
        localStorage.removeItem('items');

        checkUI();
    }
};

function filterItems (e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    items.forEach((item) => {
        const itemName = item.innerText.toLocaleLowerCase();
        
        if (itemName.includes(text)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        } 
    });
}

function checkUI () {
    itemInput.value = '';
    
    const items = itemList.querySelectorAll('li');

    if (items.length === 0) {

        itemFilter.style.display = 'none';
        clearBtn.style.display = 'none';
    } else {
        itemFilter.style.display = 'block';
        clearBtn.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
};

//Initialize app
function init () {

    //Event Listeners
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearAll);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);
    
    checkUI();
}

init();



