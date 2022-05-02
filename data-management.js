const reunionQuery = window.location.search;
let reunionID;
const localDB = [];
let collection;

if (reunionQuery[1] === "_") {
  ui_main.dataset.mode = "loading";

  reunionID = reunionQuery.slice(1);

  collection = db.collection(reunionID);

  async function getCollection(id) {
    collection
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const item = doc.data();
          item.id = doc.id;
          localDB.push(item);
        });

        if (localDB.length > 0) {
          firestoreToCalendar(localDB, id);
        } else {
          ui_main.dataset.mode = "admin";
        }
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  getCollection(reunionID);
}

// Initial data fetch

function storeBaseCal(data) {
  db.collection(data.id).doc("details").set({
    title: data.title,
    start: data.start,
    end: data.end,
    options: data.options,
  });
  db.collection(data.id)
    .doc("selection")
    .set({ selection: data.selection, members: new Array() });
}

function storeMemberCal(memberData) {
  collection.doc("selection").update({
    members: firebase.firestore.FieldValue.arrayUnion(memberData),
  });
}

function firestoreToCalendar(items, id) {
  const obj = { id: id };

  items.forEach((doc) => {
    if (doc.id === "details") {
      obj.title = doc.title;
      obj.start = doc.start;
      obj.end = doc.end;
      obj.options = doc.options;
    } else if (doc.id === "selection") {
      obj.selection = doc.selection;
      obj.members = doc.members;
    }
  });

  console.log(obj);
  initNewCalendar(obj, "edit");
}


