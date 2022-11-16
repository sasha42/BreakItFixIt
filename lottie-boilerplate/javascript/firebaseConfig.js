import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, update, onValue } from "firebase/database"; // TODO: Add SDKs for Firebase products that you want to use

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAhSjoeCqJoBWrulH9XkD4iN-hmVWccxIo",
	authDomain: "breakitfixit-9f67d.firebaseapp.com",
	databaseURL:
		"https://breakitfixit-9f67d-default-rtdb.europe-west1.firebasedatabase.app",
	projectId: "breakitfixit-9f67d",
	storageBucket: "breakitfixit-9f67d.appspot.com",
	messagingSenderId: "206776885912",
	appId: "1:206776885912:web:a71fe30fd7056d9be066ed",
};

export const fireBaseApp = initializeApp(firebaseConfig);
export const initFirebase = () => {
	console.log(app);
	let val;

	const getValues = async () => {
		const db = getDatabase(app);
		const dbVal = ref(db, "poster1");

		onValue(dbVal, (e) => {
			return e.val();
		});
	};
	return { getValues };
};
