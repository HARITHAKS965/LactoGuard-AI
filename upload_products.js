const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

const products = {
  "8901058000424": { name: "Amul Gold Full Cream Milk", brand: "Amul", fssai: "10016011002705", fat: "6g", protein: "3.5g", status: "Trusted" },
  "8901058000417": { name: "Amul Taaza Toned Milk", brand: "Amul", fssai: "10016011002705", fat: "3g", protein: "3g", status: "Trusted" },
  "8901058853456": { name: "Amul Milk Powder 500g", brand: "Amul", fssai: "10016011002705", fat: "26g", protein: "25g", status: "Trusted" },
  "8901058001131": { name: "Amul Spray Infant Milk Food", brand: "Amul", fssai: "10016011002705", fat: "22g", protein: "22g", status: "Trusted" },
  "8901058004965": { name: "Amul Full Cream Milk Powder 500g", brand: "Amul", fssai: "10016011002705", fat: "26.5g", protein: "25.5g", status: "Trusted" },
  "8901058853425": { name: "Amul Skimmed Milk Powder", brand: "Amul", fssai: "10016011002705", fat: "1.5g", protein: "36g", status: "Trusted" },
  "8901030874941": { name: "Nestle NANGROW", brand: "Nestle", fssai: "10016011000017", fat: "5.1g", protein: "16.5g", status: "Trusted" },
  "8901764000424": { name: "Nestle Everyday Dairy Whitener", brand: "Nestle", fssai: "10016011000017", fat: "1g", protein: "14g", status: "Trusted" },
  "8901030004502": { name: "Nestle NAN Pro 1", brand: "Nestle", fssai: "10016011000017", fat: "27.6g", protein: "12.9g", status: "Trusted" },
  "8901030004519": { name: "Nestle NAN Pro 2", brand: "Nestle", fssai: "10016011000017", fat: "25g", protein: "14g", status: "Trusted" },
  "8901030800004": { name: "Nestle Cerelac Wheat Stage 1", brand: "Nestle", fssai: "10016011000017", fat: "7.7g", protein: "10.8g", status: "Trusted" },
  "8901719100018": { name: "Britannia Dairy Whitener 1kg", brand: "Britannia", fssai: "10016011003283", fat: "1.5g", protein: "14g", status: "Trusted" },
  "8901719100025": { name: "Britannia Dairy Whitener 500g", brand: "Britannia", fssai: "10016011003283", fat: "1.5g", protein: "14g", status: "Trusted" },
  "8906002490018": { name: "Mother Dairy Full Cream Milk", brand: "Mother Dairy", fssai: "10016042000023", fat: "6g", protein: "3.5g", status: "Trusted" },
  "8906002490025": { name: "Mother Dairy Toned Milk", brand: "Mother Dairy", fssai: "10016042000023", fat: "3g", protein: "3g", status: "Trusted" },
  "8906002490056": { name: "Mother Dairy Milk Powder", brand: "Mother Dairy", fssai: "10016042000023", fat: "26g", protein: "25g", status: "Trusted" },
  "8901491502087": { name: "Horlicks Original", brand: "Horlicks", fssai: "10016011004321", fat: "1.5g", protein: "8.2g", status: "Trusted" },
  "8901491100070": { name: "Horlicks Junior Vanilla 500g", brand: "Horlicks", fssai: "10016011004321", fat: "4.5g", protein: "14.5g", status: "Trusted" },
  "8901491100087": { name: "Horlicks Junior Chocolate 500g", brand: "Horlicks", fssai: "10016011004321", fat: "4.5g", protein: "14.5g", status: "Trusted" },
  "8901491502094": { name: "Horlicks Chocolate", brand: "Horlicks", fssai: "10016011004321", fat: "1.8g", protein: "8.2g", status: "Trusted" },
  "8906005570018": { name: "Patanjali Cow Ghee 1L", brand: "Patanjali", fssai: "10016042001456", fat: "99.7g", protein: "0g", status: "Trusted" },
  "8906001224011": { name: "Patanjali Milk Powder", brand: "Patanjali", fssai: "10016042001456", fat: "26g", protein: "24g", status: "Trusted" },
  "8901526100016": { name: "Similac Advance Stage 1", brand: "Abbott", fssai: "10016011005432", fat: "27.2g", protein: "13.6g", status: "Trusted" },
  "8901526100023": { name: "Similac Advance Stage 2", brand: "Abbott", fssai: "10016011005432", fat: "26.3g", protein: "14.6g", status: "Trusted" },
  "8901526200014": { name: "Ensure Nutrition Vanilla", brand: "Abbott", fssai: "10016011005432", fat: "8.4g", protein: "16.7g", status: "Trusted" },
  "8901396100015": { name: "Aptamil Stage 1", brand: "Danone", fssai: "10016011006543", fat: "27.5g", protein: "12.4g", status: "Trusted" },
  "8901396100022": { name: "Aptamil Stage 2", brand: "Danone", fssai: "10016011006543", fat: "26g", protein: "14g", status: "Trusted" },
  "8901396200013": { name: "Protinex Original", brand: "Danone", fssai: "10016011006543", fat: "1.5g", protein: "20g", status: "Trusted" },
  "8901207000678": { name: "Complan Natural", brand: "Complan", fssai: "10016011007654", fat: "4.4g", protein: "18.4g", status: "Trusted" },
  "8901207000685": { name: "Complan Chocolate", brand: "Complan", fssai: "10016011007654", fat: "4.4g", protein: "18.4g", status: "Trusted" },
  "8901396600011": { name: "Bournvita Chocolate", brand: "Cadbury", fssai: "10016011008765", fat: "1.7g", protein: "7.1g", status: "Trusted" },
  "8901396600028": { name: "Bournvita 5 Star Magic", brand: "Cadbury", fssai: "10016011008765", fat: "2g", protein: "7g", status: "Trusted" },
  "8901714100012": { name: "Enfamil A+ Stage 1", brand: "Mead Johnson", fssai: "10016011009876", fat: "27.5g", protein: "13.5g", status: "Trusted" },
};

async function upload() {
  const batch = db.batch();
  for (const [barcode, data] of Object.entries(products)) {
    const ref = db.collection('products').doc(barcode);
    batch.set(ref, { ...data, barcode, addedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  }
  await batch.commit();
  console.log('? All', Object.keys(products).length, 'products uploaded to Firebase!');
  process.exit(0);
}
upload().catch(console.error);
