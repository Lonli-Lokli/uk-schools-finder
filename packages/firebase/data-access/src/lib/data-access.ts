import { initializeClientFirebase } from '@lonli-lokli/firebase/setup-client';
import { TrustDm } from '@lonli-lokli/shapes';
import { EstablishmentTypeDm } from '@lonli-lokli/shapes';
import { LocationDm } from '@lonli-lokli/shapes';
import { SchoolDm } from '@lonli-lokli/shapes';
import { collection, query as firestoreQuery, where, orderBy, limit, startAfter, getDocs, getDoc, doc } from 'firebase/firestore';

type FilterRecord = Record<string, string | undefined>;

type GetSchoolsParams = {
  page: number;
  filters?: FilterRecord;
  sortFields: SortField[];
};

const { db } = initializeClientFirebase();


export async function getSchools({
  page,
  sortFields,
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

  sortFields.forEach(sort => {
    constraints.push(orderBy(sort.field, sort.order === 'descend' ? 'desc' : 'asc'));
  })
  constraints.push(limit(pageSize));
  
  if (page > 1) {
    // Get the last document from the previous page
    const lastDoc = await getDocs(firestoreQuery(query, ...constraints, limit((page - 1) * pageSize)));
    constraints.push(startAfter(lastDoc.docs[lastDoc.docs.length - 1]));
  }
  
  const finalQuery = firestoreQuery(query, ...constraints);
  const snapshot = await getDocs(finalQuery);
  
  // Fetch all referenced data for each school
  const schoolsWithRefs: SchoolDm[] = await Promise.all(
    snapshot.docs.map(async (document) => {
      const school: Partial<SchoolDm> = document.data()
      
      // Parallel fetch all references
      const [location, type, trust] = await Promise.all([
        school.locationId ? getDoc(doc(db, 'locations', school.locationId)) : null,
        school.typeId ? getDoc(doc(db, 'establishment-types', school.typeId)) : null,
        school.trustId ? getDoc(doc(db, 'trusts', school.trustId)) : null,
      ]);

      return {
        ...school,
        location: location?.data() as LocationDm,
        establishmentType: type?.data() as EstablishmentTypeDm,
        trust: trust?.data() as TrustDm,

      } as SchoolDm;
    })
  );

  console.log(schoolsWithRefs.length)
  return { schools: schoolsWithRefs, total: snapshot.size, pageSize };
} 