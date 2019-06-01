var roleBuilder = {

    run: function(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
              creep.memory.building = false;
              creep.say('🔄 harvest');
        }

        if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length) {
                if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0
                }
            });
            if (creep.room.name == 'W23N29') {
                if (containers.length > 0) {
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else if (creep.room.name == 'W23N28') {
                if (containers.length > 0) {
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            } else if (creep.room.name == 'W22N28') {
                if (containers.length > 0) {
                    if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;
