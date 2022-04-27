const reunionQuery = window.location.search;
const localDB = [];
let collection;

if (reunionQuery[1] === "_") {
  const reunionID = reunionQuery.slice(1);

  collection = db.collection(reunionID);

  async function getCollection() {
    collection
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          const item = doc.data();
          item.id = doc.id;
          localDB.push(item);
        });

        firestoreToCalendar(localDB)
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }

  getCollection();
}

// Initial data fetch

function storeCal(data) {
  db.collection(data.id).doc("base").set({ selection: data.selection });

  db.collection(data.id).doc("details").set({
    title: data.title,
    start: data.start,
    end: data.end,
    options: data.options,
  });
}

function firestoreToCalendar(items) {
  items.forEach((item) => {
    console.log(item);
  });
}
