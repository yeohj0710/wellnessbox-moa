export const FIRST_QUESTION_ID = "name";

export interface AnswerOption {
  text: string;
  value: string;
  next?: string;
}

export interface Question {
  id: string;
  question: string;
  options: AnswerOption[];
}

export const questions: Record<string, Question> = {
  // --- 기본 정보 ---
  name: {
    id: "name",
    question: "이름을 알려주세요.",
    options: [{ text: "입력 완료", value: "entered", next: "gender" }],
  },
  gender: {
    id: "gender",
    question: "성별을 알려주세요.",
    options: [
      { text: "남성", value: "male", next: "age" },
      { text: "여성", value: "female", next: "pregnancy" },
    ],
  },
  pregnancy: {
    id: "pregnancy",
    question: "임신 중이거나 임신 계획이 있나요?",
    options: [
      { text: "예", value: "yes", next: "birthcontrol" },
      { text: "아니오/해당없음", value: "no", next: "birthcontrol" },
    ],
  },
  birthcontrol: {
    id: "birthcontrol",
    question: "피임약을 주기적으로 복용 중인가요?",
    options: [
      { text: "예", value: "yes", next: "age" },
      { text: "아니오", value: "no", next: "age" },
    ],
  },
  age: {
    id: "age",
    question: "나이를 입력하세요.",
    options: [{ text: "입력 완료", value: "entered", next: "heightweight" }],
  },
  heightweight: {
    id: "heightweight",
    question: "키(cm)와 몸무게(kg)를 입력하세요.",
    options: [{ text: "입력 완료", value: "entered", next: "smoke" }],
  },

  // --- 생활습관 & 건강 상태 ---
  smoke: {
    id: "smoke",
    question: "흡연을 하시나요?",
    options: [
      { text: "예", value: "yes", next: "drink" },
      { text: "아니오", value: "no", next: "drink" },
    ],
  },
  drink: {
    id: "drink",
    question: "음주를 하시나요?",
    options: [
      { text: "예", value: "yes", next: "sunlight" },
      { text: "아니오", value: "no", next: "sunlight" },
    ],
  },
  sunlight: {
    id: "sunlight",
    question: "평균 하루 30분 미만으로 햇볕을 쬐시나요?",
    options: [
      { text: "예", value: "yes", next: "wakeHard" },
      { text: "아니오", value: "no", next: "wakeHard" },
    ],
  },
  wakeHard: {
    id: "wakeHard",
    question: "매일 아침 일어나기 힘드신가요?",
    options: [
      { text: "예", value: "yes", next: "sleepTime" },
      { text: "아니오", value: "no", next: "sleepTime" },
    ],
  },
  sleepTime: {
    id: "sleepTime",
    question: "하루 평균 수면 시간이 6시간 미만인가요?",
    options: [
      { text: "예", value: "yes", next: "fatigueRecovery" },
      { text: "아니오", value: "no", next: "fatigueRecovery" },
    ],
  },
  fatigueRecovery: {
    id: "fatigueRecovery",
    question: "피로 회복이 더디고 온몸이 힘든 느낌이 자주 드시나요?",
    options: [
      { text: "예", value: "yes", next: "postMealDrowsy" },
      { text: "아니오", value: "no", next: "postMealDrowsy" },
    ],
  },
  postMealDrowsy: {
    id: "postMealDrowsy",
    question: "식사 후 참기 힘든 졸음이 몰려오나요?",
    options: [
      { text: "예", value: "yes", next: "stiff" },
      { text: "아니오", value: "no", next: "stiff" },
    ],
  },
  stiff: {
    id: "stiff",
    question: "어깨나 목이 뻐근하신가요?",
    options: [
      { text: "예", value: "yes", next: "coldTingling" },
      { text: "아니오", value: "no", next: "coldTingling" },
    ],
  },
  coldTingling: {
    id: "coldTingling",
    question: "손발이 차거나 저리신가요?",
    options: [
      { text: "예", value: "yes", next: "memoryCommon" },
      { text: "아니오", value: "no", next: "memoryCommon" },
    ],
  },
  memoryCommon: {
    id: "memoryCommon",
    question: "기억력·집중력이 떨어진 것 같나요?",
    options: [
      { text: "예", value: "yes", next: "dietHighCarb" },
      { text: "아니오", value: "no", next: "dietHighCarb" },
    ],
  },

  // --- 식습관 ---
  dietHighCarb: {
    id: "dietHighCarb",
    question: "고탄수화물(밥, 떡, 빵, 면 등)을 즐겨 드시나요?",
    options: [
      { text: "예", value: "yes", next: "dairy" },
      { text: "아니오", value: "no", next: "dairy" },
    ],
  },
  dairy: {
    id: "dairy",
    question: "유제품(우유, 치즈, 요거트 등)을 하루 1~2회 이상 드시나요?",
    options: [
      { text: "예", value: "yes", next: "fish" },
      { text: "아니오", value: "no", next: "fish" },
    ],
  },
  fish: {
    id: "fish",
    question: "주 2회 이상 등푸른 생선(고등어, 연어, 참치 등)을 드시나요?",
    options: [
      { text: "예", value: "yes", next: "oilyFoods" },
      { text: "아니오", value: "no", next: "oilyFoods" },
    ],
  },
  oilyFoods: {
    id: "oilyFoods",
    question: "기름진 음식(튀김, 가공육, 버터 등)을 주 3회 이상 드시나요?",
    options: [
      { text: "예", value: "yes", next: "sweetFoods" },
      { text: "아니오", value: "no", next: "sweetFoods" },
    ],
  },
  sweetFoods: {
    id: "sweetFoods",
    question: "단 음료·디저트를 주 4회 이상 드시나요?",
    options: [
      { text: "예", value: "yes", next: "medical" },
      { text: "아니오", value: "no", next: "medical" },
    ],
  },

  // --- 질환 & 리스크 ---
  medical: {
    id: "medical",
    question: "앓고 있는 질환이나 정기 복용 중인 약이 있나요?",
    options: [
      { text: "예", value: "yes", next: "medicalList" },
      { text: "아니오", value: "no", next: "bloodSugar" },
    ],
  },
  medicalList: {
    id: "medicalList",
    question:
      "앓고 있는 질환이 있다면 골라주세요. (없으면 '없음' 체크 후 다음)",
    options: [
      { text: "고혈압", value: "hypertension", next: "bloodSugar" },
      { text: "당뇨", value: "diabetes", next: "bloodSugar" },
      { text: "고지혈증", value: "hyperlipidemia", next: "bloodSugar" },
      { text: "폐질환", value: "lungDisease", next: "bloodSugar" },
      { text: "뇌졸중(중풍)", value: "stroke", next: "bloodSugar" },
      { text: "심장질환", value: "heartDisease", next: "bloodSugar" },
      { text: "신장질환", value: "kidneyDisease", next: "bloodSugar" },
      { text: "간질환", value: "liverDisease", next: "bloodSugar" },
      { text: "저혈압", value: "lowBloodPressure", next: "bloodSugar" },
      { text: "빈혈", value: "anemia", next: "bloodSugar" },
      { text: "치주질환", value: "periodontalDisease", next: "bloodSugar" },
      { text: "갑상선질환", value: "thyroidDisease", next: "bloodSugar" },
      { text: "통풍", value: "gout", next: "bloodSugar" },
      { text: "자가면역질환(아토피)", value: "autoimmune", next: "bloodSugar" },
      { text: "없음", value: "none", next: "bloodSugar" },
    ],
  },
  bloodSugar: {
    id: "bloodSugar",
    question: "혈당 검사 시 수치가 높은 편인가요?",
    options: [
      { text: "예", value: "yes", next: "supplementExperience" },
      { text: "아니오", value: "no", next: "supplementExperience" },
    ],
  },
  supplementExperience: {
    id: "supplementExperience",
    question: "영양제 복용 후 불편 경험이 있나요?",
    options: [
      { text: "예", value: "yes", next: "goal" },
      { text: "아니오", value: "no", next: "goal" },
    ],
  },

  // --- 관심 건강 목표 ---
  goal: {
    id: "goal",
    question: "가장 관심 있는 건강 목표는?",
    options: [
      { text: "면역력 강화", value: "immune" },
      { text: "피로 회복", value: "fatigue" },
      { text: "눈 건강", value: "eye", next: "eyeScreenTime" },
      { text: "간 건강", value: "liver" },
      { text: "소화 건강", value: "digestion", next: "antibiotic" },
      { text: "체중 관리", value: "weight" },
      { text: "심혈관 건강", value: "heart", next: "heart-condition" },
      { text: "뼈/관절 건강", value: "joint", next: "menopause" },
      { text: "피부/모발", value: "skinHair", next: "skinHair" },
      {
        text: "수면/스트레스",
        value: "sleepStress",
        next: "sleepStressFollow",
      },
      { text: "여성 건강", value: "womenHealth", next: "womenHealth" },
      { text: "기억력 향상", value: "memory" },
    ],
  },

  // --- 특수질문: 눈 건강 ---
  eyeScreenTime: {
    id: "eyeScreenTime",
    question: "하루에 스마트폰/컴퓨터 화면을 보는 시간이 총 몇 시간인가요?",
    options: [
      { text: "2시간 미만", value: "<2h", next: "eyeAgeCheck" },
      { text: "2~5시간", value: "2-5h", next: "eyeAgeCheck" },
      { text: "5시간 이상", value: ">5h", next: "eyeAgeCheck" },
    ],
  },
  eyeAgeCheck: {
    id: "eyeAgeCheck",
    question: "50대 이상이신가요?",
    options: [
      { text: "예", value: "over50", next: "eyeAMDCheck" },
      { text: "아니오", value: "under50", next: "eyeDryness" },
    ],
  },
  eyeAMDCheck: {
    id: "eyeAMDCheck",
    question: "안과에서 황반변성 진단을 받은 적이 있나요?",
    options: [
      { text: "예", value: "yes", next: "eyeAMDStage" },
      { text: "아니오", value: "no", next: "eyeDryness" },
    ],
  },
  eyeAMDStage: {
    id: "eyeAMDStage",
    question: "황반변성 단계는 어느 정도인가요?",
    options: [
      { text: "초기", value: "early", next: "eyeDryness" },
      { text: "중기/후기", value: "late", next: "eyeDryness" },
    ],
  },
  eyeDryness: {
    id: "eyeDryness",
    question: "눈이 자주 뻑뻑하거나 건조하다고 느끼시나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },

  // --- 특수질문: 소화 건강 ---
  antibiotic: {
    id: "antibiotic",
    question: "최근 3개월 내에 항생제 복용 경험이 있나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },

  // --- 특수질문: 심혈관 건강 ---
  "heart-condition": {
    id: "heart-condition",
    question: "혈압 또는 콜레스테롤에 대해 주의를 받은 적이 있나요?",
    options: [
      { text: "혈압 높음", value: "bp", next: "bp-med" },
      { text: "콜레스테롤 높음", value: "chol", next: "chol-med" },
      { text: "둘 다 해당", value: "both", next: "bp-med" },
      { text: "아니오, 예방 관심", value: "none" },
    ],
  },
  "bp-med": {
    id: "bp-med",
    question: "혈압약을 복용 중인가요?",
    options: [
      { text: "예", value: "yes", next: "chol-follow" },
      { text: "아니오", value: "no", next: "chol-follow" },
    ],
  },
  "chol-med": {
    id: "chol-med",
    question: "스타틴 계열 약을 복용 중인가요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },
  "chol-follow": {
    id: "chol-follow",
    question: "콜레스테롤 관련 약물 복용 여부 추가 확인",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },

  // --- 특수질문: 뼈/관절 건강 ---
  menopause: {
    id: "menopause",
    question: "폐경기를 겪으셨나요?",
    options: [
      { text: "예", value: "yes", next: "anticoagulant" },
      { text: "아니오", value: "no", next: "anticoagulant" },
    ],
  },
  anticoagulant: {
    id: "anticoagulant",
    question: "혈액 항응고제(와파린 등)를 복용 중인가요?",
    options: [
      { text: "예", value: "yes", next: "joint-type" },
      { text: "아니오", value: "no", next: "joint-type" },
    ],
  },
  "joint-type": {
    id: "joint-type",
    question: "관절/근육 불편 유형은?",
    options: [
      { text: "관절 뻣뻣", value: "A", next: "joint-a" },
      { text: "운동 후 근육 피로", value: "B", next: "joint-b" },
      { text: "자주 쥐 또는 담 결림", value: "C", next: "joint-c" },
    ],
  },
  "joint-a": {
    id: "joint-a",
    question: "아침에 관절이 뻣뻣한가요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },
  "joint-b": {
    id: "joint-b",
    question: "주 3회 이상 근력 운동을 하나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },
  "joint-c": {
    id: "joint-c",
    question: "하루 2잔 이상 카페인을 섭취하나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },

  // --- 특수질문: 피부/모발 ---
  skinHair: {
    id: "skinHair",
    question: "피부/모발 고민은?",
    options: [
      { text: "여드름/뾰루지", value: "acne" },
      { text: "건조/탄력 저하", value: "drySkin" },
      { text: "탈모/모발 약화", value: "hairLoss" },
    ],
  },

  // --- 특수질문: 수면/스트레스 ---
  sleepStress: {
    id: "sleepStress",
    question: "수면·스트레스 문제는?",
    options: [
      {
        text: "잠들기 어려움",
        value: "sleepDifficulty",
        next: "sleepStressFollow",
      },
      { text: "밤에 자주 깸", value: "legCramps", next: "legCrampsFollow" },
    ],
  },
  sleepStressFollow: {
    id: "sleepStressFollow",
    question: "걱정이나 생각이 낮에도 계속되나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },
  legCrampsFollow: {
    id: "legCrampsFollow",
    question: "밤에 다리에 쥐가 나서 깨는 경우가 있나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },

  // --- 특수질문: 여성 건강 ---
  womenHealth: {
    id: "womenHealth",
    question: "여성 건강 관심 분야는?",
    options: [
      { text: "갱년기", value: "menopauseWomen" },
      { text: "월경 전 증후군(PMS)", value: "pms" },
      { text: "방광/질 건강", value: "bladder" },
    ],
  },
  menopauseWomen: {
    id: "menopauseWomen",
    question: "가장 불편한 갱년기 증상은?",
    options: [
      { text: "안면홍조/열감", value: "flush" },
      { text: "수면·감정 문제", value: "sleepMood" },
      { text: "뼈 건강 염려", value: "boneConcern", next: "menopause" },
    ],
  },
  pms: {
    id: "pms",
    question: "PMS 중 가장 불편한 증상은?",
    options: [
      { text: "감정 기복/우울", value: "mood" },
      { text: "유방 압통/피부 트러블", value: "breast" },
      { text: "복부 경련/팽만", value: "cramp" },
    ],
  },
  bladder: {
    id: "bladder",
    question: "최근 1년 내 방광염·질염 경험이 있나요?",
    options: [
      { text: "예", value: "yes" },
      { text: "아니오", value: "no" },
    ],
  },
};
