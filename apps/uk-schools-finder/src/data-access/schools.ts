import { initializeClientFirebase } from '@lonli-lokli/firebase/setup-client';
import { collection, query as firestoreQuery, where, orderBy, limit, startAfter, getDocs } from 'firebase/firestore';
import { School } from '../shapes';

type FilterRecord = Record<string, string | undefined>;

type GetSchoolsParams = {
  page: number;
  sort: string;
  order: string;
  filters?: FilterRecord;
};

const { db } = initializeClientFirebase();

export async function getSchools({
  page,
  sort,
  order,
  filters = {},
}: GetSchoolsParams) {
  const pageSize = 10;

  // This will use the current user's credentials automatically
  const query = collection(db, 'schools');
  const constraints = [];

  // Apply all non-empty filters
  Object.entries(filters).forEach(([field, value]) => {
    if (value) {
      constraints.push(where(field, '==', value));
    }
  });

  constraints.push(orderBy(sort, order === 'descend' ? 'desc' : 'asc'));
  constraints.push(limit(pageSize));
  
  if (page > 1) {
    // Get the last document from the previous page
    const lastDoc = await getDocs(firestoreQuery(query, ...constraints, limit((page - 1) * pageSize)));
    constraints.push(startAfter(lastDoc.docs[lastDoc.docs.length - 1]));
  }
  
  const finalQuery = firestoreQuery(query, ...constraints);
  const snapshot = await getDocs(finalQuery);
  const schools = snapshot.docs.map<School>(doc => ({ id: doc.id, ...doc.data() as any}));

  return { schools, total: snapshot.size, pageSize };
} 