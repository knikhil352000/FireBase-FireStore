const cafeList = document.querySelector('#cafe-list');
const form = document.querySelector("#add-cafe-form");
// create element and render cafe

function renderCafe(doc){
    let li = document.createElement('li');
    let name = document.createElement('span');
    let city = document.createElement('span');
    let cross = document.createElement('div');
    cross.textContent = 'x';
    li.setAttribute('data-id', doc.id);
    name.textContent = doc.data().name;
    city.textContent = doc.data().city;
    li.appendChild(name);
    li.appendChild(city);
    li.appendChild(cross);
    cafeList.appendChild(li);

    //delete data
    cross.addEventListener('click', function(e){
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}

//geting data

db.collection('cafes').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderCafe(doc);
    });
});

//Making queries

db.collection('cafes').where('city', '==', 'gaya').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderCafe(doc);
    });
});

//Order data

db.collection('cafes').orderBy('name').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderCafe(doc);
    });
});

//order and making queries

db.collection('cafes').where('city', '==', 'gaya').orderBy('name').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
        renderCafe(doc);
    });
});



form.addEventListener('submit', function(e){
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        city: form.city.value
    });
    form.name.value = '';
    form.city.value = '';
});

//RealTime Listeners

db.collection('cafes').orderBy('city').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type === 'added' ){
            renderCafe(change.doc);
        }else if(change.type === 'removed'){
            let li = cafeList.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    })
})
