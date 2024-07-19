
const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");

const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateBtn");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

const symbols='~!@#$%^&+()_-+={[}]|:;"<,>.?/';

//Initial value set:
let password="";
let passwordLength=10;
let checkCount=0;
handleSLider();

//set strength circle color to white
setIndicator("#ccc");

//set password length:


function handleSLider(){
  inputSlider.value=passwordLength;
  lengthDisplay.innerText=passwordLength;

  let min=inputSlider.min;
  let max=inputSlider.max;
  inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"

}

//set indicator:
function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow:
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRandInteger(min,max){
 return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandInteger(97,123));
}


function generateUpperCase(){
    return String.fromCharCode(getRandInteger(65,91));
}


function generateSymbol(){
    const randNum=getRandInteger(0,symbols.length);
    return symbols.charAt(randNum);
}

//strength password:
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked) hasNum=true;
    if(symbolsCheck.checked) hasSym=true;

   if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8 ){
    setIndicator("#0f0");
   }
   else if((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6){
    setIndicator("#ff0");
   }
   else{
    setIndicator("#f00");
   }
   
}

//copy password:
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
      copyMsg.innerText="Failed";
    }
    
    //to make copy wala text visible
    copyMsg.classList.add("active"); 

    setTimeout( () =>{
        copyMsg.classList.remove("active");
    },2000);

}



inputSlider.addEventListener('input',(e)=> {
    passwordLength=e.target.value;

    handleSLider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

   if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSLider();
   }

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})


//shuffle password:
function sufflePassword(array){
    //fisher yates method:
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>( str+=el ));
    return str;

}


generateBtn.addEventListener('click',()=>{
  //none of the checkbox are selected
  if(checkCount == 0)
      return;

  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSLider();
  }

  //let's start the journey to find new password:
  //remove old password:

   password="";
  //lets put the stuff mentioned by checkbox:
//   if(uppercaseCheck.checked){
//     password+=generateUpperCase();
//   }

//   if(lowercaseCheck.checked){
//     password+=generateUpperCase();
//   }

//   if(numbersCheck.checked){
//     password+=generateUpperCase();
//   }

//   if(symbolsCheck.checked){
//     password+=generateUpperCase();
//   }

  let funcArr=[];

  if(uppercaseCheck.checked){
    funcArr.push(generateUpperCase);
  }

  if(lowercaseCheck.checked){
    funcArr.push(generateLowerCase);
  }

  if(numbersCheck.checked){
    funcArr.push(generateRandomNumber);
  }

  if(symbolsCheck.checked){
    funcArr.push(generateSymbol);
  }

  for(let i=0;i<funcArr.length;i++){
    password += funcArr[i]();
  }

  //remaining addition:
  for(let i=0;i<passwordLength-funcArr.length;i++){
    let randomIndex=getRandInteger(0,funcArr.length);
    password+=funcArr[randomIndex]();
  }

//shuffle password:
  password=sufflePassword(Array.from(password));

//show in UI:
passwordDisplay.value=password;

//calculate strength:
calcStrength();

});






