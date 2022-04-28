const reunionQuery = window.location.search;
const localDB = [];
let collection;

if (reunionQuery[1] === "_") {
  const reunionID = reunionQuery.slice(1);

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

        firestoreToCalendar(localDB, id);
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  getCollection(reunionID);
}

// Initial data fetch

function storeCal(data) {
  db.collection(data.id).doc("details").set({
    title: data.title,
    start: data.start,
    end: data.end,
    options: data.options,
    selection: data.selection,
  });
}

function firestoreToCalendar(items, id) {
  console.log(items);
  const obj = { id: id };

  items.forEach((doc) => {
    if (doc.id === "details") {
      obj.title = doc.title;
      obj.start = doc.start;
      obj.end = doc.end;
      obj.options = doc.options;
      obj.selection = doc.selection;
    }
  });

  console.log(obj);
  initNewCalendar(obj, "public");
}
