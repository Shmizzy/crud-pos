const itemGrid = document.querySelector('#item-grid');
const orderList = document.querySelector('#order-list');
const displayList = document.querySelector('#display-list');

let order = new Map();

const loadItems = async (type) => {
    const response = await fetch('http://localhost:3000/menu/' + type);
    const data = await response.json();
    itemGrid.innerHTML = '';
    data.menu.forEach(element => {
        createMenuItem(element.name, element.price);
    });
    addItemEl();
};

const loadOrders = async() => {
    const response = await fetch('http://localhost:3000/orders');
    const data = await response.json();

    data.orders.forEach(element => {
        createOrder(element.name, element.order, element._id);
    });
}
loadItems('entrees');
loadOrders();

const entreeButton = document.querySelector('#entrees');
const sideButton = document.querySelector('#sides');
const ingredientButton = document.querySelector('#ingredients');

entreeButton.addEventListener('click', () => loadItems('entrees'));
sideButton.addEventListener('click', () => loadItems('sides'));
ingredientButton.addEventListener('click', () => loadItems('ingredients'));


const submitOrderEl = document.querySelector('#submit-btn');

submitOrderEl.addEventListener('click', async () => {
    const nameEl = document.querySelector('#order-name');
    const nameData = nameEl.value;
    const finalOrder = {
        name: nameData,
        order,
    }

    const response = await fetch('http://localhost:3000/orders',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(finalOrder)
        });
    
    const data = await response.json();
    createOrder(nameData, order, data.id);
    console.log(data);

    nameEl.value = '';
    order = {};
    orderList.innerHTML = '';
    
});


const handleClick = (name, price) => {
    if(order[name]) {
        order[name]++;
        findElementandIncrement(name, price);
    }else {
        order[name] = 1
        addToOrderList(name, price);
    };
    
}

const findElementandIncrement = (name,price) => {    

    const foundPrice = document.querySelector(`.item-price[data-name="${name}"]`);
    const foundQty = document.querySelector(`.item-qty[data-name="${name}"]`);
    
    let currentQty = parseInt(foundQty.innerHTML);
    let currentPrice = parseInt(foundPrice.innerHTML);
    
    currentQty++;
    currentPrice = price * currentQty;

    foundQty.innerHTML = currentQty;
    foundPrice.innerHTML = currentPrice.toFixed(2);

}
const findElementandDecrement = (name,price) => {    

    const foundPrice = document.querySelector(`.item-price[data-name="${name}"]`);
    const foundQty = document.querySelector(`.item-qty[data-name="${name}"]`);
    
    let currentQty = parseInt(foundQty.innerHTML);
    let currentPrice = parseInt(foundPrice.innerHTML);
    

        currentQty--;
        currentPrice = price * currentQty;

        foundQty.innerHTML = currentQty;
        foundPrice.innerHTML = currentPrice.toFixed(2);

}

const addToOrderList = (name, price) => {    

    const orderItem = document.createElement('div');
    const removeItem = document.createElement('a');
    const itemName = document.createElement('h2');
    const itemQty = document.createElement('h2');
    const itemPrice = document.createElement('h2');
    
    removeItem.classList.add('remove-item');
    orderItem.classList.add('order-item'); 
    itemQty.classList.add('item-qty');
    itemPrice.classList.add('item-price');
    
   
    itemQty.dataset.name = name;
    orderItem.dataset.name = name;
    itemPrice.dataset.name = name;
    
    itemQty.innerHTML = '1';
    removeItem.innerHTML = '-';
    itemPrice.innerHTML = price;
    itemName.innerHTML = name;

    removeItem.addEventListener('click', () => {
            if(order[name] === 1 ){
                delete order[name];
                const foundItem = document.querySelector(`.order-item[data-name="${name}"]`);
                orderList.removeChild(foundItem);
            }else{
                order[name]--;
                findElementandDecrement(name, price);
            }
    });

    orderItem.appendChild(removeItem);
    orderItem.appendChild(itemQty);
    orderItem.appendChild(itemName);
    orderItem.appendChild(itemPrice)
    orderList.appendChild(orderItem);
}




const createOrder = (name, order, id) => {
    
    let displayOrderInString = '';

    for(let items in order){
        displayOrderInString += `${items}->${order[items]}x  `;
    }

    const orderElement = document.createElement('div');
    const namefromOrder = document.createElement('h1');
    const orderContent = document.createElement('h1');
    orderElement.classList.add('order-card')
    namefromOrder.innerHTML = name;
    orderContent.innerHTML = displayOrderInString;
    orderElement.appendChild(namefromOrder);
    orderElement.appendChild(orderContent);
    displayList.appendChild(orderElement);

    orderElement.addEventListener('click' , async () => {
        displayList.removeChild(orderElement);
        const response = await fetch('http://localhost:3000/orders/' + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        await loadOrders();
        console.log(data);
    });
}
const createMenuItem = (name, price)=> {
    const itemElement = document.createElement('div');
        itemElement.classList.add('item')
        const h1 = document.createElement('h1');
        h1.innerHTML = name;
        itemElement.appendChild(h1);
        itemGrid.appendChild(itemElement);
        itemElement.addEventListener('click', () => handleClick(name, price))
}
const addItemEl = ()=> {
    const itemElement = document.createElement('a');
        itemElement.classList.add('item')
        itemElement.innerHTML = '+';
        itemElement.href = '/item/add';
        itemGrid.appendChild(itemElement);
}