import { db, storage } from './firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { availableProperties as localAvailable, soldProperties as localSold } from '../app/data/properties';

export type Property = {
  id?: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  area: number;
  image: string;
  sold?: boolean;
  timestamp?: any;
};

export async function fetchProperties(): Promise<{ available: Property[]; sold: Property[] }> {
  const col = collection(db, 'properties');
  const snapshot = await getDocs(col);
  const items: Property[] = snapshot.docs.map((d) => ({ ...(d.data() as any), id: d.id }));
  const available = items.filter((p) => !p.sold);
  const sold = items.filter((p) => p.sold);
  return { available, sold };
}

export async function importLocalProperties(): Promise<void> {
  const col = collection(db, 'properties');
  // import available
  for (const p of localAvailable) {
    await addDoc(col, { ...p, sold: false });
  }
  for (const p of localSold) {
    await addDoc(col, { ...p, sold: true });
  }
}

export async function deleteProperty(id: string): Promise<void> {
  await deleteDoc(doc(db, 'properties', id));
}

export async function createProperty(data: Omit<Property, 'id' | 'timestamp'>): Promise<string> {
  const col = collection(db, 'properties');
  const docRef = await addDoc(col, { ...data, timestamp: serverTimestamp() });
  return docRef.id;
}

export async function updateProperty(id: string, data: Partial<Property>): Promise<void> {
  const d = doc(db, 'properties', id);
  await updateDoc(d, { ...data, timestamp: serverTimestamp() });
}

export async function uploadPropertyImage(file: File, folder = 'properties'): Promise<string> {
  const path = `${folder}/${Date.now()}_${file.name}`;
  const r = storageRef(storage, path);
  const snap = await uploadBytes(r, file);
  const url = await getDownloadURL(snap.ref);
  return url;
}
