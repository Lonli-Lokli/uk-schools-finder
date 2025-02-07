import { z } from 'zod';
import {
  stringOrNumber,
  optionalString,
  mustBeNumber,
  mustBePercentage,
} from './helpers';

// Schema includes all fields from england_ks4provisional.csv
export const KS4ResultsSchema = z.object({
  // Basic School Information
  RECTYPE: stringOrNumber(), // Record Type: '1' = School, '2' = LA, '4' = National
  LEA: stringOrNumber(), // Local Education Authority code
  ESTAB: stringOrNumber(), // Establishment number
  URN: stringOrNumber(), // Unique Reference Number
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
  CONTFLAG: mustBeNumber(), // Continuity flag
  ICLOSE: mustBeNumber(), // School closure indicator
  NFTYPE: optionalString(), // School type (e.g., Community, Academy)
  RELDENOM: optionalString(), // Religious denomination
  ADMPOL: optionalString(), // Admissions policy
  ADMPOL_PT: optionalString(), // Admissions policy detail
  EGENDER: optionalString(), // Gender of intake (Mixed/Boys/Girls)
  FEEDER: mustBeNumber(), // Feeder school status
  AGERANGE: optionalString(), // School age range: ;

  // Pupil Numbers
  TOTPUPS: mustBeNumber(), // Total number of pupils
  NUMBOYS: mustBeNumber(), // Number of boys
  NUMGIRLS: mustBeNumber(), // Number of girls
  TPUP: mustBeNumber(), // Total pupils in KS4 cohort
  BPUP: mustBeNumber(), // Boys in KS4 cohort
  GPUP: mustBeNumber(), // Girls in KS4 cohort

  // Prior Attainment
  KS2ASS: optionalString(), // KS2 assessment method
  TPRIORLO: mustBeNumber(), // Number of pupils with low prior attainment
  PTPRIORLO: mustBePercentage(), // Percentage of pupils with low prior attainment
  TPRIORAV: mustBeNumber(), // Number of pupils with average prior attainment
  PTPRIORAV: mustBePercentage(), // Percentage of pupils with average prior attainment
  TPRIORHI: mustBeNumber(), // Number of pupils with high prior attainment
  PTPRIORHI: mustBePercentage(), // Percentage of pupils with high prior attainment

  // Disadvantaged Pupils
  TFSM6CLA1A: mustBeNumber(), // Number of disadvantaged pupils
  PTFSM6CLA1A: mustBePercentage(), // Percentage of disadvantaged pupils
  TNOTFSM6CLA1A: mustBeNumber(), // Number of non-disadvantaged pupils
  PTNOTFSM6CLA1A: mustBePercentage(), // Percentage of non-disadvantaged pupils

  // English as Additional Language (EAL)
  TEALGRP2: mustBeNumber(), // Number of EAL pupils
  PTEALGRP2: mustBePercentage(), // Percentage of EAL pupils
  TEALGRP1: mustBeNumber(), // Number of EAL group 1
  PTEALGRP1: mustBePercentage(), // Percentage of EAL group 1
  TEALGRP3: mustBeNumber(), // Number of EAL group 3
  PTEALGRP3: mustBePercentage(), // Percentage of EAL group 3

  // Mobility and SEN
  TNMOB: mustBeNumber(), // Number of non-mobile pupils
  PTNMOB: mustBePercentage(), // Percentage of non-mobile pupils
  SENE4: mustBeNumber(), // Number of SEN pupils with EHC plans
  PSENE4: mustBePercentage(), // Percentage of SEN pupils with EHC plans
  SEN_ALL4: mustBeNumber(), // Total number of SEN pupils
  PSEN_ALL4: mustBePercentage(), // Percentage of all SEN pupils
  SENK4: mustBeNumber(), // Number of SEN support pupils
  PSENK4: mustBePercentage(), // Percentage of SEN support pupils

  // Attainment 8 Scores
  TOTATT8: mustBeNumber(), // Total Attainment 8 points
  ATT8SCR: mustBeNumber(), // Attainment 8 score per pupil
  TOTATT8ENG: mustBeNumber(), // Total Attainment 8 points in English
  ATT8SCRENG: mustBeNumber(), // Attainment 8 score in English per pupil
  TOTATT8MAT: mustBeNumber(), // Total Attainment 8 points in Maths
  ATT8SCRMAT: mustBeNumber(), // Attainment 8 score in Maths per pupil
  TOTATT8EBAC: mustBeNumber(), // Total Attainment 8 points in EBacc subjects
  ATT8SCREBAC: mustBeNumber(), // Attainment 8 score in EBacc subjects per pupil
  TOTATT8OPEN: mustBeNumber(), // Total Attainment 8 points in Open slots
  ATT8SCROPEN: mustBeNumber(), // Attainment 8 score in Open slots per pupil
  TOTATT8OPENG: mustBeNumber(), // Total Attainment 8 points in Open GCSE slots
  ATT8SCROPENG: mustBeNumber(), // Attainment 8 score in Open GCSE slots per pupil
  TOTATT8OPENNG: mustBeNumber(), // Total Attainment 8 points in Open non-GCSE slots
  ATT8SCROPENNG: mustBeNumber(), // Attainment 8 score in Open non-GCSE slots per pupil

  // Average Fill Rates
  AVGEBACFILL: mustBeNumber(), // Average EBacc slot fill rate
  AVGOPENFILL: mustBeNumber(), // Average Open slot fill rate

  // Progress 8 Scores
  P8PUP: mustBeNumber(), // Number of pupils included in Progress 8
  TP8ADJ: mustBeNumber(), // Total Progress 8 adjustments
  P8MEACOV: mustBePercentage(), // Progress 8 coverage
  P8MEA: mustBeNumber(), // Progress 8 score
  P8CILOW: mustBeNumber(), // Progress 8 lower confidence interval
  P8CIUPP: mustBeNumber(), // Progress 8 upper confidence interval
  P8MEA_ORIG: mustBeNumber(), // Original Progress 8 score
  P8CILOW_ORIG: mustBeNumber(), // Original Progress 8 lower confidence interval
  P8CIUPP_ORIG: mustBeNumber(), // Original Progress 8 upper confidence interval

  // Progress 8 Elements
  P8MEAENG: mustBeNumber(), // Progress 8 English element
  P8MEAENG_CILOW: mustBeNumber(), // Progress 8 English lower confidence interval
  P8MEAENG_CIUPP: mustBeNumber(), // Progress 8 English upper confidence interval
  P8MEAMAT: mustBeNumber(), // Progress 8 Maths element
  P8MEAMAT_CILOW: mustBeNumber(), // Progress 8 Maths lower confidence interval
  P8MEAMAT_CIUPP: mustBeNumber(), // Progress 8 Maths upper confidence interval
  P8MEAEBAC: mustBeNumber(), // Progress 8 EBacc element
  P8MEAEBAC_CILOW: mustBeNumber(), // Progress 8 EBacc lower confidence interval
  P8MEAEBAC_CIUPP: mustBeNumber(), // Progress 8 EBacc upper confidence interval
  P8MEAOPEN: mustBeNumber(), // Progress 8 Open element
  P8MEAOPEN_CILOW: mustBeNumber(), // Progress 8 Open lower confidence interval
  P8MEAOPEN_CIUPP: mustBeNumber(), // Progress 8 Open upper confidence interval

  // Basics Measures
  PTL2BASICS_94: mustBePercentage(), // Percentage achieving grade 4+ in English & Maths
  PTL2BASICS_95: mustBePercentage(), // Percentage achieving grade 5+ in English & Maths

  // EBacc Measures
  TOTEBACCAPS: mustBeNumber(), // Total EBacc Average Point Score
  EBACCAPS: mustBeNumber(), // EBacc APS
  EBACCAPS_FSM6CLA1A: mustBeNumber(), // EBacc APS - Disadvantaged pupils
  EBACCAPS_NFSM6CLA1A: mustBeNumber(), // EBacc APS - Non-disadvantaged pupils
  EBACCAPS_LO: mustBeNumber(), // EBacc APS - Low prior attainment
  EBACCAPS_MID: mustBeNumber(), // EBacc APS - Middle prior attainment
  EBACCAPS_HI: mustBeNumber(), // EBacc APS - High prior attainment
  EBACCAPS_EAL: mustBeNumber(), // EBacc APS - EAL pupils
  EBACCAPS_GIRLS: mustBeNumber(), // EBacc APS - Girls
  EBACCAPS_BOYS: mustBeNumber(), // EBacc APS - Boys
  EBACCAPS_NMOB: mustBeNumber(), // EBacc APS - Non-mobile pupils

  // EBacc Entry and Achievement
  TEBACC_E_PTQ_EE: mustBeNumber(), // Total EBacc entries
  PTEBACC_E_PTQ_EE: mustBePercentage(), // Percentage of EBacc entries
  PTEBACC_94: mustBePercentage(), // Percentage achieving EBacc at grade 4+
  PTEBACC_95: mustBePercentage(), // Percentage achieving EBacc at grade 5+

  // EBacc Subject Components
  TEBACENG_E_PTQ_EE: mustBeNumber(), // Total EBacc English entries
  PTEBACENG_E_PTQ_EE: mustBePercentage(), // Percentage EBacc English entries
  TEBACMAT_E_PTQ_EE: mustBeNumber(), // Total EBacc Maths entries
  PTEBACMAT_E_PTQ_EE: mustBePercentage(), // Percentage EBacc Maths entries
  TEBAC2SCI_E_PTQ_EE: mustBeNumber(), // Total EBacc Science entries
  PTEBAC2SCI_E_PTQ_EE: mustBePercentage(), // Percentage EBacc Science entries
  TEBACHUM_E_PTQ_EE: mustBeNumber(), // Total EBacc Humanities entries
  PTEBACHUM_E_PTQ_EE: mustBePercentage(), // Percentage EBacc Humanities entries
  TEBACLAN_E_PTQ_EE: mustBeNumber(), // Total EBacc Languages entries
  PTEBACLAN_E_PTQ_EE: mustBePercentage(), // Percentage EBacc Languages entries

  // EBacc Subject Achievement
  PTEBACENG_94: mustBePercentage(), // Percentage achieving EBacc English grade 4+
  PTEBACENG_95: mustBePercentage(), // Percentage achieving EBacc English grade 5+
  PTEBACMAT_94: mustBePercentage(), // Percentage achieving EBacc Maths grade 4+
  PTEBACMAT_95: mustBePercentage(), // Percentage achieving EBacc Maths grade 5+
  PTEBAC2SCI_94: mustBePercentage(), // Percentage achieving EBacc Science grade 4+
  PTEBAC2SCI_95: mustBePercentage(), // Percentage achieving EBacc Science grade 5+
  PTEBACHUM_94: mustBePercentage(), // Percentage achieving EBacc Humanities grade 4+
  PTEBACHUM_95: mustBePercentage(), // Percentage achieving EBacc Humanities grade 5+
  PTEBACLAN_94: mustBePercentage(), // Percentage achieving EBacc Languages grade 4+
  PTEBACLAN_95: mustBePercentage(), // Percentage achieving EBacc Languages grade 5+

  // Value Added Measures
  SCIVAPUP_PTQ_EE: mustBeNumber(), // Science Value Added pupils
  SCIVACOV_PTQ_EE: mustBePercentage(), // Science Value Added coverage
  HUMVAPUP_PTQ_EE: mustBeNumber(), // Humanities Value Added pupils
  HUMVACOV_PTQ_EE: mustBePercentage(), // Humanities Value Added coverage
  LANVAPUP_PTQ_EE: mustBeNumber(), // Languages Value Added pupils
  LANVACOV_PTQ_EE: mustBePercentage(), // Languages Value Added coverage

  // Value Added Scores
  SCIVAMEA_PTQ_EE: mustBeNumber(), // Science Value Added score
  SCIVALOW_PTQ_EE: mustBeNumber(), // Science Value Added lower confidence interval
  SCIVAUPP_PTQ_EE: mustBeNumber(), // Science Value Added upper confidence interval
  HUMVAMEA_PTQ_EE: mustBeNumber(), // Humanities Value Added score
  HUMVALOW_PTQ_EE: mustBeNumber(), // Humanities Value Added lower confidence interval
  HUMVAUPP_PTQ_EE: mustBeNumber(), // Humanities Value Added upper confidence interval
  LANVAMEA_PTQ_EE: mustBeNumber(), // Languages Value Added score
  LANVALOW_PTQ_EE: mustBeNumber(), // Languages Value Added lower confidence interval
  LANVAUPP_PTQ_EE: mustBeNumber(), // Languages Value Added upper confidence interval

  // EBacc Entry Counts
  TEBACENG_94: mustBeNumber(), // Number achieving EBacc English grade 4+
  TEBACENG_95: mustBeNumber(), // Number achieving EBacc English grade 5+
  TEBACMAT_94: mustBeNumber(), // Number achieving EBacc Maths grade 4+
  TEBACMAT_95: mustBeNumber(), // Number achieving EBacc Maths grade 5+
  TEBAC2SCI_94: mustBeNumber(), // Number achieving EBacc Science grade 4+
  TEBAC2SCI_95: mustBeNumber(), // Number achieving EBacc Science grade 5+
  TEBACHUM_94: mustBeNumber(), // Number achieving EBacc Humanities grade 4+
  TEBACHUM_95: mustBeNumber(), // Number achieving EBacc Humanities grade 5+
  TEBACLAN_94: mustBeNumber(), // Number achieving EBacc Languages grade 4+
  TEBACLAN_95: mustBeNumber(), // Number achieving EBacc Languages grade 5+

  // EBacc Grade 9-1 Measures
  TEBACC91: mustBeNumber(), // Total achieving EBacc at grades 9-1
  PTEBACC91: mustBePercentage(), // Percentage achieving EBacc at grades 9-1
  TEBACENG91: mustBeNumber(), // Number achieving EBacc English at grades 9-1
  PTEBACENG91: mustBePercentage(), // Percentage achieving EBacc English at grades 9-1
  TEBACMAT91: mustBeNumber(), // Number achieving EBacc Maths at grades 9-1
  PTEBACMAT91: mustBePercentage(), // Percentage achieving EBacc Maths at grades 9-1
  TEBAC2SCI91: mustBeNumber(), // Number achieving EBacc Science at grades 9-1
  PTEBAC2SCI91: mustBePercentage(), // Percentage achieving EBacc Science at grades 9-1
  TEBACHUM91: mustBeNumber(), // Number achieving EBacc Humanities at grades 9-1
  PTEBACHUM91: mustBePercentage(), // Percentage achieving EBacc Humanities at grades 9-1
  TEBACLAN91: mustBeNumber(), // Number achieving EBacc Languages at grades 9-1
  PTEBACLAN91: mustBePercentage(), // Percentage achieving EBacc Languages at grades 9-1

  // Disadvantaged Pupils Performance
  ATT8SCR_FSM6CLA1A: mustBeNumber(), // Attainment 8 score - Disadvantaged
  P8PUP_FSM6CLA1A: mustBeNumber(), // Progress 8 pupils - Disadvantaged
  TP8ADJ_FSM6CLA1A: mustBeNumber(), // Progress 8 adjustments - Disadvantaged
  P8MEA_FSM6CLA1A: mustBeNumber(), // Progress 8 score - Disadvantaged
  P8CILOW_FSM6CLA1A: mustBeNumber(), // Progress 8 lower confidence - Disadvantaged
  P8CIUPP_FSM6CLA1A: mustBeNumber(), // Progress 8 upper confidence - Disadvantaged
  P8MEA_FSM6CLA1A_ORIG: mustBeNumber(), // Original Progress 8 score - Disadvantaged
  P8CILOW_FSM6CLA1A_ORIG: mustBeNumber(), // Original P8 lower confidence - Disadvantaged
  P8CIUPP_FSM6CLA1A_ORIG: mustBeNumber(), // Original P8 upper confidence - Disadvantaged

  // Non-Disadvantaged Pupils Performance
  ATT8SCR_NFSM6CLA1A: mustBeNumber(), // Attainment 8 score - Non-disadvantaged
  P8PUP_NFSM6CLA1A: mustBeNumber(), // Progress 8 pupils - Non-disadvantaged
  TP8ADJ_NFSM6CLA1A: mustBeNumber(), // Progress 8 adjustments - Non-disadvantaged
  P8MEA_NFSM6CLA1A: mustBeNumber(), // Progress 8 score - Non-disadvantaged
  P8CILOW_NFSM6CLA1A: mustBeNumber(), // Progress 8 lower confidence - Non-disadvantaged
  P8CIUPP_NFSM6CLA1A: mustBeNumber(), // Progress 8 upper confidence - Non-disadvantaged
  P8MEA_NFSM6CLA1A_ORIG: mustBeNumber(), // Original Progress 8 score - Non-disadvantaged
  P8CILOW_NFSM6CLA1A_ORIG: mustBeNumber(), // Original P8 lower confidence - Non-disadvantaged
  P8CIUPP_NFSM6CLA1A_ORIG: mustBeNumber(), // Original P8 upper confidence - Non-disadvantaged

  // Disadvantaged English Performance
  ATT8SCRENG_FSM6CLA1A: mustBeNumber(), // Attainment 8 English score - Disadvantaged
  P8MEAENG_FSM6CLA1A: mustBeNumber(), // Progress 8 English - Disadvantaged
  P8MEAENG_CILOW_FSM6CLA1A: mustBeNumber(), // P8 English lower confidence - Disadvantaged
  P8MEAENG_CIUPP_FSM6CLA1A: mustBeNumber(), // P8 English upper confidence - Disadvantaged

  // Disadvantaged Maths Performance
  ATT8SCRMAT_FSM6CLA1A: mustBeNumber(), // Attainment 8 Maths score - Disadvantaged
  P8MEAMAT_FSM6CLA1A: mustBeNumber(), // Progress 8 Maths - Disadvantaged
  P8MEAMAT_CILOW_FSM6CLA1A: mustBeNumber(), // P8 Maths lower confidence - Disadvantaged
  P8MEAMAT_CIUPP_FSM6CLA1A: mustBeNumber(), // P8 Maths upper confidence - Disadvantaged

  // Disadvantaged EBacc Performance
  ATT8SCREBAC_FSM6CLA1A: mustBeNumber(), // Attainment 8 EBacc score - Disadvantaged
  P8MEAEBAC_FSM6CLA1A: mustBeNumber(), // Progress 8 EBacc - Disadvantaged
  P8MEAEBAC_CILOW_FSM6CLA1A: mustBeNumber(), // P8 EBacc lower confidence - Disadvantaged
  P8MEAEBAC_CIUPP_FSM6CLA1A: mustBeNumber(), // P8 EBacc upper confidence - Disadvantaged

  // Disadvantaged Open Slots Performance
  ATT8SCROPEN_FSM6CLA1A: mustBeNumber(), // Attainment 8 Open score - Disadvantaged
  P8MEAOPEN_FSM6CLA1A: mustBeNumber(), // Progress 8 Open - Disadvantaged
  P8MEAOPEN_CILOW_FSM6CLA1A: mustBeNumber(), // P8 Open lower confidence - Disadvantaged
  P8MEAOPEN_CIUPP_FSM6CLA1A: mustBeNumber(), // P8 Open upper confidence - Disadvantaged

  // Non-Disadvantaged English Performance
  ATT8SCRENG_NFSM6CLA1A: mustBeNumber(), // Attainment 8 English score - Non-disadvantaged
  P8MEAENG_NFSM6CLA1A: mustBeNumber(), // Progress 8 English - Non-disadvantaged
  P8MEAENG_CILOW_NFSM6CLA1A: mustBeNumber(), // P8 English lower confidence - Non-disadvantaged
  P8MEAENG_CIUPP_NFSM6CLA1A: mustBeNumber(), // P8 English upper confidence - Non-disadvantaged

  // Non-Disadvantaged Maths Performance
  ATT8SCRMAT_NFSM6CLA1A: mustBeNumber(), // Attainment 8 Maths score - Non-disadvantaged
  P8MEAMAT_NFSM6CLA1A: mustBeNumber(), // Progress 8 Maths - Non-disadvantaged
  P8MEAMAT_CILOW_NFSM6CLA1A: mustBeNumber(), // P8 Maths lower confidence - Non-disadvantaged
  P8MEAMAT_CIUPP_NFSM6CLA1A: mustBeNumber(), // P8 Maths upper confidence - Non-disadvantaged

  // Non-Disadvantaged EBacc Performance
  ATT8SCREBAC_NFSM6CLA1A: mustBeNumber(), // Attainment 8 EBacc score - Non-disadvantaged
  P8MEAEBAC_NFSM6CLA1A: mustBeNumber(), // Progress 8 EBacc - Non-disadvantaged
  P8MEAEBAC_CILOW_NFSM6CLA1A: mustBeNumber(), // P8 EBacc lower confidence - Non-disadvantaged
  P8MEAEBAC_CIUPP_NFSM6CLA1A: mustBeNumber(), // P8 EBacc upper confidence - Non-disadvantaged

  // Non-Disadvantaged Open Slots Performance
  ATT8SCROPEN_NFSM6CLA1A: mustBeNumber(), // Attainment 8 Open score - Non-disadvantaged
  P8MEAOPEN_NFSM6CLA1A: mustBeNumber(), // Progress 8 Open - Non-disadvantaged
  P8MEAOPEN_CILOW_NFSM6CLA1A: mustBeNumber(), // P8 Open lower confidence - Non-disadvantaged
  P8MEAOPEN_CIUPP_NFSM6CLA1A: mustBeNumber(), // P8 Open upper confidence - Non-disadvantaged

  // Additional Disadvantaged Performance Metrics
  ATT8SCROPENG_FSM6CLA1A: mustBeNumber(), // Attainment 8 Open GCSE score - Disadvantaged
  ATT8SCROPENNG_FSM6CLA1A: mustBeNumber(), // Attainment 8 Open non-GCSE score - Disadvantaged
  ATT8SCROPENG_NFSM6CLA1A: mustBeNumber(), // Attainment 8 Open GCSE score - Non-disadvantaged
  ATT8SCROPENNG_NFSM6CLA1A: mustBeNumber(), // Attainment 8 Open non-GCSE score - Non-disadvantaged

  // Performance Differences
  DIFFN_ATT8: mustBeNumber(), // Difference in Attainment 8 scores
  DIFFN_P8MEA: mustBeNumber(), // Difference in Progress 8 scores

  // Low Prior Attainment Performance
  ATT8SCR_LO: mustBeNumber(), // Attainment 8 score - Low prior attainment
  P8PUP_LO: mustBeNumber(), // Progress 8 pupils - Low prior attainment
  TP8ADJ_LO: mustBeNumber(), // Progress 8 adjustments - Low prior attainment
  P8MEA_LO: mustBeNumber(), // Progress 8 score - Low prior attainment
  P8CILOW_LO: mustBeNumber(), // Progress 8 lower confidence - Low prior attainment
  P8CIUPP_LO: mustBeNumber(), // Progress 8 upper confidence - Low prior attainment
  P8MEA_LO_ORIG: mustBeNumber(), // Original Progress 8 score - Low prior attainment
  P8CILOW_LO_ORIG: mustBeNumber(), // Original P8 lower confidence - Low prior attainment
  P8CIUPP_LO_ORIG: mustBeNumber(), // Original P8 upper confidence - Low prior attainment

  // Middle Prior Attainment Performance
  ATT8SCR_MID: mustBeNumber(), // Attainment 8 score - Middle prior attainment
  P8PUP_MID: mustBeNumber(), // Progress 8 pupils - Middle prior attainment
  TP8ADJ_MID: mustBeNumber(), // Progress 8 adjustments - Middle prior attainment
  P8MEA_MID: mustBeNumber(), // Progress 8 score - Middle prior attainment
  P8CILOW_MID: mustBeNumber(), // Progress 8 lower confidence - Middle prior attainment
  P8CIUPP_MID: mustBeNumber(), // Progress 8 upper confidence - Middle prior attainment
  P8MEA_MID_ORIG: mustBeNumber(), // Original Progress 8 score - Middle prior attainment
  P8CILOW_MID_ORIG: mustBeNumber(), // Original P8 lower confidence - Middle prior attainment
  P8CIUPP_MID_ORIG: mustBeNumber(), // Original P8 upper confidence - Middle prior attainment

  // High Prior Attainment Performance
  ATT8SCR_HI: mustBeNumber(), // Attainment 8 score - High prior attainment
  P8PUP_HI: mustBeNumber(), // Progress 8 pupils - High prior attainment
  TP8ADJ_HI: mustBeNumber(), // Progress 8 adjustments - High prior attainment
  P8MEA_HI: mustBeNumber(), // Progress 8 score - High prior attainment
  P8CILOW_HI: mustBeNumber(), // Progress 8 lower confidence - High prior attainment
  P8CIUPP_HI: mustBeNumber(), // Progress 8 upper confidence - High prior attainment
  P8MEA_HI_ORIG: mustBeNumber(), // Original Progress 8 score - High prior attainment
  P8CILOW_HI_ORIG: mustBeNumber(), // Original P8 lower confidence - High prior attainment
  P8CIUPP_HI_ORIG: mustBeNumber(), // Original P8 upper confidence - High prior attainment

  // Prior Attainment English Performance
  ATT8SCRENG_LO: mustBeNumber(), // Attainment 8 English score - Low prior attainment
  P8MEAENG_LO: mustBeNumber(), // Progress 8 English - Low prior attainment
  P8MEAENG_CILOW_LO: mustBeNumber(), // P8 English lower confidence - Low prior attainment
  P8MEAENG_CIUPP_LO: mustBeNumber(), // P8 English upper confidence - Low prior attainment
  ATT8SCRENG_MID: mustBeNumber(), // Attainment 8 English score - Middle prior attainment
  P8MEAENG_MID: mustBeNumber(), // Progress 8 English - Middle prior attainment
  P8MEAENG_CILOW_MID: mustBeNumber(), // P8 English lower confidence - Middle prior attainment
  P8MEAENG_CIUPP_MID: mustBeNumber(), // P8 English upper confidence - Middle prior attainment
  ATT8SCRENG_HI: mustBeNumber(), // Attainment 8 English score - High prior attainment
  P8MEAENG_HI: mustBeNumber(), // Progress 8 English - High prior attainment
  P8MEAENG_CILOW_HI: mustBeNumber(), // P8 English lower confidence - High prior attainment
  P8MEAENG_CIUPP_HI: mustBeNumber(), // P8 English upper confidence - High prior attainment

  // Prior Attainment Maths Performance
  ATT8SCRMAT_LO: mustBeNumber(), // Attainment 8 Maths score - Low prior attainment
  P8MEAMAT_LO: mustBeNumber(), // Progress 8 Maths - Low prior attainment
  P8MEAMAT_CILOW_LO: mustBeNumber(), // P8 Maths lower confidence - Low prior attainment
  P8MEAMAT_CIUPP_LO: mustBeNumber(), // P8 Maths upper confidence - Low prior attainment
  ATT8SCRMAT_MID: mustBeNumber(), // Attainment 8 Maths score - Middle prior attainment
  P8MEAMAT_MID: mustBeNumber(), // Progress 8 Maths - Middle prior attainment
  P8MEAMAT_CILOW_MID: mustBeNumber(), // P8 Maths lower confidence - Middle prior attainment
  P8MEAMAT_CIUPP_MID: mustBeNumber(), // P8 Maths upper confidence - Middle prior attainment
  ATT8SCRMAT_HI: mustBeNumber(), // Attainment 8 Maths score - High prior attainment
  P8MEAMAT_HI: mustBeNumber(), // Progress 8 Maths - High prior attainment
  P8MEAMAT_CILOW_HI: mustBeNumber(), // P8 Maths lower confidence - High prior attainment
  P8MEAMAT_CIUPP_HI: mustBeNumber(), // P8 Maths upper confidence - High prior attainment

  // Prior Attainment EBacc Performance
  ATT8SCREBAC_LO: mustBeNumber(), // Attainment 8 EBacc score - Low prior attainment
  P8MEAEBAC_LO: mustBeNumber(), // Progress 8 EBacc - Low prior attainment
  P8MEAEBAC_CILOW_LO: mustBeNumber(), // P8 EBacc lower confidence - Low prior attainment
  P8MEAEBAC_CIUPP_LO: mustBeNumber(), // P8 EBacc upper confidence - Low prior attainment
  ATT8SCREBAC_MID: mustBeNumber(), // Attainment 8 EBacc score - Middle prior attainment
  P8MEAEBAC_MID: mustBeNumber(), // Progress 8 EBacc - Middle prior attainment
  P8MEAEBAC_CILOW_MID: mustBeNumber(), // P8 EBacc lower confidence - Middle prior attainment
  P8MEAEBAC_CIUPP_MID: mustBeNumber(), // P8 EBacc upper confidence - Middle prior attainment
  ATT8SCREBAC_HI: mustBeNumber(), // Attainment 8 EBacc score - High prior attainment
  P8MEAEBAC_HI: mustBeNumber(), // Progress 8 EBacc - High prior attainment
  P8MEAEBAC_CILOW_HI: mustBeNumber(), // P8 EBacc lower confidence - High prior attainment
  P8MEAEBAC_CIUPP_HI: mustBeNumber(), // P8 EBacc upper confidence - High prior attainment

  // Prior Attainment Open Performance
  ATT8SCROPEN_LO: mustBeNumber(), // Attainment 8 Open score - Low prior attainment
  P8MEAOPEN_LO: mustBeNumber(), // Progress 8 Open - Low prior attainment
  P8MEAOPEN_CILOW_LO: mustBeNumber(), // P8 Open lower confidence - Low prior attainment
  P8MEAOPEN_CIUPP_LO: mustBeNumber(), // P8 Open upper confidence - Low prior attainment
  ATT8SCROPEN_MID: mustBeNumber(), // Attainment 8 Open score - Middle prior attainment
  P8MEAOPEN_MID: mustBeNumber(), // Progress 8 Open - Middle prior attainment
  P8MEAOPEN_CILOW_MID: mustBeNumber(), // P8 Open lower confidence - Middle prior attainment
  P8MEAOPEN_CIUPP_MID: mustBeNumber(), // P8 Open upper confidence - Middle prior attainment
  ATT8SCROPEN_HI: mustBeNumber(), // Attainment 8 Open score - High prior attainment
  P8MEAOPEN_HI: mustBeNumber(), // Progress 8 Open - High prior attainment
  P8MEAOPEN_CILOW_HI: mustBeNumber(), // P8 Open lower confidence - High prior attainment
  P8MEAOPEN_CIUPP_HI: mustBeNumber(), // P8 Open upper confidence - High prior attainment

  // Prior Attainment Open GCSE Performance
  ATT8SCROPENG_LO: mustBeNumber(), // Attainment 8 Open GCSE score - Low prior attainment
  ATT8SCROPENG_MID: mustBeNumber(), // Attainment 8 Open GCSE score - Middle prior attainment
  ATT8SCROPENG_HI: mustBeNumber(), // Attainment 8 Open GCSE score - High prior attainment

  // Prior Attainment Open Non-GCSE Performance
  ATT8SCROPENNG_LO: mustBeNumber(), // Attainment 8 Open non-GCSE score - Low prior attainment
  ATT8SCROPENNG_MID: mustBeNumber(), // Attainment 8 Open non-GCSE score - Middle prior attainment
  ATT8SCROPENNG_HI: mustBeNumber(), // Attainment 8 Open non-GCSE score - High prior attainment

  // EAL Performance
  ATT8SCR_EAL: mustBeNumber(), // Attainment 8 score - EAL pupils
  P8PUP_EAL: mustBeNumber(), // Progress 8 pupils - EAL
  TP8ADJ_EAL: mustBeNumber(), // Progress 8 adjustments - EAL
  P8MEA_EAL: mustBeNumber(), // Progress 8 score - EAL
  P8CILOW_EAL: mustBeNumber(), // Progress 8 lower confidence - EAL
  P8CIUPP_EAL: mustBeNumber(), // Progress 8 upper confidence - EAL
  P8MEA_EAL_ORIG: mustBeNumber(), // Original Progress 8 score - EAL
  P8CILOW_EAL_ORIG: mustBeNumber(), // Original P8 lower confidence - EAL
  P8CIUPP_EAL_ORIG: mustBeNumber(), // Original P8 upper confidence - EAL

  // Gender Performance
  ATT8SCR_BOYS: mustBeNumber(), // Attainment 8 score for boys
  ATT8SCR_GIRLS: mustBeNumber(), // Attainment 8 score for girls
  P8PUP_BOYS: mustBeNumber(), // Progress 8 pupils - Boys
  P8PUP_GIRLS: mustBeNumber(), // Progress 8 pupils - Girls
  TP8ADJ_BOYS: mustBeNumber(), // Progress 8 adjustments - Boys
  TP8ADJ_GIRLS: mustBeNumber(), // Progress 8 adjustments - Girls
  P8MEA_BOYS: mustBeNumber(), // Progress 8 score - Boys
  P8MEA_GIRLS: mustBeNumber(), // Progress 8 score - Girls

  // Gender Performance - Confidence Intervals
  P8CILOW_BOYS: mustBeNumber(), // Progress 8 lower confidence - Boys
  P8CIUPP_BOYS: mustBeNumber(), // Progress 8 upper confidence - Boys
  P8CILOW_GIRLS: mustBeNumber(), // Progress 8 lower confidence - Girls
  P8CIUPP_GIRLS: mustBeNumber(), // Progress 8 upper confidence - Girls
  P8MEA_BOYS_ORIG: mustBeNumber(), // Original Progress 8 score - Boys
  P8MEA_GIRLS_ORIG: mustBeNumber(), // Original Progress 8 score - Girls
  P8CILOW_BOYS_ORIG: mustBeNumber(), // Original P8 lower confidence - Boys
  P8CIUPP_BOYS_ORIG: mustBeNumber(), // Original P8 upper confidence - Boys
  P8CILOW_GIRLS_ORIG: mustBeNumber(), // Original P8 lower confidence - Girls
  P8CIUPP_GIRLS_ORIG: mustBeNumber(), // Original P8 upper confidence - Girls

  // Gender English Performance
  ATT8SCRENG_BOYS: mustBeNumber(), // Attainment 8 English score for boys
  ATT8SCRENG_GIRLS: mustBeNumber(), // Attainment 8 English score for girls
  P8MEAENG_BOYS: mustBeNumber(), // Progress 8 English - Boys
  P8MEAENG_GIRLS: mustBeNumber(), // Progress 8 English - Girls
  P8MEAENG_CILOW_BOYS: mustBeNumber(), // P8 English lower confidence - Boys
  P8MEAENG_CIUPP_BOYS: mustBeNumber(), // P8 English upper confidence - Boys
  P8MEAENG_CILOW_GIRLS: mustBeNumber(), // P8 English lower confidence - Girls
  P8MEAENG_CIUPP_GIRLS: mustBeNumber(), // P8 English upper confidence - Girls

  // Gender Maths Performance
  ATT8SCRMAT_BOYS: mustBeNumber(), // Attainment 8 Maths score for boys
  ATT8SCRMAT_GIRLS: mustBeNumber(), // Attainment 8 Maths score for girls
  P8MEAMAT_BOYS: mustBeNumber(), // Progress 8 Maths - Boys
  P8MEAMAT_GIRLS: mustBeNumber(), // Progress 8 Maths - Girls
  P8MEAMAT_CILOW_BOYS: mustBeNumber(), // P8 Maths lower confidence - Boys
  P8MEAMAT_CIUPP_BOYS: mustBeNumber(), // P8 Maths upper confidence - Boys
  P8MEAMAT_CILOW_GIRLS: mustBeNumber(), // P8 Maths lower confidence - Girls
  P8MEAMAT_CIUPP_GIRLS: mustBeNumber(), // P8 Maths upper confidence - Girls

  // Gender EBacc Performance
  ATT8SCREBAC_BOYS: mustBeNumber(), // Attainment 8 EBacc score for boys
  ATT8SCREBAC_GIRLS: mustBeNumber(), // Attainment 8 EBacc score for girls
  P8MEAEBAC_BOYS: mustBeNumber(), // Progress 8 EBacc - Boys
  P8MEAEBAC_GIRLS: mustBeNumber(), // Progress 8 EBacc - Girls
  P8MEAEBAC_CILOW_BOYS: mustBeNumber(), // P8 EBacc lower confidence - Boys
  P8MEAEBAC_CIUPP_BOYS: mustBeNumber(), // P8 EBacc upper confidence - Boys
  P8MEAEBAC_CILOW_GIRLS: mustBeNumber(), // P8 EBacc lower confidence - Girls
  P8MEAEBAC_CIUPP_GIRLS: mustBeNumber(), // P8 EBacc upper confidence - Girls

  // Gender Open Performance
  ATT8SCROPEN_BOYS: mustBeNumber(), // Attainment 8 Open score for boys
  ATT8SCROPEN_GIRLS: mustBeNumber(), // Attainment 8 Open score for girls
  P8MEAOPEN_BOYS: mustBeNumber(), // Progress 8 Open - Boys
  P8MEAOPEN_GIRLS: mustBeNumber(), // Progress 8 Open - Girls
  P8MEAOPEN_CILOW_BOYS: mustBeNumber(), // P8 Open lower confidence - Boys
  P8MEAOPEN_CIUPP_BOYS: mustBeNumber(), // P8 Open upper confidence - Boys
  P8MEAOPEN_CILOW_GIRLS: mustBeNumber(), // P8 Open lower confidence - Girls
  P8MEAOPEN_CIUPP_GIRLS: mustBeNumber(), // P8 Open upper confidence - Girls

  // Gender Open GCSE Performance
  ATT8SCROPENG_BOYS: mustBeNumber(), // Attainment 8 Open GCSE score for boys
  ATT8SCROPENG_GIRLS: mustBeNumber(), // Attainment 8 Open GCSE score for girls

  // Gender Open Non-GCSE Performance
  ATT8SCROPENNG_BOYS: mustBeNumber(), // Attainment 8 Open non-GCSE score for boys
  ATT8SCROPENNG_GIRLS: mustBeNumber(), // Attainment 8 Open non-GCSE score for girls

  // Non-Mobile Pupils Performance
  ATT8SCR_NMOB: mustBeNumber(), // Attainment 8 score - Non-mobile pupils
  P8PUP_NMOB: mustBeNumber(), // Progress 8 pupils - Non-mobile
  TP8ADJ_NMOB: mustBeNumber(), // Progress 8 adjustments - Non-mobile
  P8MEA_NMOB: mustBeNumber(), // Progress 8 score - Non-mobile
  P8CILOW_NMOB: mustBeNumber(), // Progress 8 lower confidence - Non-mobile
  P8CIUPP_NMOB: mustBeNumber(), // Progress 8 upper confidence - Non-mobile
  P8MEA_NMOB_ORIG: mustBeNumber(), // Original Progress 8 score - Non-mobile
  P8CILOW_NMOB_ORIG: mustBeNumber(), // Original P8 lower confidence - Non-mobile
  P8CIUPP_NMOB_ORIG: mustBeNumber(), // Original P8 upper confidence - Non-mobile

  // Non-Mobile Pupils Subject Performance
  ATT8SCRENG_NMOB: mustBeNumber(), // Attainment 8 English score - Non-mobile
  P8MEAENG_NMOB: mustBeNumber(), // Progress 8 English - Non-mobile
  P8MEAENG_CILOW_NMOB: mustBeNumber(), // P8 English lower confidence - Non-mobile
  P8MEAENG_CIUPP_NMOB: mustBeNumber(), // P8 English upper confidence - Non-mobile
  ATT8SCRMAT_NMOB: mustBeNumber(), // Attainment 8 Maths score - Non-mobile
  P8MEAMAT_NMOB: mustBeNumber(), // Progress 8 Maths - Non-mobile
  P8MEAMAT_CILOW_NMOB: mustBeNumber(), // P8 Maths lower confidence - Non-mobile
  P8MEAMAT_CIUPP_NMOB: mustBeNumber(), // P8 Maths upper confidence - Non-mobile

  // Non-Mobile Pupils EBacc Performance
  ATT8SCREBAC_NMOB: mustBeNumber(), // Attainment 8 EBacc score - Non-mobile
  P8MEAEBAC_NMOB: mustBeNumber(), // Progress 8 EBacc - Non-mobile
  P8MEAEBAC_CILOW_NMOB: mustBeNumber(), // P8 EBacc lower confidence - Non-mobile
  P8MEAEBAC_CIUPP_NMOB: mustBeNumber(), // P8 EBacc upper confidence - Non-mobile

  // Non-Mobile Pupils Open Performance
  ATT8SCROPEN_NMOB: mustBeNumber(), // Attainment 8 Open score - Non-mobile
  P8MEAOPEN_NMOB: mustBeNumber(), // Progress 8 Open - Non-mobile
  P8MEAOPEN_CILOW_NMOB: mustBeNumber(), // P8 Open lower confidence - Non-mobile
  P8MEAOPEN_CIUPP_NMOB: mustBeNumber(), // P8 Open upper confidence - Non-mobile

  // Non-Mobile Pupils Open GCSE Performance
  ATT8SCROPENG_NMOB: mustBeNumber(), // Attainment 8 Open GCSE score - Non-mobile
  ATT8SCROPENNG_NMOB: mustBeNumber(), // Attainment 8 Open non-GCSE score - Non-mobile
});

export type KS4ResultsRow = z.infer<typeof KS4ResultsSchema>;

// Helper function to check if row should be processed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shouldProcessRow = (
  row: Partial<KS4ResultsRow>,
  _index: number,
  _allRows: Partial<KS4ResultsRow>[]
): boolean => {
  // Skip last 3 rows which contain totals
  return ['1', '2'].includes(row.RECTYPE?.toString() ?? '');
};
