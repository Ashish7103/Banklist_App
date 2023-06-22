'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Ashish Singh',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-02-02T21:31:17.178Z',
    '2023-02-05T07:42:02.383Z',
    '2023-02-10T09:15:04.904Z',
    '2023-02-12T10:17:24.185Z',
    '2023-02-20T14:11:59.604Z',
    '2023-02-22T17:01:17.194Z',
    '2023-02-23T23:36:17.929Z',
    '2023-02-24T10:51:36.790Z',
  ],
  currency: 'INR',
  // locale: 'pt-PT', // de-DE
  locale: 'en-BT', // de-DE
};

const account2 = {
  owner: 'Anshu Raj',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-02-01T13:09:33.035Z',
    '2023-02-30T09:12:16.867Z',
    '2023-02-25T06:17:23.907Z',
    '2023-02-25T14:18:46.235Z',
    '2023-02-05T16:20:06.386Z',
    '2023-02-10T14:22:26.374Z',
    '2023-02-25T18:24:59.371Z',
    '2023-02-26T12:24:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const universal=document.querySelector(".universal");

/////////////////////////////////////////////////
// Functions
const formatMovementDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date1 - date2) / (24 * 60 * 60 * 1000)));

  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed == 0) return 'today';
  if (daysPassed == 1) return 'yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days ago `;
  else {
    return Intl.DateTimeFormat(locale).format(date);
    //  const year=date.getFullYear();
    //   const month=`${date.getMonth()+1}`.padStart(2,0);// 2 index if 1 than add 0 at first position if two do not add any thing
    //   const day=`${date.getDate()}`.padStart(2,0);
    //   return `${day}/${month}/${year}`;}

    // console.log(daysPassed);
  }
};

//  formatting currency
const formatCurr=function(value,locale,currency){
 return Intl.NumberFormat(locale,{
    style:'currency',
    currency:currency,
    // currency:'INR',
  }).format(value);
}


// const displayMovements = function (acc) {
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements.slice().sort((a, b) => a - b)
      : acc.movements;
  
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);

    const displayDates = formatMovementDate(date, acc.locale);

    // currency
    const formattedMov=Intl.NumberFormat(acc.locale,{
      style:'currency',
      currency:acc.currency,
      // currency:'INR',
    }).format(mov)

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDates}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// const displayMovements = function (acc, sort = false) {
//   containerMovements.innerHTML = "";

//   const movs = sort
//     ? acc.movements.slice().sort((a, b) => a - b)
//     : acc.movements;

//   movs.forEach(function (mov, i) {
//     const type = mov > 0 ? "deposit" : "withdrawal";

//     const date = new Date(acc.movementsDates[i]);
//     const displayDate = formatMovementDate(date, acc.locale);

//     const formattedMov = formatCur(mov, acc.locale, acc.currency);

//     const html = `
//       <div class="movements__row">
//         <div class="movements__type movements__type--${type}">${
//       i + 1
//     } ${type}</div>
//         <div class="movements__date">${displayDate}</div>
//         <div class="movements__value">${formattedMov}</div>
//       </div>
//     `;

//     containerMovements.insertAdjacentHTML("afterbegin", html);
//   });
// };

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  //  display currency
  const formattedMov=formatCurr(acc.balance,acc.locale,acc.currency);
  
  // Intl.NumberFormat(acc.locale,{
  //   style:'currency',
  //   currency:acc.currency,
  //   // currency:'INR',
  // }).format(acc.balance);
  // // console.log(formattedMov);
  

  labelBalance.textContent = `${formattedMov}`;
};

const calcDisplaySummary = function (acc) {

  // display currency
 
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);


  labelSumIn.textContent = `${formatCurr(incomes,acc.locale,acc.currency)}`;

  const out =Math.abs( acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0))
  labelSumOut.textContent = `${formatCurr(out,acc.locale,acc.currency)}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${formatCurr(interest,acc.locale,acc.currency)}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};


const startLogOutTimer=function(){
  const tick=function(){
    const min=String(Math.floor(time/60)).padStart(2,0);
    const second=String(Math.floor(time%60)).padStart(2,0);
    labelTimer.textContent=`${min}:${second}`;
    //  Decrease it
    if(time===0){
      clearInterval(timer);
      labelWelcome.textContent='Log in to get started'
containerApp.style.opacity = 0;
    }
    time--;

    // When 0 sec stop timer an logout
  
  }

  // set time to 5 min 
  let time=120;
  //  call timer every second
  tick();
 const timer= setInterval(tick,1000)

 return timer;
}

///////////////////////////////////////
// Event handlers
let currentAccount,timer;

//FAKE ALWAYS LOGGED IN
// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase()
  );
  // console.log(currentAccount);

  //  create current date and time by intl
  const now = new Date();

  // const local=navigator.language;//en-US // tocheck what is language and date format of ur country
  // console.log(local);

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'short', // narraow/short/long/numeric
    year: 'numeric', //2-digit
    weekday: 'short', // short/narrow/long
  };
  const formatDate = Intl.DateTimeFormat(currentAccount.locale, options).format(
    now
  );
  labelDate.textContent = formatDate;

  // const formattedMov=Intl.NumberFormat(currentAccount.locale,).format()

  // const now=new Date();
  // const year=now.getFullYear();
  // const month=`${now.getMonth()+1}`.padStart(2,0);// 2 index if 1 than add 0 at first position if two do not add any thing
  // const date=`${now.getDate()}`.padStart(2,0);
  // const hour=`${now.getHours()}`.padStart(2,0);
  // const minute=`${now.getMinutes()}`.padStart(2,0);
  // labelDate.textContent=`${date}/${month}/${year},${hour}:${minute}`;

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Timer
    if(timer) clearInterval(timer);

    timer=startLogOutTimer();
    // Update UI
    updateUI(currentAccount);

    // block display of id and passward
    universal.classList.add('blocked')


  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value.toLowerCase()
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    setTimeout(function(){
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //  Add date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // reset timer
    clearInterval(timer);
    timer=startLogOutTimer();

    // Update UI
    updateUI(currentAccount);
  },2000)
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function(){
    // Add movement
    currentAccount.movements.push(amount);

    //  add loandate
    currentAccount.movementsDates.push(new Date().toISOString());

    
    // reset timer
    clearInterval(timer);
    timer=startLogOutTimer();
    

    // Update UI
    updateUI(currentAccount);
  },2000)
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value.toLowerCase() === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/*
// ////////////////////////
// NUmber convresion
console.log(23===23.0);

// BASE 10- 0 to 9 .1/10=0.1 3/10=3.333
//  binary base 2- 0 or 1

console.log(0.1+0.2 ===0.3);
console.log(3/10);

// CONVERSION (CONVERT A STRING TO A NUMBER)
console.log(Number('23'));
console.log(Number('Awsome')); // Nan
console.log(+('23'));
console.log(('23')*1);
console.log(('23')/1);
console.log(~~('23'));// return -(x+1) single ~ double ~~ return x
console.log(~~('awsome'));// return 0
console.log(('23')-0);

//  by using function
//  round the value down the nearest integer
console.log(Math.floor('23.5'));//23
//  round the value up to nearest integer
console.log(Math.ceil('23.5'));//24
//  round the value to nearest integer either up or down but nearest
console.log(Math.round('23.7'));//24
console.log(Math.round('23.3'));//23


//  parsing
//  extract number value if present at beging
// .parstInt only return int value
console.log(Number.parseInt('23px',10));// return 23  //  taking string and base as a argument
console.log(Number.parseInt('23px',2));// return Nan
console.log(Number.parseInt('23px'));// return 23 // default base 10
console.log(Number.parseInt('e2600')); // return Nan
console.log(Number.parseInt('23.5px',10));
//  return 23

//  .parsefloat  return float value
console.log(Number.parseFloat('23.5px',10));// return 23.5
console.log(Number.parseFloat('23.5px',2)); // return Nan
console.log(Number.parseFloat('23px',10)); // return 23


//  isNan for check value is NaN 
//  return boolean value 
//  return infinity is false is not a number

console.log(Number.isNaN(20));
console.log(Number.isNaN(~~'20'));
console.log(Number.isNaN(23/0));
console.log(Number.isNaN(+'23px'));
console.log(Number.isNaN('23'));

//  checking is value is numbeer on not
console.log(Number.isFinite(20));
console.log(Number.isFinite(20.5));
console.log(Number.isFinite(~~'20'));
console.log(Number.isFinite('23/0'));
console.log(Number.isFinite(+'23px'));
console.log(isFinite(+'23'));// false


//  checking value is integer or not
console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23/0));
*/
/*

// ////////////////////////////

///////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25)); //return 5 square root
console.log(25 ** (1 / 2));//return 5 square root
console.log(8 ** (1 / 3));// return 2 cube root

// givemax value
console.log(Math.max(5, 18, 23, 11, 2));
console.log(Math.max(5, 18, '23', 11, 2));// return 23 convert string into number
console.log(Math.max(5, 18, '12px', 11, 2));// return NaN if any value present inside the function is Nan

//  return min value
console.log(Math.min(5, 18, 23, 11, 2));

//  Math.PI return value of PI and ** dosquare of 10
console.log(Math.PI * Number.parseFloat('10px') ** 2);

// return a randam value
// mth.trunc return integer part removing frection 
console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + 1) + min;
// 0...1 -> 0...(max - min) -> min...max
// console.log(randomInt(10, 20));

// Rounding integers

console.log(Math.round(23.3));//23
console.log(Math.round(23.9));//24

console.log(Math.ceil(23.3));//24
console.log(Math.ceil(23.9));//24

console.log(Math.floor(23.3));//23
console.log(Math.floor('23.9'));//23

console.log(Math.trunc(23.3));//23

console.log(Math.trunc(-23.3));//-24
console.log(Math.floor(-23.3));//-24

// Rounding decimals
// return decimal value up to given position inside bracket
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(2));
*/
/*
///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2);
console.log(5 / 2); // 5 = 2 * 2 + 1

console.log(8 % 3);
console.log(8 / 3); // 8 = 2 * 3 + 2

console.log(6 % 2);
console.log(6 / 2);

console.log(7 % 2);
console.log(7 / 2);

const isEven = n => n % 2 === 0;
console.log(isEven(8));
console.log(isEven(23));
console.log(isEven(514));

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9
    if (i % 3 === 0) row.style.backgroundColor = 'blue';
  });
});

*/

/*
///////////////////////////////////////
// Numeric Separators

// 287,460,000,000
const diameter = 287_460_000_000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

console.log(Number('230_000'));
console.log(parseInt('230_000'));
*/

/*
///////////////////////////////////////
// Working with BigInt
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 -2);


console.log(2 ** 53 + 4);

console.log(4838430248342043823408394839483204n);
//  type conversion
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
// console.log(10000n + 10000);// error
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(36286372637263726376237263726372632n * 10000000);// error
// console.log(Math.sqrt(16n));

const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));// type conversion

// Exceptions
console.log(20n > 15);
console.log(20n === 20);// false because do not allow for typecasstion ===
console.log(typeof 20n);
console.log(20n == '20');// true type casting ==

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);// only return integer value not float
console.log(10 / 3);

*/
/*
////////////////////////////////
// CREATING DATES
const now =new Date();
console.log(now);
console.log(new Date(' Feb 24 2023 21:25:48'));
console.log(new Date(' feb 24,2023'));
console.log(new Date(account1.movementsDates[0]));


console.log(new Date(2023,1,24,10,17,49));//month jan=0
console.log(new Date(2023,1,24,10,17));//month jan=0
console.log(new Date(2023,1,30));//js auto correcct date if  date voilate the rule
//  1 means feb
//  sun=0

console.log(new Date(0));//1970 1 jan
console.log(new Date(3*24*60*60*1000));// milisecond value in one days



// WORKING WITH DATES

const future=new Date(2023,2,24,10,24);
console.log(future);
console.log(future.getFullYear());
console.log(future.getMonth());
console.log(future.getDay());
console.log(future.getDate());
console.log(future.getHours());
console.log(future.getMinutes());
console.log(future.getMilliseconds());

console.log(future.toISOString());//INTERNATIONAL ORGANISATION FOR STANDARDIZATION
console.log(future.toDateString());

console.log(future.getTime());// reture date value in millisecond on calculate since 1970 1 JAN

console.log(new Date(1679633640000));// calculate date in milisecond since 1 jan 1970


//  for correction in date set property is use 
//  it has also setmonth,day ,hours etc. property like get 
future.setFullYear(2040);

//  set propery mutate or make permanent change in orignat date 
console.log(future);


*/
/*
///////////////////////////////////////

//  opearation on dates
//  dates  are subtracted simply because their subtraction value generally stored 
//  as milisocond which is easily converted into days

const date=new Date ();
console.log(date);

const calcDisplayDate=(date1,date2)=>Math.abs(date2-date1);
console.log(`${calcDisplayDate((2023,2,4),(2023,2,14))} Days ago`);
*/

/*
// //////////////////////////////
//  Internlisating dates
//  in diffrent country and languages there are diffrent way to format date and time 
// so intl is used to take date and language from api and format date and time based on their current location

const now=new Date();
const local=navigator.language;

console.log(local);

const options={
  hour:'numeric',
  minute:'numeric',
  day:'numeric',
  month:'numeric',// narraow/short/long
  year:'numeric',//2-digit
  weekday:'long',// short/narrow
}
const formatDate=Intl.DateTimeFormat(local,options).format(now)
console.log(formatDate);
*/

/*
///////////////////////////////////////
// Internationalizing Numbers (Intl)
const num = 3884764.23;

const options = {
  style: 'currency',//percent,unit,currency
  unit: 'celsius',
  currency: 'EUR',// value of currency define manually
  // useGrouping: false,
};

console.log('US:      ', new Intl.NumberFormat('en-US', options).format(num));
console.log('Germany: ', new Intl.NumberFormat('de-DE', options).format(num));
console.log('Syria:   ', new Intl.NumberFormat('ar-SY', options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);
*/
/*
///////////////////////////////////////
// Timers

// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
console.log('Waiting...');

if (ingredients.includes('spinach')) clearTimeout(pizzaTimer);

// setInterval
setInterval(function () {
  const now = new Date();
  console.log(now);
}, 1000);
*/
