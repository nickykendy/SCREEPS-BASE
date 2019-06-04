var roleMiner = {

    run: function(creep) {
        const carryTotal = _.sum(creep.carry);
        const myStorage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE
            }
        });
        const myTerminal = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_TERMINAL
            }
        });
        const minerals = creep.room.find(FIND_MINERALS);

        if (carryTotal == 0 && !creep.memory.harvesting) {
            creep.memory.harvesting = true;
        }

        if (creep.memory.harvesting && carryTotal == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting && carryTotal < creep.carryCapacity) {
            if (creep.harvest(minerals[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(minerals[0], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            for (let resourceType in creep.carry) {
                if (creep.transfer(myTerminal[0], resourceType) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(myTerminal[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    break;
                }
            }
        }
    }
};

module.exports = roleMiner;
