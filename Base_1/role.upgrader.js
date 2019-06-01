var roleUpgrader = {

    run: function(creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
  	    }

  	    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
            if(creep.room.controller) {
                /*
                if (creep.room.name == 'W23N29') {
                    if (creep.signController(creep.room.controller, "I'm new to this game! Somebody tells me how to play please! I'm dying!") == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                } else if (creep.room.name == 'W23N28') {
                    if (creep.signController(creep.room.controller, "这游戏能打中文么？!") == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                } else if (creep.room.name == 'W22N28') {
                    if (creep.signController(creep.room.controller, "尼玛写代码好特么难!") == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                */
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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
                    if (creep.withdraw(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ffaa00'}});
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

module.exports = roleUpgrader;
