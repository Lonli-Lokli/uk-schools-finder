export interface KS4DestinationsDm {
  urn: string;
  year: string;
  sustained: number | null;
  education: number | null;
  employment: number | null;
  apprenticeships: number | null;
  furtherEducation: number | null;
  sixthForm: number | null;
  sixthFormCollege: number | null;
  disadvantagedSustained: number | null;
  nonDisadvantagedSustained: number | null;
  cohortSize: number | null;
  lastUpdated: string;
}

// Common types
interface NumberPercentagePair {
  number: number | null;
  percentage: number | null;
}

interface DisadvantageMetricsDm {
  cohort: number | null;
  sustained: NumberPercentagePair;
  education: NumberPercentagePair;
  employment: NumberPercentagePair;
  apprenticeships: NumberPercentagePair;
  furtherEducation: NumberPercentagePair;
  schoolSixthForm: NumberPercentagePair;
  sixthFormCollege: NumberPercentagePair;
  otherEducation: NumberPercentagePair;
  notSustained: NumberPercentagePair;
  unknown: NumberPercentagePair;
}

// Main collection
export interface KS4DestinationsDm {
  urn: string;
  year: string;
  sustained: number | null;
  education: number | null;
  employment: number | null;
  apprenticeships: number | null;
  furtherEducation: number | null;
  sixthForm: number | null;
  sixthFormCollege: number | null;
  disadvantagedSustained: number | null;
  nonDisadvantagedSustained: number | null;
  cohortSize: number | null;
  lastUpdated: string;
}

// Details collection
export interface KS4DestinationsDetailsDm {
  urn: string;
  year: string;
  numbers: {
    cohort: number | null;
    sustained: number | null;
    education: number | null;
    employment: number | null;
    apprenticeships: number | null;
    furtherEducation: number | null;
    schoolSixthForm: number | null;
    sixthFormCollege: number | null;
    otherEducation: number | null;
    notSustained: number | null;
    unknown: number | null;
  };
  disadvantaged: DisadvantageMetricsDm;
  nonDisadvantaged: DisadvantageMetricsDm;
  lastUpdated: string;
}

export interface KS4ResultsMainDm {
  urn: string;
  year: string;
  // Core metrics
  attainment8Score: number | null;
  progress8Score: number | null;
  progress8Lower: number | null;
  progress8Upper: number | null;
  // English and Maths
  basics94: number | null;
  basics95: number | null;
  ebaccAps: number | null;
  // Student numbers
  totalPupils: number | null;
  disadvantagedPupils: number | null;
  // Disadvantaged gaps
  attainment8ScoreDisadvantaged: number | null;
  progress8ScoreDisadvantaged: number | null;
  // Gender gaps
  attainment8ScoreBoys: number | null;
  attainment8ScoreGirls: number | null;
  progress8ScoreBoys: number | null;
  progress8ScoreGirls: number | null;
  // Prior attainment
  lowPriorAttainers: number | null;
  middlePriorAttainers: number | null;
  highPriorAttainers: number | null;
  // EBacc entries
  ebaccEntry: number | null;
  ebaccAchievementRate94: number | null;
  ebaccAchievementRate95: number | null;
  lastUpdated: string;
}

export interface KS4ResultsDemographicsDm {
  urn: string;
  year: string;
  pupils: {
    total: number | null;
    examCohort: number | null;
    boys: number | null;
    girls: number | null;
  };
  characteristics: {
    eal: number | null;
    sen: number | null;
    disadvantaged: number | null;
  };
  lastUpdated: string;
}

export interface KS4ResultsDetailsDm {
  urn: string;
  year: string;
  attainment8: {
    english: number | null;
    maths: number | null;
    ebacc: number | null;
    open: number | null;
    lowPrior: {
      overall: number | null;
      english: number | null;
      maths: number | null;
      ebacc: number | null;
      open: number | null;
    };
    middlePrior: {
      overall: number | null;
      english: number | null;
      maths: number | null;
      ebacc: number | null;
      open: number | null;
    };
    highPrior: {
      overall: number | null;
      english: number | null;
      maths: number | null;
      ebacc: number | null;
      open: number | null;
    };
  };
  progress8: {
    english: {
      score: number | null;
      lower: number | null;
      upper: number | null;
    };
    maths: {
      score: number | null;
      lower: number | null;
      upper: number | null;
    };
    ebacc: {
      score: number | null;
      lower: number | null;
      upper: number | null;
    };
    open: {
      score: number | null;
      lower: number | null;
      upper: number | null;
    };
  };
  ebacc: {
    subjects: {
      english: {
        entry: number | null;
        achieved94: number | null;
        achieved95: number | null;
      };
      maths: {
        entry: number | null;
        achieved94: number | null;
        achieved95: number | null;
      };
      science: {
        entry: number | null;
        achieved94: number | null;
        achieved95: number | null;
      };
      humanities: {
        entry: number | null;
        achieved94: number | null;
        achieved95: number | null;
      };
      languages: {
        entry: number | null;
        achieved94: number | null;
        achieved95: number | null;
      };
    };
  };
  groups: {
    disadvantaged: {
      attainment8: number | null;
      progress8: {
        score: number | null;
        lower: number | null;
        upper: number | null;
      };
    };
    notDisadvantaged: {
      attainment8: number | null;
      progress8: {
        score: number | null;
        lower: number | null;
        upper: number | null;
      };
    };
    eal: {
      attainment8: number | null;
      progress8: {
        score: number | null;
        lower: number | null;
        upper: number | null;
      };
    };
    gender: {
      boys: {
        attainment8: number | null;
        progress8: {
          score: number | null;
          lower: number | null;
          upper: number | null;
        };
      };
      girls: {
        attainment8: number | null;
        progress8: {
          score: number | null;
          lower: number | null;
          upper: number | null;
        };
      };
    };
  };
  progress8Original: {
    score: number | null;
    lower: number | null;
    upper: number | null;
  };
  attainment8Open: {
    gcse: number | null;
    nonGcse: number | null;
  };
  lastUpdated: string;
}

export interface DestinationStatsDm {
  cohortSize: number | null;
  destinations: {
    overall: number | null;
    education: {
      total: number | null;
      furtherEducation: number | null;
      higherEducation: number | null;
      other: number | null;
    };
    employment: {
      total: number | null;
      apprenticeships: number | null;
    };
    other: {
      notSustained: number | null;
      notCaptured: number | null;
    };
  };
  percentages: {
    overall: number | null;
    education: {
      total: number | null;
      furtherEducation: number | null;
      higherEducation: number | null;
      other: number | null;
    };
    employment: {
      total: number | null;
      apprenticeships: number | null;
    };
    other: {
      notSustained: number | null;
      notCaptured: number | null;
    };
  };
}

export interface KS5DestinationsDm {
  urn: string;
  year: string;
  total: {
    all: DestinationStatsDm;
    disadvantaged: DestinationStatsDm;
    nonDisadvantaged: DestinationStatsDm;
  };
  level3: {
    all: DestinationStatsDm;
    disadvantaged: DestinationStatsDm;
    nonDisadvantaged: DestinationStatsDm;
  };
  level2: {
    all: DestinationStatsDm;
    disadvantaged: DestinationStatsDm;
    nonDisadvantaged: DestinationStatsDm;
  };
  otherLevels: {
    all: DestinationStatsDm;
    disadvantaged: DestinationStatsDm;
    nonDisadvantaged: DestinationStatsDm;
  };
  lastUpdated: string;
}

export interface KS5DestinationsStatsDm {
  id: string;
  destinations: Array<{
    year: string;
    higherEducation: number | null;
    furtherEducation: number | null;
    employment: number | null;
  }>;
}

export interface KS5HEDestinationsDm {
  schoolUrn: string;
  year: string;
  universities: {
    oxbridge: {
      percentage: number | null;
    };
    russell: {
      percentage: number | null;
    };
    topThird: {
      percentage: number | null;
    };
    higherTechnical: {
      percentage: number | null;
    };
  };
  disadvantaged: {
    oxbridge: {
      percentage: number | null;
    };
    russell: {
      percentage: number | null;
    };
    topThird: {
      percentage: number | null;
    };
    higherTechnical: {
      percentage: number | null;
    };
  };
  lastUpdated: string;
}

export interface RegionDm {
  name: string;
  subRegions: {
    [leaCode: string]: {
      name: string;
    };
  };
}
