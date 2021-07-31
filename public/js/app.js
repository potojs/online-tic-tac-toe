const roomInput = document.querySelector(".room-input");
function joinRoom(){
    const room = roomInput.value;
    if(room === ""){
        alert("plz enter a room to join");
        return;
    }
    location.pathname = "/game/" + room;
}
document.querySelector(".join-btn").addEventListener("click", joinRoom);
roomInput.addEventListener("keydown", e=>{
    if(e.key === "Enter"){
        joinRoom();
    }
})
document.querySelector(".search-rand-btn").addEventListener("click", e=>{
    location.pathname = "/searching"
})