/*
 * Triangle Quiz Engine (PRO UPGRADE)
 * Version: 1.1.0
*/

document.addEventListener('DOMContentLoaded', () => {

/* ================= CONFIG ================= */

const API_URL='https://opentdb.com/api.php?amount=10&category=18&type=multiple';

/* ================= HELPERS ================= */

const fetchWithTimeout=(url,timeout=12000)=>{
return Promise.race([
fetch(url),
new Promise((_,reject)=>setTimeout(()=>reject(new Error('Timeout')),timeout))
]);
};

const decodeHTML=str=>{
const txt=document.createElement('textarea');
txt.innerHTML=str;
return txt.value;
};

const secureShuffle=array=>{
for(let i=array.length-1;i>0;i--){
const j=crypto.getRandomValues(new Uint32Array(1))[0]%(i+1);
[array[i],array[j]]=[array[j],array[i]];
}
};

/* ================= DOM ================= */

const startView=document.getElementById('quiz-start');
const startBtn=document.getElementById('start-quiz-btn');
const loader=document.getElementById('quiz-loader');
const mainView=document.getElementById('quiz-main');
const endView=document.getElementById('quiz-end');

const questionCounter=document.getElementById('question-counter');
const scoreText=document.getElementById('quiz-score');
const questionText=document.getElementById('question-text');
const answerButtonsContainer=document.getElementById('answer-buttons');
const feedbackText=document.getElementById('feedback-text');
const nextBtn=document.getElementById('next-question-btn');

const finalScoreText=document.getElementById('final-score');
const restartBtn=document.getElementById('restart-quiz-btn');

/* ================= STATE ================= */

let questions=[];
let currentQuestionIndex=0;
let score=0;

/* ================= START QUIZ ================= */

async function startQuiz(){

startView.style.display='none';
endView.style.display='none';
loader.style.display='block';
startBtn.setAttribute('aria-busy','true');

questions=[];
currentQuestionIndex=0;
score=0;

let retries=2;

while(retries>=0){

try{

const res=await fetchWithTimeout(API_URL,12000);
const data=await res.json();

if(data.response_code!==0){
throw new Error('API Error');
}

questions=data.results;
break;

}catch(e){

if(retries===0){
loader.style.display='none';
startView.style.display='block';
startBtn.setAttribute('aria-busy','false');
alert('Quiz failed to load.');
return;
}

retries--;

}

}

loader.style.display='none';
mainView.style.display='block';
startBtn.setAttribute('aria-busy','false');

displayQuestion();

}

/* ================= DISPLAY QUESTION ================= */

function displayQuestion(){

feedbackText.textContent='';
nextBtn.style.display='none';
answerButtonsContainer.innerHTML='';

const q=questions[currentQuestionIndex];

questionCounter.textContent=`Question ${currentQuestionIndex+1} / ${questions.length}`;
scoreText.textContent=`Score: ${score}`;

questionText.textContent=decodeHTML(q.question);

const answers=[
...q.incorrect_answers.map(a=>decodeHTML(a)),
decodeHTML(q.correct_answer)
];

secureShuffle(answers);

answers.forEach(a=>{
const btn=document.createElement('button');
btn.textContent=a;
btn.classList.add('answer-btn');
btn.addEventListener('click',()=>handleAnswer(a,btn));
answerButtonsContainer.appendChild(btn);
});

}

/* ================= HANDLE ANSWER ================= */

function handleAnswer(selected,btn){

const q=questions[currentQuestionIndex];
const correct=decodeHTML(q.correct_answer);

[...answerButtonsContainer.children].forEach(b=>{
b.disabled=true;

if(b.textContent===correct){
b.classList.add('correct');
}else if(b===btn){
b.classList.add('wrong');
}
});

if(selected===correct){
score++;
feedbackText.textContent='Correct!';
feedbackText.style.color='var(--primary-color)';
}else{
feedbackText.textContent='Wrong! Correct: '+correct;
feedbackText.style.color='#ff6b6b';
}

nextBtn.style.display='block';
scoreText.textContent=`Score: ${score}`;

}

/* ================= NEXT ================= */

function showNextQuestion(){

currentQuestionIndex++;

if(currentQuestionIndex<questions.length){
displayQuestion();
}else{
showEndScreen();
}

}

function showEndScreen(){

mainView.style.display='none';
endView.style.display='block';
finalScoreText.textContent=`Score: ${score} / ${questions.length}`;

}

/* ================= EVENTS ================= */

startBtn.addEventListener('click',startQuiz);
nextBtn.addEventListener('click',showNextQuestion);
restartBtn.addEventListener('click',startQuiz);

});
