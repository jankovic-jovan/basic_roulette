let angle = 0;
let w = document.getElementById("thewheel")
let wallettext = document.getElementById("wallettext");
let resulttext = document.getElementById("resulttext");
var timer;
var currentMoney = 1000;
var onTheTableMoney = 0;
let startAngleSpeed = 2;
let newAngleBuffer = 0;
let angleSpeed = startAngleSpeed;
let winAmount = 0;
var result;
var color;
var isEven;
var currBetAmount = 10;
let winlosetext = document.getElementById('winlosetext');
var audio = new Audio('cashsfx.mp3');
var sfxbut1 = new Audio('sfxbut1.wav');
var sfxbut2 = new Audio('sfxbut2.wav');
var spinbut = new Audio('spinbut.wav');

var notspinning = true;

var bet_options = new Array();
var bet_amounts = new Array();

//what updates should we add:
//cool comments not just you won or you lost (you can generate this with AI)
//adsense izy money
//how to update on github
//not anything else for now i think

var win_comments = [
    "You're on a roll!",
    "Lucky you! Maybe you should buy a lottery ticket.",
    "Winner winner, chicken dinner! And dessert too.",
    "Another victory! You're unstoppable.",
    "Hot streak! Keep it going, until the cows come home.",
    "Your luck is shining brighter than a diamond.",
    "You've got the Midas touch, but without the gold fever.",
    "The casino is your playground, and you're the king of the castle.",
    "Feeling lucky tonight? Well, you should be!",
    "Your lucky star is aligned, and it's looking pretty good.",
    "Celebrate your win! You deserve it more than a puppy."
];

var lose_comments = [
    "Better luck next time, but don't worry, the next one might just be a hit.",
    "Don't give up, the next spin could be your lucky one, even if it feels like a long shot.",
    "Close but no cigar, but at least you didn't have to smoke it.",
    "That's how the cookie crumbles, but at least you didn't get crumbs in your keyboard.",
    "Sometimes you win, sometimes you learn, and sometimes you just get unlucky.",
    "Every cloud has a silver lining, like a rainbow after a storm.",
    "Keep your head up, better days are ahead, and maybe a better spin too.",
    "Don't let this loss discourage you, remember, even the best gamblers lose sometimes.",
    "The wheel of fortune turns, and sometimes it spins against you, but don't worry, it'll spin in your favor eventually.",
    "It's just a game, don't take it too hard, unless you were betting your life savings.",
    "Learn from this loss and come back stronger, like a phoenix rising from the ashes."
];

var equal_comments = [
    "Breaking even isn't bad, especially when you consider the alternative.",
    "Keep playing and see where it takes you, even if it's just around in circles.",
    "A tie is as good as a win, right? Especially when you're not losing money.",
    "No loss, no gain, but at least you didn't lose any hair over it.",
    "Maybe next time you'll hit the jackpot, or at least a decent win.",
    "Stay in the game and see what happens, even if it's just more spinning.",
    "Don't give up, the next spin could be your lucky one, even if it feels like a long shot.",
    "A tie is a good way to keep the excitement going, even if it's not as exciting as winning.",
    "Keep playing and see if you can break the streak, or at least make it more interesting.",
    "A tie is a neutral outcome, but at least you didn't lose any money, and that's a win in my book."
];

function rotate()
{
    angle = (angle + angleSpeed);
    w.style.transform = "rotate("+angle+"deg)";
    if (angle - newAngleBuffer >= 2600 && angle - newAngleBuffer < 3200) angleSpeed = 1;        
    if (angle - newAngleBuffer >= 3200 && angle - newAngleBuffer < 3560) angleSpeed = 0.5;
    if (angle - newAngleBuffer >= 3560 && angle - newAngleBuffer < 3700) angleSpeed = 0.2;
    if (angle - newAngleBuffer >= 3700 && angle - newAngleBuffer < 3750) angleSpeed = 0.1;
    if(angle - newAngleBuffer >= 3750)
    {
        clearInterval(timer);
        console.log('finished rotating');
        spinCalc();
    }
}

function undo_bet()
{
    if (notspinning && bet_options.length != 0)
    {   
        //we should pull from bet ops and bet amounts, and give back the money
        bet_options.pop();
        sfxbut2.play();
        var returned_amount = bet_amounts.pop();
        onTheTableMoney = onTheTableMoney - returned_amount;
        currentMoney = currentMoney + returned_amount;
        wallettext.innerHTML = "Wallet: " + currentMoney + "$";
    }
}

function betButtonClick(number)
{
    if(notspinning && currentMoney - currBetAmount >= 0){
        sfxbut2.play();
        bet_options.push(number);
        bet_amounts.push(currBetAmount); //for now we are betting 1 dollar for every bet, later ill add the possibility for other amounts
        currentMoney = (currentMoney - currBetAmount); //maybe we can add an option to undo, it wouldn't be that hard actually, remember that!!!
        onTheTableMoney = (onTheTableMoney + currBetAmount);
        wallettext.innerHTML = "Wallet: " + currentMoney + "$";
        console.log(bet_options, bet_amounts);
    }
}

function spinStartAnim()
{
    //this is the place where the magic happens - not really, its just the beggining
    //Basically we have a list of elements selected, and we should have a list alongside that list which has all the values of actual bets
    //So we will first perfrom the animation, then get a RNG number 0-36 and then see if it is red black even odd
    //After that we scroll through the bets and see if they hit, if so you add the money
    if (notspinning)
    {
        spinbut.play();
        notspinning = false;
        winlosetext.innerHTML = "";
        timer = setInterval(rotate, 1);
    }
    else
    {
        //the guy wants to skip, we need to adjust the angle, rotate the image accordingly and start spincalc 
        angle = newAngleBuffer + 3750; //this is the final angle
        w.style.transform = "rotate("+angle+"deg)"; // dont ask me why the variable is called w
        clearInterval(timer);
        console.log('finished rotating');
        spinCalc();
    }
    
    //we will add a skip option, if u click the button twice, it will skip the anim
}

function spinCalc()
{
    result = getRandomIntInclusive(0, 36);
    if (result % 2 == 0) color = 'black';
    if (result % 2 == 1) color = 'red';
    if (result == 0) color = 'green';

    if (color == 'green' || color == 'black') 
    {
        isEven = 1;
    }
    else 
    {
        isEven = 0;
    }

    console.log(result + ", " + color);
    if (color == 'red') resulttext.innerHTML = result + ", 🟥";
    else if (color == 'black') resulttext.innerHTML = result + ", ⬜";
    else resulttext.innerHTML = result + ", 🟩";

    bet_options.forEach((bet, index) => {
        //now we checking the bet
        if (bet == result)
        {
            //we hit THE number, so we multiply the amount by 37 and add that to winAmount, which we will add in the end
            winAmount = winAmount +  36*bet_amounts[index];
        }
        if ((bet == 'red' && color == 'red') || (bet == 'black' && color == 'black'))
        { 
            //the guy hit the color, we give him the payout 1 to 1
            winAmount = winAmount + 2*bet_amounts[index];
        }
        if ((bet == 'even' && isEven == 1) || (bet == 'odd' && isEven == 0))
        {
            //the guy got the evenness, we give him 1 to 1
            winAmount = winAmount + 2*bet_amounts[index];
        }
        if ((bet == '1to18' && bet >= 1 && bet <= 18) || (bet == '19to36' && bet >= 19 && bet <= 36))
        {
            //the lad got the halves right, payout 1 to 1
            winAmount = winAmount +  2*bet_amounts[index];
        }
        if ((bet == '1st12' && result >= 1 && result <= 12) || 
            (bet == '2nd12' && result >= 13 && result <= 24) ||
            (bet == '3rd12' && result >= 25 && result <= 36))
        {
            //he got it right, return 2 to 1
            //this is code for 1st, 2nd and 3rd dozen, not for left mid right
            //so ill change the bet condiiton, and then actually make left mid right
            winAmount = winAmount + 3*bet_amounts[index];
        }
        if ((bet == 'left12' && result % 3 == 1)
        ||  (bet == 'mid12') && result % 3 == 2
        ||  (bet == 'right12') && result % 3 == 0)
        {
            //now we got the left mid right thing
            winAmount = winAmount + 3*bet_amounts[index];
        }
    });

    //thats it for the rewards, finally
    //for now
    if (winAmount > onTheTableMoney)
    {
        console.log("congrats! you won money");
        winlosetext.innerHTML = win_comments[getRandomIntInclusive(0, win_comments.length-1)];
        audio.play();
    }
    else if (winAmount < onTheTableMoney)
    {
        console.log("screw this");
        winlosetext.innerHTML = lose_comments[getRandomIntInclusive(0, lose_comments.length-1)];
    }
    else{
        //he actually played, but didn't win anything
        winlosetext.innerHTML = equal_comments[getRandomIntInclusive(0, lose_comments.length-1)];
    }
    
    currentMoney = currentMoney + winAmount;
    console.log("the money: " + currentMoney);
    wallettext.innerHTML = "Wallet: " + currentMoney + "$";

    //now you should reset everything, so you can start new bets, press again the spin button and everything
    bet_options = new Array();
    bet_amounts = new Array();
    onTheTableMoney = 0;
    winAmount = 0;
    newAngleBuffer = angle;
    angleSpeed = startAngleSpeed;
    notspinning = true;
    w.style.transform = "rotate("+angle+"deg)";
    timer = 0;
}

//fala internet
function getRandomIntInclusive(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function setBetAmount(value)
{
    if(notspinning){
        sfxbut1.play();
        currBetAmount = value;
    }
}