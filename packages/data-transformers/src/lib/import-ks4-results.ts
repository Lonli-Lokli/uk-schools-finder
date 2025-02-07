import { KS4ResultsRow } from '@lonli-lokli/data-parsers';
import { cleanValue } from './helpers';
import { KS4ResultsDemographicsDm, KS4ResultsMainDm, KS4ResultsDetailsDm } from '@lonli-lokli/shapes';

export interface KS4ResultsBatch {
  main: Array<{
    id: string;
    data: KS4ResultsMainDm;
  }>;
  demographics: Array<{
    id: string;
    data: KS4ResultsDemographicsDm;
  }>;
  details: Array<{
    id: string;
    data: KS4ResultsDetailsDm;
  }>;
}

export function transformKS4Results(rows: KS4ResultsRow[], year: string): KS4ResultsBatch {
  const batch: KS4ResultsBatch = {

    main: [],
    demographics: [],
    details: []
  };

  for (const row of rows) {
    if (!row.URN || row.RECTYPE !== '1') continue;

    const docId = `${row.URN}_${year}`;

    // Main collection
    batch.main.push({
      id: docId,
      data: {
        urn: row.URN,
        year,
        // Core metrics
        attainment8Score: cleanValue(row.ATT8SCR),
        progress8Score: cleanValue(row.P8MEA),
        progress8Lower: cleanValue(row.P8CILOW),
        progress8Upper: cleanValue(row.P8CIUPP),
        // English and Maths
        basics94: cleanValue(row.PTL2BASICS_94),
        basics95: cleanValue(row.PTL2BASICS_95),
        ebaccAps: cleanValue(row.EBACCAPS),
        // Student numbers
        totalPupils: cleanValue(row.TPUP),
        disadvantagedPupils: cleanValue(row.PTFSM6CLA1A),
        // Disadvantaged gaps
        attainment8ScoreDisadvantaged: cleanValue(row.ATT8SCR_FSM6CLA1A),
        progress8ScoreDisadvantaged: cleanValue(row.P8MEA_FSM6CLA1A),
        // Gender gaps
        attainment8ScoreBoys: cleanValue(row.ATT8SCR_BOYS),
        attainment8ScoreGirls: cleanValue(row.ATT8SCR_GIRLS),
        progress8ScoreBoys: cleanValue(row.P8MEA_BOYS),
        progress8ScoreGirls: cleanValue(row.P8MEA_GIRLS),
        // Prior attainment
        lowPriorAttainers: cleanValue(row.PTPRIORLO),
        middlePriorAttainers: cleanValue(row.PTPRIORAV),
        highPriorAttainers: cleanValue(row.PTPRIORHI),
        // EBacc entries
        ebaccEntry: cleanValue(row.PTEBACC_E_PTQ_EE),
        ebaccAchievementRate94: cleanValue(row.PTEBACC_94),
        ebaccAchievementRate95: cleanValue(row.PTEBACC_95),
        lastUpdated: new Date().toISOString(),
      }
    });

    // Demographics collection
    batch.demographics.push({
      id: docId,
      data: {
        urn: row.URN,
        year,
        pupils: {
          total: cleanValue(row.TOTPUPS),
          examCohort: cleanValue(row.TPUP),
          boys: cleanValue(row.BPUP),
          girls: cleanValue(row.GPUP),
        },
        characteristics: {
          eal: cleanValue(row.PTEALGRP2),
          sen: cleanValue(row.PSEN_ALL4),
          disadvantaged: cleanValue(row.PTFSM6CLA1A),
        },
        lastUpdated: new Date().toISOString(),
      }
    });

    // Details collection
    batch.details.push({
      id: docId,
      data: {
        urn: row.URN,
        year,
        attainment8: {
          english: cleanValue(row.ATT8SCRENG),
          maths: cleanValue(row.ATT8SCRMAT),
          ebacc: cleanValue(row.ATT8SCREBAC),
          open: cleanValue(row.ATT8SCROPEN),
          lowPrior: {
            overall: cleanValue(row.ATT8SCR_LO),
            english: cleanValue(row.ATT8SCRENG_LO),
            maths: cleanValue(row.ATT8SCRMAT_LO),
            ebacc: cleanValue(row.ATT8SCREBAC_LO),
            open: cleanValue(row.ATT8SCROPEN_LO),
          },
          middlePrior: {
            overall: cleanValue(row.ATT8SCR_MID),
            english: cleanValue(row.ATT8SCRENG_MID),
            maths: cleanValue(row.ATT8SCRMAT_MID),
            ebacc: cleanValue(row.ATT8SCREBAC_MID),
            open: cleanValue(row.ATT8SCROPEN_MID),
          },
          highPrior: {
            overall: cleanValue(row.ATT8SCR_HI),
            english: cleanValue(row.ATT8SCRENG_HI),
            maths: cleanValue(row.ATT8SCRMAT_HI),
            ebacc: cleanValue(row.ATT8SCREBAC_HI),
            open: cleanValue(row.ATT8SCROPEN_HI),
          },
        },
        progress8: {
          english: {
            score: cleanValue(row.P8MEAENG),
            lower: cleanValue(row.P8MEAENG_CILOW),
            upper: cleanValue(row.P8MEAENG_CIUPP),
          },
          maths: {
            score: cleanValue(row.P8MEAMAT),
            lower: cleanValue(row.P8MEAMAT_CILOW),
            upper: cleanValue(row.P8MEAMAT_CIUPP),
          },
          ebacc: {
            score: cleanValue(row.P8MEAEBAC),
            lower: cleanValue(row.P8MEAEBAC_CILOW),
            upper: cleanValue(row.P8MEAEBAC_CIUPP),
          },
          open: {
            score: cleanValue(row.P8MEAOPEN),
            lower: cleanValue(row.P8MEAOPEN_CILOW),
            upper: cleanValue(row.P8MEAOPEN_CIUPP),
          },
        },
        ebacc: {
          subjects: {
            english: {
              entry: cleanValue(row.PTEBACENG_E_PTQ_EE),
              achieved94: cleanValue(row.PTEBACENG_94),
              achieved95: cleanValue(row.PTEBACENG_95),
            },
            maths: {
              entry: cleanValue(row.PTEBACMAT_E_PTQ_EE),
              achieved94: cleanValue(row.PTEBACMAT_94),
              achieved95: cleanValue(row.PTEBACMAT_95),
            },
            science: {
              entry: cleanValue(row.PTEBAC2SCI_E_PTQ_EE),
              achieved94: cleanValue(row.PTEBAC2SCI_94),
              achieved95: cleanValue(row.PTEBAC2SCI_95),
            },
            humanities: {
              entry: cleanValue(row.PTEBACHUM_E_PTQ_EE),
              achieved94: cleanValue(row.PTEBACHUM_94),
              achieved95: cleanValue(row.PTEBACHUM_95),
            },
            languages: {
              entry: cleanValue(row.PTEBACLAN_E_PTQ_EE),
              achieved94: cleanValue(row.PTEBACLAN_94),
              achieved95: cleanValue(row.PTEBACLAN_95),
            },
          },
        },
        groups: {
          disadvantaged: {
            attainment8: cleanValue(row.ATT8SCR_FSM6CLA1A),
            progress8: {
              score: cleanValue(row.P8MEA_FSM6CLA1A),
              lower: cleanValue(row.P8CILOW_FSM6CLA1A),
              upper: cleanValue(row.P8CIUPP_FSM6CLA1A),
            },
          },
          notDisadvantaged: {
            attainment8: cleanValue(row.ATT8SCR_NFSM6CLA1A),
            progress8: {
              score: cleanValue(row.P8MEA_NFSM6CLA1A),
              lower: cleanValue(row.P8CILOW_NFSM6CLA1A),
              upper: cleanValue(row.P8CIUPP_NFSM6CLA1A),
            },
          },
          eal: {
            attainment8: cleanValue(row.ATT8SCR_EAL),
            progress8: {
              score: cleanValue(row.P8MEA_EAL),
              lower: cleanValue(row.P8CILOW_EAL),
              upper: cleanValue(row.P8CIUPP_EAL),
            },
          },
          gender: {
            boys: {
              attainment8: cleanValue(row.ATT8SCR_BOYS),
              progress8: {
                score: cleanValue(row.P8MEA_BOYS),
                lower: cleanValue(row.P8CILOW_BOYS),
                upper: cleanValue(row.P8CIUPP_BOYS),
              },
            },
            girls: {
              attainment8: cleanValue(row.ATT8SCR_GIRLS),
              progress8: {
                score: cleanValue(row.P8MEA_GIRLS),
                lower: cleanValue(row.P8CILOW_GIRLS),
                upper: cleanValue(row.P8CIUPP_GIRLS),
              },
            },
          },
        },
        progress8Original: {
          score: cleanValue(row.P8MEA_ORIG),
          lower: cleanValue(row.P8CILOW_ORIG),
          upper: cleanValue(row.P8CIUPP_ORIG),
        },
        attainment8Open: {
          gcse: cleanValue(row.ATT8SCROPENG),
          nonGcse: cleanValue(row.ATT8SCROPENNG),
        },
        lastUpdated: new Date().toISOString(),
      }
    });
  }

  return batch;
}
