import { z } from 'zod';

// Helper function for number parsing
const numberParser = (val: string) => {
  const num = parseFloat(val);
  return isNaN(num) ? null : num;
};

// Helper function for integer parsing
const intParser = (val: string) => {
  const num = parseInt(val);
  return isNaN(num) ? null : num;
};

const stringOrNumber = z
  .string()
  .or(z.number())
  .or(z.null())
  .transform((val) => (val !== null ? val.toString() : val));

const optionalString = () =>
  z.coerce
    .string()
    .optional()
    .nullable()
    .default('')
    .transform((value) => value ?? '');

// Schema includes all fields from england_ks4provisional.csv
export const KS4ResultsSchema = z.object({
  // Basic School Information
  RECTYPE: stringOrNumber, // Record Type: '1' = School, '2' = LA, '4' = National
  LEA: stringOrNumber, // Local Education Authority code
  ESTAB: stringOrNumber, // Establishment number
  URN: stringOrNumber, // Unique Reference Number
  SCHNAME: optionalString(), // School Name
  SCHNAME_AC: optionalString(), // School Name (Academy Trust)

  // School Contact Details
  ADDRESS1: optionalString(), // Address line 1
  ADDRESS2: optionalString(), // Address line 2
  ADDRESS3: optionalString(), // Address line 3
  TOWN: optionalString(), // Town
  PCODE: optionalString(), // Postcode
  TELNUM: optionalString(), // Telephone number
  PCON_CODE: optionalString(), // Parliamentary Constituency code
  PCON_NAME: optionalString(), // Parliamentary Constituency name

  // School Characteristics
  CONTFLAG: optionalString(), // Continuity flag
  ICLOSE: optionalString(), // School closure indicator
  NFTYPE: optionalString(), // School type (e.g., Community, Academy)
  RELDENOM: optionalString(), // Religious denomination
  ADMPOL: optionalString(), // Admissions policy
  ADMPOL_PT: optionalString(), // Admissions policy detail
  EGENDER: optionalString(), // Gender of intake (Mixed/Boys/Girls)
  FEEDER: optionalString(), // Feeder school status
  AGERANGE: optionalString(), // School age range

  // Pupil Numbers
  TOTPUPS: optionalString(), // Total number of pupils
  NUMBOYS: optionalString(), // Number of boys
  NUMGIRLS: optionalString(), // Number of girls
  TPUP: z.string().transform(intParser), // Total pupils in KS4 cohort
  BPUP: optionalString(), // Boys in KS4 cohort
  PBPUP: optionalString(), // Percentage boys in KS4 cohort
  GPUP: optionalString(), // Girls in KS4 cohort
  PGPUP: optionalString(), // Percentage girls in KS4 cohort

  // Prior Attainment
  KS2ASS: optionalString(), // KS2 assessment method
  TPRIORLO: z.string().transform(numberParser), // Number of pupils with low prior attainment
  PTPRIORLO: z.string().transform(numberParser), // Percentage of pupils with low prior attainment
  TPRIORAV: z.string().transform(numberParser), // Number of pupils with average prior attainment
  PTPRIORAV: z.string().transform(numberParser), // Percentage of pupils with average prior attainment
  TPRIORHI: z.string().transform(numberParser), // Number of pupils with high prior attainment
  PTPRIORHI: z.string().transform(numberParser), // Percentage of pupils with high prior attainment

  // Disadvantaged Pupils
  TFSM6CLA1A: z.string().transform(numberParser), // Number of disadvantaged pupils
  PTFSM6CLA1A: z.string().transform(numberParser), // Percentage of disadvantaged pupils
  TNOTFSM6CLA1A: optionalString(), // Number of non-disadvantaged pupils
  PTNOTFSM6CLA1A: optionalString(), // Percentage of non-disadvantaged pupils

  // English as Additional Language (EAL)
  TEALGRP2: optionalString(), // Number of EAL pupils
  PTEALGRP2: optionalString(), // Percentage of EAL pupils
  TEALGRP1: optionalString(), // Number of EAL group 1
  PTEALGRP1: optionalString(), // Percentage of EAL group 1
  TEALGRP3: optionalString(), // Number of EAL group 3
  PTEALGRP3: optionalString(), // Percentage of EAL group 3

  // Mobility and SEN
  TNMOB: optionalString(), // Number of non-mobile pupils
  PTNMOB: optionalString(), // Percentage of non-mobile pupils
  SENE4: optionalString(), // Number of SEN pupils with EHC plans
  PSENE4: optionalString(), // Percentage of SEN pupils with EHC plans
  SEN_ALL4: optionalString(), // Total number of SEN pupils
  PSEN_ALL4: optionalString(), // Percentage of all SEN pupils
  SENK4: optionalString(), // Number of SEN support pupils
  PSENK4: optionalString(), // Percentage of SEN support pupils

  // Attainment 8 Scores
  TOTATT8: optionalString(), // Total Attainment 8 points
  ATT8SCR: z.string().transform(numberParser), // Attainment 8 score per pupil
  TOTATT8ENG: optionalString(), // Total Attainment 8 points in English
  ATT8SCRENG: optionalString(), // Attainment 8 score in English per pupil
  TOTATT8MAT: optionalString(), // Total Attainment 8 points in Maths
  ATT8SCRMAT: optionalString(), // Attainment 8 score in Maths per pupil
  TOTATT8EBAC: optionalString(), // Total Attainment 8 points in EBacc subjects
  ATT8SCREBAC: optionalString(), // Attainment 8 score in EBacc subjects per pupil
  TOTATT8OPEN: optionalString(), // Total Attainment 8 points in Open slots
  ATT8SCROPEN: optionalString(), // Attainment 8 score in Open slots per pupil
  TOTATT8OPENG: optionalString(), // Total Attainment 8 points in Open GCSE slots
  ATT8SCROPENG: optionalString(), // Attainment 8 score in Open GCSE slots per pupil
  TOTATT8OPENNG: optionalString(), // Total Attainment 8 points in Open non-GCSE slots
  ATT8SCROPENNG: optionalString(), // Attainment 8 score in Open non-GCSE slots per pupil

  // Average Fill Rates
  AVGEBACFILL: optionalString(), // Average EBacc slot fill rate
  AVGOPENFILL: optionalString(), // Average Open slot fill rate

  // Progress 8 Scores
  P8PUP: optionalString(), // Number of pupils included in Progress 8
  TP8ADJ: optionalString(), // Total Progress 8 adjustments
  P8MEACOV: optionalString(), // Progress 8 coverage
  P8MEA: z.string().transform(numberParser), // Progress 8 score
  P8CILOW: z.string().transform(numberParser), // Progress 8 lower confidence interval
  P8CIUPP: z.string().transform(numberParser), // Progress 8 upper confidence interval
  P8MEA_ORIG: optionalString(), // Original Progress 8 score
  P8CILOW_ORIG: optionalString(), // Original Progress 8 lower confidence interval
  P8CIUPP_ORIG: optionalString(), // Original Progress 8 upper confidence interval

  // Progress 8 Elements
  P8MEAENG: optionalString(), // Progress 8 English element
  P8MEAENG_CILOW: optionalString(), // Progress 8 English lower confidence interval
  P8MEAENG_CIUPP: optionalString(), // Progress 8 English upper confidence interval
  P8MEAMAT: optionalString(), // Progress 8 Maths element
  P8MEAMAT_CILOW: optionalString(), // Progress 8 Maths lower confidence interval
  P8MEAMAT_CIUPP: optionalString(), // Progress 8 Maths upper confidence interval
  P8MEAEBAC: optionalString(), // Progress 8 EBacc element
  P8MEAEBAC_CILOW: optionalString(), // Progress 8 EBacc lower confidence interval
  P8MEAEBAC_CIUPP: optionalString(), // Progress 8 EBacc upper confidence interval
  P8MEAOPEN: optionalString(), // Progress 8 Open element
  P8MEAOPEN_CILOW: optionalString(), // Progress 8 Open lower confidence interval
  P8MEAOPEN_CIUPP: optionalString(), // Progress 8 Open upper confidence interval

  // Basics Measures
  PTL2BASICS_94: z.string().transform(numberParser), // Percentage achieving grade 4+ in English & Maths
  PTL2BASICS_95: z.string().transform(numberParser), // Percentage achieving grade 5+ in English & Maths

  // EBacc Measures
  TOTEBACCAPS: optionalString(), // Total EBacc Average Point Score
  EBACCAPS: z.string().transform(numberParser), // EBacc Average Point Score per pupil
  EBACCAPS_FSM6CLA1A: optionalString(), // EBacc APS - Disadvantaged pupils
  EBACCAPS_NFSM6CLA1A: optionalString(), // EBacc APS - Non-disadvantaged pupils
  EBACCAPS_LO: optionalString(), // EBacc APS - Low prior attainment
  EBACCAPS_MID: optionalString(), // EBacc APS - Middle prior attainment
  EBACCAPS_HI: optionalString(), // EBacc APS - High prior attainment
  EBACCAPS_EAL: optionalString(), // EBacc APS - EAL pupils
  EBACCAPS_GIRLS: optionalString(), // EBacc APS - Girls
  EBACCAPS_BOYS: optionalString(), // EBacc APS - Boys
  EBACCAPS_NMOB: optionalString(), // EBacc APS - Non-mobile pupils

  // EBacc Entry and Achievement
  TEBACC_E_PTQ_EE: z.string().transform(numberParser), // Total EBacc entries
  PTEBACC_E_PTQ_EE: z.string().transform(numberParser), // Percentage EBacc entries
  PTEBACC_94: z.string().transform(numberParser), // Percentage achieving EBacc at grade 4+
  PTEBACC_95: z.string().transform(numberParser), // Percentage achieving EBacc at grade 5+

  // EBacc Subject Components
  TEBACENG_E_PTQ_EE: optionalString(), // Total EBacc English entries
  PTEBACENG_E_PTQ_EE: optionalString(), // Percentage EBacc English entries
  TEBACMAT_E_PTQ_EE: optionalString(), // Total EBacc Maths entries
  PTEBACMAT_E_PTQ_EE: optionalString(), // Percentage EBacc Maths entries
  TEBAC2SCI_E_PTQ_EE: optionalString(), // Total EBacc Science entries
  PTEBAC2SCI_E_PTQ_EE: optionalString(), // Percentage EBacc Science entries
  TEBACHUM_E_PTQ_EE: optionalString(), // Total EBacc Humanities entries
  PTEBACHUM_E_PTQ_EE: optionalString(), // Percentage EBacc Humanities entries
  TEBACLAN_E_PTQ_EE: optionalString(), // Total EBacc Languages entries
  PTEBACLAN_E_PTQ_EE: optionalString(), // Percentage EBacc Languages entries

  // EBacc Subject Achievement
  PTEBACENG_94: optionalString(), // Percentage achieving EBacc English grade 4+
  PTEBACENG_95: optionalString(), // Percentage achieving EBacc English grade 5+
  PTEBACMAT_94: optionalString(), // Percentage achieving EBacc Maths grade 4+
  PTEBACMAT_95: optionalString(), // Percentage achieving EBacc Maths grade 5+
  PTEBAC2SCI_94: optionalString(), // Percentage achieving EBacc Science grade 4+
  PTEBAC2SCI_95: optionalString(), // Percentage achieving EBacc Science grade 5+
  PTEBACHUM_94: optionalString(), // Percentage achieving EBacc Humanities grade 4+
  PTEBACHUM_95: optionalString(), // Percentage achieving EBacc Humanities grade 5+
  PTEBACLAN_94: optionalString(), // Percentage achieving EBacc Languages grade 4+
  PTEBACLAN_95: optionalString(), // Percentage achieving EBacc Languages grade 5+

  // Value Added Measures
  SCIVAPUP_PTQ_EE: optionalString(), // Science Value Added pupils
  SCIVACOV_PTQ_EE: optionalString(), // Science Value Added coverage
  HUMVAPUP_PTQ_EE: optionalString(), // Humanities Value Added pupils
  HUMVACOV_PTQ_EE: optionalString(), // Humanities Value Added coverage
  LANVAPUP_PTQ_EE: optionalString(), // Languages Value Added pupils
  LANVACOV_PTQ_EE: optionalString(), // Languages Value Added coverage

  // Value Added Scores
  SCIVAMEA_PTQ_EE: optionalString(), // Science Value Added score
  SCIVALOW_PTQ_EE: optionalString(), // Science Value Added lower confidence interval
  SCIVAUPP_PTQ_EE: optionalString(), // Science Value Added upper confidence interval
  HUMVAMEA_PTQ_EE: optionalString(), // Humanities Value Added score
  HUMVALOW_PTQ_EE: optionalString(), // Humanities Value Added lower confidence interval
  HUMVAUPP_PTQ_EE: optionalString(), // Humanities Value Added upper confidence interval
  LANVAMEA_PTQ_EE: optionalString(), // Languages Value Added score
  LANVALOW_PTQ_EE: optionalString(), // Languages Value Added lower confidence interval
  LANVAUPP_PTQ_EE: optionalString(), // Languages Value Added upper confidence interval

  // EBacc Entry Counts
  TEBACENG_94: optionalString(), // Number achieving EBacc English grade 4+
  TEBACENG_95: optionalString(), // Number achieving EBacc English grade 5+
  TEBACMAT_94: optionalString(), // Number achieving EBacc Maths grade 4+
  TEBACMAT_95: optionalString(), // Number achieving EBacc Maths grade 5+
  TEBAC2SCI_94: optionalString(), // Number achieving EBacc Science grade 4+
  TEBAC2SCI_95: optionalString(), // Number achieving EBacc Science grade 5+
  TEBACHUM_94: optionalString(), // Number achieving EBacc Humanities grade 4+
  TEBACHUM_95: optionalString(), // Number achieving EBacc Humanities grade 5+
  TEBACLAN_94: optionalString(), // Number achieving EBacc Languages grade 4+
  TEBACLAN_95: optionalString(), // Number achieving EBacc Languages grade 5+

  // EBacc Grade 9-1 Measures
  TEBACC91: optionalString(), // Total achieving EBacc at grades 9-1
  PTEBACC91: optionalString(), // Percentage achieving EBacc at grades 9-1
  TEBACENG91: optionalString(), // Number achieving EBacc English at grades 9-1
  PTEBACENG91: optionalString(), // Percentage achieving EBacc English at grades 9-1
  TEBACMAT91: optionalString(), // Number achieving EBacc Maths at grades 9-1
  PTEBACMAT91: optionalString(), // Percentage achieving EBacc Maths at grades 9-1
  TEBAC2SCI91: optionalString(), // Number achieving EBacc Science at grades 9-1
  PTEBAC2SCI91: optionalString(), // Percentage achieving EBacc Science at grades 9-1
  TEBACHUM91: optionalString(), // Number achieving EBacc Humanities at grades 9-1
  PTEBACHUM91: optionalString(), // Percentage achieving EBacc Humanities at grades 9-1
  TEBACLAN91: optionalString(), // Number achieving EBacc Languages at grades 9-1
  PTEBACLAN91: optionalString(), // Percentage achieving EBacc Languages at grades 9-1

  // Disadvantaged Pupils Performance
  ATT8SCR_FSM6CLA1A: z.string().transform(numberParser), // Attainment 8 score - Disadvantaged
  P8PUP_FSM6CLA1A: optionalString(), // Progress 8 pupils - Disadvantaged
  TP8ADJ_FSM6CLA1A: optionalString(), // Progress 8 adjustments - Disadvantaged
  P8MEA_FSM6CLA1A: z.string().transform(numberParser), // Progress 8 score - Disadvantaged
  P8CILOW_FSM6CLA1A: z.string().transform(numberParser), // Progress 8 lower confidence - Disadvantaged
  P8CIUPP_FSM6CLA1A: z.string().transform(numberParser), // Progress 8 upper confidence - Disadvantaged
  P8MEA_FSM6CLA1A_ORIG: optionalString(), // Original Progress 8 score - Disadvantaged
  P8CILOW_FSM6CLA1A_ORIG: optionalString(), // Original P8 lower confidence - Disadvantaged
  P8CIUPP_FSM6CLA1A_ORIG: optionalString(), // Original P8 upper confidence - Disadvantaged

  // Non-Disadvantaged Pupils Performance
  ATT8SCR_NFSM6CLA1A: optionalString(), // Attainment 8 score - Non-disadvantaged
  P8PUP_NFSM6CLA1A: optionalString(), // Progress 8 pupils - Non-disadvantaged
  TP8ADJ_NFSM6CLA1A: optionalString(), // Progress 8 adjustments - Non-disadvantaged
  P8MEA_NFSM6CLA1A: optionalString(), // Progress 8 score - Non-disadvantaged
  P8CILOW_NFSM6CLA1A: optionalString(), // Progress 8 lower confidence - Non-disadvantaged
  P8CIUPP_NFSM6CLA1A: optionalString(), // Progress 8 upper confidence - Non-disadvantaged
  P8MEA_NFSM6CLA1A_ORIG: optionalString(), // Original Progress 8 score - Non-disadvantaged
  P8CILOW_NFSM6CLA1A_ORIG: optionalString(), // Original P8 lower confidence - Non-disadvantaged
  P8CIUPP_NFSM6CLA1A_ORIG: optionalString(), // Original P8 upper confidence - Non-disadvantaged

  // Disadvantaged English Performance
  ATT8SCRENG_FSM6CLA1A: optionalString(), // Attainment 8 English score - Disadvantaged
  P8MEAENG_FSM6CLA1A: optionalString(), // Progress 8 English - Disadvantaged
  P8MEAENG_CILOW_FSM6CLA1A: optionalString(), // P8 English lower confidence - Disadvantaged
  P8MEAENG_CIUPP_FSM6CLA1A: optionalString(), // P8 English upper confidence - Disadvantaged

  // Disadvantaged Maths Performance
  ATT8SCRMAT_FSM6CLA1A: optionalString(), // Attainment 8 Maths score - Disadvantaged
  P8MEAMAT_FSM6CLA1A: optionalString(), // Progress 8 Maths - Disadvantaged
  P8MEAMAT_CILOW_FSM6CLA1A: optionalString(), // P8 Maths lower confidence - Disadvantaged
  P8MEAMAT_CIUPP_FSM6CLA1A: optionalString(), // P8 Maths upper confidence - Disadvantaged

  // Disadvantaged EBacc Performance
  ATT8SCREBAC_FSM6CLA1A: optionalString(), // Attainment 8 EBacc score - Disadvantaged
  P8MEAEBAC_FSM6CLA1A: optionalString(), // Progress 8 EBacc - Disadvantaged
  P8MEAEBAC_CILOW_FSM6CLA1A: optionalString(), // P8 EBacc lower confidence - Disadvantaged
  P8MEAEBAC_CIUPP_FSM6CLA1A: optionalString(), // P8 EBacc upper confidence - Disadvantaged

  // Disadvantaged Open Slots Performance
  ATT8SCROPEN_FSM6CLA1A: optionalString(), // Attainment 8 Open score - Disadvantaged
  P8MEAOPEN_FSM6CLA1A: optionalString(), // Progress 8 Open - Disadvantaged
  P8MEAOPEN_CILOW_FSM6CLA1A: optionalString(), // P8 Open lower confidence - Disadvantaged
  P8MEAOPEN_CIUPP_FSM6CLA1A: optionalString(), // P8 Open upper confidence - Disadvantaged

  // Non-Disadvantaged English Performance
  ATT8SCRENG_NFSM6CLA1A: optionalString(), // Attainment 8 English score - Non-disadvantaged
  P8MEAENG_NFSM6CLA1A: optionalString(), // Progress 8 English - Non-disadvantaged
  P8MEAENG_CILOW_NFSM6CLA1A: optionalString(), // P8 English lower confidence - Non-disadvantaged
  P8MEAENG_CIUPP_NFSM6CLA1A: optionalString(), // P8 English upper confidence - Non-disadvantaged

  // Non-Disadvantaged Maths Performance
  ATT8SCRMAT_NFSM6CLA1A: optionalString(), // Attainment 8 Maths score - Non-disadvantaged
  P8MEAMAT_NFSM6CLA1A: optionalString(), // Progress 8 Maths - Non-disadvantaged
  P8MEAMAT_CILOW_NFSM6CLA1A: optionalString(), // P8 Maths lower confidence - Non-disadvantaged
  P8MEAMAT_CIUPP_NFSM6CLA1A: optionalString(), // P8 Maths upper confidence - Non-disadvantaged

  // Non-Disadvantaged EBacc Performance
  ATT8SCREBAC_NFSM6CLA1A: optionalString(), // Attainment 8 EBacc score - Non-disadvantaged
  P8MEAEBAC_NFSM6CLA1A: optionalString(), // Progress 8 EBacc - Non-disadvantaged
  P8MEAEBAC_CILOW_NFSM6CLA1A: optionalString(), // P8 EBacc lower confidence - Non-disadvantaged
  P8MEAEBAC_CIUPP_NFSM6CLA1A: optionalString(), // P8 EBacc upper confidence - Non-disadvantaged

  // Non-Disadvantaged Open Slots Performance
  ATT8SCROPEN_NFSM6CLA1A: optionalString(), // Attainment 8 Open score - Non-disadvantaged
  P8MEAOPEN_NFSM6CLA1A: optionalString(), // Progress 8 Open - Non-disadvantaged
  P8MEAOPEN_CILOW_NFSM6CLA1A: optionalString(), // P8 Open lower confidence - Non-disadvantaged
  P8MEAOPEN_CIUPP_NFSM6CLA1A: optionalString(), // P8 Open upper confidence - Non-disadvantaged

  // Additional Disadvantaged Performance Metrics
  ATT8SCROPENG_FSM6CLA1A: optionalString(), // Attainment 8 Open GCSE score - Disadvantaged
  ATT8SCROPENNG_FSM6CLA1A: optionalString(), // Attainment 8 Open non-GCSE score - Disadvantaged
  ATT8SCROPENG_NFSM6CLA1A: optionalString(), // Attainment 8 Open GCSE score - Non-disadvantaged
  ATT8SCROPENNG_NFSM6CLA1A: optionalString(), // Attainment 8 Open non-GCSE score - Non-disadvantaged

  // Performance Differences
  DIFFN_ATT8: optionalString(), // Difference in Attainment 8 scores
  DIFFN_P8MEA: optionalString(), // Difference in Progress 8 scores

  // Low Prior Attainment Performance
  ATT8SCR_LO: optionalString(), // Attainment 8 score - Low prior attainment
  P8PUP_LO: optionalString(), // Progress 8 pupils - Low prior attainment
  TP8ADJ_LO: optionalString(), // Progress 8 adjustments - Low prior attainment
  P8MEA_LO: optionalString(), // Progress 8 score - Low prior attainment
  P8CILOW_LO: optionalString(), // Progress 8 lower confidence - Low prior attainment
  P8CIUPP_LO: optionalString(), // Progress 8 upper confidence - Low prior attainment
  P8MEA_LO_ORIG: optionalString(), // Original Progress 8 score - Low prior attainment
  P8CILOW_LO_ORIG: optionalString(), // Original P8 lower confidence - Low prior attainment
  P8CIUPP_LO_ORIG: optionalString(), // Original P8 upper confidence - Low prior attainment

  // Middle Prior Attainment Performance
  ATT8SCR_MID: optionalString(), // Attainment 8 score - Middle prior attainment
  P8PUP_MID: optionalString(), // Progress 8 pupils - Middle prior attainment
  TP8ADJ_MID: optionalString(), // Progress 8 adjustments - Middle prior attainment
  P8MEA_MID: optionalString(), // Progress 8 score - Middle prior attainment
  P8CILOW_MID: optionalString(), // Progress 8 lower confidence - Middle prior attainment
  P8CIUPP_MID: optionalString(), // Progress 8 upper confidence - Middle prior attainment
  P8MEA_MID_ORIG: optionalString(), // Original Progress 8 score - Middle prior attainment
  P8CILOW_MID_ORIG: optionalString(), // Original P8 lower confidence - Middle prior attainment
  P8CIUPP_MID_ORIG: optionalString(), // Original P8 upper confidence - Middle prior attainment

  // High Prior Attainment Performance
  ATT8SCR_HI: optionalString(), // Attainment 8 score - High prior attainment
  P8PUP_HI: optionalString(), // Progress 8 pupils - High prior attainment
  TP8ADJ_HI: optionalString(), // Progress 8 adjustments - High prior attainment
  P8MEA_HI: optionalString(), // Progress 8 score - High prior attainment
  P8CILOW_HI: optionalString(), // Progress 8 lower confidence - High prior attainment
  P8CIUPP_HI: optionalString(), // Progress 8 upper confidence - High prior attainment
  P8MEA_HI_ORIG: optionalString(), // Original Progress 8 score - High prior attainment
  P8CILOW_HI_ORIG: optionalString(), // Original P8 lower confidence - High prior attainment
  P8CIUPP_HI_ORIG: optionalString(), // Original P8 upper confidence - High prior attainment

  // Prior Attainment English Performance
  ATT8SCRENG_LO: optionalString(), // Attainment 8 English score - Low prior attainment
  P8MEAENG_LO: optionalString(), // Progress 8 English - Low prior attainment
  P8MEAENG_CILOW_LO: optionalString(), // P8 English lower confidence - Low prior attainment
  P8MEAENG_CIUPP_LO: optionalString(), // P8 English upper confidence - Low prior attainment
  ATT8SCRENG_MID: optionalString(), // Attainment 8 English score - Middle prior attainment
  P8MEAENG_MID: optionalString(), // Progress 8 English - Middle prior attainment
  P8MEAENG_CILOW_MID: optionalString(), // P8 English lower confidence - Middle prior attainment
  P8MEAENG_CIUPP_MID: optionalString(), // P8 English upper confidence - Middle prior attainment
  ATT8SCRENG_HI: optionalString(), // Attainment 8 English score - High prior attainment
  P8MEAENG_HI: optionalString(), // Progress 8 English - High prior attainment
  P8MEAENG_CILOW_HI: optionalString(), // P8 English lower confidence - High prior attainment
  P8MEAENG_CIUPP_HI: optionalString(), // P8 English upper confidence - High prior attainment

  // Prior Attainment Maths Performance
  ATT8SCRMAT_LO: optionalString(), // Attainment 8 Maths score - Low prior attainment
  P8MEAMAT_LO: optionalString(), // Progress 8 Maths - Low prior attainment
  P8MEAMAT_CILOW_LO: optionalString(), // P8 Maths lower confidence - Low prior attainment
  P8MEAMAT_CIUPP_LO: optionalString(), // P8 Maths upper confidence - Low prior attainment
  ATT8SCRMAT_MID: optionalString(), // Attainment 8 Maths score - Middle prior attainment
  P8MEAMAT_MID: optionalString(), // Progress 8 Maths - Middle prior attainment
  P8MEAMAT_CILOW_MID: optionalString(), // P8 Maths lower confidence - Middle prior attainment
  P8MEAMAT_CIUPP_MID: optionalString(), // P8 Maths upper confidence - Middle prior attainment
  ATT8SCRMAT_HI: optionalString(), // Attainment 8 Maths score - High prior attainment
  P8MEAMAT_HI: optionalString(), // Progress 8 Maths - High prior attainment
  P8MEAMAT_CILOW_HI: optionalString(), // P8 Maths lower confidence - High prior attainment
  P8MEAMAT_CIUPP_HI: optionalString(), // P8 Maths upper confidence - High prior attainment

  // Prior Attainment EBacc Performance
  ATT8SCREBAC_LO: optionalString(), // Attainment 8 EBacc score - Low prior attainment
  P8MEAEBAC_LO: optionalString(), // Progress 8 EBacc - Low prior attainment
  P8MEAEBAC_CILOW_LO: optionalString(), // P8 EBacc lower confidence - Low prior attainment
  P8MEAEBAC_CIUPP_LO: optionalString(), // P8 EBacc upper confidence - Low prior attainment
  ATT8SCREBAC_MID: optionalString(), // Attainment 8 EBacc score - Middle prior attainment
  P8MEAEBAC_MID: optionalString(), // Progress 8 EBacc - Middle prior attainment
  P8MEAEBAC_CILOW_MID: optionalString(), // P8 EBacc lower confidence - Middle prior attainment
  P8MEAEBAC_CIUPP_MID: optionalString(), // P8 EBacc upper confidence - Middle prior attainment
  ATT8SCREBAC_HI: optionalString(), // Attainment 8 EBacc score - High prior attainment
  P8MEAEBAC_HI: optionalString(), // Progress 8 EBacc - High prior attainment
  P8MEAEBAC_CILOW_HI: optionalString(), // P8 EBacc lower confidence - High prior attainment
  P8MEAEBAC_CIUPP_HI: optionalString(), // P8 EBacc upper confidence - High prior attainment

  // Prior Attainment Open Performance
  ATT8SCROPEN_LO: optionalString(), // Attainment 8 Open score - Low prior attainment
  P8MEAOPEN_LO: optionalString(), // Progress 8 Open - Low prior attainment
  P8MEAOPEN_CILOW_LO: optionalString(), // P8 Open lower confidence - Low prior attainment
  P8MEAOPEN_CIUPP_LO: optionalString(), // P8 Open upper confidence - Low prior attainment
  ATT8SCROPEN_MID: optionalString(), // Attainment 8 Open score - Middle prior attainment
  P8MEAOPEN_MID: optionalString(), // Progress 8 Open - Middle prior attainment
  P8MEAOPEN_CILOW_MID: optionalString(), // P8 Open lower confidence - Middle prior attainment
  P8MEAOPEN_CIUPP_MID: optionalString(), // P8 Open upper confidence - Middle prior attainment
  ATT8SCROPEN_HI: optionalString(), // Attainment 8 Open score - High prior attainment
  P8MEAOPEN_HI: optionalString(), // Progress 8 Open - High prior attainment
  P8MEAOPEN_CILOW_HI: optionalString(), // P8 Open lower confidence - High prior attainment
  P8MEAOPEN_CIUPP_HI: optionalString(), // P8 Open upper confidence - High prior attainment

  // Prior Attainment Open GCSE Performance
  ATT8SCROPENG_LO: optionalString(), // Attainment 8 Open GCSE score - Low prior attainment
  ATT8SCROPENG_MID: optionalString(), // Attainment 8 Open GCSE score - Middle prior attainment
  ATT8SCROPENG_HI: optionalString(), // Attainment 8 Open GCSE score - High prior attainment

  // Prior Attainment Open Non-GCSE Performance
  ATT8SCROPENNG_LO: optionalString(), // Attainment 8 Open non-GCSE score - Low prior attainment
  ATT8SCROPENNG_MID: optionalString(), // Attainment 8 Open non-GCSE score - Middle prior attainment
  ATT8SCROPENNG_HI: optionalString(), // Attainment 8 Open non-GCSE score - High prior attainment

  // EAL Performance
  ATT8SCR_EAL: optionalString(), // Attainment 8 score - EAL pupils
  P8PUP_EAL: optionalString(), // Progress 8 pupils - EAL
  TP8ADJ_EAL: optionalString(), // Progress 8 adjustments - EAL
  P8MEA_EAL: optionalString(), // Progress 8 score - EAL
  P8CILOW_EAL: optionalString(), // Progress 8 lower confidence - EAL
  P8CIUPP_EAL: optionalString(), // Progress 8 upper confidence - EAL
  P8MEA_EAL_ORIG: optionalString(), // Original Progress 8 score - EAL
  P8CILOW_EAL_ORIG: optionalString(), // Original P8 lower confidence - EAL
  P8CIUPP_EAL_ORIG: optionalString(), // Original P8 upper confidence - EAL

  // Gender Performance
  ATT8SCR_BOYS: z.string().transform(numberParser), // Attainment 8 score - Boys
  ATT8SCR_GIRLS: z.string().transform(numberParser), // Attainment 8 score - Girls
  P8PUP_BOYS: optionalString(), // Progress 8 pupils - Boys
  P8PUP_GIRLS: optionalString(), // Progress 8 pupils - Girls
  TP8ADJ_BOYS: optionalString(), // Progress 8 adjustments - Boys
  TP8ADJ_GIRLS: optionalString(), // Progress 8 adjustments - Girls
  P8MEA_BOYS: z.string().transform(numberParser), // Progress 8 score - Boys
  P8MEA_GIRLS: z.string().transform(numberParser), // Progress 8 score - Girls

  // Gender Performance - Confidence Intervals
  P8CILOW_BOYS: optionalString(), // Progress 8 lower confidence - Boys
  P8CIUPP_BOYS: optionalString(), // Progress 8 upper confidence - Boys
  P8CILOW_GIRLS: optionalString(), // Progress 8 lower confidence - Girls
  P8CIUPP_GIRLS: optionalString(), // Progress 8 upper confidence - Girls
  P8MEA_BOYS_ORIG: optionalString(), // Original Progress 8 score - Boys
  P8MEA_GIRLS_ORIG: optionalString(), // Original Progress 8 score - Girls
  P8CILOW_BOYS_ORIG: optionalString(), // Original P8 lower confidence - Boys
  P8CIUPP_BOYS_ORIG: optionalString(), // Original P8 upper confidence - Boys
  P8CILOW_GIRLS_ORIG: optionalString(), // Original P8 lower confidence - Girls
  P8CIUPP_GIRLS_ORIG: optionalString(), // Original P8 upper confidence - Girls

  // Gender English Performance
  ATT8SCRENG_BOYS: optionalString(), // Attainment 8 English score - Boys
  ATT8SCRENG_GIRLS: optionalString(), // Attainment 8 English score - Girls
  P8MEAENG_BOYS: optionalString(), // Progress 8 English - Boys
  P8MEAENG_GIRLS: optionalString(), // Progress 8 English - Girls
  P8MEAENG_CILOW_BOYS: optionalString(), // P8 English lower confidence - Boys
  P8MEAENG_CIUPP_BOYS: optionalString(), // P8 English upper confidence - Boys
  P8MEAENG_CILOW_GIRLS: optionalString(), // P8 English lower confidence - Girls
  P8MEAENG_CIUPP_GIRLS: optionalString(), // P8 English upper confidence - Girls

  // Gender Maths Performance
  ATT8SCRMAT_BOYS: optionalString(), // Attainment 8 Maths score - Boys
  ATT8SCRMAT_GIRLS: optionalString(), // Attainment 8 Maths score - Girls
  P8MEAMAT_BOYS: optionalString(), // Progress 8 Maths - Boys
  P8MEAMAT_GIRLS: optionalString(), // Progress 8 Maths - Girls
  P8MEAMAT_CILOW_BOYS: optionalString(), // P8 Maths lower confidence - Boys
  P8MEAMAT_CIUPP_BOYS: optionalString(), // P8 Maths upper confidence - Boys
  P8MEAMAT_CILOW_GIRLS: optionalString(), // P8 Maths lower confidence - Girls
  P8MEAMAT_CIUPP_GIRLS: optionalString(), // P8 Maths upper confidence - Girls

  // Gender EBacc Performance
  ATT8SCREBAC_BOYS: optionalString(), // Attainment 8 EBacc score - Boys
  ATT8SCREBAC_GIRLS: optionalString(), // Attainment 8 EBacc score - Girls
  P8MEAEBAC_BOYS: optionalString(), // Progress 8 EBacc - Boys
  P8MEAEBAC_GIRLS: optionalString(), // Progress 8 EBacc - Girls
  P8MEAEBAC_CILOW_BOYS: optionalString(), // P8 EBacc lower confidence - Boys
  P8MEAEBAC_CIUPP_BOYS: optionalString(), // P8 EBacc upper confidence - Boys
  P8MEAEBAC_CILOW_GIRLS: optionalString(), // P8 EBacc lower confidence - Girls
  P8MEAEBAC_CIUPP_GIRLS: optionalString(), // P8 EBacc upper confidence - Girls

  // Gender Open Performance
  ATT8SCROPEN_BOYS: optionalString(), // Attainment 8 Open score - Boys
  ATT8SCROPEN_GIRLS: optionalString(), // Attainment 8 Open score - Girls
  P8MEAOPEN_BOYS: optionalString(), // Progress 8 Open - Boys
  P8MEAOPEN_GIRLS: optionalString(), // Progress 8 Open - Girls
  P8MEAOPEN_CILOW_BOYS: optionalString(), // P8 Open lower confidence - Boys
  P8MEAOPEN_CIUPP_BOYS: optionalString(), // P8 Open upper confidence - Boys
  P8MEAOPEN_CILOW_GIRLS: optionalString(), // P8 Open lower confidence - Girls
  P8MEAOPEN_CIUPP_GIRLS: optionalString(), // P8 Open upper confidence - Girls

  // Gender Open GCSE Performance
  ATT8SCROPENG_BOYS: optionalString(), // Attainment 8 Open GCSE score - Boys
  ATT8SCROPENG_GIRLS: optionalString(), // Attainment 8 Open GCSE score - Girls

  // Gender Open Non-GCSE Performance
  ATT8SCROPENNG_BOYS: optionalString(), // Attainment 8 Open non-GCSE score - Boys
  ATT8SCROPENNG_GIRLS: optionalString(), // Attainment 8 Open non-GCSE score - Girls

  // Non-Mobile Pupils Performance
  ATT8SCR_NMOB: optionalString(), // Attainment 8 score - Non-mobile pupils
  P8PUP_NMOB: optionalString(), // Progress 8 pupils - Non-mobile
  TP8ADJ_NMOB: optionalString(), // Progress 8 adjustments - Non-mobile
  P8MEA_NMOB: optionalString(), // Progress 8 score - Non-mobile
  P8CILOW_NMOB: optionalString(), // Progress 8 lower confidence - Non-mobile
  P8CIUPP_NMOB: optionalString(), // Progress 8 upper confidence - Non-mobile
  P8MEA_NMOB_ORIG: optionalString(), // Original Progress 8 score - Non-mobile
  P8CILOW_NMOB_ORIG: optionalString(), // Original P8 lower confidence - Non-mobile
  P8CIUPP_NMOB_ORIG: optionalString(), // Original P8 upper confidence - Non-mobile

  // Non-Mobile Pupils Subject Performance
  ATT8SCRENG_NMOB: optionalString(), // Attainment 8 English score - Non-mobile
  P8MEAENG_NMOB: optionalString(), // Progress 8 English - Non-mobile
  P8MEAENG_CILOW_NMOB: optionalString(), // P8 English lower confidence - Non-mobile
  P8MEAENG_CIUPP_NMOB: optionalString(), // P8 English upper confidence - Non-mobile
  ATT8SCRMAT_NMOB: optionalString(), // Attainment 8 Maths score - Non-mobile
  P8MEAMAT_NMOB: optionalString(), // Progress 8 Maths - Non-mobile
  P8MEAMAT_CILOW_NMOB: optionalString(), // P8 Maths lower confidence - Non-mobile
  P8MEAMAT_CIUPP_NMOB: optionalString(), // P8 Maths upper confidence - Non-mobile

  // Non-Mobile Pupils EBacc Performance
  ATT8SCREBAC_NMOB: optionalString(), // Attainment 8 EBacc score - Non-mobile
  P8MEAEBAC_NMOB: optionalString(), // Progress 8 EBacc - Non-mobile
  P8MEAEBAC_CILOW_NMOB: optionalString(), // P8 EBacc lower confidence - Non-mobile
  P8MEAEBAC_CIUPP_NMOB: optionalString(), // P8 EBacc upper confidence - Non-mobile

  // Non-Mobile Pupils Open Performance
  ATT8SCROPEN_NMOB: optionalString(), // Attainment 8 Open score - Non-mobile
  P8MEAOPEN_NMOB: optionalString(), // Progress 8 Open - Non-mobile
  P8MEAOPEN_CILOW_NMOB: optionalString(), // P8 Open lower confidence - Non-mobile
  P8MEAOPEN_CIUPP_NMOB: optionalString(), // P8 Open upper confidence - Non-mobile

  // Non-Mobile Pupils Open GCSE Performance
  ATT8SCROPENG_NMOB: optionalString(), // Attainment 8 Open GCSE score - Non-mobile
  ATT8SCROPENNG_NMOB: optionalString(), // Attainment 8 Open non-GCSE score - Non-mobile
});

export type KS4ResultsRow = z.infer<typeof KS4ResultsSchema>;
