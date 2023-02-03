const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history-button");

btn.addEventListener('click', () => {
    let inpWord = document.getElementById("inp-word").value;
    fetch(`${url}${inpWord}`)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            let text="";
            if(data[0].phonetic!="")
              text=data[0].phonetic;
            result.innerHTML = `
           <div class="word" >
                    <h3>${inpWord}</h3>
                    <button onclick="playSound()">
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
            const historyItem = document.createElement("ul");
            historyItem.innerHTML = inpWord;
            historyList.appendChild(historyItem);
            
            
        })
        
        .catch(()=>{
            
            result.innerHTML=`<h3 class="error">could not find the word</h3>`;
        })
        
    });
    
    function playSound(){
        sound.play();
        console.log("play");
    }
    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML="";
        
      });
    
    
    