let quizList = [];

let favorites =
JSON.parse(
localStorage.getItem("favorites")
) || [];

function toggleFavorite(id){

    if(favorites.includes(id)){
        favorites = favorites.filter(f => f !== id);
    }else{
        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    searchConcept();
    searchFormula();
}


function checkAchievements(){

    if(correct >= 1){
        unlockAchievement(
        "첫 정답"
        );
    }

    if(correct >= 10){
        unlockAchievement(
        "정답 10개 달성"
        );
    }
    if(correct >= 50){
        unlockAchievement(
        "정답 50개 달성"
        );
    }

    if(correct >= 100){
        unlockAchievement(
        "정답 100개 달성"
        );
    }

    if(level >= 5){
        unlockAchievement(
        "레벨 5 달성"
        );
    }

    if(level >= 10){
        unlockAchievement(
        "레벨 10 달성"
        );
    }

}

function renderAchievements(){

    const list =
    document.getElementById(
    "achievementList"
    );

    if(!list) return;

    list.innerHTML = "";

    achievements.forEach(a => {

        const li =
        document.createElement("li");

        li.innerText = a;

        list.appendChild(li);

    });

}

let quizMode = "all";
let currentQuiz = 0;
let xp =
Number(localStorage.getItem("xp")) || 0;

let level =
Number(localStorage.getItem("level")) || 1;

let solved =
Number(localStorage.getItem("solved")) || 0;

let correct =
Number(localStorage.getItem("correct")) || 0;

let wrongs =
JSON.parse(
localStorage.getItem("wrongs")
) || [];

let achievements =
JSON.parse(
localStorage.getItem("achievements")
) || [];

let todaySolved =
Number(
localStorage.getItem("todaySolved")
) || 0;

let todayCorrect =
Number(
localStorage.getItem("todayCorrect")
) || 0;

let cardFront = true;
let cardIndex = 0;
let shuffledCards = [];



const concepts = [

{
title:"운동",
subject:"물리",
category:"힘과 운동",
content:"시간에 따라 물체의 위치가 변하는 현상이다."
},

{
title:"정지",
subject:"물리",
category:"힘과 운동",
content:"기준점에 대해 물체의 위치가 변하지 않는 상태이다."
},

{
title:"기준점",
subject:"물리",
category:"힘과 운동",
content:"운동 여부를 판단하기 위해 기준으로 삼는 점."
},

{
title:"거리",
subject:"물리",
category:"힘과 운동",
content:"두 지점 사이의 길이를 의미한다."
},

{
title:"이동 거리",
subject:"물리",
category:"힘과 운동",
content:"물체가 실제로 이동한 경로의 전체 길이이다."
},

{
title:"변위",
subject:"물리",
category:"힘과 운동",
content:"출발점에서 도착점까지의 위치 변화이다."
},

{
title:"속력",
subject:"물리",
category:"힘과 운동",
content:"단위 시간 동안 이동한 거리이다."
},

{
title:"평균 속력",
subject:"물리",
category:"힘과 운동",
content:"총 이동 거리를 총 걸린 시간으로 나눈 값이다."
},

{
title:"등속 운동",
subject:"물리",
category:"힘과 운동",
content:"속력이 일정하게 유지되는 운동이다."
},

{
title:"가속 운동",
subject:"물리",
category:"힘과 운동",
content:"속력이 증가하는 운동이다."
},

{
title:"감속 운동",
subject:"물리",
category:"힘과 운동",
content:"속력이 감소하는 운동이다."
},

{
title:"관성",
subject:"물리",
category:"힘과 운동",
content:"물체가 현재 운동 상태를 유지하려는 성질이다."
},

{
title:"질량",
subject:"물리",
category:"힘과 운동",
content:"물체가 가진 물질의 양이다."
},

{
title:"힘",
subject:"물리",
category:"힘과 운동",
content:"물체의 운동 상태를 변화시키거나 변형시키는 원인이다."
},

{
title:"중력",
subject:"물리",
category:"힘과 운동",
content:"지구가 물체를 중심 방향으로 끌어당기는 힘이다."
},

{
title:"무게",
subject:"물리",
category:"힘과 운동",
content:"중력에 의해 물체가 받는 힘이다."
},

{
title:"탄성력",
subject:"물리",
category:"힘과 운동",
content:"변형된 물체가 원래 상태로 돌아가려는 힘이다."
},

{
title:"마찰력",
subject:"물리",
category:"힘과 운동",
content:"접촉한 물체 사이의 운동을 방해하는 힘이다."
},

{
title:"작용",
subject:"물리",
category:"힘과 운동",
content:"한 물체가 다른 물체에 가하는 힘이다."
},

{
title:"반작용",
subject:"물리",
category:"힘과 운동",
content:"작용에 대해 크기가 같고 방향이 반대인 힘이다."
},

{
title:"압력",
subject:"물리",
category:"압력과 부력",
content:"단위 면적에 작용하는 힘이다."
},

{
title:"기압",
subject:"물리",
category:"압력과 부력",
content:"공기의 무게 때문에 생기는 압력이다."
},

{
title:"대기압",
subject:"물리",
category:"압력과 부력",
content:"지구를 둘러싼 공기가 누르는 압력이다."
},

{
title:"수압",
subject:"물리",
category:"압력과 부력",
content:"물의 무게 때문에 생기는 압력이다."
},

{
title:"압력의 방향",
subject:"물리",
category:"압력과 부력",
content:"압력은 모든 방향으로 작용한다."
},

{
title:"압력 증가",
subject:"물리",
category:"압력과 부력",
content:"힘이 커지거나 면적이 작아지면 압력이 증가한다."
},

{
title:"압력 감소",
subject:"물리",
category:"압력과 부력",
content:"힘이 작아지거나 면적이 커지면 압력이 감소한다."
},

{
title:"부력",
subject:"물리",
category:"압력과 부력",
content:"액체나 기체가 물체를 위로 밀어 올리는 힘이다."
},

{
title:"아르키메데스 원리",
subject:"물리",
category:"압력과 부력",
content:"부력의 크기는 밀려난 유체의 무게와 같다."
},

{
title:"밀도",
subject:"물리",
category:"압력과 부력",
content:"단위 부피당 질량이다."
},

{
title:"파동",
subject:"물리",
category:"파동",
content:"에너지가 공간을 따라 전달되는 현상이다."
},

{
title:"매질",
subject:"물리",
category:"파동",
content:"파동이 전달되는 물질이다."
},

{
title:"횡파",
subject:"물리",
category:"파동",
content:"진동 방향과 진행 방향이 수직인 파동이다."
},

{
title:"종파",
subject:"물리",
category:"파동",
content:"진동 방향과 진행 방향이 같은 파동이다."
},

{
title:"진폭",
subject:"물리",
category:"파동",
content:"평형 위치에서 최대 변위이다."
},

{
title:"파장",
subject:"물리",
category:"파동",
content:"같은 위상의 두 점 사이 거리이다."
},

{
title:"주기",
subject:"물리",
category:"파동",
content:"한 번 진동하는 데 걸리는 시간이다."
},

{
title:"진동수",
subject:"물리",
category:"파동",
content:"1초 동안 반복되는 진동 횟수이다."
},

{
title:"소리",
subject:"물리",
category:"파동",
content:"물체의 진동으로 발생하는 종파이다."
},

{
title:"초음파",
subject:"물리",
category:"파동",
content:"사람이 들을 수 없는 높은 진동수의 소리이다."
},

{
title:"반사",
subject:"물리",
category:"파동",
content:"파동이 경계면에서 되돌아오는 현상이다."
},

{
title:"굴절",
subject:"물리",
category:"파동",
content:"파동이 다른 매질로 이동하며 진행 방향이 바뀌는 현상이다."
},

{
title:"회절",
subject:"물리",
category:"파동",
content:"장애물 뒤쪽으로 파동이 휘어지는 현상이다."
},

{
title:"간섭",
subject:"물리",
category:"파동",
content:"두 파동이 만나 새로운 파형을 만드는 현상이다."
},

{
title:"빛",
subject:"물리",
category:"빛",
content:"직진하는 전자기파의 일종이다."
},

{
title:"광원",
subject:"물리",
category:"빛",
content:"스스로 빛을 내는 물체이다."
},

{
title:"반사",
subject:"물리",
category:"빛",
content:"빛이 물체에 부딪혀 되돌아오는 현상이다."
},

{
title:"입사각",
subject:"물리",
category:"빛",
content:"입사광선과 법선이 이루는 각이다."
},

{
title:"반사각",
subject:"물리",
category:"빛",
content:"반사광선과 법선이 이루는 각이다."
},

{
title:"굴절",
subject:"물리",
category:"빛",
content:"빛이 다른 매질로 들어가며 꺾이는 현상이다."
},

{
title:"볼록 렌즈",
subject:"물리",
category:"빛",
content:"가운데가 두껍고 빛을 모으는 렌즈이다."
},

{
title:"오목 렌즈",
subject:"물리",
category:"빛",
content:"가운데가 얇고 빛을 퍼뜨리는 렌즈이다."
},

{
title:"실상",
subject:"물리",
category:"빛",
content:"빛이 실제로 모여 만들어지는 상이다."
},

{
title:"허상",
subject:"물리",
category:"빛",
content:"빛이 모이는 것처럼 보이는 상이다."
},

{
title:"빛의 삼원색",
subject:"물리",
category:"빛",
content:"빨강, 초록, 파랑이다."
},

{
title:"빛의 분산",
subject:"물리",
category:"빛",
content:"빛이 파장에 따라 나뉘는 현상이다."
},

{
title:"전기",
subject:"물리",
category:"전기와 자기",
content:"전하의 이동이나 상호작용에 의해 나타나는 현상이다."
},

{
title:"전하",
subject:"물리",
category:"전기와 자기",
content:"전기적 성질의 근원으로 양전하와 음전하가 있다."
},

{
title:"양전하",
subject:"물리",
category:"전기와 자기",
content:"플러스 전하를 띠는 전하이다."
},

{
title:"음전하",
subject:"물리",
category:"전기와 자기",
content:"마이너스 전하를 띠는 전하이다."
},

{
title:"정전기",
subject:"물리",
category:"전기와 자기",
content:"움직이지 않고 정지해 있는 전하에 의한 전기 현상이다."
},

{
title:"마찰전기",
subject:"물리",
category:"전기와 자기",
content:"물체를 마찰할 때 전자가 이동하여 발생하는 전기이다."
},

{
title:"전류",
subject:"물리",
category:"전기와 자기",
content:"전하가 일정한 방향으로 흐르는 현상이다."
},

{
title:"전류의 방향",
subject:"물리",
category:"전기와 자기",
content:"양전하가 이동하는 방향으로 정의한다."
},

{
title:"전압",
subject:"물리",
category:"전기와 자기",
content:"전하를 이동시키는 전기적 위치에너지 차이이다."
},

{
title:"저항",
subject:"물리",
category:"전기와 자기",
content:"전류의 흐름을 방해하는 정도이다."
},

{
title:"도체",
subject:"물리",
category:"전기와 자기",
content:"전류가 잘 흐르는 물질이다."
},

{
title:"부도체",
subject:"물리",
category:"전기와 자기",
content:"전류가 거의 흐르지 않는 물질이다."
},

{
title:"반도체",
subject:"물리",
category:"전기와 자기",
content:"도체와 부도체의 중간 성질을 가진 물질이다."
},

{
title:"전류계",
subject:"물리",
category:"전기와 자기",
content:"전류의 세기를 측정하는 기구이다."
},

{
title:"전압계",
subject:"물리",
category:"전기와 자기",
content:"전압을 측정하는 기구이다."
},

{
title:"직렬 연결",
subject:"물리",
category:"전기와 자기",
content:"전기 기구를 한 줄로 연결한 회로이다."
},

{
title:"병렬 연결",
subject:"물리",
category:"전기와 자기",
content:"전기 기구를 나란히 연결한 회로이다."
},

{
title:"전력",
subject:"물리",
category:"전기와 자기",
content:"전기에너지가 사용되는 빠르기이다."
},

{
title:"전력량",
subject:"물리",
category:"전기와 자기",
content:"일정 시간 동안 사용한 전기에너지의 양이다."
},

{
title:"줄열",
subject:"물리",
category:"전기와 자기",
content:"전류가 흐를 때 발생하는 열에너지이다."
},

{
title:"자석",
subject:"물리",
category:"전기와 자기",
content:"철을 끌어당기는 성질을 가진 물체이다."
},

{
title:"N극",
subject:"물리",
category:"전기와 자기",
content:"자석의 북쪽을 가리키는 극이다."
},

{
title:"S극",
subject:"물리",
category:"전기와 자기",
content:"자석의 남쪽을 가리키는 극이다."
},

{
title:"자기장",
subject:"물리",
category:"전기와 자기",
content:"자기력이 작용하는 공간이다."
},

{
title:"자기력선",
subject:"물리",
category:"전기와 자기",
content:"자기장의 방향을 나타내는 가상의 선이다."
},

{
title:"전자석",
subject:"물리",
category:"전기와 자기",
content:"전류가 흐를 때만 자기력을 가지는 자석이다."
},

{
title:"전자기 유도",
subject:"물리",
category:"전기와 자기",
content:"자기장의 변화로 전류가 발생하는 현상이다."
},

{
title:"에너지",
subject:"물리",
category:"에너지",
content:"일을 할 수 있는 능력이다."
},

{
title:"운동에너지",
subject:"물리",
category:"에너지",
content:"운동하는 물체가 가지는 에너지이다."
},

{
title:"위치에너지",
subject:"물리",
category:"에너지",
content:"물체의 위치에 의해 저장되는 에너지이다."
},

{
title:"역학적에너지",
subject:"물리",
category:"에너지",
content:"운동에너지와 위치에너지의 합이다."
},

{
title:"역학적에너지 보존",
subject:"물리",
category:"에너지",
content:"마찰이 없을 때 역학적에너지 총합은 일정하다."
},

{
title:"일",
subject:"물리",
category:"에너지",
content:"힘이 물체를 이동시켰을 때 전달된 에너지이다."
},

{
title:"일률",
subject:"물리",
category:"에너지",
content:"단위 시간 동안 한 일의 양이다."
},

{
title:"열에너지",
subject:"물리",
category:"에너지",
content:"입자의 운동에 의해 나타나는 에너지이다."
},

{
title:"전기에너지",
subject:"물리",
category:"에너지",
content:"전기 현상과 관련된 에너지이다."
},

{
title:"빛에너지",
subject:"물리",
category:"에너지",
content:"빛이 전달하는 에너지이다."
},

{
title:"화학에너지",
subject:"물리",
category:"에너지",
content:"화학 결합에 저장된 에너지이다."
},

{
title:"핵에너지",
subject:"물리",
category:"에너지",
content:"원자핵 내부에 저장된 에너지이다."
},

{
title:"물질",
subject:"화학",
category:"물질의 상태",
content:"공간을 차지하고 질량을 가지는 모든 것을 말한다."
},

{
title:"고체",
subject:"화학",
category:"물질의 상태",
content:"모양과 부피가 일정한 상태이다."
},

{
title:"액체",
subject:"화학",
category:"물질의 상태",
content:"부피는 일정하지만 모양은 일정하지 않은 상태이다."
},

{
title:"기체",
subject:"화학",
category:"물질의 상태",
content:"모양과 부피가 모두 일정하지 않은 상태이다."
},

{
title:"융해",
subject:"화학",
category:"물질의 상태",
content:"고체가 액체로 변하는 현상이다."
},

{
title:"응고",
subject:"화학",
category:"물질의 상태",
content:"액체가 고체로 변하는 현상이다."
},

{
title:"기화",
subject:"화학",
category:"물질의 상태",
content:"액체가 기체로 변하는 현상이다."
},

{
title:"액화",
subject:"화학",
category:"물질의 상태",
content:"기체가 액체로 변하는 현상이다."
},

{
title:"승화",
subject:"화학",
category:"물질의 상태",
content:"고체와 기체 사이에서 직접 상태가 변하는 현상이다."
},

{
title:"증발",
subject:"화학",
category:"물질의 상태",
content:"액체 표면에서 일어나는 기화 현상이다."
},

{
title:"녹는점",
subject:"화학",
category:"물질의 상태",
content:"고체가 녹기 시작하는 일정한 온도이다."
},

{
title:"끓는점",
subject:"화학",
category:"물질의 상태",
content:"액체가 끓기 시작하는 일정한 온도이다."
},

{
title:"확산",
subject:"화학",
category:"물질의 상태",
content:"입자가 스스로 퍼져 나가는 현상이다."
},

{
title:"원자",
subject:"화학",
category:"물질의 구성",
content:"물질을 이루는 기본 입자이다."
},

{
title:"원자핵",
subject:"화학",
category:"물질의 구성",
content:"원자의 중심에 있는 부분이다."
},

{
title:"전자",
subject:"화학",
category:"물질의 구성",
content:"원자핵 주위를 운동하는 음전하 입자이다."
},

{
title:"양성자",
subject:"화학",
category:"물질의 구성",
content:"양전하를 띠는 입자이다."
},

{
title:"중성자",
subject:"화학",
category:"물질의 구성",
content:"전하를 띠지 않는 입자이다."
},

{
title:"분자",
subject:"화학",
category:"물질의 구성",
content:"물질의 성질을 나타내는 가장 작은 입자이다."
},

{
title:"원소",
subject:"화학",
category:"물질의 구성",
content:"한 종류의 원자로 이루어진 물질이다."
},

{
title:"원소 기호",
subject:"화학",
category:"물질의 구성",
content:"원소를 알파벳으로 나타낸 기호이다."
},

{
title:"화합물",
subject:"화학",
category:"물질의 구성",
content:"두 종류 이상의 원소가 결합한 순물질이다."
},

{
title:"주기율표",
subject:"화학",
category:"물질의 구성",
content:"원소를 일정한 규칙에 따라 배열한 표이다."
},

{
title:"금속 원소",
subject:"화학",
category:"물질의 구성",
content:"광택과 전기 전도성을 가진 원소이다."
},

{
title:"비금속 원소",
subject:"화학",
category:"물질의 구성",
content:"금속의 성질을 가지지 않는 원소이다."
},

{
title:"순물질",
subject:"화학",
category:"순물질과 혼합물",
content:"한 종류의 물질로만 이루어진 물질이다."
},

{
title:"혼합물",
subject:"화학",
category:"순물질과 혼합물",
content:"두 종류 이상의 물질이 섞인 물질이다."
},

{
title:"균일 혼합물",
subject:"화학",
category:"순물질과 혼합물",
content:"어느 부분이나 성질이 같은 혼합물이다."
},

{
title:"불균일 혼합물",
subject:"화학",
category:"순물질과 혼합물",
content:"부분에 따라 성질이 다른 혼합물이다."
},

{
title:"용액",
subject:"화학",
category:"순물질과 혼합물",
content:"균일 혼합물의 한 종류이다."
},

{
title:"용질",
subject:"화학",
category:"순물질과 혼합물",
content:"녹는 물질이다."
},

{
title:"용매",
subject:"화학",
category:"순물질과 혼합물",
content:"녹이는 물질이다."
},

{
title:"용해",
subject:"화학",
category:"순물질과 혼합물",
content:"용질이 용매에 녹는 현상이다."
},

{
title:"용해도",
subject:"화학",
category:"순물질과 혼합물",
content:"일정한 양의 용매에 녹을 수 있는 용질의 최대량이다."
},

{
title:"포화 용액",
subject:"화학",
category:"순물질과 혼합물",
content:"더 이상 용질이 녹지 않는 용액이다."
},

{
title:"화학 반응",
subject:"화학",
category:"화학 반응",
content:"물질의 종류가 변하는 변화이다."
},

{
title:"반응물",
subject:"화학",
category:"화학 반응",
content:"반응하기 전 물질이다."
},

{
title:"생성물",
subject:"화학",
category:"화학 반응",
content:"반응 후 생성된 물질이다."
},

{
title:"연소",
subject:"화학",
category:"화학 반응",
content:"물질이 산소와 반응하며 열과 빛을 내는 현상이다."
},

{
title:"산화",
subject:"화학",
category:"화학 반응",
content:"산소와 결합하는 반응이다."
},

{
title:"환원",
subject:"화학",
category:"화학 반응",
content:"산소를 잃는 반응이다."
},

{
title:"질량 보존 법칙",
subject:"화학",
category:"화학 반응",
content:"반응 전후 전체 질량은 일정하다."
},

{
title:"일정 성분비 법칙",
subject:"화학",
category:"화학 반응",
content:"화합물을 이루는 원소의 질량비는 항상 일정하다."
},

{
title:"흡열 반응",
subject:"화학",
category:"화학 반응",
content:"주변으로부터 열을 흡수하는 반응이다."
},

{
title:"발열 반응",
subject:"화학",
category:"화학 반응",
content:"주변으로 열을 방출하는 반응이다."
},

{
title:"산",
subject:"화학",
category:"산과 염기",
content:"수용액에서 수소 이온(H⁺)을 내놓는 물질이다. 신맛이 나며 푸른색 리트머스 종이를 붉게 변화시킨다."
},

{
title:"염기",
subject:"화학",
category:"산과 염기",
content:"수용액에서 수산화 이온(OH⁻)을 내놓는 물질이다. 쓴맛, 비린맛이 나며 붉은색 리트머스 종이를 푸르게 변화시킨다."
},

{
title:"중화 반응",
subject:"화학",
category:"산과 염기",
content:"산과 염기가 반응하여 물과 염을 만드는 반응이다."
},

{
title:"지시약",
subject:"화학",
category:"산과 염기",
content:"산성과 염기성을 구별하는 물질이다."
},

{
title:"리트머스 종이",
subject:"화학",
category:"산과 염기",
content:"산성과 염기성을 판별하는 대표적인 지시약이다. 산성에서는 청색 리트머스 종이가 빨간색으로 변하고, 염기성에서는 적색 리트머스 종이가 파란색으로 변한다. 중성에서는 색 변화가 없다."
},

{
title:"BTB 용액",
subject:"화학",
category:"산과 염기",
content:"산성과 염기성을 구별하는 지시약이다. 산성에서는 노란색, 중성에서는 초록색, 염기성에서는 파란색을 나타낸다."
},

{
title:"페놀프탈레인 용액",
subject:"화학",
category:"산과 염기",
content:"산성과 염기성을 구별하는 지시약이다. 산성과 중성에서는 무색이고, 염기성에서는 빨간색을 나타낸다."
},

{
title:"수소 이온",
subject:"화학",
category:"산과 염기",
content:"산성을 나타내는 이온이다."
},

{
title:"수산화 이온",
subject:"화학",
category:"산과 염기",
content:"염기성을 나타내는 이온이다."
},

{
title:"세포",
subject:"생물",
category:"세포",
content:"생물체의 구조와 기능의 기본 단위이다."
},

{
title:"세포막",
subject:"생물",
category:"세포",
content:"세포를 둘러싸며 물질의 출입을 조절한다."
},

{
title:"세포질",
subject:"생물",
category:"세포",
content:"세포막과 핵 사이를 채우고 있는 부분이다."
},

{
title:"핵",
subject:"생물",
category:"세포",
content:"유전 정보를 저장하고 세포 활동을 조절한다."
},

{
title:"식물세포",
subject:"생물",
category:"세포",
content:"세포벽, 엽록체, 액포를 가진 세포이다."
},

{
title:"동물세포",
subject:"생물",
category:"세포",
content:"세포벽과 엽록체가 없는 세포이다."
},

{
title:"세포벽",
subject:"생물",
category:"세포",
content:"식물세포를 보호하고 형태를 유지한다."
},

{
title:"엽록체",
subject:"생물",
category:"세포",
content:"광합성이 일어나는 세포 소기관이다."
},

{
title:"액포",
subject:"생물",
category:"세포",
content:"물과 양분 등을 저장하는 공간이다."
},

{
title:"생물",
subject:"생물",
category:"세포",
content:"세포로 이루어져 생명 활동을 하는 존재이다."
},

{
title:"광합성",
subject:"생물",
category:"광합성",
content:"빛에너지를 이용해 양분을 만드는 과정이다."
},

{
title:"포도당",
subject:"생물",
category:"광합성",
content:"광합성으로 생성되는 양분이다."
},

{
title:"산소",
subject:"생물",
category:"광합성",
content:"광합성 결과 생성되는 기체이다."
},

{
title:"이산화탄소",
subject:"생물",
category:"광합성",
content:"광합성의 원료가 되는 기체이다."
},

{
title:"물",
subject:"생물",
category:"광합성",
content:"광합성의 원료가 되는 물질이다."
},

{
title:"기공",
subject:"생물",
category:"광합성",
content:"잎의 표면에서 기체 교환이 일어나는 곳이다."
},

{
title:"증산 작용",
subject:"생물",
category:"광합성",
content:"식물체의 물이 수증기로 빠져나가는 현상이다."
},

{
title:"소화",
subject:"생물",
category:"소화",
content:"음식을 작은 영양소로 분해하는 과정이다."
},

{
title:"소화기관",
subject:"생물",
category:"소화",
content:"소화에 관여하는 기관들의 모임이다."
},

{
title:"입",
subject:"생물",
category:"소화",
content:"음식을 씹고 소화가 시작되는 기관이다."
},

{
title:"식도",
subject:"생물",
category:"소화",
content:"음식을 위로 운반하는 기관이다."
},

{
title:"위",
subject:"생물",
category:"소화",
content:"단백질 소화가 시작되는 기관이다."
},

{
title:"소장",
subject:"생물",
category:"소화",
content:"대부분의 소화와 흡수가 일어나는 기관이다."
},

{
title:"대장",
subject:"생물",
category:"소화",
content:"수분을 흡수하는 기관이다."
},

{
title:"영양소",
subject:"생물",
category:"소화",
content:"생명 활동에 필요한 물질이다."
},

{
title:"순환",
subject:"생물",
category:"순환",
content:"물질을 몸 전체에 운반하는 과정이다."
},

{
title:"심장",
subject:"생물",
category:"순환",
content:"혈액을 온몸으로 보내는 기관이다."
},

{
title:"혈액",
subject:"생물",
category:"순환",
content:"산소와 영양소를 운반하는 액체 조직이다."
},

{
title:"동맥",
subject:"생물",
category:"순환",
content:"심장에서 나가는 혈관이다."
},

{
title:"정맥",
subject:"생물",
category:"순환",
content:"심장으로 들어오는 혈관이다."
},

{
title:"모세혈관",
subject:"생물",
category:"순환",
content:"물질 교환이 일어나는 가는 혈관이다."
},

{
title:"호흡",
subject:"생물",
category:"호흡",
content:"산소를 이용해 에너지를 얻는 과정이다."
},

{
title:"폐",
subject:"생물",
category:"호흡",
content:"기체 교환이 일어나는 기관이다."
},

{
title:"폐포",
subject:"생물",
category:"호흡",
content:"산소와 이산화탄소의 교환이 일어나는 곳이다."
},

{
title:"유전",
subject:"생물",
category:"유전",
content:"부모의 형질이 자손에게 전달되는 현상이다."
},

{
title:"형질",
subject:"생물",
category:"유전",
content:"생물이 가지는 특징이다."
},

{
title:"염색체",
subject:"생물",
category:"유전",
content:"유전 정보를 담고 있는 구조이다."
},

{
title:"DNA",
subject:"생물",
category:"유전",
content:"유전 정보를 저장하는 물질이다."
},

{
title:"생태계",
subject:"생물",
category:"생태계",
content:"생물과 환경이 상호작용하는 체계이다."
},

{
title:"생산자",
subject:"생물",
category:"생태계",
content:"스스로 양분을 만드는 생물이다."
},

{
title:"소비자",
subject:"생물",
category:"생태계",
content:"다른 생물을 먹고 살아가는 생물이다."
},

{
title:"분해자",
subject:"생물",
category:"생태계",
content:"죽은 생물을 분해하는 생물이다."
},

{
title:"먹이사슬",
subject:"생물",
category:"생태계",
content:"먹고 먹히는 관계를 나타낸 것이다."
},

{
title:"지권",
subject:"지구과학",
category:"지권",
content:"지구의 단단한 부분이다."
},

{
title:"암석",
subject:"지구과학",
category:"지권",
content:"광물들이 모여 이루어진 물질이다."
},

{
title:"화성암",
subject:"지구과학",
category:"지권",
content:"마그마가 식어 굳어 생성된 암석이다."
},

{
title:"퇴적암",
subject:"지구과학",
category:"지권",
content:"퇴적물이 쌓여 만들어진 암석이다."
},

{
title:"변성암",
subject:"지구과학",
category:"지권",
content:"기존 암석이 열과 압력을 받아 변한 암석이다."
},

{
title:"풍화",
subject:"지구과학",
category:"지권",
content:"암석이 잘게 부서지는 과정이다."
},

{
title:"침식",
subject:"지구과학",
category:"지권",
content:"풍화된 물질이 이동하는 과정이다."
},

{
title:"대기",
subject:"지구과학",
category:"날씨",
content:"지구를 둘러싼 공기의 층이다."
},

{
title:"기온",
subject:"지구과학",
category:"날씨",
content:"공기의 온도이다."
},

{
title:"습도",
subject:"지구과학",
category:"날씨",
content:"공기 중 수증기의 양이다."
},

{
title:"구름",
subject:"지구과학",
category:"날씨",
content:"작은 물방울이나 얼음 결정의 집합체이다."
},

{
title:"강수",
subject:"지구과학",
category:"날씨",
content:"비나 눈이 내리는 현상이다."
},

{
title:"기압",
subject:"지구과학",
category:"날씨",
content:"공기의 무게로 인해 생기는 압력이다."
},

{
title:"태양",
subject:"지구과학",
category:"우주",
content:"태양계 중심에 있는 항성이다."
},

{
title:"행성",
subject:"지구과학",
category:"우주",
content:"항성 주위를 공전하는 천체이다."
},

{
title:"지구",
subject:"지구과학",
category:"우주",
content:"태양계의 세 번째 행성이다."
},

{
title:"달",
subject:"지구과학",
category:"우주",
content:"지구의 자연 위성이다."
},

{
title:"별",
subject:"지구과학",
category:"우주",
content:"스스로 빛을 내는 천체이다."
},

{
title:"은하",
subject:"지구과학",
category:"우주",
content:"수많은 별들의 집단이다."
},







];


const formulas = [




{
title:"속력",
subject:"물리",
category:"힘과 운동",
formula:"v = s / t"
},

{
title:"거리",
subject:"물리",
category:"힘과 운동",
formula:"s = vt"
},

{
title:"시간",
subject:"물리",
category:"힘과 운동",
formula:"t = s / v"
},

{
title:"무게",
subject:"물리",
category:"힘과 운동",
formula:"W = mg"
},

{
title:"압력",
subject:"물리",
category:"압력과 부력",
formula:"P = F / A"
},

{
title:"힘",
subject:"물리",
category:"압력과 부력",
formula:"F = PA"
},

{
title:"면적",
subject:"물리",
category:"압력과 부력",
formula:"A = F / P"
},

{
title:"부력",
subject:"물리",
category:"압력과 부력",
formula:"F = ρgV"
},

{
title:"일",
subject:"물리",
category:"에너지",
formula:"W = Fs"
},

{
title:"일률",
subject:"물리",
category:"에너지",
formula:"P = W / t"
},

{
title:"전하량",
subject:"물리",
category:"전기와 자기",
formula:"Q = It"
},

{
title:"전력",
subject:"물리",
category:"전기와 자기",
formula:"P = VI"
},

{
title:"전력량",
subject:"물리",
category:"전기와 자기",
formula:"W = Pt"
},

{
title:"줄열",
subject:"물리",
category:"전기와 자기",
formula:"Q = VIt"
},

{
title:"옴의 법칙",
subject:"물리",
category:"전기와 자기",
formula:"V = IR"
},

{
title:"진동수",
subject:"물리",
category:"파동",
formula:"f = 1 / T"
},

{
title:"주기",
subject:"물리",
category:"파동",
formula:"T = 1 / f"
},

{
title:"파동의 속력",
subject:"물리",
category:"파동",
formula:"v = fλ"
},

{
title:"맥놀이수",
subject:"물리",
category:"파동",
formula:"|f₁ - f₂|"
},

{
title:"굴절의 법칙",
subject:"물리",
category:"빛",
formula:"n₁sinθ₁ = n₂sinθ₂"
},


{
title:"밀도",
subject:"화학",
category:"물질의 상태",
formula:"ρ = m / V"
},

{
title:"질량",
subject:"화학",
category:"물질의 상태",
formula:"m = ρV"
},

{
title:"부피",
subject:"화학",
category:"물질의 상태",
formula:"V = m / ρ"
},

{
title:"용질의 질량 백분율",
subject:"화학",
category:"용액",
formula:"(용질의 질량 / 용액의 질량) × 100"
},

{
title:"용액의 질량",
subject:"화학",
category:"용액",
formula:"용질의 질량 + 용매의 질량"
},


{
title:"광합성",
subject:"생물",
category:"광합성",
formula:"이산화탄소 + 물 → 포도당 + 산소"
},

{
title:"호흡",
subject:"생물",
category:"호흡",
formula:"포도당 + 산소 → 이산화탄소 + 물 + 에너지"
},

{
title:"먹이 단계 에너지 전달",
subject:"생물",
category:"생태계",
formula:"약 10%"
},

{
title:"기온감률",
subject:"지구과학",
category:"날씨",
formula:"100m당 약 0.65℃ 감소"
},

{
title:"지구 자전 주기",
subject:"지구과학",
category:"지구와 우주",
formula:"24시간"
},

{
title:"지구 공전 주기",
subject:"지구과학",
category:"지구와 우주",
formula:"365.24일"
},

{
title:"달 공전 주기",
subject:"지구과학",
category:"지구와 우주",
formula:"약 27.3일"
},

{
title:"달의 위상 변화 주기",
subject:"지구과학",
category:"지구와 우주",
formula:"약 29.5일"
}



];


const quizzes = [
{
q:"속력을 구하는 공식은?",
a:["거리×시간","거리÷시간","시간÷거리","거리+시간"],
correct:1,
wrongCount:0
},

{
q:"물체의 운동 여부를 판단하는 기준은?",
a:["질량","기준점","속력","시간"],
correct:1,
wrongCount:0
},

{
q:"출발점에서 도착점까지의 위치 변화는?",
a:["이동 거리","변위","속력","가속도"],
correct:1,
wrongCount:0
},

{
q:"물체가 현재 운동 상태를 유지하려는 성질은?",
a:["탄성","관성","중력","부력"],
correct:1,
wrongCount:0
},

{
q:"지구가 물체를 끌어당기는 힘은?",
a:["탄성력","마찰력","중력","부력"],
correct:2,
wrongCount:0
},

{
q:"압력을 구하는 공식은?",
a:["힘×면적","힘÷면적","면적÷힘","힘+면적"],
correct:1,
wrongCount:0
},

{
q:"면적이 작아지면 압력은?",
a:["감소","증가","변화 없음","0"],
correct:1,
wrongCount:0
},

{
q:"물체를 위로 밀어 올리는 힘은?",
a:["중력","탄성력","부력","마찰력"],
correct:2,
wrongCount:0
},

{
q:"파동의 한 종류로 진동 방향과 진행 방향이 같은 것은?",
a:["횡파","종파","빛","전류"],
correct:1,
wrongCount:0
},

{
q:"1초 동안 반복되는 진동 횟수는?",
a:["주기","파장","진동수","진폭"],
correct:2,
wrongCount:0
},

{
q:"빛이 경계면에서 되돌아오는 현상은?",
a:["굴절","회절","반사","간섭"],
correct:2,
wrongCount:0
},

{
q:"빛을 모으는 렌즈는?",
a:["오목렌즈","볼록렌즈","평면거울","프리즘"],
correct:1,
wrongCount:0
},

{
q:"전하가 이동하는 현상은?",
a:["전압","전류","저항","자기장"],
correct:1,
wrongCount:0
},

{
q:"전류의 단위는?",
a:["V","W","A","Ω"],
correct:2,
wrongCount:0
},

{
q:"전압의 단위는?",
a:["A","V","Ω","J"],
correct:1,
wrongCount:0
},

{
q:"전류의 흐름을 방해하는 정도는?",
a:["전압","저항","전력","전하"],
correct:1,
wrongCount:0
},

{
q:"전기에너지가 사용되는 빠르기는?",
a:["전류","전압","전력","전하량"],
correct:2,
wrongCount:0
},

{
q:"일을 구하는 공식은?",
a:["F÷s","Fs","s÷F","F+s"],
correct:1,
wrongCount:0
},

{
q:"운동하는 물체가 가지는 에너지는?",
a:["위치에너지","운동에너지","화학에너지","빛에너지"],
correct:1,
wrongCount:0
},

{
q:"위치에너지와 운동에너지의 합은?",
a:["열에너지","전기에너지","역학적에너지","화학에너지"],
correct:2,
wrongCount:0
},

{
q:"고체의 특징은?",
a:["모양과 부피가 일정하다","모양만 일정하다","부피만 일정하다","모양과 부피가 모두 일정하지 않다"],
correct:0,
wrongCount:0
},

{
q:"액체의 특징은?",
a:["모양과 부피가 일정하다","모양은 변하고 부피는 일정하다","부피가 변하고 모양은 일정하다","모양과 부피가 모두 일정하지 않다"],
correct:1,
wrongCount:0
},

{
q:"고체가 액체로 변하는 현상은?",
a:["응고","융해","기화","액화"],
correct:1,
wrongCount:0
},

{
q:"액체가 기체로 변하는 현상은?",
a:["응고","융해","기화","액화"],
correct:2,
wrongCount:0
},

{
q:"기체가 액체로 변하는 현상은?",
a:["승화","액화","응고","증발"],
correct:1,
wrongCount:0
},

{
q:"고체가 기체로 직접 변하는 현상은?",
a:["융해","기화","승화","액화"],
correct:2,
wrongCount:0
},

{
q:"물질을 이루는 기본 입자는?",
a:["분자","전자","원자","이온"],
correct:2,
wrongCount:0
},

{
q:"원자핵 주위를 도는 입자는?",
a:["양성자","중성자","전자","분자"],
correct:2,
wrongCount:0
},

{
q:"전하를 띠지 않는 입자는?",
a:["전자","양성자","중성자","이온"],
correct:2,
wrongCount:0
},

{
q:"한 종류의 원자로 이루어진 물질은?",
a:["혼합물","화합물","원소","용액"],
correct:2,
wrongCount:0
},

{
q:"두 종류 이상의 물질이 섞인 것은?",
a:["원소","순물질","혼합물","분자"],
correct:2,
wrongCount:0
},

{
q:"용액에서 녹는 물질은?",
a:["용매","용질","혼합물","원소"],
correct:1,
wrongCount:0
},

{
q:"용액에서 녹이는 물질은?",
a:["용매","용질","화합물","분자"],
correct:0,
wrongCount:0
},

{
q:"산소와 결합하는 반응은?",
a:["환원","산화","중화","연소"],
correct:1,
wrongCount:0
},

{
q:"산과 염기가 반응하는 것은?",
a:["연소","산화","중화","환원"],
correct:2,
wrongCount:0
},

{
q:"BTB 용액이 산성에서 나타내는 색은?",
a:["파란색","초록색","노란색","붉은색"],
correct:2,
wrongCount:0
},

{
q:"BTB 용액이 중성에서 나타내는 색은?",
a:["초록색","파란색","노란색","분홍색"],
correct:0,
wrongCount:0
},

{
q:"페놀프탈레인 용액이 염기성에서 나타내는 색은?",
a:["무색","노란색","붉은색","초록색"],
correct:2,
wrongCount:0
},

{
q:"푸른색 리트머스 종이가 붉게 변하면?",
a:["중성","산성","염기성","순물질"],
correct:1,
wrongCount:0
},

{
q:"질량 보존 법칙의 내용은?",
a:["질량이 항상 증가한다","질량이 항상 감소한다","반응 전후 전체 질량은 같다","원자의 수가 줄어든다"],
correct:2,
wrongCount:0
},

{
q:"생물체의 구조와 기능의 기본 단위는?",
a:["기관","세포","조직","개체"],
correct:1,
wrongCount:0
},

{
q:"유전 정보를 저장하는 세포 기관은?",
a:["세포막","핵","세포질","액포"],
correct:1,
wrongCount:0
},

{
q:"광합성이 일어나는 장소는?",
a:["핵","액포","엽록체","세포막"],
correct:2,
wrongCount:0
},

{
q:"식물세포에만 있는 구조가 아닌 것은?",
a:["세포벽","엽록체","액포","핵"],
correct:3,
wrongCount:0
},

{
q:"광합성의 결과 생성되는 양분은?",
a:["산소","이산화탄소","포도당","질소"],
correct:2,
wrongCount:0
},

{
q:"광합성에 필요한 기체는?",
a:["산소","이산화탄소","질소","수소"],
correct:1,
wrongCount:0
},

{
q:"음식을 작은 영양소로 분해하는 과정은?",
a:["순환","배설","소화","호흡"],
correct:2,
wrongCount:0
},

{
q:"대부분의 소화와 흡수가 일어나는 기관은?",
a:["위","소장","대장","식도"],
correct:1,
wrongCount:0
},

{
q:"수분을 흡수하는 기관은?",
a:["위","소장","대장","간"],
correct:2,
wrongCount:0
},

{
q:"혈액을 온몸으로 보내는 기관은?",
a:["폐","심장","간","신장"],
correct:1,
wrongCount:0
},

{
q:"심장에서 나가는 혈관은?",
a:["정맥","모세혈관","동맥","림프관"],
correct:2,
wrongCount:0
},

{
q:"기체 교환이 일어나는 기관은?",
a:["심장","위","폐","간"],
correct:2,
wrongCount:0
},

{
q:"산소와 이산화탄소가 교환되는 곳은?",
a:["기관지","폐포","식도","대장"],
correct:1,
wrongCount:0
},

{
q:"부모의 형질이 자손에게 전달되는 현상은?",
a:["진화","유전","광합성","호흡"],
correct:1,
wrongCount:0
},

{
q:"유전 정보를 저장하는 물질은?",
a:["RNA","DNA","ATP","단백질"],
correct:1,
wrongCount:0
},

{
q:"스스로 양분을 만드는 생물은?",
a:["소비자","분해자","생산자","포식자"],
correct:2,
wrongCount:0
},

{
q:"죽은 생물을 분해하는 생물은?",
a:["생산자","소비자","분해자","초식동물"],
correct:2,
wrongCount:0
},

{
q:"먹고 먹히는 관계를 나타낸 것은?",
a:["생태계","먹이사슬","군집","개체군"],
correct:1,
wrongCount:0
},

{
q:"기공의 역할은?",
a:["광합성 중단","기체 교환","물 저장","유전"],
correct:1,
wrongCount:0
},

{
q:"산소를 이용해 에너지를 얻는 과정은?",
a:["광합성","소화","호흡","배설"],
correct:2,
wrongCount:0
},

{
q:"마그마가 식어 굳어 생성된 암석은?",
a:["퇴적암","변성암","화성암","석탄"],
correct:2,
wrongCount:0
},

{
q:"퇴적물이 쌓여 만들어진 암석은?",
a:["화성암","퇴적암","변성암","현무암"],
correct:1,
wrongCount:0
},

{
q:"암석이 잘게 부서지는 과정은?",
a:["침식","풍화","퇴적","융해"],
correct:1,
wrongCount:0
},

{
q:"풍화된 물질이 이동하는 과정은?",
a:["퇴적","침식","응고","분화"],
correct:1,
wrongCount:0
},

{
q:"지구를 둘러싼 공기의 층은?",
a:["수권","생물권","대기","지권"],
correct:2,
wrongCount:0
},

{
q:"공기의 온도는?",
a:["습도","기압","기온","풍속"],
correct:2,
wrongCount:0
},

{
q:"공기 중 수증기의 양은?",
a:["기온","습도","기압","강수량"],
correct:1,
wrongCount:0
},

{
q:"비나 눈이 내리는 현상은?",
a:["풍화","강수","침식","증발"],
correct:1,
wrongCount:0
},

{
q:"공기의 무게 때문에 생기는 압력은?",
a:["수압","기압","부력","압력"],
correct:1,
wrongCount:0
},

{
q:"태양계 중심에 있는 천체는?",
a:["지구","달","태양","화성"],
correct:2,
wrongCount:0
},

{
q:"지구의 자연 위성은?",
a:["금성","화성","달","태양"],
correct:2,
wrongCount:0
},

{
q:"스스로 빛을 내는 천체는?",
a:["행성","위성","별","소행성"],
correct:2,
wrongCount:0
},

{
q:"항성 주위를 공전하는 천체는?",
a:["행성","별","은하","성운"],
correct:0,
wrongCount:0
},

{
q:"수많은 별들의 집단은?",
a:["행성","은하","달","혜성"],
correct:1,
wrongCount:0
},

{
q:"지구 자전 주기는?",
a:["12시간","24시간","30일","365일"],
correct:1,
wrongCount:0
},

{
q:"지구 공전 주기는?",
a:["24시간","27.3일","29.5일","365.24일"],
correct:3,
wrongCount:0
},

{
q:"달의 공전 주기는?",
a:["24시간","27.3일","29.5일","365일"],
correct:1,
wrongCount:0
},

{
q:"달의 위상 변화 주기는?",
a:["27.3일","29.5일","365일","24시간"],
correct:1,
wrongCount:0
},

{
q:"기온은 높아질수록 공기의 밀도는?",
a:["증가","감소","일정","0"],
correct:1,
wrongCount:0
},

{
q:"구름은 주로 무엇이 모여 만들어지는가?",
a:["먼지","산소","물방울","질소"],
correct:2,
wrongCount:0
}

];

const savedQuizzes =
JSON.parse(
localStorage.getItem("quizzes")
);

if(savedQuizzes){

    quizzes.forEach((q,i)=>{

        if(savedQuizzes[i]){

            q.wrongCount =
            savedQuizzes[i].wrongCount || 0;

        }

    });

}

    



shuffleCards();

let currentCard = 0;

function saveData(){

localStorage.setItem("xp",xp);
localStorage.setItem("level",level);
localStorage.setItem("solved",solved);
localStorage.setItem("correct",correct);

localStorage.setItem(
"wrongs",
JSON.stringify(wrongs)
);

localStorage.setItem(
"quizzes",
JSON.stringify(quizzes)
);

localStorage.setItem(
"todaySolved",
todaySolved
);

localStorage.setItem(
"todayCorrect",
todayCorrect
);

}

function updateStats(){

document.getElementById("xp").innerText=xp;
document.getElementById("level").innerText=level;

let rate =
solved===0 ? 0 :
Math.round(correct/solved*100);

document.getElementById("accuracy")
.innerText=rate;

if(document.getElementById("correctCount")){
    document.getElementById("correctCount").innerText = correct;
}

if(document.getElementById("wrongCount")){
    document.getElementById("wrongCount").innerText = solved - correct;
}

renderWrongs();

document.getElementById("todaySolved")
.innerText = todaySolved;

document.getElementById("todayCorrect")
.innerText = todayCorrect;

let todayRate =
todaySolved === 0
? 0
: Math.round(
todayCorrect / todaySolved * 100
);

document.getElementById("todayAccuracy")
.innerText = todayRate;

}

function renderWrongs(){

 const list =
 document.getElementById("wrongList");

 list.innerHTML="";

 wrongs.forEach(item=>{

   const li =
   document.createElement("li");

   li.innerHTML = `
   <div style="margin-bottom:15px;">
     <strong>문제:</strong>
     ${item.question}
     <br>

     ❌ <strong>내 답:</strong>
     ${item.userAnswer}

     <br>

     ✅ <strong>정답:</strong>
     ${item.correctAnswer}
   </div>
   <hr>
   `;

   list.appendChild(li);

 });

}

function showTab(id){

    document
.getElementById("formulaResults")
.classList.add("hidden-formula");

    document
    .querySelectorAll("main section")
    .forEach(sec=>{
        sec.classList.add("hidden");
    });

    document
    .getElementById(id)
    .classList.remove("hidden");

    if(id !== "concepts"){
        document.getElementById("conceptResults").innerHTML = "";
    }

}

function shuffleCards(){

    shuffledCards = [...concepts];

    for(let i = shuffledCards.length - 1; i > 0; i--){

        const j =
        Math.floor(Math.random() * (i + 1));

        [shuffledCards[i], shuffledCards[j]] =
        [shuffledCards[j], shuffledCards[i]];
    }

    cardIndex = 0;
}

function flipCard(){

    const card =
    document.getElementById("flashcard");

    if(cardFront){

        card.innerHTML =
        shuffledCards[cardIndex].content;

    }else{

        cardIndex++;

        if(cardIndex >= shuffledCards.length){

            shuffleCards();

        }

        card.innerHTML =
        shuffledCards[cardIndex].title;

    }

    cardFront = !cardFront;

}





function loadQuiz(){

    const today =
new Date().toLocaleDateString();

const lastDate =
localStorage.getItem("lastDate");

if(lastDate !== today){

    todaySolved = 0;
    todayCorrect = 0;

    localStorage.setItem("todaySolved",0);
    localStorage.setItem("todayCorrect",0);
    localStorage.setItem("lastDate",today);

}


    if(quizList.length === 0){

        document
        .getElementById("question")
        .innerText =
        "오답 문제가 없습니다 🎉";

        document
        .getElementById("answers")
        .innerHTML = "";

        return;

    }

  if(currentQuiz >= quizList.length){

    document.getElementById("question")
    .innerText =
    "🎉 모든 문제를 완료했습니다!";

    document.getElementById("answers")
    .innerHTML = "";

    return;
}



    const q =
    quizList[currentQuiz];

    document
    .getElementById("question")
    .innerText = q.q;

    const box =
    document.getElementById("answers");

    box.innerHTML = "";

    q.a.forEach((answer,index)=>{

        const btn =
        document.createElement("button");

        btn.className = "answer-btn";

        btn.innerText = answer;

        btn.onclick = () =>
        checkAnswer(index);

        box.appendChild(btn);

    });

}



function getNextQuiz(){

    let weighted = [];

    quizzes.forEach(q=>{

        let weight =
        q.wrongCount + 1;

        for(let i=0;i<weight;i++){

            weighted.push(q);

        }

    });

    return weighted[
    Math.floor(
    Math.random()*weighted.length
    )];

}

function checkAnswer(choice){


const q =
quizList[currentQuiz];

    solved++;

    todaySolved++;

    if(choice===q.correct){

        correct++;

        todayCorrect++;

        if(correct === 1){
    unlockAchievement("첫 정답");
}

 if(correct === 10){
    unlockAchievement("정답 10개 달성");
}

 if(correct === 50){
    unlockAchievement("정답 50개 달성");
}

if(correct === 100){
    unlockAchievement("정답 100개 달성");
}

        xp += 10;

        document
        .getElementById("result")
        .innerHTML =
        "<span style='color:limegreen'>정답! ✅</span>";

        if(xp >= level * 100){

            level++;

            alert(
            "레벨업! LV." + level
            );

            if(level === 5){
    unlockAchievement("레벨 5 달성");
}

 if(level === 10){
    unlockAchievement("레벨 10 달성");
}

        }

    }else{

        if(q.wrongCount !== undefined){
            q.wrongCount++;
        }

        wrongs.push({
            question: q.q,
            userAnswer: q.a[choice],
            correctAnswer: q.a[q.correct]
        });

        document
        .getElementById("result")
        .innerHTML =
        "<span style='color:red'>오답! ❌</span>";

    }

    currentQuiz++;

    saveData();

    updateStats();

    loadQuiz();

}



document.getElementById("flashcard")
.innerHTML =
shuffledCards[0].title;



function unlockAchievement(name){

    if(!achievements.includes(name)){

        achievements.push(name);

        localStorage.setItem(
        "achievements",
        JSON.stringify(achievements)
        );

        alert("🏆 업적 달성!\n" + name);

        renderAchievements();
    }
}



function nextCard(){

    cardFront = true;

    cardIndex++;

    if(cardIndex >= shuffledCards.length){
        shuffleCards();
    }

    document.getElementById("flashcard")
    .innerHTML =
    shuffledCards[cardIndex].title;

}

function toggleDarkMode(){

    document.body
    .classList.toggle("dark");

}

function shuffleArray(arr){
    for(let i = arr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

function setQuizMode(mode){

  

    quizMode = mode;

    quizList =
    quizMode === "wrong"
    ? quizzes.filter(q => q.wrongCount > 0)
    : [...quizzes];

    shuffleArray(quizList);



    currentQuiz = 0;

    loadQuiz();

}

shuffleCards();

updateStats();

loadQuiz();

searchConcept();

checkAchievements();

renderAchievements();

showTab("formulas")

function showFavorites(){

    alert("즐겨찾기 실행됨");

    const box =
    document.getElementById("conceptResults");

    box.innerHTML = "";

    box.innerHTML +=
    "<h2>📖 즐겨찾기 개념</h2>";

    concepts
    .filter(item =>
        favorites.includes(
            "concept_" + item.title
        )
    )
    .forEach(item => {

        const div =
        document.createElement("div");

        div.innerHTML =

        "<h3>" +
        item.title +
        "</h3>" +

        "<p>📚 <b>과목:</b> " +
        item.subject +
        "</p>" +

        "<p>🧩 <b>카테고리:</b> " +
        item.category +
        "</p>" +

        "<p>📖 <b>설명:</b></p>" +

        "<p>" +
        item.content +
        "</p><hr>";

        box.appendChild(div);

    });

    box.innerHTML +=
    "<h2>📐 즐겨찾기 공식</h2>";

    formulas
    .filter(item =>
        favorites.includes(
            "formula_" + item.title
        )
    )
    .forEach(item => {

        const div =
        document.createElement("div");

        div.className =
        "formula-card";

        div.innerHTML =

        "<h3>" +
        item.title +
        "</h3>" +

        "<p>📚 <b>과목:</b> " +
        item.subject +
        "</p>" +

        "<p>🧩 <b>카테고리:</b> " +
        item.category +
        "</p>" +

        "<p>📐 <b>공식:</b></p>" +

        "<p>" +
        item.formula +
        "</p><hr>";

        box.appendChild(div);

    });

}

function searchFormula(){

const keyword =
document
.getElementById("formulaSearch")
.value
.toLowerCase()
.trim()
.normalize("NFKC");

    const box =
    document
    .getElementById("formulaResults");

    box.innerHTML = "";

    formulas
    .filter(item => {

        const title =
        (item.title || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const subject =
        (item.subject || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const category =
        (item.category || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

        const formula =
        (item.formula || "")
        .toLowerCase()
        .replace(/\s/g,"")
        .normalize("NFKC");

const keywords = keyword.split(/\s+/);

const searchText = (
    title + " " +
    subject + " " +
    category + " " +
    formula
);

return (
    keyword === "" ||
    keywords.every(word =>
        searchText.includes(word)
    )
);

    })
    .forEach(item => {

        const div =
        document.createElement("div");

        div.className = "formula-card";
        
        div.innerHTML =

        "<h3>" +
item.title +

" <span style='cursor:pointer;font-size:24px' onclick=\"toggleFavorite('formula_" +
item.title +
"')\">" +

(
favorites.includes(
"formula_" + item.title
)

? "★" : "☆"

)

+

"</span></h3>" +

        "<p>📚 <b>과목:</b> " +
        item.subject +
        "</p>" +

        "<p>🧩 <b>카테고리:</b> " +
        item.category +
        "</p>" +

        "<p>📐 <b>공식:</b></p>" +

        "<p>" +
        item.formula +
        "</p><hr>";

        box.appendChild(div);

    });

}

function searchConcept(){

    const keyword =
    document
    .getElementById("searchInput")
    .value
.toLowerCase()
.replace(/\s/g, "");

    const box =
    document
    .getElementById("conceptResults");

    box.innerHTML = "";

    
    concepts
    .filter(item => {

    const title =
    (item.title || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const subject =
    (item.subject || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const category =
    (item.category || "")
    .toLowerCase()
    .replace(/\s/g,"");

    const content =
    (item.content || "")
    .toLowerCase()
    .replace(/\s/g,"");

return (
keyword === "" ||
title.includes(keyword) ||
subject.includes(keyword) ||
category.includes(keyword) ||
content.includes(keyword)
);

})
    .forEach(item => {

        const div =
        document.createElement("div");

 div.innerHTML =
"<h3>" +
item.title +

" <span style='cursor:pointer;font-size:24px' onclick=\"toggleFavorite('concept_" +
item.title +
"')\">" +

(
favorites.includes(
"concept_" + item.title
)

? "★" : "☆"

)

+

"</span></h3>" + 

"<p>📚 <b>과목:</b> " +
(item.subject || "미분류") +
"</p>" +

"<p>🧩 <b>카테고리:</b> " +
(item.category || "미분류") +
"</p>" +

"<p>📖 <b>설명</b></p>" +

"<p>" +
item.content +
"</p><hr>";

        box.appendChild(div);

    });

}

function updateFavoriteCount(){
    document.getElementById("favoriteCount").textContent =
    "⭐ " + favorites.length;
}

searchFormula();
