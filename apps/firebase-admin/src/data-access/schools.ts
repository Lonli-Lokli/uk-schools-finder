import { initializeClientFirebase } from '@lonli-lokli/firebase/setup-client';

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
  const offset = (page - 1) * pageSize;

  let query = db.collection('schools');

  // Apply all non-empty filters
  Object.entries(filters).forEach(([field, value]) => {
    if (value) {
      query = query.where(field, '==', value);
    }
  });

  query = query.orderBy(sort, order === 'descend' ? 'desc' : 'asc');
  
  const total = (await query.count().get()).data().count;
  const snapshot = await query.limit(pageSize).offset(offset).get();
  const schools = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return { schools, total, pageSize };
} 