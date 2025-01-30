import { doc, Firestore, writeBatch } from 'firebase/firestore';
import { ImportParams, ImportResult, BATCH_SIZE, parseAndValidateCSV } from './shapes';
import { KS4ResultsSchema } from './schemas/ks4-results.schema';
import type { KS4ResultsRow } from './schemas/ks4-results.schema';


export async function importKS4Results(
  params: ImportParams & { db: Firestore }
): Promise<ImportResult> {
  const { csvData, year, db } = params;
  const academicYear = `${Number(year)-1}/${year.slice(-2)}`;

  try {
    const { valid: rows, errors } = await parseAndValidateCSV<KS4ResultsRow>(
      csvData,
      KS4ResultsSchema as any
    );

    if (errors.length > 0) {
      return { 
        success: false, 
        count: 0, 
        errors: errors.map((e) => `Row ${e.row}: ${e.error.message}`) 
      };
    }

    const validRows = rows.filter(row => row.URN && row.RECTYPE === '1');
    let imported = 0;
    let currentBatch = writeBatch(db);
    let batchCount = 0;

    for (const row of validRows) {
      const docId = `${row.URN}_${academicYear}`;
      
      // 1. Main performance metrics
      currentBatch.set(
        doc(db, 'school-ks4-results', docId),
        {
          urn: row.URN,
          year: academicYear,
          schoolName: row.SCHNAME,
          // Core metrics
          attainment8Score: row.ATT8SCR,
          progress8Score: row.P8MEA,
          progress8Lower: row.P8CILOW,
          progress8Upper: row.P8CIUPP,
          // English and Maths
          basics94: row.PTL2BASICS_94,
          basics95: row.PTL2BASICS_95,
          ebaccAps: row.EBACCAPS,
          // Student numbers
          totalPupils: row.TPUP,
          disadvantagedPupils: row.PTFSM6CLA1A,
          // Disadvantaged gaps
          attainment8ScoreDisadvantaged: row.ATT8SCR_FSM6CLA1A,
          progress8ScoreDisadvantaged: row.P8MEA_FSM6CLA1A,
          // Gender gaps
          attainment8ScoreBoys: row.ATT8SCR_BOYS,
          attainment8ScoreGirls: row.ATT8SCR_GIRLS,
          progress8ScoreBoys: row.P8MEA_BOYS,
          progress8ScoreGirls: row.P8MEA_GIRLS,
          // Prior attainment
          lowPriorAttainers: row.PTPRIORLO,
          middlePriorAttainers: row.PTPRIORAV,
          highPriorAttainers: row.PTPRIORHI,
          // EBacc entries
          ebaccEntry: row.PTEBACC_E_PTQ_EE,
          ebaccAchievementRate94: row.PTEBACC_94,
          ebaccAchievementRate95: row.PTEBACC_95,
          // Metadata
          lastUpdated: new Date().toISOString(),
        }
      );

      // 2. Year-specific demographics
      currentBatch.set(
        doc(db, 'school-ks4-demographics', docId),
        {
          urn: row.URN,
          year: academicYear,
          pupils: {
            total: row.TOTPUPS,
            examCohort: row.TPUP,
            boys: row.BPUP,
            girls: row.GPUP,
          },
          characteristics: {
            eal: row.PTEALGRP2,
            sen: row.PSEN_ALL4,
            disadvantaged: row.PTFSM6CLA1A,
          },
          lastUpdated: new Date().toISOString(),
        }
      );

      // 3. Detailed performance data
      currentBatch.set(
        doc(db, 'school-ks4-details', docId),
        {
          urn: row.URN,
          year: academicYear,

          // Attainment 8 breakdowns
          attainment8: {
            // By subject pillars
            english: row.ATT8SCRENG,
            maths: row.ATT8SCRMAT,
            ebacc: row.ATT8SCREBAC,
            open: row.ATT8SCROPEN,
            
            // By prior attainment
            lowPrior: {
              overall: row.ATT8SCR_LO,
              english: row.ATT8SCRENG_LO,
              maths: row.ATT8SCRMAT_LO,
              ebacc: row.ATT8SCREBAC_LO,
              open: row.ATT8SCROPEN_LO,
            },
            middlePrior: {
              overall: row.ATT8SCR_MID,
              english: row.ATT8SCRENG_MID,
              maths: row.ATT8SCRMAT_MID,
              ebacc: row.ATT8SCREBAC_MID,
              open: row.ATT8SCROPEN_MID,
            },
            highPrior: {
              overall: row.ATT8SCR_HI,
              english: row.ATT8SCRENG_HI,
              maths: row.ATT8SCRMAT_HI,
              ebacc: row.ATT8SCREBAC_HI,
              open: row.ATT8SCROPEN_HI,
            },
          },

          // Progress 8 breakdowns
          progress8: {
            // By subject pillars
            english: {
              score: row.P8MEAENG,
              lower: row.P8MEAENG_CILOW,
              upper: row.P8MEAENG_CIUPP,
            },
            maths: {
              score: row.P8MEAMAT,
              lower: row.P8MEAMAT_CILOW,
              upper: row.P8MEAMAT_CIUPP,
            },
            ebacc: {
              score: row.P8MEAEBAC,
              lower: row.P8MEAEBAC_CILOW,
              upper: row.P8MEAEBAC_CIUPP,
            },
            open: {
              score: row.P8MEAOPEN,
              lower: row.P8MEAOPEN_CILOW,
              upper: row.P8MEAOPEN_CIUPP,
            },
          },

          // EBacc detailed breakdowns
          ebacc: {
            subjects: {
              english: {
                entry: row.PTEBACENG_E_PTQ_EE,
                achieved94: row.PTEBACENG_94,
                achieved95: row.PTEBACENG_95,
              },
              maths: {
                entry: row.PTEBACMAT_E_PTQ_EE,
                achieved94: row.PTEBACMAT_94,
                achieved95: row.PTEBACMAT_95,
              },
              science: {
                entry: row.PTEBAC2SCI_E_PTQ_EE,
                achieved94: row.PTEBAC2SCI_94,
                achieved95: row.PTEBAC2SCI_95,
              },
              humanities: {
                entry: row.PTEBACHUM_E_PTQ_EE,
                achieved94: row.PTEBACHUM_94,
                achieved95: row.PTEBACHUM_95,
              },
              languages: {
                entry: row.PTEBACLAN_E_PTQ_EE,
                achieved94: row.PTEBACLAN_94,
                achieved95: row.PTEBACLAN_95,
              },
            },
          },

          // Performance by student groups
          groups: {
            disadvantaged: {
              attainment8: row.ATT8SCR_FSM6CLA1A,
              progress8: {
                score: row.P8MEA_FSM6CLA1A,
                lower: row.P8CILOW_FSM6CLA1A,
                upper: row.P8CIUPP_FSM6CLA1A,
              },
            },
            notDisadvantaged: {
              attainment8: row.ATT8SCR_NFSM6CLA1A,
              progress8: {
                score: row.P8MEA_NFSM6CLA1A,
                lower: row.P8CILOW_NFSM6CLA1A,
                upper: row.P8CIUPP_NFSM6CLA1A,
              },
            },
            eal: {
              attainment8: row.ATT8SCR_EAL,
              progress8: {
                score: row.P8MEA_EAL,
                lower: row.P8CILOW_EAL,
                upper: row.P8CIUPP_EAL,
              },
            },
            gender: {
              boys: {
                attainment8: row.ATT8SCR_BOYS,
                progress8: {
                  score: row.P8MEA_BOYS,
                  lower: row.P8CILOW_BOYS,
                  upper: row.P8CIUPP_BOYS,
                },
              },
              girls: {
                attainment8: row.ATT8SCR_GIRLS,
                progress8: {
                  score: row.P8MEA_GIRLS,
                  lower: row.P8CILOW_GIRLS,
                  upper: row.P8CIUPP_GIRLS,
                },
              },
            },
          },

          // Original (unadjusted) Progress 8 scores
          progress8Original: {
            score: row.P8MEA_ORIG,
            lower: row.P8CILOW_ORIG,
            upper: row.P8CIUPP_ORIG,
          },

          // GCSE vs non-GCSE breakdowns
          attainment8Open: {
            gcse: row.ATT8SCROPENG,
            nonGcse: row.ATT8SCROPENNG,
          },

          lastUpdated: new Date().toISOString(),
        }
      );

      batchCount++;
      imported++;

      if (batchCount === BATCH_SIZE) {
        await currentBatch.commit();
        currentBatch = writeBatch(db);
        batchCount = 0;
      }
    }

    // Commit any remaining documents
    if (batchCount > 0) {
      await currentBatch.commit();
    }

    console.log(`Successfully imported ${imported} KS4 results`);
    return {
      success: true,
      count: imported,
      errors: [],
    };
  } catch (error) {
    console.error('KS4 results import error:', error);
    return {
      success: false,
      count: 0,
      errors: [(error as Error).message],
    };
  }
} 