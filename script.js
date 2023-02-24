const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

btn.addEventListener('click', () => {
    let inpWord = document.getElementById("inp-word").value;
    let searchWordsLocalStorage = localStorage.getItem("search_words");
    let searchWords = searchWordsLocalStorage ? JSON.parse(searchWordsLocalStorage) : [];

    fetch(`${url}${inpWord}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            searchWords.push(data);
            let text="";
            if(data[0].phonetic!="")
              text=data[0].phonetic;
            result.innerHTML = `
           <div class="word" >
                    <div class="word-title">${inpWord}</div>
                    <button onclick="playSound()" class = "word-audio-btn">
                        <i class="fa-solid fa-volume-high"></i>
                    </button>
             </div>
             <div class="details">
                    <p>${data[0].meanings[0].partOfSpeech}</p>
                   
                    <p>${text}</p>
                    
             </div>
             <p class="word-meaning">
                    ${data[0].meanings[0].definitions[0].definition}
             </p>
             <p class="word-example">
                    ${(data[0].meanings[0].synonyms).splice(0,3)|| ""}
             </p>`;
             if(data[0].phonetics.length==1)
               sound.setAttribute("src",`${data[0].phonetics[0].audio}`);
            else
            { 
                let pronounce="";
                data[0].phonetics.map((info)=>{
                    if(info.audio!=""){
                        
                         pronounce=info.audio;   
                    }
                       
                })
                sound.setAttribute("src",pronounce);
            }
            result.style.display = "block";
            localStorage.setItem("search_words", JSON.stringify(searchWords))
        })
        
        .catch(()=>{
            
            result.innerHTML=`<div class="error"> Sorry ! Could not find the word "${inpWord}"</div>`;
            result.style.display = "block";
        })
        
    });
    
    function playSound(){
        sound.play();
        console.log("play");
    }
    // clearHistoryBtn.addEventListener('click', () => {
    //     historyList.innerHTML="";
        
    //   });

function deleteHistory(wordIndex){
    console.log(wordIndex);
    let searchWordsLocalStorage = localStorage.getItem("search_words");
    let searchWords = searchWordsLocalStorage ? JSON.parse(searchWordsLocalStorage) : [];
    searchWords.splice(wordIndex, 1);
    localStorage.setItem("search_words", JSON.stringify(searchWords));
    printHistory();
}
function printHistory(){
    let searchWordsLocalStorage = localStorage.getItem("search_words");
    let searchWords = searchWordsLocalStorage ? JSON.parse(searchWordsLocalStorage) : [];

    let historyHtml = "";

    searchWords.forEach((word, wordInd) => {
        let wordObj = word[0];
        historyHtml += `
            <div class="history-item-box">
                <div class="history-word-title">
                    ${wordObj.word}
                </div>
                <div class="history-word-description">
                    ${wordObj.meanings[0].definitions[0].definition}
                </div>
                <div class="delete-container">
                    <button class="history-delete-btn" onclick="deleteHistory(${wordInd})">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            </div>
        `
    });

    if(searchWords.length === 0){
        document.getElementById("clear-history-btn").style.display = "none";
        historyHtml = '<div class="no-history"> No search history </div>'
    }
    else{
        document.getElementById("clear-history-btn").style.display = "block";
    }

    document.getElementById("history-results").innerHTML = historyHtml;
}
document.getElementById("view-history").addEventListener('click', () => {
    document.getElementById("history-popup").style.display = "flex";
    printHistory();
})
document.getElementById("popup-close-btn").addEventListener('click', () => {
    document.getElementById("history-popup").style.display = "none";
})
document.getElementById("clear-history-btn").addEventListener('click', () => {
    localStorage.removeItem("search_words");
    document.getElementById("history-popup").style.display = "none";
})
