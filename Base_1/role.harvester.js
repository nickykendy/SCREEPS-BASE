var roleHarvester = {

    run: function(creep) {
        const extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });
        const energyAll = 300 + extensions.length * 50;
        const carryTotal = _.sum(creep.carry);
        const mySpawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
            }
        });

        if (creep.room.energyAvailable < energyAll) {
            creep.memory.refill = true;
        } else {
            creep.memory.refill = false;
        }

        if (creep.carry.energy == 0 && !creep.memory.harvesting) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting && carryTotal == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting && carryTotal < creep.carryCapacity) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
            console.log('hello');
        } else if (!creep.memory.harvesting && carryTotal <= creep.carryCapacity) {
            if (targets.length > 0) {
                for (let i in targets) {
                    // refill the energy cargo
                    if ((targets[i].structureType == STRUCTURE_SPAWN || targets[i].structureType == STRUCTURE_EXTENSION) && creep.memory.refill && creep.carry.energy == carryTotal) {
                        if (creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                    // refill the tower
                    } else if (targets[i].structureType == STRUCTURE_TOWER && !creep.memory.refill && creep.carry.energy == carryTotal) {
                        if (creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                    }
                }
            } else {
                creep.moveTo(mySpawn[0], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleHarvester;
