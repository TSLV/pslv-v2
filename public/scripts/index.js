let placeholder = document.getElementById("heading-text");
let words = ["Welcome to your professional Community."];
let index = 0;
function type(word){
    let i = 0;
    let writing = setInterval(() => {
        placeholder.innerHTML += word.charAt(i);
        i++;
        if(i>=word.length){
            clearInterval(writing);
            // setTimeout(erase, 1000);
        }
    }, 75)
}

type(words[index]);

// function erase() {
//     let deleting = setInterval(() => {
//         placeholder.innerHTML = placeholder.innerHTML.slice(0,-1);
//         if(placeholder.innerHTML.length <= 0){
//             clearInterval(deleting);
//             index++;
//             if(index>=words.length){
//                 index = 0;
//             }
//             type(words[index])
//         }
//     }, 25);
// }
