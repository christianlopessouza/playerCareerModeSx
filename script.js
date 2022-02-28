var year = 2022;
const clubs=[["Barcelona", "Real Madrid", "Manchester City", "Atlético de Madrid", "Chelsea","Manchester United","Bayern Munchen","Liverpool","PSG","Juventus","Inter de Milão","Milan"],["Valencia","Newcastle","Villareal","Porto","Real Sociedad", "Sevilla","Gent","RB Leipzig", "Borussia Dortmund", "Schalke 04","Hoffenheim","Borussia M'glandbach", "Tottenham","Wolfsburg","Bayer Leverkusen","Napoli","Lazio","Roma","Fiorentina","Sassuolo","Everton","Arsenal","Leicester city","West Ham United","Southamptom","Lyon","Olympique Marseille","Monaco","Nice","Bordeaux","Lille","Sporting","Benfica","Porto","Shakhtar Donetsk","Fenerbahçe","Zenit","Basel","Besiktas","Ajax","Feyenoord","PSV","CSKA","Spartak Moskva"],["Betis","Celtic","Dinamo Kyev","Eibar","Braga","Saint-Étienne","Getafe","Girona","Athletic Bilbao","Celta De Vigo","Alavés","La Coruna","Espanyol","Málaga","Augsburg","Eintracht Frankfurt","Hannover","Hertha Berlim","Stuttgart", "Freiburg","Mainz 05", "Hamburg","Koln","Werder Bremen","Sampdoria","Atalanta","Udinese","Bologna","Chievo Verona","Genoa","Cagliari","Spal","Crotone","Hellas Verona","Benevento","Newcastle United","Brighton & Holves Albion","Crystal Palace","Bournemouth","Huddersfird Town","Burnley","Aston Villa","Preston","Wolverhamptom","Fulham","Sheffield United","Middlesbrough","Norwich","Nottigahn Forest","Sunderland","Nantes","Guingamp","Rennes","Caen","Dijon","Strasbourg","Angers","Amiens","Troyes","Metz","Montpellier","Olympiacos","Anderlecht", "Salzburg", "Club Brugge", "Apoel","Viktoria Plzen","Steua Bucaresti","Legia Warszawa","Krasnodar","Qarabag","Genk","Nordsjaelland", "Vardar", "Standard Liege","Groningem","Rangers", "Flamengo", "Palmeiras","Atlético Mineiro"]];

function selectTeam(club,age,avg,credit,overall){
    let changeChance = randint(1,10);
    let tierChance = [2];
    avg = (avg + credit) / 2;

    if(age < 22){
        avg += 0.2
    }


    console.log(Math.round(avg*10)+"0% de ficar");
    
    if(Math.round(avg*10) <= changeChance){
        if(overall >= 87){
            tierChance = [0,0,1];
        }else if(overall >= 83){
            tierChance = [0,1,1];
        }else if(overall >= 80){
            tierChance = [0,1,1,1,2];
        }else if(overall >= 75){
            tierChance = [1,2,2];
        }else if(overall > 65){
            tierChance = [0,1,2,2,2,2,2,2,2];
        }

        tierIndex = randint(0,(tierChance.length)-1);
        tierIndex = tierChance[tierIndex];
        clubIndex = randint(0,(clubs[tierIndex].length)-1);
        console.log(tierIndex,clubIndex)
        club = clubs[tierIndex][clubIndex];
    }



    return club;
}

/* 
POSIÇÕES
 Goleiro CS - DD
 Zagueiro G - CS - D
 Lateral G - A - D
 Volante G - A - D
 Meia G - A 
 Ponta - A - G
 CentroAvanta G - A
 */

// Stats => posicao + overall
// Overall++ => stats + idade
// Valor de Mercado => idade + overall
// Posicao => stats
// Parametro => overall



function randint(min, max) {
    return Math.floor(Math.random() * max) + min;
}

const defaultOverall = 95;


function getPercent(overall) {
    return (overall / defaultOverall);
}


function getStats(position, overall) {
    let statsParams = {};
    let percentage = getPercent(overall);

    switch (position) {
        case "GK": //GoalKeeper
            statsParams.cleanSheets = 50;
            statsParams.saves = 65;
            break;
        case "CB": //CenterBack
            statsParams.goals = 15;
            statsParams.cleanSheets = 55;
            statsParams.tackles = 110;
            break;
        case "WB": //WingBack
            statsParams.goals = 20;
            statsParams.assists = 30;
            statsParams.tackles = 90;
            break;
        case "CDM": //CenterDefensiveMidfilder
            statsParams.goals = 20;
            statsParams.assists = 30;
            statsParams.tackles = 120;
            break;
        case "MD": //Midfilder
            statsParams.goals = 30;
            statsParams.assists = 50;
            break;

        case "W": //Winger
            statsParams.goals = 40;
            statsParams.assists = 40;
            break;
        case "ST": //Striker
            statsParams.goals = 55;
            statsParams.assists = 20;

            break;
    }

    let seasonStats = {};
    Object.keys(statsParams).forEach(function (item) {
        seasonStats[item] = {
            did: randint(1, Math.round(statsParams[item] * percentage)),
            max: Math.round(statsParams[item] * percentage),
        };
    });
    console.log(seasonStats, "faded heart");
    return seasonStats
}

function sumStats(stats) {
    let total = { did: 0, max: 0 };
    Object.keys(stats).forEach(function (item) {
        console.log(item)
        total.did += stats[item].did;
        total.max += stats[item].max;
    });
    return total;
}

function gradeOverallAudit(overall) {
    let maxGrade = 0.6;
    return ((overall - 1) * maxGrade) / 100;

}

function overallAudit(credits, upgrade, age, ageParam, overall) {

    let gradeParam = gradeOverallAudit(overall);

    if (credits < gradeParam && age < ageParam) {
        let dismount = (credits - gradeParam);
        upgrade = Math.round((upgrade + 4) * dismount);
        upgrade *= -1; // negativa
    } else if (credits < (gradeParam + 0.08)) {
        upgrade = 0;
    }

    upp = false;
    if (randint(1, 2) == 2) {
        upgrade /= 2;
        upp = true;
    }

    return upgrade;
}


// season:"",
// club:"",
// titles:{},
// stats:{},
// position:"",
// overall:"",
// valor:""


function Action(player) {
    let status = true;
    let stats = getStats(player.position, player.overall);
    let totalStats = sumStats(stats);
    if (player.age > 16) {
        ageParam = 30;
    } else {
        ageParam = 16;
    }

    let average = (player.gradeAvg / player.seasonC);
    let seasonCredits = (totalStats.did / totalStats.max);
    if (seasonCredits < average && player.age > 16) {
        seasonCredits = (seasonCredits + average) / 2;
    }
    let upgrade = (ageParam - player.age) * (seasonCredits);

    upgrade = overallAudit(seasonCredits, upgrade, player.age, ageParam, player.overall);


    let overall = Math.round(upgrade + player.overall);

    player.overall = overall;
    player.gradeAvg += seasonCredits;
    player.age += 1;
    player.seasonC += 1;
    player.club = selectTeam(player.club,player.age,average,seasonCredits,overall);
    player.seasons[year] = {
        stats:stats,
        geralStatus:totalStats,
        club:player.club,
        seasonCredits:seasonCredits,
        average:average,
        overall:overall,
        age:player.age
    }

    year += 1;

    if(getRetired(player.age)){
        status= false;
    }

    return {
        status:status,player:player
    }




}

function getRetired(age){
    if(age > 33 && (randint(1,3) == 2)){
        return true;
    }
    return false;
}






//desempenho
// -> overall & posicionamento & nivel do time & idade
// -> (define gols e assistencia)

// -> baseado nisso define nova posição
// -> baseado na idade aumentando/diminui ovr


