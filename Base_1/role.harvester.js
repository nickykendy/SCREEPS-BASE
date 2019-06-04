var roleHarvester = {

    run: function(creep) {
        const extensions = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_EXTENSION;
            }
        });
        const energyAll = 300 + extensions.length * extensions[0].energyCapacity;
        const carryTotal = _.sum(creep.carry);
        const mySpawn = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_SPAWN;
            }
        });
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_EXTENSION ||
                    structure.structureType == STRUCTURE_SPAWN ||
                    structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity) ||
                    structure.structureType == STRUCTURE_STORAGE;
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
            var dropped = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            var closestHostile = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            var tomb = creep.pos.findClosestByRange(FIND_TOMBSTONES);
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });

            if (!closestHostile && tomb) {
                if (_.sum(tomb.store) > 0) {
                    for (let resourceType in tomb.store) {
                        if (creep.withdraw(tomb, resourceType) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(tomb, {visualizePathStyle: {stroke: '#ffffff'}});
                            break;
                        }
                    }
                } else {
                    if (creep.room.name == 'W23N29') {
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                                
                            }
                        }
                    } else if (creep.room.name == 'W23N28') {
                        if (containers.length > 0) {
                            if (creep.withdraw(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ffaa00'}});
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
            } else {
                if (creep.room.name == 'W23N29') {
                    if (containers.length > 0) {
                        if (creep.withdraw(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                } else if (creep.room.name == 'W23N28') {
                    if (containers.length > 0) {
                        if (creep.withdraw(containers[1], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containers[1], {visualizePathStyle: {stroke: '#ffaa00'}});
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
                    // transfer rare resource to my storage
                    } else if (targets[i].structureType == STRUCTURE_STORAGE && !creep.memory.harvesting && creep.carry.energy < carryTotal) {
                        for (let resourceType in creep.carry) {
                           if (resourceType != RESOURCE_ENERGY) {
                               if (creep.transfer(targets[i], resourceType) == ERR_NOT_IN_RANGE) {
                                   creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffffff'}});
                                   break;
                               }
                           }
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleHarvester;
