const socket = io();

socket.on("redirect", room=>{
    location.pathname = "/game/"+room;
})


document.querySelector(".cancel").addEventListener("click", ()=>{
    socket.emit("cancel-searching");
    location.pathname = "/";
})