var spawnNewCreep = {

    run: function(creep, spawnName, roomName) {
        // empty memory
        for (let name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }

        // find controller, struct, mineral
        const controller = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTROLLER }
        });
        const level = controller[0].level;
        const constructSites = Game.spawns[spawnName].room.find(FIND_CONSTRUCTION_SITES);
        const minerals = Game.spawns[spawnName].room.find(FIND_MINERALS);
        const myExtractors = Game.spawns[spawnName].room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTRACTOR }
        });
        const myContainers = Game.rooms[roomName].find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
        });

        // init the creep
        var harvesters;
        var builders;
        var upgraders;
        var attackers;
        var claimers;
        var repairers;
        var miners;
        var expanders;
        var gatherers;

        var needBuilder = 0;
        var needHarvester = 0;
        var needUpgrader = 0;
        var needAttacker = 0;
        var needClaimer = 0;
        var needRepairer = 0;
        var needMiner = 0;
        var needExpander = 0;
        var needGatherer = 0;

        var builderParts = [];
        var upgraderParts = [];
        var harvesterParts = [];
        var attackerParts = [];
        var claimerParts = [];
        var repairerParts = [];
        var minerParts = [];
        var expanderParts = [];
        var gathererParts = [];

        // get the instances of every kind of creep
        harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester' && creep.memory.belong == roomName);
        builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder' && creep.memory.belong == roomName);
        upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader' && creep.memory.belong == roomName);
        attackers = _.filter(Game.creeps, (creep) => creep.memory.role == 'attacker' && creep.memory.belong == roomName);
        claimers = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer' && creep.memory.belong == roomName);
        repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer' && creep.memory.belong == roomName);
        miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner' && creep.memory.belong == roomName);
        expanders = _.filter(Game.creeps, (creep) => creep.memory.role == 'expander' && creep.memory.belong == roomName);
        gatherers = _.filter(Game.creeps, (creep) => creep.memory.role == 'gatherer' && creep.memory.belong == roomName);

        // UI
        if (Game.spawns[spawnName].room.name == roomName) {
            var xx = Game.spawns[spawnName].pos.x - 5;
            var yy = Game.spawns[spawnName].pos.y + 11;
            Game.spawns[spawnName].room.visual.text(
                '🚜:'+harvesters.length+','+'🚜:'+gatherers.length+','+'🛠️:'+builders.length+','+'⚡:'+upgraders.length+','+'⚔️:'+attackers.length,
                xx, yy, {align: 'left', opacity: 0.8}
            );
            Game.spawns[spawnName].room.visual.text(
                '🏛️:'+claimers.length+','+'⚙️:'+repairers.length+','+'⛑️:'+miners.length+','+'🏳️:'+expanders.length,
                xx, yy+1, {align: 'left', opacity: 0.8}
            );
        }

        // change the spawn creep number by controller level
        if (constructSites.length) {
            needBuilder = 1;
        }

        if (myContainers.length) {
            needGatherer = myContainers.length;
        }

        if (minerals[0].mineralAmount > 0 && myExtractors.length > 0) {
            if (myExtractors[0].isActive()) {
                needMiner = 1;
            }
        }

        if (level == 1) {
            builderParts = [WORK,CARRY,MOVE,MOVE];
            upgraderParts = [WORK,CARRY,MOVE,MOVE];
            harvesterParts = [WORK,CARRY,MOVE,MOVE];
            needHarvester = 1;
            needUpgrader = 2;

        } else if (level == 2) {
            builderParts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            upgraderParts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            harvesterParts = [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
            gathererParts = [WORK,WORK,WORK,WORK,MOVE,MOVE];
            repairerParts = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            needHarvester = 1;
            needUpgrader = 2;
            needRepairer = 1;

        } else if (level == 3) {
            builderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            upgraderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            harvesterParts = [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
            gathererParts = [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE];
            repairerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            needHarvester = 1;
            needUpgrader = 2;
            needRepairer = 1;

        } else if (level == 4) {
            builderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            upgraderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            harvesterParts = [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
            gathererParts = [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE];
            repairerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            needHarvester = 1;
            needUpgrader = 2;
            needRepairer = 1;

        } else if (level == 5) {
            builderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            upgraderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            harvesterParts = [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
            attackerParts = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK];
            claimerParts = [CLAIM,MOVE,MOVE];
            gathererParts = [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE];
            repairerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            minerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            needHarvester = 1;
            needUpgrader = 2;
            needRepairer = 1;
            needClaimer = 0;

        } else {
            builderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            upgraderParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            harvesterParts = [CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE,CARRY,CARRY,MOVE];
            attackerParts = [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK];
            claimerParts = [CLAIM,MOVE,MOVE];
            gathererParts = [WORK,WORK,MOVE,WORK,WORK,MOVE,WORK,WORK,MOVE];
            repairerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
            minerParts = [WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE,WORK,CARRY,MOVE];
            needHarvester = 1;
            needUpgrader = 2;
            needRepairer = 1;
            needAttacker = 0;
        }

        // spawn the creep
        if (builders.length < needBuilder && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Builder' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(builderParts, newName, {memory: {role: 'builder', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new builder: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new builder: ' + newName + ", Successful");
            }
        }

        if (upgraders.length < needUpgrader && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Upgrader' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(upgraderParts, newName, {memory: {role: 'upgrader', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new upgrader: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new upgrader: ' + newName + ", Successful");
            }
        }

        if (harvesters.length < needHarvester) {
            let newName = 'Harvester' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(harvesterParts, newName, {memory: {role: 'harvester', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new harvester: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new harvester: ' + newName + ", Successful");
            }
        }

        if (attackers.length < needAttacker && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Attacker' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(attackerParts, newName, {memory: {role: 'attacker', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new attacker: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new attacker: ' + newName + ", Successful");
            }
        }

        if (claimers.length < needClaimer && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Claimer' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(claimerParts, newName, {memory: {role: 'claimer', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new claimer: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new claimer: ' + newName + ", Successful");
            }
        }

        if (repairers.length < needRepairer && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Repairer' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(repairerParts, newName, {memory: {role: 'repairer', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new Repairer: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new Repairer: ' + newName + ", Successful");
            }
        }

        if (miners.length < needMiner && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Miner' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(minerParts, newName, {memory: {role: 'miner', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new Miner: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new Miner: ' + newName + ", Successful");
            }
        }

        if (expanders.length < needExpander && harvesters.length >= needHarvester && gatherers.length >= needGatherer) {
            let newName = 'Expander' + '_' + roomName + '_' + Game.time;
            let bSpawn = Game.spawns[spawnName].spawnCreep(expanderParts, newName, {memory: {role: 'expander', belong: roomName}});
            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new Expander: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new Expander: ' + newName + ", Successful");
            }
        }

        if (gatherers.length < needGatherer) {
            let newName = 'Gatherer' + '_' + roomName + '_' + Game.time;
            let bSpawn
            if (gatherers.length == 0) {
                bSpawn = Game.spawns[spawnName].spawnCreep(gathererParts, newName, {memory: {role: 'gatherer', belong: roomName, gender: 'male'}});
            } else if (gatherers.length > 0 && gatherers[0].memory.gender == 'male') {
                bSpawn = Game.spawns[spawnName].spawnCreep(gathererParts, newName, {memory: {role: 'gatherer', belong: roomName, gender: 'female'}});
            } else if (gatherers.length > 0 && gatherers[0].memory.gender == 'female') {
                bSpawn = Game.spawns[spawnName].spawnCreep(gathererParts, newName, {memory: {role: 'gatherer', belong: roomName, gender: 'male'}});
            }

            if (bSpawn == -6) {
                console.log(spawnName + ' spawns new Gatherer: ' + newName + ", Not Enough Source");
            } else {
                console.log(spawnName + ' spawns new Gatherer: ' + newName + ", Successful");
            }
        }

        if (Game.spawns[spawnName].room.name == roomName) {
            if (Game.spawns[spawnName].spawning) {
                let spawningCreep = Game.creeps[Game.spawns[spawnName].spawning.name];
                Game.spawns[spawnName].room.visual.text(
                    '🛠️' + spawningCreep.memory.role + ',' + spawningCreep.memory.belong,
                    Game.spawns[spawnName].pos.x + 1,
                    Game.spawns[spawnName].pos.y,
                    {align: 'left', opacity: 0.8});
            }
        }
    }
};

module.exports = spawnNewCreep;
