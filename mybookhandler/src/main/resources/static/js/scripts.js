
//Load a book from disk
function loadBook(filename, displayName) {
    let currentBook = "";
    let url = "../books/" + filename;

    //reset our UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //create a server a request to load our book
    var xhr = new XMLHttpRequest();
 /* open(method, url, async)	Specifies the type of request
    method: the type of request: GET or POST
    url: the server(file) location
    async: true(asynchronous) or false(synchronous)
    send()	Sends the request to the server(used for GET)*/
    xhr.open("GET", url, true);
    xhr.send();

    //What happens when we receive a response
    /* onreadystatechange	Defines a function to be called when the readyState property changes
       readyState	Holds the status of the XMLHttpRequest.
        0: request not initialized
        1: server connection established
        2: request received
        3: processing request
        4: request finished and response is ready
        status	200: "OK"
        403: "Forbidden"
        404: "Page not found"
        For a complete list go to the Http Messages Reference
        statusText	Returns the status-text (e.g. "OK" or "Not Found")*/
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            findMostUsedWords(currentBook);
            document.getElementById("fileContent").innerHTML = currentBook;

            //remove line breaks
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}

async function addbook( ){
    //Create a new formdata object with the information we want to send to the server
       let formData = new FormData();        
       //Add the chosen file to the object
       
 
       await fetch('/fileUpload.php', {
          method: "POST",
          crossDomain: true,
          body: JSON.stringify(formData)
        }).then(response => {
            if (!response.ok){
                throw new Error('Network response was not ok.');
            }
        }).catch((err) => {
            console.log(err);
        });    
        alert('Your book has been added!');
   
}

function findMostUsedWords(book){
    var a = book.toLowerCase();
    let wordArray = a.match(/\b\S+\b/g);
    let ourDictionary = {};

    var mostCommonArray = [];
    mostCommonArray = filterStopWords(wordArray);

   //for each word in our array let the variable wordvalue = to each instance
   //ourDictionary object is initialized here
   //it is an object of arrays, where index 0 = an array of key value pairs where the key is the word, and value is its count
   for(let word in mostCommonArray){
       let wordValue = mostCommonArray[word];
       if(ourDictionary[wordValue>0]){
           ourDictionary[wordValue] += 1;
       }else{
           ourDictionary[wordValue] =1;
       }
   }
    let ourWords = sortArray(ourDictionary);

    //Return the top 5 words
    var topWords = ourWords.slice(0, 6);
    var leastUsedWords = ourWords.slice(-6, ourWords.length);
   
    //write the values to the page
    documentStats(topWords, document.getElementById('mostUsed'));
    documentStats(topWords, document.getElementById('leastUsed'));
    
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    docLength.innerText = "Document Length " + a.length;
    wordCount.innerText = "Word Count: " + wordArray.length;
}
//Sort our array from highest word count to lowest word count
function sortArray(obj){
    let returnedArray = Object.entries(obj);
    returnedArray.sort(function(a,b){
        return b[1] - a[1];
    });
    return returnedArray;
 
    }
//Get the Top 5 Words and Least 5 Words values mapped into the HTML
function documentStats(popularWords, element){
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for(i=0; i<popularWords.length-1; i++){
        resultsHTML += templateHTML.replace('{{val}}', popularWords[i][0]+ ":" + popularWords[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML;
}

//Function to ignore these words in the Text
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}
//filter out stop words
function filterStopWords(wordArray) {
    var commonWords = getStopWords();
    var commonObj = {};
    var arrayValues = [];

    //Basically remove each of these words from the array
    for (i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    //Push the remaining values into an Array
    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            arrayValues.push(word);
        }
    }

    return arrayValues;
}

//This is our Search Function
function searchWords() {

    //read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    //find all the currently marked items
    let spans = document.querySelectorAll('mark');

    for (var i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    //whatever you typed into the Search
    var re = new RegExp(keyword, "gi");
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
    };

}